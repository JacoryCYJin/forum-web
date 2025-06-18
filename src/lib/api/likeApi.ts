/**
 * @file 点赞API模块
 * @module lib/api/likeApi
 * @description 提供点赞相关的API调用函数
 */

import { post, del } from '@/lib/utils/request';

/**
 * 点赞表单数据接口
 */
export interface LikeForm {
  /**
   * 帖子ID (使用下划线格式，对应后端BaseForm的JsonNaming策略)
   */
  post_id: string;
}

/**
 * 添加点赞
 * 
 * 为指定帖子添加点赞
 *
 * @async
 * @param {LikeForm} likeForm - 点赞表单数据
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 为帖子添加点赞
 * await addLikeApi({ postId: "post-123" });
 */
export async function addLikeApi(likeForm: LikeForm): Promise<void> {
  try {
    await post('/likes/add', likeForm);
  } catch (error) {
    console.error('添加点赞失败:', error);
    throw error;
  }
}

/**
 * 取消点赞
 * 
 * 取消对指定帖子的点赞
 *
 * @async
 * @param {LikeForm} likeForm - 点赞表单数据
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 取消帖子点赞
 * await deleteLikeApi({ postId: "post-123" });
 */
export async function deleteLikeApi(likeForm: LikeForm): Promise<void> {
  try {
    await del('/likes/delete', { data: likeForm });
  } catch (error) {
    console.error('取消点赞失败:', error);
    throw error;
  }
}

/**
 * 检查点赞状态
 * 
 * 检查当前用户是否已对指定帖子点赞
 *
 * @async
 * @param {LikeForm} likeForm - 点赞表单数据
 * @returns {Promise<boolean>} 点赞状态（true表示已点赞，false表示未点赞）
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 检查是否已点赞
 * const isLiked = await checkLikeApi({ postId: "post-123" });
 */
export async function checkLikeApi(likeForm: LikeForm): Promise<boolean> {
  try {
    const response = await post('/likes/check', likeForm);
    return response.data;
  } catch (error) {
    console.error('检查点赞状态失败:', error);
    throw error;
  }
}

/**
 * 切换点赞状态
 * 
 * 如果已点赞则取消点赞，如果未点赞则添加点赞
 *
 * @async
 * @param {LikeForm} likeForm - 点赞表单数据
 * @returns {Promise<boolean>} 新的点赞状态（true表示已点赞，false表示已取消点赞）
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 切换点赞状态
 * const newLikeStatus = await toggleLikeApi({ postId: "post-123" });
 * console.log(newLikeStatus ? '已点赞' : '已取消点赞');
 */
export async function toggleLikeApi(likeForm: LikeForm): Promise<boolean> {
  try {
    console.log('🔄 切换点赞状态:', likeForm);
    
    const response = await post('/likes/toggle', likeForm);
    
    console.log('✅ 点赞状态切换成功:', {
      post_id: likeForm.post_id,
      newStatus: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ 切换点赞状态失败:', error);
    throw error;
  }
}
