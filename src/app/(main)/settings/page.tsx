/**
 * @file 用户设置页面
 * @description 包含用户设置、普通设置和安全设置的完整设置界面
 */

'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { updateAvatarAndUsernameAndProfileApi } from '@/lib/api/userApi';

/**
 * 设置分类类型
 */
type SettingCategory = 'user' | 'general' | 'security';

/**
 * 设置页面组件
 * 
 * @component
 */
export default function SettingsPage() {
  const { user, setUser } = useUserStore();
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('user');
  const [isLoading, setIsLoading] = useState(false);
  
  // 用户设置状态
  const [userSettings, setUserSettings] = useState({
    nickname: user?.username || '',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });

  // 普通设置状态
  const [generalSettings, setGeneralSettings] = useState({
    showCollections: true,
    showLikes: true,
    showFollowers: true,
    showFollowing: true
  });

  // 安全设置状态
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  /**
   * 处理用户设置保存
   */
  const handleSaveUserSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // 调用API更新用户资料
      const updatedUser = await updateAvatarAndUsernameAndProfileApi({
        username: userSettings.nickname || undefined,
        avatarUrl: userSettings.avatar || undefined,
        profile: userSettings.bio || undefined
      });

      // 更新userStore中的用户信息
      const newUserInfo = {
        ...user,
        username: updatedUser.username || user.username,
        nickname: updatedUser.username || user.nickname,
        avatar: updatedUser.avatarUrl || user.avatar,
        bio: updatedUser.profile || user.bio
      };
      setUser(newUserInfo);

      // 同时更新localStorage中的用户信息
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          userInfo.username = updatedUser.username || userInfo.username;
          userInfo.avatarUrl = updatedUser.avatarUrl || userInfo.avatarUrl;
          userInfo.profile = updatedUser.profile || userInfo.profile;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }

      alert('用户设置已保存成功！');
    } catch (error: any) {
      console.error('保存用户设置失败:', error);
      alert(error.message || '保存用户设置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理普通设置保存
   */
  const handleSaveGeneralSettings = () => {
    // 这里应该调用API保存普通设置
    console.log('保存普通设置:', generalSettings);
    alert('普通设置已保存');
  };

  /**
   * 处理安全设置保存
   */
  const handleSaveSecuritySettings = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    // 这里应该调用API保存安全设置
    console.log('保存安全设置:', securitySettings);
    alert('安全设置已保存');
  };

  /**
   * 设置分类配置
   */
  const categories = [
    {
      key: 'user' as SettingCategory,
      label: '用户设置',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      key: 'general' as SettingCategory,
      label: '普通设置',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      )
    },
    {
      key: 'security' as SettingCategory,
      label: '安全设置',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  // 如果用户未登录，显示提示
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
            请先登录
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            您需要登录才能访问设置页面
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">设置</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            管理您的账户设置和偏好
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow p-4">
              <nav className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.key
                        ? 'bg-primary text-white'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span className={activeCategory === category.key ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}>
                      {category.icon}
                    </span>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
              {/* 用户设置 */}
              {activeCategory === 'user' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6">
                    用户设置
                  </h2>
                  
                  <div className="space-y-6">
                    {/* 头像设置 */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                        头像
                      </label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={userSettings.avatar}
                          alt="头像"
                          className="w-20 h-20 rounded-full border-4 border-primary"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="avatar-upload"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="px-4 py-2 bg-neutral-100 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                          >
                            更换头像
                          </label>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            支持 JPG、PNG 格式，文件大小不超过 5MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 昵称设置 */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        昵称
                      </label>
                      <input
                        type="text"
                        value={userSettings.nickname}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, nickname: e.target.value }))}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="请输入昵称"
                      />
                    </div>

                    {/* 个人简介 */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        个人简介
                      </label>
                      <textarea
                        value={userSettings.bio}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="请输入个人简介"
                      />
                    </div>

                    {/* 保存按钮 */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveUserSettings}
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-lg transition-colors ${
                          isLoading
                            ? 'bg-neutral-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover'
                        } text-white`}
                      >
                        {isLoading ? '保存中...' : '保存更改'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 普通设置 */}
              {activeCategory === 'general' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6">
                    普通设置
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                        隐私设置
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        选择您希望对其他用户公开的信息
                      </p>

                      <div className="space-y-4">
                        {/* 收藏设置 */}
                        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-neutral-800 dark:text-white">
                              展示我的收藏
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              其他用户可以查看您收藏的内容
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={generalSettings.showCollections}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, showCollections: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        {/* 点赞设置 */}
                        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-neutral-800 dark:text-white">
                              展示我的点赞
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              其他用户可以查看您点赞的内容
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={generalSettings.showLikes}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, showLikes: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        {/* 粉丝设置 */}
                        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-neutral-800 dark:text-white">
                              展示我的粉丝
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              其他用户可以查看您的粉丝列表
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={generalSettings.showFollowers}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, showFollowers: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        {/* 关注设置 */}
                        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-zinc-700 rounded-lg">
                          <div>
                            <h4 className="font-medium text-neutral-800 dark:text-white">
                              展示我的关注
                            </h4>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              其他用户可以查看您关注的人
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={generalSettings.showFollowing}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, showFollowing: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 保存按钮 */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGeneralSettings}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                      >
                        保存更改
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 安全设置 */}
              {activeCategory === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6">
                    安全设置
                  </h2>
                  
                  <div className="space-y-8">
                    {/* 密码修改 */}
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                        修改密码
                      </h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            当前密码
                          </label>
                          <input
                            type="password"
                            value={securitySettings.currentPassword}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入当前密码"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            新密码
                          </label>
                          <input
                            type="password"
                            value={securitySettings.newPassword}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入新密码"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            确认新密码
                          </label>
                          <input
                            type="password"
                            value={securitySettings.confirmPassword}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请再次输入新密码"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 联系方式 */}
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                        联系方式
                      </h3>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            手机号
                          </label>
                          <input
                            type="tel"
                            value={securitySettings.phone}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入手机号"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            邮箱
                          </label>
                          <input
                            type="email"
                            value={securitySettings.email}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="请输入邮箱"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 保存按钮 */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveSecuritySettings}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                      >
                        保存更改
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 