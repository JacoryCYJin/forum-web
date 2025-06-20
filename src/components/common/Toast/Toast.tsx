"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Toast 消息类型
 */
export type ToastType = 'info' | 'success' | 'warning' | 'error';

/**
 * Toast 消息接口
 */
interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

/**
 * Toast 组件属性接口
 */
interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

/**
 * 单个 Toast 项组件
 */
function ToastItem({ message, onRemove }: { message: ToastMessage; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 进入动画
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // 自动消失
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(message.id), 300);
    }, message.duration || 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message.id, message.duration, onRemove]);

  /**
   * 获取Toast样式类名
   */
  const getToastStyles = () => {
    const baseStyles = "flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-sm";
    const animationStyles = `transition-all duration-300 ease-in-out transform ${
      isVisible && !isLeaving 
        ? 'translate-x-0 opacity-100' 
        : 'translate-x-full opacity-0'
    }`;

    switch (message.type) {
      case 'success':
        return `${baseStyles} ${animationStyles} bg-green-50/90 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
      case 'warning':
        return `${baseStyles} ${animationStyles} bg-yellow-50/90 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
      case 'error':
        return `${baseStyles} ${animationStyles} bg-red-50/90 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
      default:
        return `${baseStyles} ${animationStyles} bg-primary/10 dark:bg-primary/20 border-primary/20 dark:border-primary/40 text-primary dark:text-primary`;
    }
  };

  /**
   * 获取图标
   */
  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";
    
    switch (message.type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`${iconClass} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`${iconClass} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="ml-3 flex-1">
        {message.title && (
          <p className="text-sm font-semibold mb-1">
            {message.title}
          </p>
        )}
        <p className="text-sm leading-relaxed">
          {message.message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => onRemove(message.id), 300);
        }}
        className="ml-3 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Toast 容器组件
 * 
 * 显示浮动提示消息的容器，支持多种类型的消息和自动消失
 *
 * @component
 */
function Toast({ messages, onRemove }: ToastProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      {messages.map((message) => (
        <div key={message.id} className="pointer-events-auto">
          <ToastItem message={message} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
}

export default Toast; 