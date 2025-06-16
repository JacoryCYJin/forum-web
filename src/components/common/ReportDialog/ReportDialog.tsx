/**
 * @file 举报弹窗组件
 * @module components/common/ReportDialog
 * @description 通用举报弹窗组件，支持用户、帖子、评论的举报功能
 */

"use client";

import { useState, useEffect } from 'react';
import { getReportReasonsApi, submitReportApi } from '@/lib/api/reportApi';
import type { 
  ReportDialogProps, 
  ReportReason, 
  ComponentType 
} from '@/types/reportTypes';
import { getReasonLabel, getReportCategories, COMPONENT_TYPE_LABELS } from '@/types/reportTypes';

/**
 * 举报弹窗组件
 * 
 * 提供统一的举报功能界面，支持多种举报类型和原因选择
 *
 * @component
 * @example
 * <ReportDialog
 *   visible={showReportDialog}
 *   onClose={() => setShowReportDialog(false)}
 *   componentType="POST"
 *   componentId="post123"
 *   title="这是一个帖子标题"
 *   onSuccess={() => console.log('举报成功')}
 * />
 */
export default function ReportDialog({
  visible,
  onClose,
  componentType,
  componentId,
  title,
  onSuccess
}: ReportDialogProps) {
  /**
   * 举报原因列表
   */
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  
  /**
   * 选中的举报原因
   */
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  /**
   * 自定义举报原因
   */
  const [customReason, setCustomReason] = useState<string>('');
  
  /**
   * 加载状态
   */
  const [loading, setLoading] = useState<boolean>(false);
  
  /**
   * 提交状态
   */
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 错误消息
   */
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * 成功消息
   */
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * 获取举报原因列表
   */
  const fetchReasons = async (type: ComponentType) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const reasonList = await getReportReasonsApi(type);
      setReasons(reasonList);
    } catch (error: any) {
      console.error('获取举报原因失败:', error);
      setErrorMessage(error.message || '获取举报原因失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 重置表单状态
   */
  const resetForm = () => {
    setSelectedReason('');
    setCustomReason('');
    setReasons([]);
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * 处理弹窗关闭
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /**
   * 处理举报提交
   */
  const handleSubmit = async () => {
    setErrorMessage('');
    
    if (!selectedReason) {
      setErrorMessage('请选择举报原因');
      return;
    }

    if (selectedReason.endsWith('_OTHER') && !customReason.trim()) {
      setErrorMessage('请填写具体的举报原因');
      return;
    }

    try {
      setSubmitting(true);

      await submitReportApi({
        componentType,
        componentId,
        reasonType: selectedReason,
        reason: selectedReason.endsWith('_OTHER') ? customReason.trim() : undefined
      });

      setSuccessMessage('举报提交成功，我们会尽快处理');
      
      // 延迟关闭弹窗，让用户看到成功消息
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (error: any) {
      console.error('提交举报失败:', error);
      setErrorMessage(error.message || '举报提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 监听弹窗显示状态，获取举报原因
   */
  useEffect(() => {
    if (visible && componentType) {
      fetchReasons(componentType);
    }
  }, [visible, componentType]);

  /**
   * 获取分类后的举报原因
   */
  const getCategorizedReasons = () => {
    const categories = getReportCategories(componentType);
    const reasonMap = new Map(reasons.map(r => [r.reason, r]));
    
    return categories.map(category => ({
      ...category,
      availableReasons: category.reasons
        .map(reasonKey => reasonMap.get(reasonKey))
        .filter(Boolean) as ReportReason[]
    })).filter(category => category.availableReasons.length > 0);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* 弹窗内容 - 增加宽度，固定高度避免滚动 */}
      <div className="relative bg-white dark:bg-dark-secondary rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-zinc-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
            举报{COMPONENT_TYPE_LABELS[componentType]}
          </h3>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 弹窗内容区域 - 两列布局 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：举报原因选择 */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* 成功消息 */}
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-700 dark:text-green-300 text-sm">{successMessage}</span>
                </div>
              </div>
            )}

            {/* 错误消息 */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-300 text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* 举报原因选择 */}
            <div>
              <h4 className="text-base font-medium text-neutral-800 dark:text-white mb-4">
                请选择举报原因
              </h4>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-neutral-500">加载中...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {getCategorizedReasons().map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-3">
                      {/* 分类标题 */}
                      <h5 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-zinc-700 pb-2">
                        {category.title}
                      </h5>
                      
                      {/* 分类下的举报原因 - 固定3列布局 */}
                      <div className="grid grid-cols-3 gap-3">
                        {category.availableReasons.map((reason) => (
                          <label
                            key={reason.reason}
                            className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="reportReason"
                              value={reason.reason}
                              checked={selectedReason === reason.reason}
                              onChange={(e) => setSelectedReason(e.target.value)}
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ 
                                outline: 'none', 
                                boxShadow: 'none',
                                border: '1px solid #d1d5db',
                                backgroundColor: selectedReason === reason.reason ? 'var(--primary)' : 'transparent'
                              }}
                            />
                            <span className="ml-3 text-neutral-700 dark:text-neutral-300 text-sm leading-tight">
                              {getReasonLabel(componentType, reason.reason)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 自定义原因输入框 */}
            {selectedReason.endsWith('_OTHER') && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  请详细说明举报原因
                </h4>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="请详细描述违规内容或行为..."
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="text-right text-xs text-neutral-400 mt-1">
                  {customReason.length}/200
                </div>
              </div>
            )}
          </div>

          {/* 右侧：被举报内容信息和说明 */}
          <div className="w-80 p-6 bg-neutral-50 dark:bg-zinc-800/50 border-l border-neutral-200 dark:border-zinc-700">
            {/* 被举报内容信息 */}
            {title && (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  举报内容
                </h4>
                <p className="text-neutral-800 dark:text-white text-sm line-clamp-3">
                  {title}
                </p>
              </div>
            )}

            {/* 举报说明 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-2">举报说明</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 我们会认真处理每一个举报，请确保举报内容属实</li>
                    <li>• 恶意举报可能会影响您的账号信誉</li>
                    <li>• 处理结果将通过系统消息通知您</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 弹窗底部按钮 - 固定在底部 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-neutral-200 dark:border-zinc-700 flex-shrink-0 bg-white dark:bg-dark-secondary">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white border border-neutral-300 dark:border-zinc-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || loading || submitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{submitting ? '提交中...' : '提交举报'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 