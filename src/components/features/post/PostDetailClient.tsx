/**
 * @file 帖子详情客户端组件
 * @module components/features/post/PostDetailClient
 * @description 处理帖子详情页面的客户端交互，包括评论分页
 */

"use client";

import { useState } from 'react';
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
    fetchComments(currentPage);
  };

  // 创建带有正确当前页码的评论数据
  const commentsWithCorrectPage = {
    ...comments,
    page_num: currentPage
  };

  return (
    <CommentSection 
      postId={postId}
      comments={commentsWithCorrectPage}
      onPageChange={handleCommentPageChange}
      onCommentAdded={handleCommentAdded}
      loading={loading}
    />
  );
} 