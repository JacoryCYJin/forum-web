/**
 * @file 头像链接组件
 * @module components/common/AvatarLink
 * @description 可点击的头像组件，点击后跳转到用户主页
 */

'use client';

import Link from 'next/link';

/**
 * 头像链接组件属性接口
 */
interface AvatarLinkProps {
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
  sizeClass?: string;
  
  /**
   * 额外的CSS类名
   */
  className?: string;
  
  /**
   * 是否显示边框
   * @default true
   */
  showBorder?: boolean;
}

/**
 * 头像链接组件
 * 
 * 显示可点击的用户头像，点击后跳转到用户主页
 *
 * @component
 * @example
 * <AvatarLink 
 *   userId="user123"
 *   username="张三"
 *   avatarUrl="/images/avatars/user.jpg"
 * />
 */
export default function AvatarLink({
  userId,
  avatarUrl,
  username,
  sizeClass = "w-10 h-10",
  className = "",
  showBorder = true
}: AvatarLinkProps) {
  const borderClass = showBorder ? "border-2 border-neutral-200 dark:border-zinc-600" : "";
  
  return (
    <Link href={`/user/${userId}`} className="inline-block">
      <img
        src={avatarUrl || '/images/avatars/default-avatar.svg'}
        alt={username}
        className={`${sizeClass} rounded-full object-cover ${borderClass} cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      />
    </Link>
  );
} 