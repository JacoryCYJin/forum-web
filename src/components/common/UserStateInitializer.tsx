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
  const initialize = useUserStore(state => state.initialize);

  useEffect(() => {
    // 在客户端初始化时恢复登录状态
    initialize();
  }, [initialize]);

  // 这个组件不渲染任何内容
  return null;
}

export default UserStateInitializer; 