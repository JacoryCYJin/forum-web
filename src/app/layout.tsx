import type { Metadata } from "next";
import "./globals.css";
import 'element-plus/dist/index.css';
import '../styles/element-plus-theme.css';
import RootClientLayout from '@/components/common/Layout/RootClientLayout';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Metadata不能在客户端组件中使用，所以需要单独创建
export const metadata: Metadata = {
  title: "论坛 - Next.js 示例",
  description: "使用Next.js、Element Plus和Tailwind CSS构建的论坛网站",
  keywords: "论坛, Next.js, Element Plus, Tailwind CSS",
};

/**
 * 根布局组件
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <RootClientLayout>
          {children}
        </RootClientLayout>
        
        {/* 开发环境下的全局方法 */}
        {process.env.NODE_ENV === 'development' && (
          <script dangerouslySetInnerHTML={{
            __html: `
              // 开发环境快捷登录方法
              if (typeof window !== 'undefined') {
                window.mockLogin = function() {
                  // 等待store初始化
                  setTimeout(() => {
                    const event = new CustomEvent('mockLogin');
                    window.dispatchEvent(event);
                  }, 100);
                };
                
                console.log('🚀 开发模式已启用！');
                console.log('📝 在控制台输入 mockLogin() 即可快速登录');
              }
            `
          }} />
        )}
      </body>
    </html>
  );
}
