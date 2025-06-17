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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* 遮罩层 - 增强版 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40 backdrop-blur-md transition-all duration-300"
        onClick={handleClose}
      />
      
      {/* 弹窗内容 - 现代化设计，增加宽度适应三列布局 */}
      <div className="relative bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col border border-neutral-200/50 dark:border-zinc-700/50 overflow-hidden animate-slideUp">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-red-500/5 pointer-events-none"></div>
        
        {/* 弹窗头部 - 增强版 */}
        <div className="relative flex items-center justify-between p-8 border-b border-gradient-to-r from-transparent via-neutral-200 dark:via-zinc-700 to-transparent bg-gradient-to-r from-white via-neutral-50 to-white dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                举报{COMPONENT_TYPE_LABELS[componentType]}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                请详细描述违规内容，我们会认真处理
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-zinc-700 hover:bg-neutral-200 dark:hover:bg-zinc-600 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all duration-200 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 弹窗内容区域 - 两列布局优化 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：举报原因选择 */}
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-zinc-600">
            {/* 成功消息 - 增强版 */}
            {successMessage && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 animate-slideIn">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">提交成功</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 错误消息 - 增强版 */}
            {errorMessage && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6 animate-slideIn">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">提交失败</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 举报原因选择 */}
            <div>
              <h4 className="text-lg font-bold text-neutral-800 dark:text-white mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                请选择举报原因
              </h4>
              
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
                  </div>
                  <span className="ml-4 text-neutral-500 dark:text-neutral-400 font-medium">加载举报原因中...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {getCategorizedReasons().map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                      {/* 分类标题 - 增强版 */}
                      <h5 className="text-base font-bold text-neutral-700 dark:text-neutral-200 border-b-2 border-gradient-to-r from-primary/30 to-transparent pb-3 flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {category.title}
                      </h5>
                      
                      {/* 分类下的举报原因 - 一行三列布局 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.availableReasons.map((reason) => (
                          <label
                            key={reason.reason}
                            className={`group relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                              selectedReason === reason.reason
                                ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg'
                                : 'border-neutral-200 dark:border-zinc-700 hover:border-primary/50 hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <div className="relative flex items-center">
                              <input
                                type="radio"
                                name="reportReason"
                                value={reason.reason}
                                checked={selectedReason === reason.reason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                selectedReason === reason.reason
                                  ? 'border-primary bg-primary'
                                  : 'border-neutral-300 dark:border-zinc-600 group-hover:border-primary'
                              }`}>
                                {selectedReason === reason.reason && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-scaleIn"></div>
                                )}
                              </div>
                            </div>
                            <span className="ml-4 text-neutral-700 dark:text-neutral-300 text-sm font-medium leading-relaxed">
                              {getReasonLabel(componentType, reason.reason)}
                            </span>
                            {/* 选中指示器 */}
                            {selectedReason === reason.reason && (
                              <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 自定义原因输入框 - 增强版 */}
            {selectedReason.endsWith('_OTHER') && (
              <div className="mt-8 p-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-zinc-800/50 dark:to-zinc-700/50 rounded-xl border border-neutral-200 dark:border-zinc-700 animate-slideIn">
                <h4 className="text-base font-semibold text-neutral-700 dark:text-neutral-200 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  请详细说明举报原因
                </h4>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={4}
                  maxLength={200}
                  placeholder="请详细描述违规内容或行为，这将帮助我们更好地处理您的举报..."
                  className="w-full px-4 py-3 border-2 border-neutral-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    详细的描述有助于我们快速处理举报
                  </p>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500">
                    {customReason.length}/200
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：被举报内容信息和说明 */}
          <div className="w-96 p-8 bg-gradient-to-br from-neutral-50/80 to-neutral-100/80 dark:from-zinc-800/50 dark:to-zinc-900/50 border-l border-neutral-200 dark:border-zinc-700">
            {/* 被举报内容信息 */}
            {title && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8 shadow-sm border border-neutral-200 dark:border-zinc-700">
                <h4 className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  举报内容
                </h4>
                <p className="text-neutral-800 dark:text-white text-sm line-clamp-4 leading-relaxed bg-neutral-50 dark:bg-zinc-700 p-3 rounded-lg">
                  {title}
                </p>
              </div>
            )}

            {/* 举报说明 - 增强版 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-3">举报说明</p>
                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      我们会认真处理每一个举报，请确保举报内容属实
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      恶意举报可能会影响您的账号信誉
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      处理结果将通过系统消息通知您
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      通常在24小时内处理完成
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 弹窗底部按钮 - 增强版 */}
        <div className="relative flex justify-end space-x-4 p-8 border-t border-neutral-200 dark:border-zinc-700 bg-gradient-to-r from-white via-neutral-50 to-white dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-6 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white border-2 border-neutral-300 dark:border-zinc-600 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || loading || submitting}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
            )}
            <span>{submitting ? '提交中...' : '提交举报'}</span>
          </button>
        </div>
      </div>
      
      {/* 添加CSS动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from { 
            transform: scale(0);
          }
          to { 
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
} 