/**
 * @file 帖子详情客户端组件
 * @module components/features/post/PostDetailClient
 * @description 处理帖子详情页面的客户端交互，包括评论分页
 */

"use client";

import { useState, useEffect } from 'react';
import { getPostByIdApi } from '@/lib/api/postsApi';

import CommentSection from './CommentSection';
import type { PageResponse, Comment } from '@/types/postTypes';

/**
 * 帖子详情客户端组件属性接口
 */
interface PostDetailClientProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 初始评论分页数据
   */
  initialComments: PageResponse<Comment>;
  
  /**
   * 评论提交回调
   */
  onCommentSubmitted?: (commentId: string, content: string) => void;

  /**
   * 初始评论数
   */
  initialCommentCount?: number;

  /**
   * 评论数更新回调
   */
  onCommentCountUpdated?: (count: number) => void;
}

/**
 * 帖子详情客户端组件
 * 
 * 处理评论分页的客户端逻辑，使用本地状态管理页码
 *
 * @component
 * @example
 * <PostDetailClient postId="post-123" initialComments={commentsData} />
 */
export default function PostDetailClient({ 
  postId, 
  initialComments, 
  onCommentSubmitted, 
  initialCommentCount,
  onCommentCountUpdated
}: PostDetailClientProps) {
  // 使用本地状态管理评论数据和当前页码
  const [comments, setComments] = useState<PageResponse<Comment>>(initialComments);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount || initialComments.total_count || 0);

  // 初始化时如果评论总数有变化，就更新本地状态
  useEffect(() => {
    setCommentCount(initialCommentCount || initialComments.total_count || 0);
  }, [initialCommentCount, initialComments.total_count]);

  /**
   * 获取指定页码的评论数据
   * 
   * @param page - 目标页码
   */
  const fetchComments = async (page: number) => {
    try {
      setLoading(true);
      
      // 通过获取帖子详情来获取评论数据
      const postDetail = await getPostByIdApi(postId, {
        comment_page_num: page,
        comment_page_size: 10
      });
      
      // 更新评论列表和总数
      setComments(postDetail.comments);
      setCurrentPage(page);
      
      // 更新评论总数
      if (postDetail.comments.total_count !== commentCount) {
        setCommentCount(postDetail.comments.total_count || 0);
        onCommentCountUpdated?.(postDetail.comments.total_count || 0);
      }
      
      // 数据加载完成后滚动到页面顶部
      // 使用 requestAnimationFrame 确保 DOM 更新完成后再滚动
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 使用多种方法确保滚动成功
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
          
          // 备用方案：如果smooth滚动有问题，800ms后强制滚动到顶部
          setTimeout(() => {
            if (window.scrollY > 10) {
              window.scrollTo(0, 0);
            }
          }, 800);
        });
      });
      
    } catch (error) {
      console.error('获取评论数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理评论分页变化
   * 
   * @param page - 目标页码
   */
  const handleCommentPageChange = (page: number) => {
    if (page !== currentPage) {
      fetchComments(page);
    }
  };

  /**
   * 处理评论添加成功后的刷新
   * 刷新当前页的评论数据
   */
  const handleCommentAdded = () => {
    fetchComments(1); // 评论添加后返回第一页，展示最新评论
  };

  // 创建带有正确当前页码的评论数据
  const commentsWithCorrectPage = {
    ...comments,
    page_num: currentPage
  };

  // 创建评论提交回调，同时处理本地状态更新和外部回调
  const handleCommentSubmitted = (commentId: string, content: string) => {
    handleCommentAdded(); // 刷新本地评论列表
    onCommentSubmitted?.(commentId, content); // 调用外部回调
  };

  return (
    <CommentSection 
      postId={postId}
      comments={commentsWithCorrectPage}
      onPageChange={handleCommentPageChange}
      onCommentAdded={handleCommentAdded}
      onCommentSubmitted={handleCommentSubmitted}
      loading={loading}
    />
  );
} 