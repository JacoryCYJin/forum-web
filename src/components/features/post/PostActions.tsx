'use client';

import { useState, useCallback } from 'react';
import FavouriteButton from './FavouriteButton';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import ReportDialog from '@/components/common/ReportDialog/ReportDialog';

/**
 * 帖子操作组件属性接口
 */
interface PostActionsProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 帖子标题，用于分享
   */
  postTitle: string;
  
  /**
   * 组件样式类名
   */
  className?: string;
}

/**
 * 帖子操作组件
 * 
 * 提供点赞、分享、收藏等操作功能
 *
 * @component
 * @example
 * <PostActions postId="123" postTitle="帖子标题" />
 */
export default function PostActions({ 
  postId, 
  postTitle, 
  className = "" 
}: PostActionsProps) {
  // 点赞状态
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  
  // 举报弹窗状态
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);

  /**
   * 切换点赞状态
   */
  const handleToggleLike = useCallback(async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      // 这里暂时模拟点赞功能，后续可以替换为真实API
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLiked(!isLiked);
      console.log(`${!isLiked ? '已点赞' : '已取消点赞'} 帖子: ${postId}`);
    } catch (error) {
      console.error(`切换点赞状态失败 (postId: ${postId}):`, error);
    } finally {
      setIsLiking(false);
    }
  }, [isLiked, isLiking, postId]);

  /**
   * 分享帖子 - 复制链接到剪贴板
   */
  const handleShare = useCallback(async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      
      console.log(`已复制链接到剪贴板: ${postTitle}`);
      
      // 添加临时的成功提示
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>已复制</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('复制链接失败:', error);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/post/${postId}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [postId, postTitle]);

  return (
    <>
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* 点赞按钮 */}
        <button 
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isLiked 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-zinc-700'}`}
        >
          {isLiking ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          ) : (
            <svg 
              className="w-5 h-5" 
              fill={isLiked ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span>
            <LanguageText 
              texts={{
                'zh-CN': isLiked ? '已点赞' : '点赞',
                'zh-TW': isLiked ? '已點讚' : '點讚',
                'en': isLiked ? 'Liked' : 'Like'
              }}
            />
          </span>
        </button>

        {/* 分享按钮 */}
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>
            <LanguageText 
              texts={{
                'zh-CN': '分享',
                'zh-TW': '分享',
                'en': 'Share'
              }}
            />
          </span>
        </button>

        {/* 收藏按钮 */}
        <FavouriteButton 
          postId={postId} 
          variant="default"
          className=""
        />

        {/* 更多操作按钮（包含举报） */}
        <div className="relative group">
          <button className="flex items-center space-x-2 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <button
              onClick={() => setShowReportDialog(true)}
              className="w-full px-4 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>举报</span>
            </button>
          </div>
        </div>
      </div>

      {/* 举报弹窗 */}
      <ReportDialog
        visible={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        componentType="POST"
        componentId={postId}
        title={postTitle}
        onSuccess={() => {
          // 举报提交成功，可以在这里添加其他处理逻辑
        }}
      />
    </>
  );
} 