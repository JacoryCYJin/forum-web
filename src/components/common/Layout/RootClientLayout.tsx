'use client';

import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { ThemeProvider } from 'next-themes';

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 侧边栏折叠状态变更的回调函数
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar 
            onToggle={handleSidebarToggle} 
          />
          <main 
            className={`flex-1 transition-all duration-300 ${
              sidebarCollapsed ? 'ml-10' : 'ml-60'
            }`}
          >
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