/**
 * @file 关注页面
 * @description 展示用户的关注列表和关注用户发布的帖子
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getFollowingListApi } from '@/lib/api/followApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import PostList from '@/components/features/post/PostList';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import type { Follow } from '@/types/followTypes';
import type { User } from '@/types/userTypes';

/**
 * 扩展的关注数据类型（包含用户信息）
 */
interface FollowWithUser extends Follow {
  user?: User;
}

/**
 * 关注页面组件
 * 
 * 显示用户关注的人发布的帖子和关注列表
 *
 * @component
 */
export default function LikePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [followingList, setFollowingList] = useState<FollowWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取关注列表
   */
  const fetchFollowingList = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFollowingListApi({
        userId: user.userId,
        pageNum: 1,
        pageSize: 100,
        fetchAll: true
      });
      
      const followList = response.list || [];
      
      // 获取关注用户的详细信息
      const followingWithUsers = await Promise.all(
        followList.map(async (follow) => {
          try {
            const userInfo = await getUserInfoApi({ userId: follow.followerId });
            return {
              ...follow,
              user: userInfo
            };
          } catch (err) {
            console.error(`获取用户 ${follow.followerId} 信息失败:`, err);
            return follow;
          }
        })
      );
      
      setFollowingList(followingWithUsers);
    } catch (err: any) {
      setError(err.message || '获取关注列表失败');
      console.error('获取关注列表错误:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件初始化时获取数据
   */
  useEffect(() => {
    fetchFollowingList();
  }, [user]);

  /**
   * 跳转到用户页面
   */
  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
            <LanguageText 
              texts={{
                'zh-CN': '请先登录',
                'zh-TW': '請先登入',
                'en': 'Please login first'
              }}
            />
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            <LanguageText 
              texts={{
                'zh-CN': '登录后查看您的关注动态',
                'zh-TW': '登入後查看您的關注動態',
                'en': 'Login to view your followed content'
              }}
            />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
          <LanguageText 
            texts={{
              'zh-CN': '我的关注',
              'zh-TW': '我的關注',
              'en': 'My Following'
            }}
          />
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          <LanguageText 
            texts={{
              'zh-CN': '查看您关注的用户和他们的最新动态',
              'zh-TW': '查看您關注的用戶和他們的最新動態',
              'en': 'View users you follow and their latest updates'
            }}
          />
        </p>
      </div>

      {/* 左右分栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：关注用户列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4 sticky top-6">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
              <LanguageText 
                texts={{
                  'zh-CN': '关注的用户',
                  'zh-TW': '關注的用戶',
                  'en': 'Following Users'
                }}
              />
            </h2>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-500 text-sm mb-2">{error}</p>
                <button 
                  onClick={fetchFollowingList}
                  className="text-primary hover:text-primary-hover text-sm"
                >
                  <LanguageText 
                    texts={{
                      'zh-CN': '重试',
                      'zh-TW': '重試',
                      'en': 'Retry'
                    }}
                  />
                </button>
              </div>
            ) : followingList.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  <LanguageText 
                    texts={{
                      'zh-CN': '还没有关注任何用户',
                      'zh-TW': '還沒有關注任何用戶',
                      'en': 'No following users yet'
                    }}
                  />
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {followingList.map((follow) => (
                  <div
                    key={follow.followId}
                    onClick={() => handleUserClick(follow.followerId)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
                  >
                    <img
                      src={follow.user?.avatarUrl || '/images/avatars/default-avatar.svg'}
                      alt={follow.user?.username || '用户'}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-zinc-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 dark:text-white truncate">
                        {follow.user?.username || `用户${follow.followerId}`}
                      </p>
                      {follow.user?.profile && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {follow.user.profile}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：关注用户的帖子 */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              <LanguageText 
                texts={{
                  'zh-CN': '关注用户的帖子',
                  'zh-TW': '關注用戶的貼文',
                  'en': 'Posts from Following'
                }}
              />
            </h2>
          </div>
          
          <PostList 
            showFollowedPosts={true}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
