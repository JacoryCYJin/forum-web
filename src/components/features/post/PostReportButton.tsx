'use client';

import { useState, useRef, useEffect } from 'react';
import ReportDialog from '@/components/common/ReportDialog/ReportDialog';
import LanguageText from '@/components/common/LanguageText/LanguageText';

/**
 * 帖子举报按钮组件属性接口
 */
interface PostReportButtonProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 帖子标题，用于举报弹窗显示
   */
  postTitle: string;
}

/**
 * 帖子举报按钮组件
 * 
 * 在帖子详情页右上角显示的举报按钮，点击后显示下拉菜单
 *
 * @component
 * @example
 * <PostReportButton postId="123" postTitle="帖子标题" />
 */
export default function PostReportButton({ postId, postTitle }: PostReportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * 点击外部区域关闭菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * 处理举报点击
   */
  const handleReportClick = () => {
    setShowMenu(false);
    setShowReportDialog(true);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          aria-label="更多选项"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {/* 下拉菜单 */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-lg shadow-lg py-2 z-50">
            <button
              onClick={handleReportClick}
              className="w-full px-4 py-2 text-left text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>
                <LanguageText 
                  texts={{
                    'zh-CN': '举报',
                    'zh-TW': '舉報',
                    'en': 'Report'
                  }}
                />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 举报弹窗 */}
      <ReportDialog
        visible={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        componentType="POST"
        componentId={postId}
        title={`帖子: ${postTitle.slice(0, 50)}${postTitle.length > 50 ? '...' : ''}`}
        onSuccess={() => {
          // 举报提交成功
        }}
      />
    </>
  );
} 