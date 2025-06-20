/**
 * @file 主题包装组件
 * @description 只提供ThemeProvider功能，不包含具体布局
 */

'use client';

import { ThemeProvider } from 'next-themes';
import LanguageProvider from './LanguageProvider';
import UserStateInitializer from '@/components/common/UserStateInitializer';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';

/**
 * 主题包装组件Props
 */
interface ThemeWrapperProps {
  /** 子组件 */
  children: React.ReactNode;
}

/**
 * 主题包装组件
 * 
 * 只提供主题功能，用于根布局
 * 
 * @component
 * @param props - 组件属性
 */
export default function BaseClientLayout({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <ToastProvider>
        <LanguageProvider />
        <UserStateInitializer />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
} 