'use client';

import { useState, useCallback, useEffect } from 'react';
import FavouriteButton from './FavouriteButton';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import { toggleLikeApi, checkLikeApi } from '@/lib/api/likeApi';
import { useUserStore } from '@/store/userStore';

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

  /**
   * 组件布局变体
   */
  variant?: 'vertical' | 'horizontal';
  
  /**
   * 点赞状态变更回调
   */
  onLikeStatusChanged?: (isLiked: boolean) => void;
  
  /**
   * 收藏状态变更回调
   */
  onFavouriteStatusChanged?: (isFavourited: boolean) => void;
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
  className = "",
  variant = 'vertical',
  onLikeStatusChanged,
  onFavouriteStatusChanged
}: PostActionsProps) {
  const { user, showLogin } = useUserStore();
  const isLoggedIn = !!user;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  /**
   * 组件初始化时获取点赞状态
   */
  useEffect(() => {
    // 未登录用户不获取点赞状态
    if (!isLoggedIn) {
      return;
    }
    
    const fetchLikeStatus = async () => {
      try {
        const liked = await checkLikeApi({ post_id: postId });
        setIsLiked(liked);
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    };

    fetchLikeStatus();
  }, [postId, isLoggedIn]);

  /**
   * 处理点赞/取消点赞
   */
  const handleToggleLike = useCallback(async () => {
    // 未登录用户点击时弹出登录对话框
    if (!isLoggedIn) {
      showLogin();
      return;
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const newLikeStatus = await toggleLikeApi({ post_id: postId });
      setIsLiked(newLikeStatus);
      onLikeStatusChanged?.(newLikeStatus);
    } catch (error: any) {
      console.error('点赞操作失败:', error);
      
      // 检查是否需要显示登录对话框
      if (error.shouldShowLoginDialog) {
        showLogin();
        return;
      }
    } finally {
      setIsLiking(false);
    }
  }, [postId, isLiking, isLoggedIn, showLogin, onLikeStatusChanged]);

  /**
   * 处理分享
   */
  const handleShare = useCallback(async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      
      // 可以添加一个临时的成功提示
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-xs">已复制</span>
        `;
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
      
      console.log(`已复制链接到剪贴板: ${postTitle}`);
    } catch (error) {
      console.error('复制链接失败:', error);
      // 降级方案：选择文本
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/post/${postId}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, [postId, postTitle]);

  // 按钮基础样式类
  const buttonBaseClass = "flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium border text-sm min-h-[40px]";

  return (
    <div className={className}>
      {variant === 'horizontal' ? (
        /* 横向布局 - 适合侧边栏 */
        <div className="flex items-center space-x-3">
          {/* 点赞按钮 */}
          <button 
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`${buttonBaseClass} w-[100px] ${
              isLiked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-neutral-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-800'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLiking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <svg 
                className="w-4 h-4 flex-shrink-0" 
                fill={isLiked ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span className="whitespace-nowrap">
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
            className={`${buttonBaseClass} w-[100px] text-neutral-600 dark:text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-neutral-200 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-800`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="whitespace-nowrap">
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
            className={`${buttonBaseClass} w-[100px]`}
            onFavouriteStatusChanged={onFavouriteStatusChanged}
          />
        </div>
      ) : (
        /* 纵向布局 - 原有的垂直布局 */
        <div className={`space-y-3 ${className}`}>
          {/* 点赞按钮 */}
          <button 
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium border text-sm min-h-[42px] ${
              isLiked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-neutral-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-800'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          
          {/* 收藏按钮 */}
          <FavouriteButton 
            postId={postId} 
            variant="full-width"
            onFavouriteStatusChanged={onFavouriteStatusChanged}
          />
          
          {/* 分享按钮 */}
          <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium border text-sm min-h-[42px] text-neutral-600 dark:text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-neutral-200 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-800"
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
        </div>
      )}
    </div>
  );
} 