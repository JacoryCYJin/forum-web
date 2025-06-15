/**
 * @file 收藏相关API
 * @module lib/api/favouriteApi
 * @description 提供收藏相关的API调用函数
 */

import { get, post, del} from '@/lib/utils/request';
import type { PageResponse, Post } from '@/types/postType';

/**
 * 收藏表单数据接口
 */
export interface FavouriteForm {
  /**
   * 帖子ID
   */
  postId: string;
}

/**
 * 获取用户收藏列表参数接口
 */
export interface GetUserFavouritesParams {
  /**
   * 页码，从1开始
   * @default 1
   */
  pageNum?: number;
  
  /**
   * 每页大小
   * @default 10
   */
  pageSize?: number;
  
  /**
   * 用户ID，为空时使用当前登录用户
   */
  userId?: string;
}

/**
 * 获取用户收藏的帖子列表
 * 
 * 获取指定用户收藏的帖子列表，支持分页
 *
 * @async
 * @param {GetUserFavouritesParams} params - 查询参数
 * @returns {Promise<PageResponse<Post>>} 收藏的帖子列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的收藏列表
 * const favourites = await getUserFavouritesApi({ pageNum: 1, pageSize: 10 });
 * 
 * // 获取指定用户的收藏列表
 * const userFavourites = await getUserFavouritesApi({ 
 *   userId: 'user123', 
 *   pageNum: 1, 
 *   pageSize: 10 
 * });
 */
export async function getUserFavouritesApi(params: GetUserFavouritesParams = {}): Promise<PageResponse<Post>> {
  const { pageNum = 1, pageSize = 10, userId } = params;
  
  // 构建请求参数，如果userId为空则不传递该参数
  const requestParams: any = {
    pageNum,
    pageSize
  };
  
  // 只有当userId有值时才添加到请求参数中
  if (userId && userId.trim() !== '') {
    requestParams.userId = userId;
  }
  
  try {
    console.log('🔍 发送收藏列表请求:', {
      url: '/favourites/user',
      params: requestParams
    });
    
    const response = await get('/favourites/user', requestParams);
    
    console.log('✅ 收藏列表响应:', response);
    
    return response.data;
  } catch (error) {
    console.error('❌ 获取用户收藏列表失败:', error);
    console.error('请求参数:', requestParams);
    throw error;
  }
}

/**
 * 添加收藏
 * 
 * 将指定帖子添加到当前用户的收藏列表
 *
 * @async
 * @param {FavouriteForm} favouriteForm - 收藏表单数据
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 收藏帖子
 * await addFavouriteApi({ postId: 'post123' });
 */
export async function addFavouriteApi(favouriteForm: FavouriteForm): Promise<void> {
  try {
    await post('/favourites/add', favouriteForm);
  } catch (error) {
    console.error('添加收藏失败:', error);
    throw error;
  }
}

/**
 * 取消收藏
 * 
 * 从当前用户的收藏列表中移除指定帖子
 *
 * @async
 * @param {FavouriteForm} favouriteForm - 收藏表单数据
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 取消收藏帖子
 * await deleteFavouriteApi({ postId: 'post123' });
 */
export async function deleteFavouriteApi(favouriteForm: FavouriteForm): Promise<void> {
  try {
    await del('/favourites/delete', { data: favouriteForm });
  } catch (error) {
    console.error('取消收藏失败:', error);
    throw error;
  }
}

/**
 * 检查是否已收藏
 * 
 * 检查当前用户是否已收藏指定帖子
 *
 * @async
 * @param {FavouriteForm} favouriteForm - 收藏表单数据
 * @returns {Promise<boolean>} 是否已收藏
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 检查是否已收藏
 * const isFavourited = await checkFavouriteApi({ postId: 'post123' });
 */
export async function checkFavouriteApi(favouriteForm: FavouriteForm): Promise<boolean> {
  try {
    const response = await post('/favourites/check', favouriteForm);
    return response.data;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    throw error;
  }
}