/**
 * @file 简单布局组件
 * @description 只包含Footer的简单布局，用于介绍页面
 */

'use client';

import Footer from '../Footer/Footer';

/**
 * 简单布局组件Props
 */
interface SimpleLayoutProps {
  /** 子组件 */
  children: React.ReactNode;
}

/**
 * 简单布局组件
 * 
 * 只提供页脚，适用于介绍页面等简洁页面
 * 
 * @component
 * @param props - 组件属性
 */
export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 