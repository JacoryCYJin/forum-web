/**
 * @file 用户主页
 * @description 展示用户信息、发布的帖子以及关注/取消关注功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getUserInfoApi } from '@/lib/api/userApi';
import { getUserPostCountApi } from '@/lib/api/postsApi';
import { getFollowingCountApi, getFollowersCountApi, followUserApi, unfollowUserApi, checkFollowStatusApi } from '@/lib/api/followApi';
import PostList from '@/components/features/post/PostList';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import ConfirmDialog from '@/components/common/ConfirmDialog/ConfirmDialog';
import { ElMessage } from 'element-plus';
import type { User } from '@/types/userTypes';

/**
 * 用户统计信息接口
 */
interface UserStats {
  followingCount: number;
  followersCount: number;
  postsCount: number;
}

/**
 * 标签页类型
 */
type TabType = 'posts' | 'about';

/**
 * 用户主页组件
 * 
 * 显示用户详细信息、发布的帖子和关注功能
 *
 * @component
 */
export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { user: currentUser } = useUserStore();
  
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    followingCount: 0,
    followersCount: 0,
    postsCount: 0
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  /**
   * 获取用户信息
   */
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfoApi({ userId });
      setUserInfo(response);
    } catch (err: any) {
      setError(err.message || '获取用户信息失败');
      console.error('获取用户信息错误:', err);
    }
  };

  /**
   * 获取用户统计信息
   */
  const fetchUserStats = async () => {
    try {
      const [followingCount, followersCount] = await Promise.all([
        getFollowingCountApi(userId),
        getFollowersCountApi(userId)
      ]);
      
      // 获取用户帖子数量
      try {
        const postCount = await getUserPostCountApi({
          userId: userId
        });
        
        setUserStats({
          followingCount,
          followersCount,
          postsCount: postCount || 0
        });
      } catch {
        setUserStats({
          followingCount,
          followersCount,
          postsCount: 0
        });
      }
    } catch (err: any) {
      console.error('获取用户统计信息错误:', err);
    }
  };

  /**
   * 检查是否已关注该用户
   */
  const checkFollowStatus = async () => {
    if (!currentUser || currentUser.userId === userId) return;
    
    try {
      const followStatus = await checkFollowStatusApi({ followerId: userId });
      setIsFollowing(followStatus);
    } catch (err) {
      console.error('检查关注状态错误:', err);
      setIsFollowing(false);
    }
  };

  /**
   * 处理关注/取消关注
   */
  const handleFollowToggle = async () => {
    if (!currentUser) {
      ElMessage.warning('请先登录');
      return;
    }

    if (currentUser.userId === userId) {
      ElMessage.warning('不能关注自己');
      return;
    }

    // 如果已关注，显示确认弹窗
    if (isFollowing) {
      setShowUnfollowDialog(true);
      return;
    }

    // 直接关注
    setFollowLoading(true);
    
    try {
      await followUserApi({ followerId: userId });
      setIsFollowing(true);
      setUserStats(prev => ({
        ...prev,
        followersCount: prev.followersCount + 1
      }));
      ElMessage.success('关注成功');
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败');
      console.error('关注操作错误:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  /**
   * 确认取消关注
   */
  const handleConfirmUnfollow = async () => {
    setFollowLoading(true);
    
    try {
      await unfollowUserApi({ followerId: userId });
      setIsFollowing(false);
      setUserStats(prev => ({
        ...prev,
        followersCount: Math.max(0, prev.followersCount - 1)
      }));
      setShowUnfollowDialog(false);
      ElMessage.success('已取消关注');
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败');
      console.error('取消关注错误:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  /**
   * 初始化数据
   */
  useEffect(() => {
    if (userId) {
      const initData = async () => {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          fetchUserInfo(),
          fetchUserStats(),
          checkFollowStatus()
        ]);
        
        setLoading(false);
      };
      
      initData();
    }
  }, [userId, currentUser]);

  // 加载状态
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          {/* 用户信息骨架屏 */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-neutral-200 dark:bg-zinc-700 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-neutral-200 dark:bg-zinc-700 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-1/2"></div>
                <div className="flex space-x-4">
                  <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-16"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-16"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
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
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
            <LanguageText 
              texts={{
                'zh-CN': '用户不存在',
                'zh-TW': '用戶不存在',
                'en': 'User not found'
              }}
            />
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            <LanguageText 
              texts={{
                'zh-CN': '该用户可能已被删除或不存在',
                'zh-TW': '該用戶可能已被刪除或不存在',
                'en': 'This user may have been deleted or does not exist'
              }}
            />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 用户信息卡片 */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-neutral-200 dark:border-zinc-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* 用户头像 */}
            <img
              src={userInfo.avatarUrl || '/images/avatars/default-avatar.svg'}
              alt={userInfo.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-neutral-200 dark:border-zinc-600"
            />
            
            {/* 用户信息 */}
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                {userInfo.username}
              </h1>
              
              {/* 用户简介 */}
              {userInfo.profile && (
                <p className="text-neutral-600 dark:text-neutral-400 mb-3 max-w-md">
                  {userInfo.profile}
                </p>
              )}
              
              {/* 统计信息 */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-neutral-800 dark:text-white">
                    {userStats.postsCount}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    <LanguageText 
                      texts={{
                        'zh-CN': '帖子',
                        'zh-TW': '貼文',
                        'en': 'Posts'
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-800 dark:text-white">
                    {userStats.followingCount}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    <LanguageText 
                      texts={{
                        'zh-CN': '关注',
                        'zh-TW': '關注',
                        'en': 'Following'
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-800 dark:text-white">
                    {userStats.followersCount}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    <LanguageText 
                      texts={{
                        'zh-CN': '粉丝',
                        'zh-TW': '粉絲',
                        'en': 'Followers'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 关注按钮 */}
          {currentUser && currentUser.userId !== userId && (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-zinc-600'
                  : 'bg-primary text-white hover:bg-primary-hover'
              } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {followLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    <LanguageText 
                      texts={{
                        'zh-CN': '处理中...',
                        'zh-TW': '處理中...',
                        'en': 'Processing...'
                      }}
                    />
                  </span>
                </div>
              ) : isFollowing ? (
                <LanguageText 
                  texts={{
                    'zh-CN': '已关注',
                    'zh-TW': '已關注',
                    'en': 'Following'
                  }}
                />
              ) : (
                <LanguageText 
                  texts={{
                    'zh-CN': '关注',
                    'zh-TW': '關注',
                    'en': 'Follow'
                  }}
                />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex space-x-1 mb-6 bg-neutral-100 dark:bg-zinc-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'posts'
              ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <LanguageText 
            texts={{
              'zh-CN': '用户帖子',
              'zh-TW': '用戶貼文',
              'en': 'User Posts'
            }}
          />
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <LanguageText 
            texts={{
              'zh-CN': '关于',
              'zh-TW': '關於',
              'en': 'About'
            }}
          />
        </button>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'posts' && (
        <div>
          <PostList 
            showUserPosts={true}
            userId={userId}
            pageSize={10}
          />
        </div>
      )}

      {activeTab === 'about' && (
        <div>
          <PostList 
            showUserPosts={true}
            userId={userId}
            pageSize={10}
          />
        </div>
      )}

      {/* 取消关注确认弹窗 */}
      <ConfirmDialog
        visible={showUnfollowDialog}
        title="取消关注"
        message={`确定要取消关注 ${userInfo?.username || '该用户'} 吗？`}
        confirmText="确定取消关注"
        loading={followLoading}
        onConfirm={handleConfirmUnfollow}
        onCancel={() => setShowUnfollowDialog(false)}
      />
    </div>
  );
} 