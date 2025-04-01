export class ConfigService {

    static get instance(){
        if (!ConfigService._instance) {
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }

    private static _instance: ConfigService;

    apiUrl: string = "http://localhost:3001/api";

    private constructor() {
        
    }
}