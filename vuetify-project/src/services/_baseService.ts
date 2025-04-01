import axios from 'axios';
import { ConfigService } from './config';
import { AuthService } from './authService';

const API_URL = ConfigService.instance.apiUrl;

interface HasId{
    id: number
}

export abstract class BaseService<T extends HasId> {
    constructor() {
        axios.interceptors.request.use((config) => {
            const token = AuthService.token;
            if (token) {
                config.headers.Authorization = `${token}`;
            }
            return config;
        });
    }
    protected abstract get endpoint(): string;

    async getAll(){
        return (await axios.get<T[]>(`${API_URL}/${this.endpoint}`)).data.map(this.fixId);
    }

    // ???????
    // Why tf do I get a 'string' when the id is a number?
    // why???
    protected fixId(item: T) {
      if (!item.id) {
        return {...item};
      }
      const copy = {...item};
      copy.id = Number(copy.id);
      if (!copy.id) {
        console.error("How???", copy.id, item.id, this);
      }
      return copy;
    }

    async getById(id: number) {
      return this.fixId((await axios.get<T>(`${API_URL}/${this.endpoint}/${id}`)).data);
    }
    
    async create(model: T) {
      return this.fixId((await axios.post(`${API_URL}/${this.endpoint}`, model)).data);
    }
    async put(id: number, model: T) {
      return this.fixId((await axios.put(`${API_URL}/${this.endpoint}/${id}`, model)).data);
    }
    async delete(id: number) {
      return this.fixId((await axios.delete(`${API_URL}/${this.endpoint}/${id}`)).data);
    }
}