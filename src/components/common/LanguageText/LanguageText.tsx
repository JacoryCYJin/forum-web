/**
 * @file 多语言文本组件
 * @description 根据当前语言显示对应的文本内容
 */

'use client';

import { useLanguageStore } from '@/store/languageStore';

/**
 * 多语言文本映射接口
 */
interface LanguageTextMap {
  'zh-CN': string;
  'zh-TW': string;
  'en': string;
}

/**
 * 多语言文本组件Props
 */
interface LanguageTextProps {
  /** 多语言文本映射 */
  texts: LanguageTextMap;
  /** 额外的CSS类名 */
  className?: string;
}

/**
 * 多语言文本组件
 * 
 * 根据当前选择的语言显示对应的文本
 * 
 * @component
 * @example
 * <LanguageText 
 *   texts={{
 *     'zh-CN': '欢迎',
 *     'zh-TW': '歡迎',
 *     'en': 'Welcome'
 *   }}
 * />
 */
export function LanguageText({ texts, className }: LanguageTextProps) {
  const { currentLanguage } = useLanguageStore();
  
  return (
    <span className={className}>
      {texts[currentLanguage]}
    </span>
  );
}

export default LanguageText; 