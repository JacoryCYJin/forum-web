/**
 * @file 用户状态初始化组件
 * @description 在应用启动时恢复用户登录状态
 */

'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

/**
 * 用户状态初始化组件
 * 
 * 在应用启动时从localStorage恢复用户登录状态
 * 
 * @component
 */
export function UserStateInitializer() {
  const { restoreLoginState } = useUserStore();

  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      restoreLoginState();
    }
  }, [restoreLoginState]);

  // 这个组件不渲染任何内容
  return null;
}

export default UserStateInitializer; 