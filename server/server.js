import jsonServer from 'json-server'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import bcrypt from 'bcrypt'


const server = jsonServer.create();
const filePath = './db.json';
const router = jsonServer.router(filePath);
const middlewares = jsonServer.defaults({
  static: './public',
});

// Set default middlewares (logger, static, cors, and no-cache)
server.use(middlewares);

// To handle POST, PUT, and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// Custom middleware to handle `If-Modified-Since` header
// server.use((req, res, next) => {
//   console.log("Checking If-Modified-Since header...")
//   let ifModifiedSinceHeader = req.headers['if-modified-since'];
//   if (ifModifiedSinceHeader) {
//     const modifiedSinceNumber = +ifModifiedSinceHeader;
//     if (modifiedSinceNumber && (+modifiedSinceNumber) > 0) {

//       // Get the last modified date of the db.json file
//       const lastModifiedDate = fs.statSync(filePath).mtime;
//       const modifiedSinceDate = new Date(+modifiedSinceNumber);
  
//       // If the file has not been modified since the provided date, send a 304 response
//       if (lastModifiedDate <= modifiedSinceDate) {
//         res.status(304).send(); // Not Modified
//         return;
//       }
//     }
//   }
//   next(); // Continue to the next middleware (or router)
// });

// const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtSecret = "jwt-secret-lol";


class AuthUtils {
  static jwtInvalidIDs = new Set();
  static tokenIDs = 0;

  static async hashPassword(password, saltOrRounds){
      return await bcrypt.hash(password, saltOrRounds)
  }

  static generateJWT(user){
      const jwtObject = {user: {...user, passwordHash: undefined}, jwt_id: this.tokenIDs++};

      const jwtToken = jwt.sign(
          jwtObject,
          jwtSecret,
          { expiresIn: "1d" }
      );
      return jwtToken;
  }

  static decodeJWT(jwtToken){
      try {
          const decoded = jwt.verify(jwtToken, jwtSecret);
          
          if (Date.now()/1000 > decoded.exp) {
              console.log({jwt: decoded}, `Verified expired token`);
              return undefined;
          }
          if (this.jwtInvalidIDs.has(decoded.jwt_id)) {
              console.log({jwt: decoded}, "Verified ID invalidated token");
              return undefined
          }

          return decoded;
      } catch (error) {
          console.log(error, "Verification failed")
          return undefined;
      }
  }

  static invalidateToken(token){
      jwtInvalidIDs.add(token.jwt_id);
  }

  static comparePassHash(password, hash){
      return bcrypt.compare(password, hash)
  }
}

server.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (typeof(authHeader) === 'string') {
    try {
      // decodes jwt and passes it to the following middlewares
      req.jwt = AuthUtils.decodeJWT(authHeader)
    } catch {
      console.log("Error decoding JWT", authHeader)
      req.jwt = undefined;
    }
  }
  next();
})

// - login and register routes with body
// - logout with token
server.use('/api/auth/', async (req, res) => {

  if (req.url.endsWith("/validate")) {
    if (req.method !== 'GET') {
      res.status(405).send();
      return;
    }
    if (!req.jwt) {
      res.status(401).send();
      return;
    }
    res.status(200).send();
    return;
  }

  console.log("AUTH request")
  if (req.method !== 'POST') {
    res.status(405).send();
    return;
  }


  if (req.url.endsWith("/logout")) {
    if (!req.jwt) {
      res.status(401).send();
      return;
    }
    AuthUtils.invalidateToken(req.jwt);
    res.status(200).send();
  }
  
  let loginInfo = null;
  try {
    loginInfo = req.body;
    if (typeof(loginInfo) !== 'object' || typeof(loginInfo.name) !== 'string' || typeof(loginInfo.password) !== 'string') {
      res.status(400).send();
      return;
    }

  } catch {
    res.status(400).send();
    return;
  }

  if (req.url.endsWith("/login")) {
    const db = router.db;
    const users = db.get('users').value();
    const user = users.find(user => user.name === loginInfo.name);
    if (!user) {
      res.status(401).send();
      return;
    }
    const passwordHash = user.passwordHash;
    const password = loginInfo.password;
    if (!passwordHash || !password) {
      res.status(401).send();
      return;
    }
    const passwordMatch = await AuthUtils.comparePassHash(password, passwordHash);
    if (!passwordMatch) {
      res.status(401).send();
      return;
    }
    const jwt = AuthUtils.generateJWT(user);
    res.status(201).send({jwt});
  }
  else if (req.url.endsWith("/register")) {
    const db = router.db;
    const users = db.get('users').value();
    const user = users.find(user => user.name === loginInfo.name);
    if (user) {
      res.status(409).send();
      return;
    }
    const password = loginInfo.password;
    const passwordHash = await AuthUtils.hashPassword(password, 10);
    if (!passwordHash) {
      res.status(401).send();
      return;
    }
    const newUser = {
      name: loginInfo.name,
      passwordHash: passwordHash,
      role: "user",
    };
    db.get('users').push(newUser).write();
    const jwt = AuthUtils.generateJWT(newUser);
    res.status(201).send({jwt});
  }
  else {
    res.status(404).send();
    return;
  }
})

server.use((req, res, next) => {
  console.log("Checking permissions...")
  if (req.url.endsWith('/users')) {
    res.status(403).send();
    return;
  }

  if (req.method !== 'GET') {
    if (!req.jwt) {
      res.status(401).send();
      return;
    }
    if (req.jwt.user.role !== 'admin') {
      res.status(403).send();
      return;
    }
  }
  next();
})

// prevent json-server ID duplication
// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.use((req, res, next) => {
  console.log("Transforming post request...")
  if (req.method === 'POST') {
    try {
      if (req.body && req.body.id !== undefined){
        delete req.body.id;
        // providing an ID to json-server will
        // override auto-incrementing IDs
      }
    } catch {
      // silently fail
    }
  }
  next();
})

// Use default router
server.use('/api', router);


// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
  console.log(`Static files served from: ./public`);
});