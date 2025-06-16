/**
 * @file 用户状态管理
 * @description 处理用户登录、登出、个人信息和通知等状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo as User, UserStats, Notification } from '@/types/userType';
import { processAvatarPath } from '@/lib/utils/avatarUtils';
import { updateAvatarAndUsernameAndProfileApi } from '@/lib/api/userApi';

/**
 * 用户状态接口
 */
interface UserState {
  // 状态
  /** 当前用户信息 */
  user: User | null;
  /** 用户统计信息 */
  userStats: UserStats | null;
  /** 登录状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 通知列表 */
  notifications: Notification[];
  /** 未读通知数量 */
  unreadNotificationCount: number;
  /** 是否已初始化 */
  isInitialized: boolean;
  
  // 操作
  /** 设置用户信息 */
  setUser: (user: User | null) => void;
  /** 设置用户统计信息 */
  setUserStats: (stats: UserStats) => void;
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void;
  /** 设置错误信息 */
  setError: (error: string | null) => void;
  /** 用户登出 */
  logout: () => void;
  /** 更新用户资料 */
  updateProfile: (data: Partial<User>) => Promise<void>;
  /** 获取通知列表 */
  fetchNotifications: () => Promise<void>;
  /** 标记通知为已读 */
  markNotificationAsRead: (notificationId: string) => void;
  /** 标记所有通知为已读 */
  markAllNotificationsAsRead: () => void;
  /** 清除所有状态 */
  clearState: () => void;
  /** 从localStorage恢复登录状态 */
  restoreLoginState: () => void;
  /** 初始化状态 */
  initialize: () => void;
}

/**
 * 模拟API调用 - 获取通知列表
 * TODO: 等后端提供通知API后替换为真实API
 */
const fetchNotificationsApi = async (): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      type: 'system' as any,
      title: '系统通知',
      content: '欢迎使用我们的平台！',
      isRead: false,
      createdAt: new Date(),
      relatedUrl: '/notifications'
    },
    {
      id: '2',
      type: 'comment' as any,
      title: '新评论',
      content: '有人评论了您的帖子',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000),
      relatedUrl: '/post/1'
    },
    {
      id: '3',
      type: 'like' as any,
      title: '新点赞',
      content: '有人点赞了您的帖子',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000),
      relatedUrl: '/post/2'
    }
  ];
};

/**
 * 用户状态管理Store
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      userStats: null,
      isLoading: false,
      error: null,
      notifications: [],
      unreadNotificationCount: 0,
      isInitialized: false,
      
      // 基础设置方法
      setUser: (user) => set({ user }),
      setUserStats: (userStats) => set({ userStats }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // 登出方法
      logout: () => {
        // 清除状态
        set({ 
          user: null, 
          userStats: null, 
          notifications: [], 
          unreadNotificationCount: 0,
          error: null 
        });
        
        // 清除localStorage中的登录信息
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenType');
          localStorage.removeItem('userInfo');
        }
        
        console.log('已退出登录');
      },
      
      // 更新用户资料
      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          // 调用真实的后端API更新用户资料
          const updatedUserData = await updateAvatarAndUsernameAndProfileApi({
            userId: user.userId, // 使用userId字段
            username: data.username,
            avatarUrl: data.avatar,
            profile: data.bio // 前端的bio字段映射到后端的profile字段
          });
          
          // 将后端返回的数据转换为UserInfo格式
          const updatedUser: User = {
            ...user,
            username: updatedUserData.username || user.username,
            nickname: updatedUserData.username || user.nickname,
            avatar: processAvatarPath(updatedUserData.avatarUrl) || user.avatar,
            bio: updatedUserData.profile || user.bio,
            email: updatedUserData.email || user.email,
            phone: updatedUserData.phone || user.phone
          };
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
          
          // 同时更新localStorage中的用户信息
          if (typeof window !== 'undefined') {
            const userInfoStr = localStorage.getItem('userInfo');
            if (userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              userInfo.username = updatedUserData.username || userInfo.username;
              userInfo.avatarUrl = updatedUserData.avatarUrl || userInfo.avatarUrl;
              userInfo.profile = updatedUserData.profile || userInfo.profile;
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
          }
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : '更新资料失败', 
            isLoading: false 
          });
        }
      },
      
      // 获取通知列表
      fetchNotifications: async () => {
        try {
          const notifications = await fetchNotificationsApi();
          const unreadCount = notifications.filter(n => !n.isRead).length;
          set({ 
            notifications, 
            unreadNotificationCount: unreadCount 
          });
        } catch (err) {
          set({ 
            error: err instanceof Error ? err.message : '获取通知失败' 
          });
        }
      },
      
      // 标记通知为已读
      markNotificationAsRead: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        set({ 
          notifications: updatedNotifications, 
          unreadNotificationCount: unreadCount 
        });
      },
      
      // 标记所有通知为已读
      markAllNotificationsAsRead: () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        set({ 
          notifications: updatedNotifications, 
          unreadNotificationCount: 0 
        });
      },
      
      // 清除所有状态
      clearState: () => {
        set({
          user: null,
          userStats: null,
          isLoading: false,
          error: null,
          notifications: [],
          unreadNotificationCount: 0,
          isInitialized: false
        });
      },
      
      // 从localStorage恢复登录状态
      restoreLoginState: () => {
        try {
          if (typeof window === 'undefined') return;
          
          const accessToken = localStorage.getItem('accessToken');
          const userInfoStr = localStorage.getItem('userInfo');
          
          if (accessToken && userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            
            // 转换为User格式
            const user: User = {
              userId: userInfo.userId,
              username: userInfo.username,
              nickname: userInfo.username,
              email: userInfo.email || '',
              phone: userInfo.phone || '',
              avatar: processAvatarPath(userInfo.avatarUrl),
              bio: userInfo.profile || '',
              createdAt: userInfo.ctime ? new Date(userInfo.ctime) : new Date(),
              lastLoginAt: new Date()
            };
            
            // 设置用户信息
            set({ user });
            
            // 设置默认统计信息
            set({ 
              userStats: {
                followingCount: 0,
                followersCount: 0,
                postsCount: 0,
                viewsCount: 0
              }
            });
            
            console.log('✅ 已从localStorage恢复登录状态:', user.nickname, '个人简介:', user.bio);
          }
        } catch (error) {
          console.error('恢复登录状态失败:', error);
          // 清除可能损坏的数据
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('userInfo');
          }
        }
      },

      // 初始化状态
      initialize: () => {
        const { isInitialized } = get();
        if (!isInitialized) {
          get().restoreLoginState();
          set({ isInitialized: true });
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        userStats: state.userStats,
        notifications: state.notifications,
        unreadNotificationCount: state.unreadNotificationCount
      }),
    }
  )
); 