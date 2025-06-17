/**
 * @file 用户工具函数
 * @description 提供用户信息处理相关的工具函数
 */

import type { UserInfo } from '@/types/userTypes';

/**
 * 更新用户的updatedAt时间
 * 
 * @param {UserInfo} user - 用户信息对象
 * @param {Date} [updateTime] - 更新时间，默认为当前时间
 * @returns {UserInfo} 更新后的用户信息
 * @example
 * // 使用当前时间更新
 * const updatedUser = updateUserTime(user);
 * 
 * // 使用指定时间更新
 * const updatedUser = updateUserTime(user, new Date('2024-03-15'));
 */
export function updateUserTime(user: UserInfo, updateTime?: Date): UserInfo {
  return {
    ...user,
    updatedAt: updateTime || new Date()
  };
}

/**
 * 同步用户信息到localStorage
 * 
 * @param {UserInfo} user - 用户信息对象
 * @param {string[]} [fields] - 需要同步的字段，不传则同步所有字段
 * @example
 * // 同步所有字段
 * syncUserToLocalStorage(user);
 * 
 * // 只同步特定字段
 * syncUserToLocalStorage(user, ['email', 'phone']);
 */
export function syncUserToLocalStorage(user: UserInfo, fields?: string[]): void {
  if (typeof window === 'undefined') {
    return; // 服务端渲染时跳过
  }

  try {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    
    if (fields) {
      // 只更新指定字段
      fields.forEach(field => {
        if (field === 'updatedAt' && user.updatedAt) {
          userInfo.mtime = user.updatedAt.toISOString();
        } else if (field in user) {
          // 映射前端字段到后端字段
          const backendField = mapFrontendToBackendField(field);
          userInfo[backendField] = (user as any)[field];
        }
      });
    } else {
      // 更新所有相关字段
      userInfo.username = user.username;
      userInfo.email = user.email;
      userInfo.phone = user.phone;
      userInfo.avatarUrl = user.avatar;
      userInfo.profile = user.bio;
      if (user.updatedAt) {
        userInfo.mtime = user.updatedAt.toISOString();
      }
    }

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error('同步用户信息到localStorage失败:', error);
  }
}

/**
 * 映射前端字段名到后端字段名
 * 
 * @param {string} frontendField - 前端字段名
 * @returns {string} 后端字段名
 */
function mapFrontendToBackendField(frontendField: string): string {
  const fieldMap: Record<string, string> = {
    avatar: 'avatarUrl',
    bio: 'profile',
    // 其他字段保持不变
  };
  
  return fieldMap[frontendField] || frontendField;
}

/**
 * 更新用户信息并同步到localStorage
 * 
 * @param {UserInfo} user - 用户信息对象
 * @param {Partial<UserInfo>} updates - 要更新的字段
 * @param {boolean} [updateTime=true] - 是否更新updatedAt时间
 * @returns {UserInfo} 更新后的用户信息
 * @example
 * // 更新邮箱并自动更新时间
 * const updatedUser = updateUserAndSync(user, { email: 'new@example.com' });
 * 
 * // 更新用户名但不更新时间
 * const updatedUser = updateUserAndSync(user, { username: 'newname' }, false);
 */
export function updateUserAndSync(
  user: UserInfo, 
  updates: Partial<UserInfo>, 
  updateTime: boolean = true
): UserInfo {
  const updatedUser: UserInfo = {
    ...user,
    ...updates,
    ...(updateTime && { updatedAt: new Date() })
  };

  // 同步更新的字段到localStorage
  const updatedFields = Object.keys(updates);
  if (updateTime) {
    updatedFields.push('updatedAt');
  }
  
  syncUserToLocalStorage(updatedUser, updatedFields);
  
  return updatedUser;
} 