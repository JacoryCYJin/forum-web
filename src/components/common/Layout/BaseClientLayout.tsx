/**
 * @file 基础客户端布局组件
 * @description 包含ThemeProvider、Navbar、Sidebar和Footer的完整布局
 */

'use client';

import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { ThemeProvider } from 'next-themes';

/**
 * 基础客户端布局组件Props
 */
interface BaseClientLayoutProps {
  /** 子组件 */
  children: React.ReactNode;
}

/**
 * 基础客户端布局组件
 * 
 * 提供主题、导航栏、侧边栏和页脚，适用于大部分页面的完整布局
 * 
 * @component
 * @param props - 组件属性
 */
export default function BaseClientLayout({ children }: BaseClientLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * 处理侧边栏切换
   */
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Sidebar onToggle={handleSidebarToggle} />
        <div className="flex flex-1 pt-14">
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-10' : 'w-60'}`}></div>
          <main className="flex-1">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-10' : 'ml-60'
        }`}>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
} 