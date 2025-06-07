/**
 * @file 帖子相关类型定义
 * @module types/postType
 * @description 定义帖子数据结构和相关的接口类型
 */

/**
 * 分类视图对象类型
 * 对应后端CategoryVO的数据结构
 */
export interface Category {
  /**
   * 分类唯一标识
   */
  categoryId: string;
  
  /**
   * 分类名称
   */
  categoryName: string;
}

/**
 * 标签视图对象类型
 * 对应后端TagVO的数据结构
 */
export interface Tag {
  /**
   * 标签唯一标识
   */
  tagId: string;
  
  /**
   * 标签名称
   */
  tagName: string;
}

/**
 * 帖子实体类型
 * 对应后端PostVO的数据结构
 */
export interface Post {
  /**
   * 帖子唯一标识
   */
  postId: string;
  
  /**
   * 发帖用户ID
   */
  userId: string;
  
  /**
   * 帖子标题
   */
  title: string;
  
  /**
   * 帖子内容(Markdown格式)
   */
  content: string;
  
  /**
   * 帖子分类信息
   */
  category: Category;
  
  /**
   * 帖子标签列表
   */
  tags: Tag[];
  
  /**
   * 帖子附件URL列表，多个URL用逗号分隔
   */
  fileUrls?: string;
  
  /**
   * 发帖位置，格式为 "经度,纬度"
   */
  location?: string;
}

/**
 * 帖子查询参数类型
 */
export interface PostQueryParams {
  /**
   * 搜索标题关键词
   */
  title?: string;
  
  /**
   * 页码，从1开始
   * @default 1
   */
  page_num?: number;
  
  /**
   * 每页大小
   * @default 10
   */
  page_size?: number;
  
  /**
   * 是否获取全部数据
   */
  fetch_all?: boolean;
}

/**
 * 分页响应数据类型
 */
export interface PageResponse<T> {
  /**
   * 数据列表
   */
  list: T[];
  
  /**
   * 总记录数
   */
  total: number;
  
  /**
   * 当前页码
   */
  pageNum: number;
  
  /**
   * 每页大小
   */
  pageSize: number;
  
  /**
   * 总页数
   */
  pages: number;
  
  /**
   * 是否为第一页
   */
  isFirstPage: boolean;
  
  /**
   * 是否为最后一页
   */
  isLastPage: boolean;
}

/**
 * 后端响应数据格式
 */
export interface ApiResponse<T = any> {
  /**
   * 响应状态码
   */
  code: number;
  
  /**
   * 响应数据
   */
  data: T;
  
  /**
   * 响应消息
   */
  message: string;
}

/**
 * 帖子列表响应类型
 */
export interface PostListResponse {
  /**
   * 分页数据
   */
  pageInfo: PageResponse<Post>;
  
  /**
   * 帖子列表
   */
  list: Post[];
} 