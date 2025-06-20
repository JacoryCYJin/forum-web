/**
 * @file 用户主页
 * @description 展示用户信息、发布的帖子以及关注/取消关注功能
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { getUserInfoApi } from '@/lib/api/userApi';
import { getUserPostCountApi } from '@/lib/api/postsApi';
import { getFollowingCountApi, getFollowersCountApi, followUserApi, unfollowUserApi, checkFollowStatusApi } from '@/lib/api/followApi';
import PostList from '@/components/features/post/PostList';
import LanguageText from '@/components/common/LanguageText/LanguageText';
import ConfirmDialog from '@/components/common/ConfirmDialog/ConfirmDialog';
import ReportDialog from '@/components/common/ReportDialog/ReportDialog';
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
 * 用户主页组件
 * 
 * 显示用户详细信息、发布的帖子和关注功能，采用现代简约设计
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
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
   * 点击外部关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // 加载状态 - 简洁的骨架屏
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            {/* 用户信息骨架屏 */}
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-6 mb-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态 - 简洁的错误页面
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">出现错误</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium"
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
      </div>
    );
  }

  // 用户不存在 - 简洁的404页面
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 用户信息卡片 - 简洁设计 */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg border border-neutral-100 dark:border-zinc-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              {/* 用户头像 */}
              <img
                src={userInfo.avatarUrl || '/images/avatars/default-avatar.svg'}
                alt={userInfo.username}
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
              
              {/* 用户信息 */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                  {userInfo.username}
                </h1>
                
                {/* 用户简介 */}
                {userInfo.profile && (
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-2xl">
                    {userInfo.profile}
                  </p>
                )}
                
                {/* 统计信息 - 简洁布局 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {userStats.postsCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
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
                    <div className="text-xl font-bold text-primary">
                      {userStats.followingCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
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
                    <div className="text-xl font-bold text-primary">
                      {userStats.followersCount}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
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
            
            {/* 操作按钮组 - 简洁设计 */}
            {currentUser && currentUser.userId !== userId && (
              <div className="flex items-center space-x-3">
                {/* 私聊按钮 */}
                <button
                  onClick={() => window.open(`/message?userId=${userId}`, '_blank')}
                  className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-600 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>
                    <LanguageText 
                      texts={{
                        'zh-CN': '私聊',
                        'zh-TW': '私聊',
                        'en': 'Message'
                      }}
                    />
                  </span>
                </button>

                {/* 关注按钮 */}
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
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

              {/* 更多操作按钮（举报等） */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-700"
                  title="更多操作"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                
                {/* 下拉菜单 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowReportDialog(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3 font-medium group"
                    >
                      <svg className="w-4 h-4 text-red-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="group-hover:text-red-600">举报用户</span>
                    </button>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>
        </div>

        {/* 用户帖子列表 - 简洁容器 */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg border border-neutral-100 dark:border-zinc-700 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
              <LanguageText 
                texts={{
                  'zh-CN': '用户动态',
                  'zh-TW': '用戶動態',
                  'en': 'User Posts'
                }}
              />
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              <LanguageText 
                texts={{
                  'zh-CN': `查看 ${userInfo.username} 发布的所有内容`,
                  'zh-TW': `查看 ${userInfo.username} 發布的所有內容`,
                  'en': `View all content posted by ${userInfo.username}`
                }}
              />
            </p>
          </div>
          
          <PostList 
            showUserPosts={true}
            userId={userId}
            pageSize={10}
          />
        </div>

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

        {/* 举报弹窗 */}
        <ReportDialog
          visible={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          componentType="USER"
          componentId={userId}
          title={`用户: ${userInfo?.username || '该用户'}`}
          onSuccess={() => {
            console.log('用户举报提交成功');
            ElMessage.success('举报提交成功');
          }}
        />
      </div>
    </div>
  );
} 