/**
 * @file 评论API模块
 * @module lib/api/commentApi
 * @description 提供评论相关的API调用函数
 */

import { post, get } from '@/lib/utils/request';
import type { AddCommentRequest, CommentApiResponse } from '@/types/commentTypes';

/**
 * 添加评论API
 * 
 * 向服务器提交新的评论数据
 *
 * @async
 * @param {AddCommentRequest} commentData - 评论数据
 * @returns {Promise<CommentApiResponse>} 添加评论的响应结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 添加新评论
 * const result = await addCommentApi({
 *   postId: 'post-123',
 *   content: '这是一条评论内容'
 * });
 */
export async function addCommentApi(commentData: AddCommentRequest): Promise<CommentApiResponse> {
  try {
    console.log('📤 发送评论数据:', commentData);
    
    // 验证数据
    if (!commentData.postId || !commentData.content) {
      throw new Error('帖子ID和评论内容不能为空');
    }
    
    if (commentData.content.trim().length === 0) {
      throw new Error('评论内容不能为空');
    }
    
    if (commentData.content.length > 500) {
      throw new Error('评论内容不能超过500个字符');
    }
    
    // 转换为后端期望的CommentForm格式（下划线命名）
    const commentForm = {
      comment_id: null, // 后端会自动生成
      post_id: commentData.postId,
      content: commentData.content
    };
    
    const response: CommentApiResponse = await post('/comment/add', commentForm);
    
    console.log('📥 收到评论响应:', response);
    
    if (response.code === 0) {
      console.log('✅ 评论添加成功');
      return response;
    } else {
      console.error('❌ 评论添加失败，服务器返回:', response);
      throw new Error(response.message || '添加评论失败');
    }
  } catch (error: any) {
    console.error('❌ 添加评论失败:', error);
    
    // 如果是网络错误或其他错误，提供更友好的错误信息
    if (error.message === '网络错误，请检查网络连接') {
      throw new Error('网络连接失败，请检查网络后重试');
    } else if (error.message === '登录已过期，请重新登录') {
      throw new Error('登录已过期，请重新登录后再试');
    } else if (error.message && error.message.includes('系统异常')) {
      throw new Error('服务器繁忙，请稍后重试');
    }
    
    throw error;
  }
}

/**
 * 获取帖子评论数API
 * 
 * 获取指定帖子的评论总数
 *
 * @async
 * @param {string} postId - 帖子ID
 * @returns {Promise<number>} 评论总数
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取帖子评论数
 * const commentCount = await getCommentCountApi('post-123');
 */
export async function getCommentCountApi(postId: string): Promise<number> {
  try {
    if (!postId) {
      throw new Error('帖子ID不能为空');
    }

    const queryParams = {
      post_id: postId
    };

    const response: CommentApiResponse = await get('/comment/count', queryParams);

    if (response.code === 0) {
      return response.data || 0;
    } else {
      console.error('❌ 获取评论数失败，服务器返回:', response);
      throw new Error(response.message || '获取评论数失败');
    }
  } catch (error: any) {
    console.error('❌ 获取评论数失败:', error);
    
    // 对于获取评论数的错误，我们返回0而不是抛出错误，避免影响帖子列表显示
    if (error.message?.includes('网络') || error.message?.includes('连接')) {
      console.warn('网络异常，评论数设为0');
      return 0;
    }
    
    throw error;
  }
}
