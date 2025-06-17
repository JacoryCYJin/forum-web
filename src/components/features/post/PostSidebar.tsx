/**
 * @file 帖子侧边栏组件
 * @module components/features/post/PostSidebar
 * @description 右侧栏组件，包含操作按钮和评论区域
 */

'use client';

import { useState } from 'react';
import PostActions from './PostActions';
import PostDetailClient from './PostDetailClient';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import type { PageResponse, Comment } from '@/types/postTypes';

/**
 * 帖子侧边栏组件属性接口
 */
interface PostSidebarProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 帖子标题，用于分享
   */
  postTitle: string;
  
  /**
   * 评论总数
   */
  commentCount: number;
  
  /**
   * 初始评论数据
   */
  initialComments: PageResponse<Comment>;
}

/**
 * 帖子侧边栏组件
 * 
 * 右侧栏显示操作按钮和评论区域，采用现代简约设计
 *
 * @component
 * @example
 * <PostSidebar 
 *   postId="123" 
 *   postTitle="帖子标题"
 *   commentCount={5}
 *   initialComments={commentsData}
 * />
 */
export default function PostSidebar({ 
  postId, 
  postTitle,
  commentCount,
  initialComments 
}: PostSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white dark:bg-dark-secondary rounded-lg shadow border border-neutral-100 dark:border-zinc-700 overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-20' : ''}`}>
      {/* 头部控制栏 - 简约设计 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-white flex items-center">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
            <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <LanguageText 
            texts={{
              'zh-CN': '互动面板',
              'zh-TW': '互動面板',
              'en': 'Interaction Panel'
            }}
          />
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
          aria-label={isCollapsed ? '展开' : '收缩'}
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 主要内容区域 */}
      <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 max-h-0' : 'opacity-100'}`}>
        {/* 操作按钮区域 - 横向布局，简约样式 */}
        <div className="p-6 border-b border-neutral-100 dark:border-zinc-700">
          <PostActions 
            postId={postId} 
            postTitle={postTitle}
            variant="horizontal"
            className="justify-center"
          />
        </div>
        
        {/* 评论区域 - 简约设计 */}
        <div className="flex-1">
          <div className="px-6 py-4 bg-neutral-50 dark:bg-zinc-800/30 border-b border-neutral-100 dark:border-zinc-700">
            <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-200 flex items-center">
              <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <LanguageText 
                texts={{
                  'zh-CN': `评论区 (${commentCount})`,
                  'zh-TW': `評論區 (${commentCount})`,
                  'en': `Comments (${commentCount})`
                }}
              />
              {commentCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {commentCount}
                </span>
              )}
            </h4>
          </div>
          <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent">
            <PostDetailClient 
              postId={postId}
              initialComments={initialComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 