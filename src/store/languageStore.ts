/**
 * @file 语言状态管理
 * @description 处理多语言切换和本地化状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 支持的语言类型
 */
export type Language = 'zh-CN' | 'zh-TW' | 'en';

/**
 * 语言配置接口
 */
export interface LanguageConfig {
  /** 语言代码 */
  code: Language;
  /** 语言名称 */
  name: string;
  /** 语言图标 */
  icon: string;
  /** 语言标签 */
  label: string;
}

/**
 * 语言状态接口
 */
interface LanguageState {
  /** 当前语言 */
  currentLanguage: Language;
  /** 可用语言列表 */
  availableLanguages: LanguageConfig[];
  
  /** 设置语言 */
  setLanguage: (language: Language) => void;
  /** 获取当前语言配置 */
  getCurrentLanguageConfig: () => LanguageConfig;
}

/**
 * 可用语言配置
 */
const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  {
    code: 'zh-CN',
    name: '简体中文',
    icon: '🇨🇳',
    label: '简体'
  },
  {
    code: 'zh-TW',
    name: '繁體中文',
    icon: '🇭🇰',
    label: '繁體'
  },
  {
    code: 'en',
    name: 'English',
    icon: '🇺🇸',
    label: 'EN'
  }
];

/**
 * 语言状态管理Store
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentLanguage: 'zh-CN',
      availableLanguages: AVAILABLE_LANGUAGES,
      
      // 设置语言
      setLanguage: (language) => {
        set({ currentLanguage: language });
        
        // 更新HTML lang属性
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
        }
        
        console.log(`语言已切换为: ${AVAILABLE_LANGUAGES.find(l => l.code === language)?.name}`);
      },
      
      // 获取当前语言配置
      getCurrentLanguageConfig: () => {
        const { currentLanguage, availableLanguages } = get();
        return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
      }
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ currentLanguage: state.currentLanguage })
    }
  )
); 