/**
 * @file 加载状态组件
 * @description 提供统一的加载状态UI组件
 */

import React from 'react';

/**
 * 加载旋转器组件的 Props
 */
interface LoadingSpinnerProps {
  /**
   * 尺寸大小
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * 颜色主题
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'white';
  
  /**
   * 是否显示加载文本
   * @default false
   */
  showText?: boolean;
  
  /**
   * 自定义加载文本
   */
  text?: string;
  
  /**
   * 是否全屏显示
   * @default false
   */
  fullScreen?: boolean;
}

/**
 * 尺寸映射
 */
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

/**
 * 颜色映射
 */
const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-gray-600 dark:text-gray-400',
  white: 'text-white',
};

/**
 * 加载旋转器组件
 * 
 * 提供统一的加载状态显示
 *
 * @component
 * @example
 * // 基本用法
 * <LoadingSpinner />
 * 
 * // 带文本的加载
 * <LoadingSpinner showText text="加载中..." />
 * 
 * // 全屏加载
 * <LoadingSpinner fullScreen showText />
 */
export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  showText = false,
  text = '加载中...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
        role="status"
        aria-label="加载中"
      >
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`text-sm ${colorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
} 