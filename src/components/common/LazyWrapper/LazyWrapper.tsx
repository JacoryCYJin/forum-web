/**
 * @file 懒加载组件包装器
 * @description 统一管理所有懒加载组件，提供加载状态和错误处理
 */

'use client';

import React, { Suspense } from 'react';
import { createDynamicComponent } from '@/lib/utils/performance';
import LoadingSpinner from '../LoadingStates/LoadingSpinner';
import { PostListSkeleton } from '../LoadingStates/SkeletonLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

/**
 * 懒加载的帖子列表组件
 */
export const LazyPostList = createDynamicComponent(
  () => import('@/components/features/post/PostList'),
  {
    loading: () => <PostListSkeleton count={3} />,
    ssr: true,
  }
);

/**
 * 懒加载的用户侧边栏组件
 */
export const LazySidebar = createDynamicComponent(
  () => import('@/components/common/Sidebar/Sidebar'),
  {
    loading: () => <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />,
    ssr: false,
  }
);

/**
 * 懒加载的导航栏组件（登录相关功能）
 */
export const LazyNavbarAuth = createDynamicComponent(
  () => import('@/components/common/Navbar/LoginDialog'),
  {
    loading: () => <LoadingSpinner size="sm" />,
    ssr: false,
  }
);

/**
 * 懒加载的 Markdown 渲染器
 */
export const LazyMarkdownRenderer = createDynamicComponent(
  () => import('@/components/common/MarkdownRenderer/MarkdownRenderer'),
  {
    loading: () => (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6" />
      </div>
    ),
    ssr: true,
  }
);

/**
 * 懒加载组件的通用包装器
 */
interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  showErrorDetails?: boolean;
}

/**
 * 懒加载组件包装器
 */
export function LazyComponentWrapper({
  children,
  fallback = <LoadingSpinner showText text="加载中..." />,
  onError,
  showErrorDetails = process.env.NODE_ENV === 'development',
}: LazyComponentWrapperProps) {
  return (
    <ErrorBoundary
      onError={onError}
      showDetailInDev={showErrorDetails}
      fallback={(error) => (
        <div className="p-4 text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            组件加载失败
          </p>
          {showErrorDetails && (
            <p className="text-xs text-gray-500">{error.message}</p>
          )}
        </div>
      )}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * 页面级懒加载包装器
 */
interface LazyPageWrapperProps {
  children: React.ReactNode;
  pageTitle?: string;
  showPageLoader?: boolean;
}

export function LazyPageWrapper({
  children,
  pageTitle = '页面',
  showPageLoader = true,
}: LazyPageWrapperProps) {
  const pageLoadingFallback = showPageLoader ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" showText text={`加载${pageTitle}中...`} />
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
  );

  return (
    <LazyComponentWrapper fallback={pageLoadingFallback}>
      {children}
    </LazyComponentWrapper>
  );
} 