"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from './useToast';
import ClientOnlyToast from './ClientOnlyToast';
import type { ToastType } from './Toast';

/**
 * Toast Context 接口
 */
interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showWarning: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  clearAll: () => void;
}

/**
 * Toast Context
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider 属性接口
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast Provider 组件
 * 
 * 提供全局Toast功能的Provider组件
 *
 * @component
 * @example
 * // 在根组件中使用
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const {
    messages,
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    removeToast,
    clearAll
  } = useToast();

  const contextValue: ToastContextType = {
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    clearAll
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast 组件只在客户端渲染 */}
      <ClientOnlyToast messages={messages} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * useToastContext Hook
 * 
 * 获取Toast上下文
 *
 * @hook
 * @returns {ToastContextType} Toast上下文对象
 * @throws {Error} 当在ToastProvider外部使用时抛出错误
 */
export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider; 