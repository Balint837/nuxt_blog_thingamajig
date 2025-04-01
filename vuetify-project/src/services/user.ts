import type { UserModel } from '@/models/user';
import { BaseService } from './_baseService';
  
class UserServiceClass extends BaseService<UserModel>{
  get endpoint(): string {
    return 'users';
  }
}

export const UserService = new UserServiceClass();