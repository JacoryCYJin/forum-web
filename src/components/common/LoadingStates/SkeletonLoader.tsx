/**
 * @file 骨架屏组件
 * @description 提供各种类型的骨架屏，改善页面加载体验
 */

import React from 'react';

/**
 * 基础骨架组件 Props
 */
interface SkeletonProps {
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否启用动画
   * @default true
   */
  animate?: boolean;
}

/**
 * 基础骨架组件
 */
function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${
        animate ? 'animate-pulse' : ''
      } ${className}`}
    />
  );
}

/**
 * 帖子列表骨架屏 Props
 */
interface PostListSkeletonProps {
  /**
   * 显示的骨架项数量
   * @default 5
   */
  count?: number;
  
  /**
   * 是否显示头像
   * @default true
   */
  showAvatar?: boolean;
  
  /**
   * 是否显示标签
   * @default true
   */
  showTags?: boolean;
}

/**
 * 帖子列表骨架屏
 * 
 * @component
 * @example
 * <PostListSkeleton count={3} />
 */
export function PostListSkeleton({ 
  count = 5, 
  showAvatar = true, 
  showTags = true 
}: PostListSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark-secondary rounded-lg p-6 border border-neutral-100 dark:border-zinc-700"
        >
          {/* 头部：用户信息和时间 */}
          <div className="flex items-center space-x-3 mb-4">
            {showAvatar && (
              <Skeleton className="w-10 h-10 rounded-full" />
            )}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          {/* 标题 */}
          <Skeleton className="h-6 w-3/4 mb-3" />
          
          {/* 内容 */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          
          {/* 标签 */}
          {showTags && (
            <div className="flex space-x-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          )}
          
          {/* 底部：互动按钮 */}
          <div className="flex items-center space-x-6">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 用户卡片骨架屏 Props
 */
interface UserCardSkeletonProps {
  /**
   * 显示的骨架项数量
   * @default 3
   */
  count?: number;
}

/**
 * 用户卡片骨架屏
 */
export function UserCardSkeleton({ count = 3 }: UserCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark-secondary rounded-lg p-4 border border-neutral-100 dark:border-zinc-700"
        >
          {/* 头像和基本信息 */}
          <div className="flex items-center space-x-3 mb-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          {/* 描述 */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          
          {/* 统计信息 */}
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 评论列表骨架屏 Props
 */
interface CommentListSkeletonProps {
  /**
   * 显示的骨架项数量
   * @default 3
   */
  count?: number;
}

/**
 * 评论列表骨架屏
 */
export function CommentListSkeleton({ count = 3 }: CommentListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex space-x-3">
          {/* 头像 */}
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          
          {/* 内容 */}
          <div className="flex-1 space-y-2">
            {/* 用户名和时间 */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            {/* 评论内容 */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 文章详情骨架屏
 */
export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题 */}
      <div className="mb-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        
        {/* 作者信息 */}
        <div className="flex items-center space-x-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        
        {/* 标签 */}
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-18 rounded-full" />
        </div>
      </div>
      
      {/* 内容 */}
      <div className="prose max-w-none space-y-4 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* 互动区域 */}
      <div className="border-t border-neutral-200 dark:border-zinc-700 pt-6">
        <div className="flex items-center space-x-6 mb-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        
        {/* 评论区 */}
        <div className="space-y-1 mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        
        <CommentListSkeleton count={2} />
      </div>
    </div>
  );
}

/**
 * 表格骨架屏 Props
 */
interface TableSkeletonProps {
  /**
   * 行数
   * @default 5
   */
  rows?: number;
  
  /**
   * 列数
   * @default 4
   */
  columns?: number;
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg border border-neutral-100 dark:border-zinc-700 overflow-hidden">
      {/* 表头 */}
      <div className="grid gap-4 p-4 border-b border-neutral-100 dark:border-zinc-700" 
           style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-4 w-20" />
        ))}
      </div>
      
      {/* 表格内容 */}
      <div className="divide-y divide-neutral-100 dark:divide-zinc-700">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 p-4" 
               style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton key={colIndex} className="h-4" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton; 