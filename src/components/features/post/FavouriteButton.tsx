'use client';

import React, { useState, useEffect } from 'react';
import { toggleFavouriteApi, checkFavouriteApi } from '@/lib/api/favouriteApi';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import { useUserStore } from '@/store/userStore';

/**
 * 收藏按钮组件属性接口
 */
interface FavouriteButtonProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 按钮样式类型
   * @default 'default'
   */
  variant?: 'default' | 'large' | 'full-width';
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 收藏按钮组件
 * 
 * 显示收藏状态并支持切换收藏/取消收藏
 *
 * @component
 * @example
 * // 基本用法
 * <FavouriteButton postId="post123" />
 * 
 * // 大尺寸按钮
 * <FavouriteButton postId="post123" variant="large" />
 */
export default function FavouriteButton({ 
  postId, 
  variant = 'default',
  className = '' 
}: FavouriteButtonProps) {
  const { user, showLogin } = useUserStore();
  const isLoggedIn = !!user;
  
  /**
   * 收藏状态
   */
  const [isFavourited, setIsFavourited] = useState<boolean>(false);
  
  /**
   * 加载状态
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * 切换中状态
   */
  const [isToggling, setIsToggling] = useState<boolean>(false);

  /**
   * 获取收藏状态
   */
  const fetchFavouriteStatus = async () => {
    // 未登录用户不获取收藏状态
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const status = await checkFavouriteApi({ postId });
      setIsFavourited(status);
    } catch (error) {
      console.error('获取收藏状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 切换收藏状态
   */
  const handleToggleFavourite = async () => {
    // 未登录用户点击时弹出登录对话框
    if (!isLoggedIn) {
      showLogin();
      return;
    }
    
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      const newStatus = await toggleFavouriteApi({ postId });
      setIsFavourited(newStatus);
      console.log(`${newStatus ? '已收藏' : '已取消收藏'} 帖子: ${postId}`);
    } catch (error: any) {
      console.error('切换收藏状态失败:', error);
      
      // 检查是否需要显示登录对话框
      if (error.shouldShowLoginDialog) {
        showLogin();
        return;
      }
    } finally {
      setIsToggling(false);
    }
  };

  /**
   * 组件初始化时获取收藏状态
   */
  useEffect(() => {
    fetchFavouriteStatus();
  }, [postId, isLoggedIn]);

  // 根据variant确定样式
  const getButtonStyles = () => {
    const baseStyles = "flex items-center transition-all duration-200 rounded-lg";
    const disabledStyles = isToggling ? "opacity-50 cursor-not-allowed" : "";
    const colorStyles = isFavourited 
      ? "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" 
      : "text-neutral-600 dark:text-neutral-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-neutral-200 dark:border-zinc-700 hover:border-yellow-200 dark:hover:border-yellow-800";
    
    if (variant === 'full-width') {
      return `${baseStyles} ${colorStyles} ${disabledStyles} justify-center space-x-3 px-4 py-3 text-base font-medium border w-full ${className}`;
    }
    
    if (variant === 'large') {
      return `${baseStyles} ${colorStyles} ${disabledStyles} hover:bg-neutral-100 dark:hover:bg-zinc-700 px-4 py-3 text-base font-medium ${className}`;
    }
    
    return `${baseStyles} ${colorStyles} ${disabledStyles} hover:bg-neutral-100 dark:hover:bg-zinc-700 px-3 py-2 text-sm ${className}`;
  };

  // 根据variant确定图标大小
  const getIconSize = () => {
    return variant === 'large' ? "h-6 w-6" : "h-5 w-5";
  };

  return (
    <button
      onClick={handleToggleFavourite}
      disabled={isToggling || isLoading}
      className={getButtonStyles()}
      title={isFavourited ? '取消收藏' : '收藏帖子'}
    >
      {isToggling ? (
        <div className={`animate-spin rounded-full border-b-2 border-current mr-2 ${getIconSize()}`}></div>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`mr-2 ${getIconSize()}`}
          fill={isFavourited ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      
      {isLoading ? (
        <LanguageText 
          texts={{
            'zh-CN': '加载中...',
            'zh-TW': '載入中...',
            'en': 'Loading...'
          }}
        />
      ) : (
        <LanguageText 
          texts={{
            'zh-CN': isFavourited ? '已收藏' : '收藏',
            'zh-TW': isFavourited ? '已收藏' : '收藏',
            'en': isFavourited ? 'Favorited' : 'Save'
          }}
        />
      )}
    </button>
  );
} 