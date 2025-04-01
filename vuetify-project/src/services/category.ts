import type { CategoryModel } from '@/models/category';
import { BaseService } from './_baseService';

class CategoryServiceClass extends BaseService<CategoryModel>{
  get endpoint(): string {
    return 'categories';
  }
}
export const CategoryService = new CategoryServiceClass();
