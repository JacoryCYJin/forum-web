/**
 * @file 完整布局组件
 * @description 包含Navbar、Sidebar和Footer的完整布局
 */

"use client";

import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

/**
 * 完整布局组件Props
 */
interface FullLayoutProps {
  /** 子组件 */
  children: React.ReactNode;
}

/**
 * 完整布局组件
 *
 * 提供导航栏、侧边栏和页脚，适用于大部分页面的完整布局
 *
 * @component
 * @param props - 组件属性
 */
export default function FullLayout({ children }: FullLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * 处理侧边栏切换
   */
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Sidebar onToggle={handleSidebarToggle} />
      <div className="flex flex-1 pt-14">
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-10" : "w-60"
          }`}
        ></div>
        <main className="flex-1 dark:bg-neutral-dark-100 min-h-screen">
          <div className="container mx-auto px-4 py-6 pb-20">{children}</div>
          {/* Footer放在main内部，确保需要滚动才能看到 */}
          <div
            className={`transition-all duration-300 ${
              sidebarCollapsed ? "ml-0" : "ml-0"
            }`}
          >
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
