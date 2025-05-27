import type { Metadata } from "next";
import "./globals.css";
import 'element-plus/dist/index.css';
import '../styles/element-plus-theme.css';
import BaseClientLayout from '@/components/common/Layout/BaseClientLayout';
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
        <BaseClientLayout>
          {children}
        </BaseClientLayout>
      </body>
    </html>
  );
}
