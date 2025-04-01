import type { TagModel } from '@/models/tag';
import { BaseService } from './_baseService';
  
class TagServiceClass extends BaseService<TagModel>{
  get endpoint(): string {
    return 'tags';
  }
}
export const TagService = new TagServiceClass();