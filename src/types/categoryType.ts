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


/**
 * 分类页面属性接口
 */
export interface CategoryPageProps {
  /**
   * 路由参数
   */
  params: {
    /**
     * 分类ID - Next.js动态路由参数
     */
    categoryId: string;
    // 注意：categoryName 不会自动传递，需要通过API获取
  };
}
