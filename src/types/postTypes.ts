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
 * 评论视图对象类型
 * 对应后端CommentVo的数据结构
 */
export interface Comment {
  /**
   * 评论唯一标识
   */
  commentId: string;
  
  /**
   * 所属帖子ID
   */
  postId: string;
  
  /**
   * 评论用户ID
   */
  userId: string;
  
  /**
   * 评论内容
   */
  content: string;
  
  /**
   * 评论创建时间
   */
  ctime?: string;
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

  /**
   * 发帖时间
   */
  createdTime?: string;
}

/**
 * 帖子详情类型
 * 对应后端PostDetailVO的数据结构，包含帖子基本信息和评论列表
 */
export interface PostDetail {
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
  
  /**
   * 评论列表（分页）
   */
  comments: PageResponse<Comment>;

  /**
   * 发帖时间
   */
  createdTime?: string;
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
   * 用户ID，用于查询特定用户的帖子
   */
  user_id?: string;
  
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
 * 帖子详情查询参数类型
 */
export interface PostDetailQueryParams {
  /**
   * 评论页码，从1开始
   * @default 1
   */
  comment_page_num?: number;
  
  /**
   * 评论每页大小
   * @default 10
   */
  comment_page_size?: number;
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
  total_count: number;
  
  /**
   * 当前页码
   */
  page_num: number;
  
  /**
   * 每页大小
   */
  page_size: number;
  
  /**
   * 总页数
   */
  page_count: number;
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