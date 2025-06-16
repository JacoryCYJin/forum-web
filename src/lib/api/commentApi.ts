/**
 * @file 评论API模块
 * @module lib/api/commentApi
 * @description 提供评论相关的API调用函数
 */

import { post } from '@/lib/utils/request';
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
