/**
 * @file 粉丝页面
 * @description 展示用户的粉丝列表
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getFollowersListApi } from '@/lib/api/followApi';
import { getUserInfoApi } from '@/lib/api/userApi';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import type { Follow } from '@/types/followTypes';
import type { User } from '@/types/userTypes';

/**
 * 扩展的粉丝数据类型（包含用户信息）
 */
interface FollowerWithUser extends Follow {
  user?: User;
}

/**
 * 粉丝页面组件
 * 
 * 显示当前用户的粉丝列表
 *
 * @component
 */
export default function FollowersPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [followersList, setFollowersList] = useState<FollowerWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取粉丝列表
   */
  const fetchFollowersList = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFollowersListApi({
        followerId: user.userId,
        pageNum: 1,
        pageSize: 100,
        fetchAll: true
      });
      
      const followerList = response.list || [];
      
      // 获取粉丝用户的详细信息
      const followersWithUsers = await Promise.all(
        followerList.map(async (follower) => {
          try {
            const userInfo = await getUserInfoApi({ userId: follower.userId });
            return {
              ...follower,
              user: userInfo
            };
          } catch (err) {
            console.error(`获取用户 ${follower.userId} 信息失败:`, err);
            return follower;
          }
        })
      );
      
      setFollowersList(followersWithUsers);
    } catch (err: any) {
      setError(err.message || '获取粉丝列表失败');
      console.error('获取粉丝列表错误:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件初始化时获取数据
   */
  useEffect(() => {
    fetchFollowersList();
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
                'zh-CN': '登录后查看您的粉丝',
                'zh-TW': '登入後查看您的粉絲',
                'en': 'Login to view your followers'
              }}
            />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
          <LanguageText 
            texts={{
              'zh-CN': '我的粉丝',
              'zh-TW': '我的粉絲',
              'en': 'My Followers'
            }}
          />
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          <LanguageText 
            texts={{
              'zh-CN': '关注您的用户列表',
              'zh-TW': '關注您的用戶列表',
              'en': 'Users who follow you'
            }}
          />
        </p>
      </div>

      {/* 粉丝列表 */}
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
        {loading ? (
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse flex items-center space-x-4">
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchFollowersList}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
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
        ) : followersList.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
              <LanguageText 
                texts={{
                  'zh-CN': '还没有粉丝',
                  'zh-TW': '還沒有粉絲',
                  'en': 'No followers yet'
                }}
              />
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              <LanguageText 
                texts={{
                  'zh-CN': '发布更多精彩内容来吸引粉丝吧',
                  'zh-TW': '發布更多精彩內容來吸引粉絲吧',
                  'en': 'Create great content to attract followers'
                }}
              />
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {followersList.map((follower) => (
                <div
                  key={follower.followId}
                  onClick={() => handleUserClick(follower.userId)}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors border border-neutral-100 dark:border-zinc-700"
                >
                  <img
                    src={follower.user?.avatarUrl || '/images/avatars/default-avatar.svg'}
                    alt={follower.user?.username || '用户'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 dark:border-zinc-600"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-neutral-800 dark:text-white truncate">
                      {follower.user?.username || `用户${follower.userId}`}
                    </h3>
                    {follower.user?.profile && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate mt-1">
                        {follower.user.profile}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      <LanguageText 
                        texts={{
                          'zh-CN': `关注于 ${new Date(follower.ctime).toLocaleDateString('zh-CN')}`,
                          'zh-TW': `關注於 ${new Date(follower.ctime).toLocaleDateString('zh-TW')}`,
                          'en': `Followed on ${new Date(follower.ctime).toLocaleDateString('en-US')}`
                        }}
                      />
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 