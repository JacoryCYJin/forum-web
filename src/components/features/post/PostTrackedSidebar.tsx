'use client';

/**
 * @file 帖子侧边栏事件跟踪组件
 * @module components/features/post/PostTrackedSidebar
 * @description 带事件跟踪功能的帖子侧边栏组件
 */

import { useCallback } from 'react';
import PostSidebar from './PostSidebar';
import { trackLikePost, trackFavouritePost, trackCommentPost } from '../../../lib/api/trackingApi';

/**
 * 帖子跟踪侧边栏属性
 */
interface PostTrackedSidebarProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 帖子标题
   */
  postTitle: string;
  
  /**
   * 评论数量
   */
  commentCount: number;
  
  /**
   * 初始评论列表
   */
  initialComments?: any;
}

/**
 * 带事件跟踪功能的帖子侧边栏组件
 * 
 * 在用户与侧边栏交互时发送事件到埋点系统
 * 
 * @component
 */
export default function PostTrackedSidebar({ postId, postTitle, commentCount, initialComments }: PostTrackedSidebarProps) {
  /**
   * 评论提交回调
   * 
   * @param commentId - 新评论ID
   * @param content - 评论内容
   */
  const handleCommentSubmitted = useCallback(() => {
    // 发送评论事件埋点
    trackCommentPost(postId);
  }, [postId]);

  /**
   * 点赞状态变更回调
   * 
   * @param isLiked - 是否点赞
   */
  const handleLikeStatusChanged = useCallback(() => {
    // 发送点赞事件埋点
    trackLikePost(postId);
  }, [postId]);
  
  /**
   * 收藏状态变更回调
   * 
   * @param isFavourited - 是否收藏
   */
  const handleFavouriteStatusChanged = useCallback(() => {
    // 发送收藏事件埋点
    trackFavouritePost(postId);
  }, [postId]);
  
  return (
    <PostSidebar 
      postId={postId}
      postTitle={postTitle}
      commentCount={commentCount}
      initialComments={initialComments}
      onCommentSubmitted={handleCommentSubmitted}
      onLikeStatusChanged={handleLikeStatusChanged}
      onFavouriteStatusChanged={handleFavouriteStatusChanged}
    />
  );
} 