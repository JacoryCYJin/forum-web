/**
 * @file 关注相关API接口
 * @description 提供关注、取消关注、获取关注列表等API调用函数
 */

import { get, post } from '@/lib/utils/request';
import type { Follow, FollowRequest, UnfollowRequest, FollowPageParams } from '@/types/followTypes';
import type { PageResponse } from '@/types/postTypes';

// 定义接口返回数据的类型
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * 关注用户
 * 
 * 用户关注另一个用户
 *
 * @async
 * @param {FollowRequest} params - 关注请求参数
 * @returns {Promise<any>} 关注结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 关注指定用户
 * await followUserApi({ followerId: 'user-123' });
 */
export async function followUserApi(params: FollowRequest): Promise<any> {
  const requestParams = {
    user_id: params.userId,
    follower_id: params.followerId
  };
  return post('/follows/follow', requestParams);
}

/**
 * 取消关注用户
 * 
 * 用户取消关注另一个用户
 *
 * @async
 * @param {UnfollowRequest} params - 取消关注请求参数
 * @returns {Promise<any>} 取消关注结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 取消关注指定用户
 * await unfollowUserApi({ followerId: 'user-123' });
 */
export async function unfollowUserApi(params: UnfollowRequest): Promise<any> {
  const requestParams = {
    user_id: params.userId,
    follower_id: params.followerId
  };
  return post('/follows/unfollow', requestParams);
}

/**
 * 分页获取关注列表
 * 
 * 分页获取指定用户的关注列表
 *
 * @async
 * @param {FollowPageParams} params - 分页参数
 * @returns {Promise<PageResponse<Follow>>} 分页关注列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的关注列表
 * const followingList = await getFollowingListApi({ 
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 * 
 * // 获取指定用户的关注列表
 * const userFollowing = await getFollowingListApi({ 
 *   userId: 'user-123',
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 */
export async function getFollowingListApi(params: FollowPageParams): Promise<PageResponse<Follow>> {
  const queryParams = {
    user_id: params.userId,
    page_num: params.pageNum || 1,
    page_size: params.pageSize || 10,
    fetch_all: params.fetchAll
  };
  
  const response: ResponseData<PageResponse<Follow>> = await get('/follows/get-follower-list', queryParams);
  return response.data;
}

/**
 * 分页获取粉丝列表
 * 
 * 分页获取指定用户的粉丝列表
 *
 * @async
 * @param {FollowPageParams} params - 分页参数
 * @returns {Promise<PageResponse<Follow>>} 分页粉丝列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的粉丝列表
 * const followersList = await getFollowersListApi({ 
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 * 
 * // 获取指定用户的粉丝列表
 * const userFollowers = await getFollowersListApi({ 
 *   followerId: 'user-123',
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 */
export async function getFollowersListApi(params: FollowPageParams): Promise<PageResponse<Follow>> {
  const queryParams = {
    follower_id: params.followerId,
    page_num: params.pageNum || 1,
    page_size: params.pageSize || 10,
    fetch_all: params.fetchAll
  };
  
  const response: ResponseData<PageResponse<Follow>> = await get('/follows/get-user-list', queryParams);
  return response.data;
}

/**
 * 获取关注总数
 * 
 * 获取指定用户的关注总数
 *
 * @async
 * @param {string} [userId] - 用户ID，如果为空则获取当前登录用户的关注数
 * @returns {Promise<number>} 关注总数
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的关注数
 * const followingCount = await getFollowingCountApi();
 * 
 * // 获取指定用户的关注数
 * const userFollowingCount = await getFollowingCountApi('user-123');
 */
export async function getFollowingCountApi(userId?: string): Promise<number> {
  const queryParams = userId ? { user_id: userId } : {};
  const response: ResponseData<number> = await get('/follows/follow-count', queryParams);
  return response.data;
}

/**
 * 获取粉丝总数
 * 
 * 获取指定用户的粉丝总数
 *
 * @async
 * @param {string} [followerId] - 被关注者用户ID，如果为空则获取当前登录用户的粉丝数
 * @returns {Promise<number>} 粉丝总数
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的粉丝数
 * const followersCount = await getFollowersCountApi();
 * 
 * // 获取指定用户的粉丝数
 * const userFollowersCount = await getFollowersCountApi('user-123');
 */
export async function getFollowersCountApi(followerId?: string): Promise<number> {
  const queryParams = followerId ? { follower_id: followerId } : {};
  const response: ResponseData<number> = await get('/follows/follower-count', queryParams);
  return response.data;
}

/**
 * 检查是否关注指定用户
 * 
 * 检查当前用户是否已关注指定用户
 *
 * @async
 * @param {Object} params - 查询参数
 * @param {string} params.followerId - 被关注者用户ID
 * @returns {Promise<boolean>} 是否已关注
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 检查是否关注指定用户
 * const isFollowing = await checkFollowStatusApi({ followerId: 'user-123' });
 */
export async function checkFollowStatusApi(params: {
  followerId: string;
}): Promise<boolean> {
  const queryParams = {
    follower_id: params.followerId
  };
  
  const response: ResponseData<boolean> = await get('/follows/check-follow-status', queryParams);
  return response.data;
}

/**
 * 获取关注用户的帖子列表
 * 
 * 按时间顺序（最新在最上面）分页查询当前用户关注的人发布的帖子
 *
 * @async
 * @param {Object} params - 分页参数
 * @param {number} [params.pageNum=1] - 页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @returns {Promise<PageResponse<any>>} 分页帖子列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取关注用户的帖子列表
 * const followedPosts = await getFollowedUsersPostsApi({ 
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 */
export async function getFollowedUsersPostsApi(params: {
  pageNum?: number;
  pageSize?: number;
}): Promise<PageResponse<any>> {
  const queryParams = {
    page_num: params.pageNum || 1,
    page_size: params.pageSize || 10
  };
  
  const response: ResponseData<PageResponse<any>> = await get('/posts/followed-posts', queryParams);
  return response.data;
}