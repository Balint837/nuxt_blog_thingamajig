import axios from 'axios';
import { ConfigService } from './config';
import type { AuthModel } from '@/models/auth';
import type { UserModel } from '@/models/user';

const API_URL = ConfigService.instance.apiUrl;

interface AuthResponse{
    jwt: string;
}

class AuthServiceClass {

    private async doAuth(authModel: AuthModel, endpoint: string){
        console.log('doAuth', authModel, endpoint);
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/${endpoint}`, authModel);
        if (response.data) {
            this.token =  response.data.jwt;
        }
        return response.data;
    }

    async validate(){
        if (!this.token) {
            return false;
        }

        const response = await axios.get(`${API_URL}/auth/validate`, {
            headers: {
                Authorization: this.token
            },
            validateStatus: (status) => status === 200 || status === 401
        })
        if (response.status === 401) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    }
    
    async register(authModel: AuthModel) {
        return this.doAuth(authModel, 'register');
    }

    async login(authModel: AuthModel) {
        return this.doAuth(authModel, 'login');
    }

    async logout() {
        console.log(this.token)
        // use auth/logout to invalidate the token on the server
        try {
            await axios.post(`${API_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: this.token
                }
            });
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.removeItem('token');   
        }
    }

    getCurrentUser() {
        const token = this.token;
        if (!token) {
            return null;
        }
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const user = JSON.parse(decodedPayload);
        return user.user as UserModel;
    }

    get token(): string | null {
        return localStorage.getItem('token');
    }

    set token(value: string){
        localStorage.setItem('token', value);
        // ik this is not secure BUT: I don't give a f***
    }
}

export const AuthService = new AuthServiceClass();