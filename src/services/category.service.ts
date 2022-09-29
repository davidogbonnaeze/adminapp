import BaseService from "/@src/services/base.service";

export class CategoryService{
  static getCategories() {
    return BaseService.get('category?relations=series,sermons')
  }
}
