/**
 * @file 用户头像下拉菜单组件
 * @description 用户登录后显示的头像下拉菜单，包含各种功能入口
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getFollowersCountApi } from '@/lib/api/followApi';
import { getUserPostCountApi } from '@/lib/api/postsApi';

/**
 * 菜单项接口
 */
interface MenuItem {
  /** 菜单项键 */
  key: string;
  /** 图标 */
  icon: React.ReactNode;
  /** 标题 */
  title: string;
  /** 链接地址 */
  href?: string;
  /** 点击事件 */
  onClick?: () => void;
  /** 是否显示分割线 */
  divider?: boolean;
  /** 是否显示红点 */
  showBadge?: boolean;
  /** 红点数量 */
  badgeCount?: number;
}

/**
 * 用户统计信息接口
 */
interface UserStats {
  followersCount: number;
  postsCount: number;
}

/**
 * 用户头像下拉菜单组件
 * 
 * @component
 * @example
 * <UserDropdownMenu />
 */
export function UserDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({ followersCount: 0, postsCount: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { 
    user, 
    unreadNotificationCount, 
    logout 
  } = useUserStore();

  /**
   * 获取用户统计数据
   */
  const fetchUserStats = async () => {
    if (!user?.userId || statsLoading) return;
    
    setStatsLoading(true);
    try {
      const [followersCount, postsCount] = await Promise.all([
        getFollowersCountApi(), // 获取当前用户的粉丝数
        getUserPostCountApi({}) // 获取当前用户的帖子数
      ]);
      
      setUserStats({
        followersCount: followersCount || 0,
        postsCount: postsCount || 0
      });
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
      // 出错时设置默认值
      setUserStats({ followersCount: 0, postsCount: 0 });
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * 处理退出登录
   */
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/');
  };

  /**
   * 处理菜单项点击
   */
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  /**
   * 处理下拉菜单打开
   */
  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
    // 打开菜单时获取统计数据
    if (!isOpen && user?.userId) {
      fetchUserStats();
    }
  };

  /**
   * 点击外部关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 如果用户未登录，不显示下拉菜单
  if (!user) {
    return null;
  }

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: 'post',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      title: '发帖',
      href: '/post/create'
    },
    {
      key: 'profile',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: '我的',
      href: '/profile'
    },
    {
      key: 'files',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
        </svg>
      ),
      title: '我的文件',
      href: '/files'
    },
    {
      key: 'notifications',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5m-5 10l-5-5 5-5" />
        </svg>
      ),
      title: '通知',
      href: '/notifications',
      showBadge: unreadNotificationCount > 0,
      badgeCount: unreadNotificationCount,
      divider: true
    },
    {
      key: 'settings',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: '设置',
      href: '/settings'
    },
    {
      key: 'logout',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      title: '退出登录',
      onClick: handleLogout,
      divider: true
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 头像触发器 */}
      <button
        onClick={handleToggleMenu}
        className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors"
      >
        <div className="h-8 w-8 rounded-full border-2 border-primary overflow-hidden bg-neutral-200 dark:bg-zinc-700">
          <img
            src={user.avatar}
            alt={user.nickname}
            className="h-full w-full object-cover"
          />
        </div>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-secondary rounded-xl shadow-xl border border-neutral-200 dark:border-zinc-700 py-3 z-50 backdrop-blur-sm">
          {/* 用户信息头部 */}
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-zinc-700">
            <div className="flex items-center space-x-3">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-neutral-200 dark:bg-zinc-700 flex-shrink-0 border-2 border-primary/20">
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {user.nickname}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  @{user.username || user.userId}
                </p>
                
                {/* 统计信息 */}
                <div className="flex space-x-4 mt-2">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-neutral-800 dark:text-white">
                      {statsLoading ? (
                        <div className="w-4 h-3 bg-neutral-200 dark:bg-zinc-600 rounded animate-pulse"></div>
                      ) : (
                        userStats.followersCount
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">粉丝</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-neutral-800 dark:text-white">
                      {statsLoading ? (
                        <div className="w-4 h-3 bg-neutral-200 dark:bg-zinc-600 rounded animate-pulse"></div>
                      ) : (
                        userStats.postsCount
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">帖子</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 菜单项 */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {item.divider && index > 0 && (
                  <div className="border-t border-neutral-100 dark:border-zinc-700 my-2" />
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.showBadge && item.badgeCount && item.badgeCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.showBadge && item.badgeCount && item.badgeCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                      </span>
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdownMenu; 