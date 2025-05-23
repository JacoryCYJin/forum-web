import type { Metadata } from "next";
import "./globals.css";
import 'element-plus/dist/index.css';
import '../styles/element-plus-theme.css';
import RootClientLayout from "@/components/common/Layout/RootClientLayout";

// Metadata不能在客户端组件中使用，所以需要单独创建
export const metadata: Metadata = {
  title: "论坛 - Next.js 示例",
  description: "使用Next.js、Element Plus和Tailwind CSS构建的论坛网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-neutral-200 dark:bg-dark-primary">
        <RootClientLayout>
        {children}
        </RootClientLayout>
      </body>
    </html>
  );
}
