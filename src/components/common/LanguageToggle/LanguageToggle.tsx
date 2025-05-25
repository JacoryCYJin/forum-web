/**
 * @file 语言切换组件
 * @description 提供多语言切换功能的下拉菜单组件
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore, type Language } from '@/store/languageStore';

/**
 * 语言切换组件
 * 
 * @component
 * @example
 * <LanguageToggle />
 */
export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentLanguage, 
    availableLanguages, 
    setLanguage, 
    getCurrentLanguageConfig 
  } = useLanguageStore();

  /**
   * 在客户端挂载后再渲染，避免水合错误
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * 点击外部关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * 处理语言切换
   */
  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  // 如果没有挂载完成，返回占位符以避免布局偏移
  if (!mounted) {
    return (
      <button
        className="rounded-full p-2 bg-neutral-100 dark:bg-dark-secondary transition-colors"
        aria-label="加载中"
      >
        <div className="w-5 h-5"></div>
      </button>
    );
  }

  const currentConfig = getCurrentLanguageConfig();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 语言切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 bg-neutral-100 dark:bg-dark-secondary hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
        aria-label={`当前语言: ${currentConfig.name}`}
      >
        <span className="text-3xl leading-none w-5 h-5 flex items-center justify-center">
          {currentConfig.icon}
        </span>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-dark-secondary rounded-lg shadow-lg border border-neutral-200 dark:border-zinc-700 py-2 z-50">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors text-left ${
                currentLanguage === language.code
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <span className="text-lg">{language.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{language.name}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {language.label}
                </div>
              </div>
              {currentLanguage === language.code && (
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageToggle; 