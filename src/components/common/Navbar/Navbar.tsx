'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/common/ThemeToggle/ThemeToggle';
import { Search } from '@icon-park/react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-primary border-b border-neutral-200 dark:border-zinc-800">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="h-8 w-8 text-primary">
              <g>
                <circle fill="currentColor" cx="10" cy="10" r="10" />
                <path fill="white" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z" />
              </g>
            </svg>
            <span className="ml-2 text-xl font-bold text-neutral-500 dark:text-white hidden md:block">论坛</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-6 relative max-w-xl">
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

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button className="hidden sm:block px-4 py-1 text-sm font-medium text-secondary border border-secondary rounded-full hover:bg-secondary hover:text-white transition-colors">
            登录
          </button>
          <button className="px-4 py-1 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors">
            注册
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 