/**
 * @file 错误边界组件
 * @description 用于捕获组件错误并提供友好的错误显示
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import LoadingSpinner from '../LoadingStates/LoadingSpinner';

/**
 * 错误边界组件 Props
 */
interface ErrorBoundaryProps {
  /**
   * 子组件
   */
  children: ReactNode;
  
  /**
   * 自定义错误 UI
   */
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  
  /**
   * 错误回调函数
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /**
   * 是否在开发环境显示详细错误信息
   * @default true
   */
  showDetailInDev?: boolean;
}

/**
 * 错误边界组件状态
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 错误边界组件
 * 
 * 捕获 React 组件树中的错误，显示友好的错误界面
 *
 * @component
 * @example
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * 
 * // 自定义错误 UI
 * <ErrorBoundary 
 *   fallback={(error) => <div>自定义错误: {error.message}</div>}
 * >
 *   <SomeComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * 静态方法：从错误中获取派生状态
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 捕获错误信息
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 更新状态
    this.setState({
      error,
      errorInfo,
    });

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 在开发环境下输出错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary 捕获到错误:', error);
      console.error('错误信息:', errorInfo);
    }

    // 在生产环境中可以将错误信息发送到错误监控服务
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成如 Sentry 等错误监控服务
      // Sentry.captureException(error, { extra: errorInfo });
    }
  }

  /**
   * 重置错误状态
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * 渲染错误 UI
   */
  renderErrorUI(): ReactNode {
    const { error, errorInfo } = this.state;
    const { fallback, showDetailInDev = true } = this.props;

    // 如果有自定义错误 UI，使用自定义的
    if (fallback && error && errorInfo) {
      return fallback(error, errorInfo);
    }

    const isDev = process.env.NODE_ENV === 'development';

    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          {/* 错误图标 */}
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* 错误标题 */}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            哎呀，出现了错误
          </h2>

          {/* 错误描述 */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isDev && showDetailInDev && error
              ? error.message
              : '页面加载时遇到了问题，请稍后重试。'}
          </p>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <button
              onClick={this.resetError}
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              重试
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              刷新页面
            </button>
          </div>

          {/* 开发环境下显示详细错误信息 */}
          {isDev && showDetailInDev && errorInfo && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                查看技术详情
              </summary>
              <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-auto">
                  {error?.stack}
                  {'\n\n'}
                  {errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

/**
 * 异步错误边界 Hook
 * 
 * 用于捕获异步操作中的错误
 */
export function useAsyncError() {
  const [, setState] = React.useState();
  
  return React.useCallback((error: Error) => {
    setState(() => {
      throw error;
    });
  }, []);
}

/**
 * 异步组件包装器
 * 
 * 为懒加载组件提供错误边界和加载状态
 */
interface AsyncComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
}

export function AsyncComponentWrapper({
  children,
  fallback = <LoadingSpinner showText text="加载中..." />,
  errorFallback,
}: AsyncComponentWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
} 