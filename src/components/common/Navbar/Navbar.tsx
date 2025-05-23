'use client';

import { useState } from 'react';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import { Search, User } from '@icon-park/react';
import LoginDialog from './LoginDialog';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);

  return (
    <nav 
      className="fixed top-0 right-0 h-14 bg-white dark:bg-dark-primary border-b border-neutral-200 dark:border-zinc-800 transition-all duration-300 z-50 left-60"
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Search Bar - 占据大部分空间 */}
        <div className="flex-1 max-w-xl">
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

        {/* Avatar and Theme Toggle - 右侧固定宽度 */}
        <div className="flex-shrink-0 w-32 flex items-center justify-end space-x-3">
          <ThemeToggle />
          <div 
            className="cursor-pointer relative"
            onClick={() => setLoginDialogVisible(true)}
          >
            <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden border-2 border-primary hover:border-secondary transition-colors">
              <User theme="outline" size="22" className="text-neutral-500 dark:text-neutral-300" />
            </div>
          </div>
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