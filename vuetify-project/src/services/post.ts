import type { PostModel } from '@/models/post';
import { BaseService } from './_baseService';

class PostServiceClass extends BaseService<PostModel>{
  get endpoint(): string {
    return 'posts';
  }
}
export const PostService = new PostServiceClass();