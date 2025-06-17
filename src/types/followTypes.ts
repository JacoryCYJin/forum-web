/**
 * @file 关注相关的类型定义
 * @description 定义关注、粉丝等相关的数据类型
 */

/**
 * 关注关系数据
 */
export interface Follow {
  /**
   * 关注关系ID
   */
  followId: string;
  
  /**
   * 关注者用户ID
   */
  userId: string;
  
  /**
   * 被关注者用户ID
   */
  followerId: string;
  
  /**
   * 关注时间
   */
  ctime: string;
}

/**
 * 关注请求参数
 */
export interface FollowRequest {
  /**
   * 用户ID（可选，默认为当前登录用户）
   */
  userId?: string;
  
  /**
   * 被关注者用户ID
   */
  followerId: string;
}

/**
 * 取消关注请求参数
 */
export interface UnfollowRequest {
  /**
   * 用户ID（可选，默认为当前登录用户）
   */
  userId?: string;
  
  /**
   * 被关注者用户ID
   */
  followerId: string;
}

/**
 * 分页参数接口
 */
export interface FollowPageParams {
  /**
   * 用户ID（可选）
   */
  userId?: string;
  
  /**
   * 被关注者ID（用于获取粉丝列表）
   */
  followerId?: string;
  
  /**
   * 页码
   */
  pageNum?: number;
  
  /**
   * 每页大小
   */
  pageSize?: number;
  
  /**
   * 是否获取全部数据
   */
  fetchAll?: boolean;
}

/**
 * 关注数量统计
 */
export interface FollowStats {
  /**
   * 关注数
   */
  followingCount: number;
  
  /**
   * 粉丝数
   */
  followersCount: number;
}
