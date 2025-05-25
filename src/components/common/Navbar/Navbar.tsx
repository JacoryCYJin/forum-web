'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle/LanguageToggle';
import { Search, User } from '@icon-park/react';
import LoginDialog from './LoginDialog';
import UserDropdownMenu from './UserDropdownMenu';
import { useUserStore } from '@/store/userStore';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);
  const { user } = useUserStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-dark-primary border-b border-neutral-200 dark:border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Logo - 左侧固定宽度 */}
        <div className="flex-shrink-0 w-32">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-8 w-8 text-primary flex-shrink-0">
              <g>
                <circle fill="currentColor" cx="10" cy="10" r="10" />
                <path fill="white" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z" />
              </g>
            </svg>
            <span className="ml-2 text-xl font-bold text-neutral-800 dark:text-white whitespace-nowrap">云社OpenShare</span>
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
              placeholder="搜索论坛"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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