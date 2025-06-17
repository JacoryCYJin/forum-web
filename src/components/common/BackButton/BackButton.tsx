/**
 * @file 返回按钮组件
 * @module components/common/BackButton
 * @description 简洁的返回按钮组件
 */

'use client';

import Link from 'next/link';
import LanguageText from '@/components/common/LanguageText/LanguageText';

/**
 * 返回按钮组件属性接口
 */
interface BackButtonProps {
  /**
   * 返回的目标URL
   * @default '/'
   */
  href?: string;
  
  /**
   * 按钮文本
   */
  text?: {
    'zh-CN': string;
    'zh-TW': string;
    'en': string;
  };
  
  /**
   * 自定义CSS类名
   */
  className?: string;
}

/**
 * 返回按钮组件
 * 
 * 简洁设计的返回导航按钮
 *
 * @component
 * @example
 * <BackButton href="/" />
 * <BackButton 
 *   href="/posts" 
 *   text={{
 *     'zh-CN': '返回帖子列表',
 *     'zh-TW': '返回貼文列表',
 *     'en': 'Back to Posts'
 *   }}
 * />
 */
export default function BackButton({ 
  href = '/', 
  text = {
    'zh-CN': '返回首页',
    'zh-TW': '返回首頁',
    'en': 'Back to Home'
  },
  className = '' 
}: BackButtonProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Link 
        href={href}
        className="inline-flex items-center space-x-2 text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 text-sm group"
      >
        <svg 
          className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">
          <LanguageText texts={text} />
        </span>
      </Link>
    </div>
  );
} 