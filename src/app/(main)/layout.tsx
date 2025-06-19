'use client';

import FullLayout from "@/components/common/Layout/FullLayout";
import TokenStatusDebug from "@/components/common/TokenStatusDebug";
import LoginDialog from "@/components/common/Navbar/LoginDialog";
import { useUserStore } from "@/store/userStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showLoginDialog, hideLogin } = useUserStore();
  
  return (
    <FullLayout>
      {children}
      {/* 调试组件 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === 'development' && <TokenStatusDebug />}
      
      {/* 全局登录对话框 */}
      <LoginDialog 
        visible={showLoginDialog} 
        onClose={hideLogin} 
      />
    </FullLayout>
  );
}