/**
 * @file 评论区组件
 * @module components/features/post/CommentSection
 * @description 显示帖子评论列表，支持分页和用户信息展示
 */

"use client";

import { useState, useEffect } from "react";
import { getUserInfoApi } from "@/lib/api/userApi";
import UserLink from "@/components/common/UserLink/UserLink";
import { addCommentApi } from "@/lib/api/commentApi";
import Pagination from "@/components/common/Pagination/Pagination";
import ReportDialog from "@/components/common/ReportDialog/ReportDialog";
import type { User } from "@/types/userTypes";
import type { Comment, PageResponse } from "@/types/postTypes";
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
  const [showReportDialog, setShowReportDialog] = useState(false);

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
    <>
      <div className="flex space-x-3 p-4 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
        {/* 用户信息和时间 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <UserLink
              userId={comment.userId}
              avatarUrl={user?.avatarUrl || "/images/avatars/cjp.png"}
              username={user?.username || `用户${comment.userId.slice(-6)}`}
              usernameClass="font-medium text-neutral-800 dark:text-white text-sm"
              spacing="space-x-2"
            />
            <span className="text-xs text-neutral-400 flex items-center ml-3">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              刚刚
            </span>
          </div>

          {/* 评论文本 */}
          <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed mb-2 text-sm">
            {comment.content}
          </div>

          {/* 评论操作按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-primary transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>回复</span>
              </button>
              <button className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-red-500 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>点赞</span>
              </button>
            </div>

            {/* 更多操作按钮（包含举报） */}
            <div className="relative group">
              <button className="flex items-center justify-center w-6 h-6 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* 下拉菜单 */}
              <div className="absolute right-0 top-full mt-1 w-24 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => setShowReportDialog(true)}
                  className="w-full px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>举报</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 举报弹窗 */}
      <ReportDialog
        visible={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        componentType="COMMENT"
        componentId={comment.commentId}
        title={`评论: ${comment.content.slice(0, 50)}${comment.content.length > 50 ? '...' : ''}`}
        onSuccess={() => {
          // 评论举报提交成功，可以在这里添加其他处理逻辑
        }}
      />
    </>
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
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-neutral-100 dark:border-zinc-700">
      {/* 评论区头部 */}
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-zinc-700">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          评论 
          <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {totalComments}
          </span>
        </h2>
      </div>

      {/* 评论输入区域 */}
      <div className="px-6 py-4 bg-neutral-50 dark:bg-zinc-800/50">
        {!isCommentExpanded ? (
          /* 收起状态：显示简单的点击区域 */
          <div
            onClick={handleCommentClick}
            className="w-full border-2 border-dashed border-neutral-200 dark:border-zinc-600 rounded-lg p-4 bg-white dark:bg-zinc-800 text-neutral-400 cursor-text hover:border-primary hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all duration-200 text-center"
          >
            <svg className="w-6 h-6 mx-auto mb-1 text-neutral-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>添加评论...</span>
          </div>
        ) : (
          /* 展开状态：显示完整的输入框和操作按钮 */
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-neutral-200 dark:border-zinc-700 p-3">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full border-0 bg-transparent text-neutral-800 dark:text-white placeholder-neutral-400 focus:ring-0 resize-none text-base leading-relaxed"
              rows={3}
              placeholder="写下你的评论..."
              autoFocus
            />
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-zinc-700 mt-3">
              <div className="text-sm text-neutral-400">
                <span className={commentContent.length > 450 ? 'text-orange-500' : commentContent.length > 500 ? 'text-red-500' : ''}>
                  {commentContent.length}
                </span>
                <span>/500</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelComment}
                  className="px-3 py-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handlePublishComment}
                  disabled={!commentContent.trim() || isSubmitting || commentContent.length > 500}
                  className="px-4 py-1 text-sm font-medium text-white bg-primary rounded hover:bg-primary-hover transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{isSubmitting ? "发布中..." : "发布评论"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 评论列表 */}
      <div className="px-6 pb-4">
        {comments.list && comments.list.length > 0 ? (
          <div className="space-y-0">
            {comments.list.map((comment, index) => (
              <div key={comment.commentId} className={`${index !== 0 ? 'border-t border-neutral-100 dark:border-zinc-700' : ''}`}>
                <CommentItem comment={comment} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              暂无评论
            </h3>
            <p className="text-neutral-400 dark:text-neutral-500">
              快来发表第一条评论吧！
            </p>
          </div>
        )}
      </div>

      {/* 分页组件 */}
      {totalPages > 1 && (
        <div className="px-6 pb-4 border-t border-neutral-100 dark:border-zinc-700 pt-4">
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
