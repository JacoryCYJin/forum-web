/**
 * @file 确认弹窗组件
 * @description 通用的确认弹窗组件
 */

'use client';

import React from 'react';
import LanguageText from '@/components/common/LanguageText/LanguageText';

/**
 * 确认弹窗组件属性接口
 */
interface ConfirmDialogProps {
  /**
   * 弹窗是否可见
   */
  visible: boolean;
  
  /**
   * 弹窗标题
   */
  title: string;
  
  /**
   * 弹窗内容
   */
  message: string;
  
  /**
   * 确认按钮文本
   */
  confirmText?: string;
  
  /**
   * 取消按钮文本
   */
  cancelText?: string;
  
  /**
   * 是否正在处理请求
   */
  loading?: boolean;
  
  /**
   * 确认操作的回调函数
   */
  onConfirm: () => void;
  
  /**
   * 取消操作的回调函数
   */
  onCancel: () => void;
}

/**
 * 确认弹窗组件
 * 
 * 显示确认信息并提供确认和取消操作
 *
 * @component
 * @example
 * <ConfirmDialog
 *   visible={showDialog}
 *   title="确认删除"
 *   message="确定要删除这个项目吗？"
 *   loading={isLoading}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={!loading ? onCancel : undefined}
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white dark:bg-dark-secondary rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
          {title}
        </h3>
        
        {/* 内容 */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {message}
        </p>
        
        {/* 操作按钮 */}
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white border border-neutral-300 dark:border-zinc-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText || (
              <LanguageText 
                texts={{
                  'zh-CN': '取消',
                  'zh-TW': '取消',
                  'en': 'Cancel'
                }}
              />
            )}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {confirmText || (
                <LanguageText 
                  texts={{
                    'zh-CN': '确认',
                    'zh-TW': '確認',
                    'en': 'Confirm'
                  }}
                />
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 