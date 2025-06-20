import { useState, useCallback } from 'react';
import type { ToastType } from './Toast';

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
 * useToast Hook
 * 
 * 提供Toast消息管理功能
 *
 * @hook
 * @returns {Object} Toast管理对象
 * @returns {ToastMessage[]} returns.messages - 当前Toast消息列表
 * @returns {Function} returns.showToast - 显示Toast消息
 * @returns {Function} returns.showInfo - 显示信息Toast
 * @returns {Function} returns.showSuccess - 显示成功Toast
 * @returns {Function} returns.showWarning - 显示警告Toast
 * @returns {Function} returns.showError - 显示错误Toast
 * @returns {Function} returns.removeToast - 移除指定Toast消息
 * @returns {Function} returns.clearAll - 清除所有Toast消息
 */
export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  /**
   * 生成唯一ID
   */
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  /**
   * 显示Toast消息
   * 
   * @param type - 消息类型
   * @param message - 消息内容
   * @param title - 消息标题（可选）
   * @param duration - 显示时长（可选，默认4000ms）
   */
  const showToast = useCallback((
    type: ToastType,
    message: string,
    title?: string,
    duration?: number
  ) => {
    const id = generateId();
    const newMessage: ToastMessage = {
      id,
      type,
      title,
      message,
      duration: duration || 4000
    };

    setMessages(prev => [...prev, newMessage]);
  }, [generateId]);

  /**
   * 显示信息Toast
   */
  const showInfo = useCallback((message: string, title?: string, duration?: number) => {
    showToast('info', message, title, duration);
  }, [showToast]);

  /**
   * 显示成功Toast
   */
  const showSuccess = useCallback((message: string, title?: string, duration?: number) => {
    showToast('success', message, title, duration);
  }, [showToast]);

  /**
   * 显示警告Toast
   */
  const showWarning = useCallback((message: string, title?: string, duration?: number) => {
    showToast('warning', message, title, duration);
  }, [showToast]);

  /**
   * 显示错误Toast
   */
  const showError = useCallback((message: string, title?: string, duration?: number) => {
    showToast('error', message, title, duration);
  }, [showToast]);

  /**
   * 移除指定Toast消息
   * 
   * @param id - 消息ID
   */
  const removeToast = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  /**
   * 清除所有Toast消息
   */
  const clearAll = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    removeToast,
    clearAll
  };
}

export type { ToastMessage };
export default useToast; 