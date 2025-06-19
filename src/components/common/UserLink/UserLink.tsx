/**
 * @file 用户链接组件
 * @module components/common/UserLink
 * @description 包含头像和用户名的可点击组件，点击后跳转到用户主页
 */

'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/userStore';

/**
 * 用户链接组件属性接口
 */
interface UserLinkProps {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 头像URL
   */
  avatarUrl?: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 头像尺寸类名
   * @default "w-10 h-10"
   */
  avatarSizeClass?: string;
  
  /**
   * 用户名文字样式类名
   * @default "font-medium text-neutral-700 dark:text-neutral-300"
   */
  usernameClass?: string;
  
  /**
   * 是否显示头像
   * @default true
   */
  showAvatar?: boolean;
  
  /**
   * 是否显示用户名
   * @default true
   */
  showUsername?: boolean;
  
  /**
   * 额外的CSS类名
   */
  className?: string;
  
  /**
   * 是否显示边框
   * @default true
   */
  showBorder?: boolean;
  
  /**
   * 组件间距
   * @default "space-x-3"
   */
  spacing?: string;
}

/**
 * 用户链接组件
 * 
 * 显示可点击的用户头像和用户名，点击后跳转到用户主页
 *
 * @component
 * @example
 * <UserLink 
 *   userId="user123"
 *   username="张三"
 *   avatarUrl="/images/avatars/user.jpg"
 * />
 * 
 * // 只显示用户名
 * <UserLink 
 *   userId="user123"
 *   username="张三"
 *   showAvatar={false}
 * />
 */
export default function UserLink({
  userId,
  avatarUrl,
  username,
  avatarSizeClass = "w-10 h-10",
  usernameClass = "font-medium text-neutral-700 dark:text-neutral-300 text-sm",
  showAvatar = true,
  showUsername = true,
  className = "",
  showBorder = true,
  spacing = "space-x-3"
}: UserLinkProps) {
  const { user, showLogin } = useUserStore();
  const isLoggedIn = !!user;
  const borderClass = showBorder ? "border-2 border-neutral-200 dark:border-zinc-600" : "";
  
  /**
   * 处理用户链接点击
   */
  const handleClick = (e: React.MouseEvent) => {
    // 如果用户未登录，阻止跳转并显示登录对话框
    if (!isLoggedIn) {
      e.preventDefault();
      showLogin();
      return;
    }
  };
  
  return (
    <Link 
      href={`/user/${userId}`} 
      onClick={handleClick}
      className={`flex items-center ${spacing} hover:opacity-80 transition-opacity ${className}`}
    >
      {showAvatar && (
        <img
          src={avatarUrl || '/images/avatars/default-avatar.svg'}
          alt={username}
          className={`${avatarSizeClass} rounded-full object-cover ${borderClass}`}
        />
      )}
      {showUsername && (
        <span className={`${usernameClass} hover:text-primary transition-colors`}>
          {username}
        </span>
      )}
    </Link>
  );
} 