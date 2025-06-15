'use client';

import FullLayout from "@/components/common/Layout/FullLayout";
import TokenStatusDebug from "@/components/common/TokenStatusDebug";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FullLayout>
      {children}
      {/* 调试组件 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && <TokenStatusDebug />}
    </FullLayout>
  );
}