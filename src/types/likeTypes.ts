/**
 * @file 点赞相关类型定义
 * @module types/likeTypes
 * @description 定义点赞功能相关的数据结构和接口类型
 */

/**
 * 点赞记录接口
 */
export interface Like {
  /**
   * 点赞记录ID
   */
  likedId: string;
  
  /**
   * 被点赞的帖子ID
   */
  postId: string;
  
  /**
   * 点赞用户ID
   */
  userId: string;
  
  /**
   * 点赞时间
   */
  ctime?: string;
  
  /**
   * 最后更新时间
   */
  mtime?: string;
}

/**
 * 点赞请求参数接口
 * @deprecated 请使用 likeApi.ts 中的 LikeForm 接口
 */
export interface LikeRequest {
  /**
   * 帖子ID (使用下划线格式)
   */
  post_id: string;
}

/**
 * 点赞API响应接口
 */
export interface LikeResponse {
  /**
   * 操作是否成功
   */
  success: boolean;
  
  /**
   * 响应消息
   */
  message?: string;
  
  /**
   * 响应数据
   */
  data?: any;
}

/**
 * 切换点赞状态响应接口
 */
export interface ToggleLikeResponse {
  /**
   * 操作是否成功
   */
  success: boolean;
  
  /**
   * 当前点赞状态（true表示已点赞，false表示未点赞）
   */
  data: boolean;
  
  /**
   * 响应消息
   */
  message?: string;
}

/**
 * 检查点赞状态响应接口
 */
export interface CheckLikeResponse {
  /**
   * 操作是否成功
   */
  success: boolean;
  
  /**
   * 点赞状态（true表示已点赞，false表示未点赞）
   */
  data: boolean;
  
  /**
   * 响应消息
   */
  message?: string;
}
