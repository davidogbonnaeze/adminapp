import BaseService from '/@src/services/base.service'

export class CategoryService {
  static createCategory(createCategoryDto: any) {
    return BaseService.post('category', createCategoryDto)
  }

  static getCategories() {
    return BaseService.get('category?relations=series,sermons')
  }

  static deleteCategory(categoryId: string) {
    return BaseService.delete(`category/${categoryId}`)
  }

  static updateCategory(categoryId: string, payload: any) {
    return BaseService.put(`category/${categoryId}`, payload)
  }
}
