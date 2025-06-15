/**
 * @file 评论区组件
 * @module components/features/post/CommentSection
 * @description 显示帖子评论列表，支持分页和用户信息展示
 */

"use client";

import { useState, useEffect } from "react";
import { getUserInfoApi } from "@/lib/api/userApi";
import { addCommentApi } from "@/lib/api/commentApi";
import Pagination from "@/components/common/Pagination/Pagination";
import type { User } from "@/types/userType";
import type { Comment, PageResponse } from "@/types/postType";
import type { AddCommentRequest } from "@/types/commentTypes";

/**
 * 评论项组件属性接口
 */
interface CommentItemProps {
  /**
   * 评论数据
   */
  comment: Comment;
}

/**
 * 评论区组件属性接口
 */
interface CommentSectionProps {
  /**
   * 帖子ID
   */
  postId: string;

  /**
   * 评论分页数据
   */
  comments: PageResponse<Comment>;

  /**
   * 页码变化回调函数
   */
  onPageChange: (page: number) => void;

  /**
   * 评论发布成功回调函数
   */
  onCommentAdded?: () => void;

  /**
   * 是否显示加载状态
   */
  loading?: boolean;
}

/**
 * 评论项组件
 *
 * 显示单条评论信息，包含用户头像、昵称和评论内容
 *
 * @component
 * @example
 * <CommentItem comment={commentData} />
 */
function CommentItem({ comment }: CommentItemProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 获取评论用户信息
   */
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const userInfo = await getUserInfoApi({ userId: comment.userId });
        setUser(userInfo);
      } catch (error) {
        console.error(`获取用户信息失败 (userId: ${comment.userId}):`, error);
        // 设置默认用户信息
        setUser({
          userId: comment.userId,
          username: `用户${comment.userId.slice(-6)}`,
          avatarUrl: "/images/avatars/cjp.png",
        } as User);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [comment.userId]);

  if (loading) {
    return (
      <div className="flex space-x-3 p-4 animate-pulse">
        <div className="w-10 h-10 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-1/4"></div>
          <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3 p-4 border-b border-neutral-100 dark:border-zinc-700 last:border-b-0">
      {/* 用户头像 */}
      <div className="flex-shrink-0">
        <img
          src={user?.avatarUrl || "/images/avatars/cjp.png"}
          alt={user?.username || "用户头像"}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* 评论内容 */}
      <div className="flex-1 min-w-0">
        {/* 用户名 */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-neutral-800 dark:text-white">
            {user?.username || `用户${comment.userId.slice(-6)}`}
          </span>
          <span className="text-xs text-neutral-400">
            {/* 这里可以添加评论时间，如果后端提供的话 */}
          </span>
        </div>

        {/* 评论文本 */}
        <div className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* 评论操作按钮 */}
        <div className="flex items-center space-x-4 mt-2">
          <button className="text-xs text-neutral-400 hover:text-primary transition-colors">
            回复
          </button>
          <button className="text-xs text-neutral-400 hover:text-primary transition-colors">
            点赞
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 评论区组件
 *
 * 显示帖子的评论列表，支持分页功能
 *
 * @component
 * @example
 * <CommentSection
 *   comments={commentsData}
 *   onPageChange={(page) => handlePageChange(page)}
 *   loading={false}
 * />
 */
export default function CommentSection({
  postId,
  comments,
  onPageChange,
  onCommentAdded,
  loading = false,
}: CommentSectionProps) {
  /**
   * 控制评论输入框是否展开
   */
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);

  /**
   * 评论内容状态
   */
  const [commentContent, setCommentContent] = useState("");

  /**
   * 评论发布加载状态
   */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 处理评论输入框点击展开
   */
  const handleCommentClick = () => {
    setIsCommentExpanded(true);
  };

  /**
   * 处理取消评论
   */
  const handleCancelComment = () => {
    setIsCommentExpanded(false);
    setCommentContent("");
  };

  /**
   * 处理发布评论
   */
  const handlePublishComment = async () => {
    if (!commentContent.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      // 检查用户登录状态
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("请先登录后再发表评论");
        return;
      }

      const commentData: AddCommentRequest = {
        postId,
        content: commentContent.trim(),
      };


      await addCommentApi(commentData);

      // 发布成功后重置状态
      setCommentContent("");
      setIsCommentExpanded(false);

      // 调用回调函数刷新评论列表
      if (onCommentAdded) {
        onCommentAdded();
      }

      console.log("评论发布成功");
    } catch (error: any) {
      console.error("发布评论失败:", error);

      // 显示用户友好的错误信息
      if (error.message.includes("登录已过期")) {
        alert("登录已过期，请重新登录后再试");
      } else if (error.message.includes("网络")) {
        alert("网络连接失败，请检查网络后重试");
      } else if (error.message.includes("服务器繁忙")) {
        alert("服务器繁忙，请稍后重试");
      } else {
        alert(error.message || "发布评论失败，请稍后重试");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-white">
          评论加载中...
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex space-x-3 p-4 animate-pulse">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalComments = comments.total_count || 0;
  const currentPage = comments.page_num || 1;
  const pageSize = comments.page_size || 10;
  const totalPages = comments.page_count || 1;

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-white">
        评论 ({totalComments})
      </h2>

      {/* 评论输入区域 */}
      <div className="mb-8">
        {!isCommentExpanded ? (
          /* 收起状态：显示简单的点击区域 */
          <div
            onClick={handleCommentClick}
            className="w-full border border-neutral-200 dark:border-zinc-700 rounded-md p-4 bg-white dark:bg-zinc-800 text-neutral-400 cursor-text hover:border-primary transition-colors"
          >
            添加评论...
          </div>
        ) : (
          /* 展开状态：显示完整的输入框和操作按钮 */
          <div className="space-y-3">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border border-neutral-200 dark:border-zinc-700 rounded-md p-4 bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="写下你的评论..."
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-400">
                {commentContent.length}/500
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelComment}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handlePublishComment}
                  disabled={!commentContent.trim() || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "发布中..." : "发布评论"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 评论列表 */}
      {comments.list && comments.list.length > 0 ? (
        <div className="space-y-0">
          {comments.list.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-neutral-500 dark:text-neutral-400">
            暂无评论，快来发表第一条评论吧！
          </div>
        </div>
      )}

      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={totalComments}
            pageSize={pageSize}
            onPageChange={onPageChange}
            compact={false}
            showStats={false}
          />
        </div>
      )}
    </div>
  );
}
