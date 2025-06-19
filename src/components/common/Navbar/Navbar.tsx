'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle/LanguageToggle';
import { Search, User } from '@icon-park/react';
import LoginDialog from './LoginDialog';
import UserDropdownMenu from './UserDropdownMenu';
import { useUserStore } from '@/store/userStore';
import LanguageText from '@/components/common/LanguageText/LanguageText';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);
  const { user } = useUserStore();

  /**
   * 获取搜索栏的多语言文本
   */
  const getSearchText = () => ({
    'zh-CN': '搜索论坛',
    'zh-TW': '搜尋論壇',
    'en': 'Search Forum'
  });

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-dark-primary border-b border-neutral-200 dark:border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Logo - 左侧固定宽度 */}
        <div className="flex-shrink-0 w-32">
          <Link href="/" className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="OpenShare Logo" 
                className="h-full w-full object-contain brightness-0 invert scale-150" 
                />
            </div>
            <span className="ml-2 text-xl font-bold text-neutral-800 dark:text-white whitespace-nowrap">云社 · OpenShare</span>
          </Link>
        </div>

        {/* Search Bar - 中间自适应宽度 */}
        <div className="flex-1 max-w-xl px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search theme="outline" size="20" fill="currentColor" className="text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-full py-2 pl-10 pr-3 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs text-neutral-400">
              <LanguageText texts={getSearchText()} />
            </div>
          </div>
        </div>

        {/* Avatar, Language Toggle and Theme Toggle - 右侧固定宽度 */}
        <div className="flex-shrink-0 w-32 flex items-center justify-end space-x-3">
          {/* 语言切换按钮 */}
          <LanguageToggle />
          
          {/* 主题切换按钮 */}
          <ThemeToggle />
          
          {/* 用户登录状态显示 */}
          {user ? (
            /* 已登录：显示用户下拉菜单 */
            <UserDropdownMenu />
          ) : (
            /* 未登录：显示登录按钮 */
            <div 
              className="cursor-pointer relative"
              onClick={() => setLoginDialogVisible(true)}
            >
              <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border-2 border-primary hover:border-secondary transition-colors">
                <User theme="outline" size="22" className="text-neutral-500 dark:text-neutral-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 登录弹窗 */}
      <LoginDialog 
        visible={loginDialogVisible} 
        onClose={() => setLoginDialogVisible(false)} 
      />
    </nav>
  );
};

export default Navbar;