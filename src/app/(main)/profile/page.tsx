/**
 * @file 用户个人主页
 * @description 显示用户的动态、点赞、收藏和统计信息
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { UserActivity, UserActivityType } from '@/types/user.types';

/**
 * 标签页类型
 */
type TabType = 'activities' | 'likes' | 'favorites';

/**
 * 用户个人主页组件
 * 
 * @component
 */
export default function ProfilePage() {
  const { user, userStats } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('activities');
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 模拟获取用户动态数据
   */
  const fetchUserActivities = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          type: UserActivityType.POST,
          description: '发布了新帖子《Next.js 15 性能优化实践》',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
          relatedId: '1',
          relatedType: 'post'
        },
        {
          id: '2',
          type: UserActivityType.COMMENT,
          description: '评论了帖子《使用Element Plus构建现代UI》',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
          relatedId: '2',
          relatedType: 'post'
        },
        {
          id: '3',
          type: UserActivityType.LIKE,
          description: '点赞了帖子《React服务器组件最佳实践》',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
          relatedId: '3',
          relatedType: 'post'
        },
        {
          id: '4',
          type: UserActivityType.FAVORITE,
          description: '收藏了帖子《前端性能优化指南》',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
          relatedId: '4',
          relatedType: 'post'
        },
        {
          id: '5',
          type: UserActivityType.FOLLOW,
          description: '关注了用户 @技术专家',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
          relatedId: '5',
          relatedType: 'user'
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('获取用户动态失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 初始化时获取数据
   */
  useEffect(() => {
    fetchUserActivities();
  }, []);

  /**
   * 获取活动类型对应的图标
   */
  const getActivityIcon = (type: UserActivityType) => {
    switch (type) {
      case UserActivityType.POST:
        return (
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case UserActivityType.COMMENT:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        );
      case UserActivityType.LIKE:
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case UserActivityType.FAVORITE:
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        );
      case UserActivityType.FOLLOW:
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  /**
   * 格式化时间显示
   */
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  /**
   * 标签页配置
   */
  const tabs = [
    { key: 'activities' as TabType, label: '我的动态', count: activities.length },
    { key: 'likes' as TabType, label: '我的点赞', count: 0 },
    { key: 'favorites' as TabType, label: '我的收藏', count: 0 }
  ];

  // 如果用户未登录，显示提示
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
            请先登录
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            您需要登录才能查看个人主页
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* 头像 */}
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
            
            {/* 用户信息 */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                {user.nickname}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                @{user.username}
              </p>
              
              {/* 统计信息 */}
              {userStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {userStats.followingCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      关注
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {userStats.followersCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      粉丝
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {userStats.postsCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      发帖
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {userStats.viewsCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      被浏览
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow mb-6">
          <div className="border-b border-neutral-200 dark:border-zinc-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.key
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'activities' && (
              <div>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-200 dark:bg-zinc-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-neutral-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-neutral-800 dark:text-white">
                            {activity.description}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {formatTimeAgo(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                      暂无动态
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      开始发帖、评论或点赞来创建您的第一条动态吧
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                  暂无点赞记录
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  您还没有点赞过任何内容
                </p>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                  暂无收藏内容
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  您还没有收藏过任何内容
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 