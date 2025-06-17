/**
 * @file 评论相关类型定义
 * @module types/commentTypes
 * @description 定义评论数据结构和相关的接口类型
 */

/**
 * 评论表单数据类型
 * 对应后端CommentForm的数据结构
 */
export interface CommentForm {
  /**
   * 评论ID（可选，新建评论时不需要）
   */
  commentId?: string;
  
  /**
   * 所属帖子ID
   */
  postId: string;
  
  /**
   * 评论内容
   */
  content: string;
}

/**
 * 添加评论请求参数类型
 */
export interface AddCommentRequest {
  /**
   * 所属帖子ID
   */
  postId: string;
  
  /**
   * 评论内容
   */
  content: string;
}

/**
 * 评论API响应数据类型
 */
export interface CommentApiResponse<T = any> {
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
