/**
 * @file 分类类型模块
 * @description 定义分类相关的类型接口
 */

/**
 * 分类接口
 */
export interface Category {
  categoryId: string;
  categoryName: string;
}

/**
 * 分类列表响应接口
 */
export interface CategoryListResponse {
    list: Category[];
    total?: number;
    page?: number;
    pageSize?: number;
  }
