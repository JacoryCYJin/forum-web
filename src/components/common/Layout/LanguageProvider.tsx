/**
 * @file 语言提供者组件
 * @description 动态设置HTML lang属性的客户端组件
 */

'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

/**
 * 语言提供者组件
 * 
 * 监听语言变化并动态更新HTML lang属性
 * 
 * @component
 */
export function LanguageProvider() {
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    // 更新HTML lang属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  // 这个组件不渲染任何内容，只是用来处理副作用
  return null;
}

export default LanguageProvider; 