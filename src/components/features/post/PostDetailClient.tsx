/**
 * @file 帖子详情客户端组件
 * @module components/features/post/PostDetailClient
 * @description 处理帖子详情页面的客户端交互，包括评论分页
 */

"use client";

import { useState, useEffect } from 'react';
import { getPostByIdApi } from '@/lib/api/postsApi';
import CommentSection from './CommentSection';
import type { PageResponse, Comment } from '@/types/postType';

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
export default function PostDetailClient({ postId, initialComments }: PostDetailClientProps) {
  // 使用本地状态管理评论数据和当前页码
  const [comments, setComments] = useState<PageResponse<Comment>>(initialComments);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /**
   * 页码变化时滚动到页面顶部
   */
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentPage]);

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
      
      setComments(postDetail.comments);
      setCurrentPage(page);
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

  // 创建带有正确当前页码的评论数据
  const commentsWithCorrectPage = {
    ...comments,
    page_num: currentPage
  };

  return (
    <CommentSection 
      comments={commentsWithCorrectPage}
      onPageChange={handleCommentPageChange}
      loading={loading}
    />
  );
} 