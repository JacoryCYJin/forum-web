/**
 * @file 用户设置页面
 * @description 包含用户设置、普通设置和安全设置的完整设置界面
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { 
  updateAvatarAndUsernameAndProfileApi, 
  updatePrivacySettingsApi,
  getPrivacySettingsApi,
  changePasswordApi,
  changePhoneApi,
  changeEmailApi,
  sendPhoneCodeApi,
  sendUnifiedEmailCodeApi
} from '@/lib/api/userApi';
import { formatDateToChinese } from '@/lib/utils/dateUtils';
import { updateUserAndSync } from '@/lib/utils/userUtils';
import type { PrivacySettings } from '@/types/userTypes';
import { useRouter } from 'next/navigation';

/**
 * 设置分类类型
 */
type SettingCategory = 'user' | 'general' | 'security';

/**
 * 加密显示文本
 * 
 * @param text - 原始文本
 * @param showStart - 显示开头字符数
 * @param showEnd - 显示结尾字符数
 * @returns 加密后的文本
 */
function maskText(text: string, showStart: number = 3, showEnd: number = 4): string {
  if (!text || text.length <= showStart + showEnd) {
    return text;
  }
  const start = text.substring(0, showStart);
  const end = text.substring(text.length - showEnd);
  const middle = '*'.repeat(Math.min(text.length - showStart - showEnd, 6));
  return start + middle + end;
}

/**
 * 设置页面组件
 * 
 * @component
 */
export default function SettingsPage() {
  const { user, setUser, showLogin } = useUserStore();
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('user');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  /**
   * 检查登录状态，如果未登录则弹出登录框并返回上一页
   */
  useEffect(() => {
    if (!hasCheckedAuth) {
      setHasCheckedAuth(true);
      if (!user) {
        showLogin();
        router.back();
        return;
      }
    }
  }, [user, showLogin, router, hasCheckedAuth]);
  
  // 用户设置状态
  const [userSettings, setUserSettings] = useState({
    nickname: user?.username || '',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [originalUserSettings, setOriginalUserSettings] = useState({
    nickname: user?.username || '',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });
  
  // 头像文件状态
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 普通设置状态
  const [generalSettings, setGeneralSettings] = useState<PrivacySettings>({
    showEmail: true,
    showPhone: true,
    allowFriendRequests: true,
    showCollections: true,
    showLikes: true,
    showFollowers: true,
    showFollowing: true
  });

  // 安全设置状态
  const [securitySettings, setSecuritySettings] = useState({
    // 密码修改
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // 手机号修改
    currentPhone: '',
    newPhone: '',
    phoneVerificationCode: '',
    
    // 邮箱修改
    currentEmail: '',
    newEmail: '',
    emailVerificationCode: '',
    
    twoFactorEnabled: false
  });

  // 安全设置编辑状态
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // 验证码发送状态
  const [phoneCodeSending, setPhoneCodeSending] = useState(false);
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [phoneCodeCountdown, setPhoneCodeCountdown] = useState(0);
  const [emailCodeCountdown, setEmailCodeCountdown] = useState(0);

  /**
   * 初始化时获取隐私设置数据
   */
  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
      // 更新用户设置
      const settings = {
        nickname: user.username || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      };
      setUserSettings(settings);
      setOriginalUserSettings(settings);
    }
  }, [user]);

  /**
   * 获取隐私设置
   */
  const fetchPrivacySettings = async () => {
    try {
      const settings = await getPrivacySettingsApi();
      setGeneralSettings(settings);
    } catch (error: any) {
      console.error('获取隐私设置失败:', error);
      // 使用默认设置
    }
  };

  /**
   * 验证码倒计时
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phoneCodeCountdown > 0) {
      interval = setInterval(() => {
        setPhoneCodeCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneCodeCountdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailCodeCountdown > 0) {
      interval = setInterval(() => {
        setEmailCodeCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailCodeCountdown]);

  /**
   * 开始编辑用户设置
   */
  const handleStartEditUser = () => {
    setIsEditingUser(true);
    setOriginalUserSettings({ ...userSettings });
  };

  /**
   * 取消编辑用户设置
   */
  const handleCancelEditUser = () => {
    setIsEditingUser(false);
    setUserSettings({ ...originalUserSettings });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  /**
   * 处理头像文件上传
   */
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 验证文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片文件大小不能超过5MB');
        return;
      }
      
      setAvatarFile(file);
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  /**
   * 处理用户设置保存
   */
  const handleSaveUserSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // 构建更新参数，只包含实际修改的字段
      const updateParams: any = {};
      
      // 只有当昵称实际发生变化时才传递username
      if (userSettings.nickname !== originalUserSettings.nickname) {
        updateParams.username = userSettings.nickname || undefined;
      }
      
      // 检查是否有新的头像文件
      if (avatarFile) {
        updateParams.avatar = avatarFile;
      }
      
      // 只有当简介实际发生变化时才传递profile
      if (userSettings.bio !== originalUserSettings.bio) {
        updateParams.profile = userSettings.bio || undefined;
      }
      
      // 如果没有任何字段需要更新，直接返回
      if (Object.keys(updateParams).length === 0) {
        alert('没有检测到任何更改');
        setIsLoading(false);
        return;
      }
      
      const updatedUser = await updateAvatarAndUsernameAndProfileApi(updateParams);

      const newUserInfo = {
        ...user,
        username: updatedUser.username || user.username,
        nickname: updatedUser.username || user.nickname,
        avatar: updatedUser.avatarUrl || user.avatar,
        bio: updatedUser.profile || user.bio
      };
      setUser(newUserInfo);

      // 更新本地显示的用户设置
      const updatedSettings = {
        nickname: updatedUser.username || userSettings.nickname,
        avatar: updatedUser.avatarUrl || userSettings.avatar,
        bio: updatedUser.profile || userSettings.bio
      };
      setUserSettings(updatedSettings);
      setOriginalUserSettings(updatedSettings);

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

      setIsEditingUser(false);
      
      // 清理头像相关状态
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
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
  const handleSaveGeneralSettings = async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      
      await updatePrivacySettingsApi({
        userId: user.userId,
        ...generalSettings
      });
      alert('普通设置已保存成功！');
    } catch (error: any) {
      console.error('保存普通设置失败:', error);
      alert(error.message || '保存普通设置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理密码修改
   */
  const handleChangePassword = async () => {
    // 基础验证
    if (!securitySettings.currentPassword || !securitySettings.newPassword || !securitySettings.confirmPassword) {
      alert('请输入当前密码和新密码');
      return;
    }
    
    // 密码长度验证
    if (securitySettings.newPassword.length < 8 || securitySettings.newPassword.length > 16) {
      alert('新密码长度必须在8到16位之间');
      return;
    }
    
    // 密码一致性验证
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }

    // 检查新密码是否与当前密码相同
    if (securitySettings.currentPassword === securitySettings.newPassword) {
      alert('新密码不能与当前密码相同');
      return;
    }

    if (!user) return;
    
    setIsLoading(true);
    try {
      await changePasswordApi({
        userId: user.userId,
        currentPassword: securitySettings.currentPassword,
        newPassword: securitySettings.newPassword,
        newPasswordConfirm: securitySettings.confirmPassword
      });
      
      // 密码修改成功后，更新用户的updatedAt时间
      if (user) {
        const updatedUserInfo = updateUserAndSync(user, {}, true);
        setUser(updatedUserInfo);
      }
      
      // 清空密码字段并关闭编辑状态
      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setIsEditingPassword(false);
      
      alert('密码修改成功！');
    } catch (error: any) {
      console.error('修改密码失败:', error);
      alert(error.message || '修改密码失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 发送手机验证码
   */
  const handleSendPhoneCode = async () => {
    if (!securitySettings.newPhone) {
      alert('请输入新手机号');
      return;
    }

    // 验证当前手机号是否与用户手机号匹配
    if (securitySettings.currentPhone !== user?.phone) {
      alert('当前手机号不正确，请重新输入');
      return;
    }

    // 验证新手机号不能与当前手机号相同
    if (securitySettings.currentPhone === securitySettings.newPhone) {
      alert('新手机号不能与当前手机号相同');
      return;
    }

    setPhoneCodeSending(true);
    try {
      await sendPhoneCodeApi(securitySettings.newPhone, 3); // type=3表示修改手机号
      setPhoneCodeCountdown(60);
      alert('验证码已发送到您的新手机号');
    } catch (error: any) {
      console.error('发送手机验证码失败:', error);
      alert(error.message || '发送验证码失败，请稍后重试');
    } finally {
      setPhoneCodeSending(false);
    }
  };

  /**
   * 处理手机号修改
   */
  const handleChangePhone = async () => {
    if (!securitySettings.currentPhone || !securitySettings.newPhone || !securitySettings.phoneVerificationCode) {
      alert('请输入当前手机号、新手机号和验证码');
      return;
    }

    // 再次验证当前手机号是否与用户手机号匹配
    if (securitySettings.currentPhone !== user?.phone) {
      alert('当前手机号不正确，请重新输入');
      return;
    }

    // 验证新手机号不能与当前手机号相同
    if (securitySettings.currentPhone === securitySettings.newPhone) {
      alert('新手机号不能与当前手机号相同');
      return;
    }

    setIsLoading(true);
    try {
      await changePhoneApi({
        currentPhone: securitySettings.currentPhone,
        newPhone: securitySettings.newPhone,
        verificationCode: securitySettings.phoneVerificationCode
      });
      
      // 更新用户信息
      if (user) {
        const newUserInfo = updateUserAndSync(user, { 
          phone: securitySettings.newPhone
        });
        setUser(newUserInfo);
      }
      
      // 清空手机号字段并关闭编辑状态
      setSecuritySettings(prev => ({
        ...prev,
        currentPhone: '',
        newPhone: '',
        phoneVerificationCode: ''
      }));
      setIsEditingPhone(false);
      
      alert('手机号修改成功！');
    } catch (error: any) {
      console.error('修改手机号失败:', error);
      alert(error.message || '修改手机号失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 发送邮箱验证码
   */
  const handleSendEmailCode = async () => {
    if (!securitySettings.currentEmail || !securitySettings.newEmail) {
      alert('请输入当前邮箱和新邮箱地址');
      return;
    }

    // 验证当前邮箱是否与用户邮箱匹配
    if (securitySettings.currentEmail !== user?.email) {
      console.log("securitySettings.currentEmail:", securitySettings.currentEmail);
      console.log("user?.email:", user?.email);
      alert('当前邮箱不正确，请重新输入');
      return;
    }

    // 验证新邮箱不能与当前邮箱相同
    if (securitySettings.currentEmail === securitySettings.newEmail) {
      alert('新邮箱不能与当前邮箱相同');
      return;
    }

    setEmailCodeSending(true);
    try {
      await sendUnifiedEmailCodeApi(securitySettings.newEmail, 3);
      setEmailCodeCountdown(60);
      alert('验证码已发送到您的新邮箱');
    } catch (error: any) {
      console.error('发送邮箱验证码失败:', error);
      alert(error.message || '发送验证码失败，请稍后重试');
    } finally {
      setEmailCodeSending(false);
    }
  };

  /**
   * 处理邮箱修改
   */
  const handleChangeEmail = async () => {
    if (!securitySettings.currentEmail || !securitySettings.newEmail || !securitySettings.emailVerificationCode) {
      alert('请输入当前邮箱、新邮箱地址和验证码');
      return;
    }

    // 再次验证当前邮箱是否与用户邮箱匹配
    if (securitySettings.currentEmail !== user?.email) {
      alert('当前邮箱不正确，请重新输入');
      return;
    }

    // 验证新邮箱不能与当前邮箱相同
    if (securitySettings.currentEmail === securitySettings.newEmail) {
      alert('新邮箱不能与当前邮箱相同');
      return;
    }

    setIsLoading(true);
    try {
      await changeEmailApi({
        userId: user.userId,
        email: securitySettings.newEmail,
        verificationCode: securitySettings.emailVerificationCode
      });
      
      // 更新用户信息
      if (user) {
        const newUserInfo = updateUserAndSync(user, { 
          email: securitySettings.newEmail
        });
        setUser(newUserInfo);
      }
      
      // 清空邮箱字段并关闭编辑状态
      setSecuritySettings(prev => ({
        ...prev,
        currentEmail: '',
        newEmail: '',
        emailVerificationCode: ''
      }));
      setIsEditingEmail(false);
      
      alert('邮箱修改成功！');
    } catch (error: any) {
      console.error('修改邮箱失败:', error);
      alert(error.message || '修改邮箱失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
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

  // 如果用户未登录，返回空内容（登录对话框已经弹出）
  if (!hasCheckedAuth || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 - 简化设计 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">
            账户设置
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            管理您的个人信息、隐私设置和账户安全
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* 侧边栏导航 - 简化设计 */}
          <div className="xl:w-80">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-neutral-200 dark:border-zinc-700 p-6">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                设置分类
              </h3>
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
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主要内容区域 - 简化设计 */}
          <div className="flex-1">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow border border-neutral-200 dark:border-zinc-700">
              {/* 用户设置 - 简化设计 */}
              {activeCategory === 'user' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                        用户设置
                      </h2>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        管理您的个人资料和基本信息
                      </p>
                    </div>
                    {!isEditingUser && (
                      <button
                        onClick={handleStartEditUser}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>修改设置</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {/* 头像设置 - 简化设计 */}
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-4">
                      <label className="block text-sm font-medium text-neutral-800 dark:text-white mb-3">
                        头像设置
                      </label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={avatarPreview || userSettings.avatar}
                          alt="头像"
                          className="w-16 h-16 rounded-lg border border-neutral-200 dark:border-zinc-600 object-cover"
                        />
                        {isEditingUser && (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="avatar-upload"
                              onChange={handleAvatarFileChange}
                            />
                            <label
                              htmlFor="avatar-upload"
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-100 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span>{avatarFile ? '重新选择' : '更换头像'}</span>
                            </label>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                              支持 JPG、PNG 格式，文件大小不超过 5MB
                              {avatarFile && <span className="block text-green-600">已选择: {avatarFile.name}</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 昵称设置 - 简化设计 */}
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-4">
                      <label className="block text-sm font-medium text-neutral-800 dark:text-white mb-3">
                        显示昵称
                      </label>
                      {isEditingUser ? (
                        <input
                          type="text"
                          value={userSettings.nickname}
                          onChange={(e) => setUserSettings(prev => ({ ...prev, nickname: e.target.value }))}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="请输入您的昵称..."
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-600 rounded-lg">
                          <span className="text-neutral-800 dark:text-white">
                            {userSettings.nickname || (
                              <span className="text-neutral-400 dark:text-neutral-500 italic">未设置昵称</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 个人简介 - 简化设计 */}
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-4">
                      <label className="block text-sm font-medium text-neutral-800 dark:text-white mb-3">
                        个人简介
                      </label>
                      {isEditingUser ? (
                        <div className="space-y-2">
                          <textarea
                            value={userSettings.bio}
                            onChange={(e) => setUserSettings(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            placeholder="介绍一下您自己..."
                          />
                          <div className="flex justify-between">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              简洁的自我介绍有助于建立个人形象
                            </p>
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                              {userSettings.bio.length}/500
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-700 border border-neutral-200 dark:border-zinc-600 rounded-lg min-h-[80px]">
                          <p className="text-neutral-800 dark:text-white">
                            {userSettings.bio || (
                              <span className="text-neutral-400 dark:text-neutral-500 italic">暂未填写个人简介</span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 保存/取消按钮 - 简化设计 */}
                    {isEditingUser && (
                      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-zinc-700">
                        <button
                          onClick={handleCancelEditUser}
                          className="px-4 py-2 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-zinc-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleSaveUserSettings}
                          disabled={isLoading}
                          className={`px-6 py-2 rounded-lg transition-colors ${
                            isLoading
                              ? 'bg-neutral-400 cursor-not-allowed opacity-70'
                              : 'bg-primary hover:bg-primary-hover text-white'
                          }`}
                        >
                          {isLoading ? '保存中...' : '保存更改'}
                        </button>
                      </div>
                    )}
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
                            <div className={`w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
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
                            <div className={`w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
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
                            <div className={`w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
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
                            <div className={`w-11 h-6 bg-neutral-200 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 保存按钮 */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGeneralSettings}
                        disabled={isLoading}
                        className={`px-6 py-3 rounded-lg transition-colors ${
                          isLoading
                            ? 'bg-neutral-400 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover'
                        } text-white`}
                      >
                        {isLoading ? '保存中...' : '保存设置'}
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
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                          登录密码
                        </h3>
                        {!isEditingPassword && (
                          <button
                            onClick={() => setIsEditingPassword(true)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            修改密码
                          </button>
                        )}
                      </div>
                      
                      {!isEditingPassword ? (
                        <div className="text-neutral-600 dark:text-neutral-400">
                          <p>为了您的账户安全，建议定期更换密码</p>
                          <p className="text-sm mt-1">上次修改时间：{formatDateToChinese(user?.updatedAt)}</p>
                        </div>
                      ) : (
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
                          <div className="flex space-x-4 pt-2">
                            <button
                              onClick={() => {
                                setIsEditingPassword(false);
                                setSecuritySettings(prev => ({
                                  ...prev,
                                  currentPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                }));
                              }}
                              className="px-6 py-3 bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-zinc-600 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleChangePassword}
                              disabled={isLoading}
                              className={`px-6 py-3 rounded-lg transition-colors ${
                                isLoading
                                  ? 'bg-neutral-400 cursor-not-allowed'
                                  : 'bg-primary hover:bg-primary-hover'
                              } text-white`}
                            >
                              {isLoading ? '修改中...' : '确认修改'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 手机号修改 */}
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                          绑定手机号
                        </h3>
                        {!isEditingPhone && (
                          <button
                            onClick={() => setIsEditingPhone(true)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            修改手机号
                          </button>
                        )}
                      </div>
                      
                      {!isEditingPhone ? (
                        <div className="space-y-2">
                          <div className="text-neutral-600 dark:text-neutral-400">
                            <p>当前绑定手机号：{user?.phone ? maskText(user.phone, 3, 4) : '未绑定'}</p>
                            <p className="text-sm mt-1">手机号用于登录和找回密码</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              当前手机号验证
                            </label>
                            <input
                              type="tel"
                              value={securitySettings.currentPhone}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPhone: e.target.value }))}
                              className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="请输入当前完整手机号进行验证"
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              为了安全起见，请完整输入您当前的手机号
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              新手机号
                            </label>
                            <input
                              type="tel"
                              value={securitySettings.newPhone}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPhone: e.target.value }))}
                              className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="请输入新手机号"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              验证码
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={securitySettings.phoneVerificationCode}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, phoneVerificationCode: e.target.value }))}
                                className="flex-1 px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="请输入验证码"
                              />
                              <button
                                onClick={handleSendPhoneCode}
                                disabled={phoneCodeSending || phoneCodeCountdown > 0 || !securitySettings.currentPhone || !securitySettings.newPhone}
                                className={`px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                                  phoneCodeSending || phoneCodeCountdown > 0 || !securitySettings.currentPhone || !securitySettings.newPhone
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-hover'
                                } text-white`}
                              >
                                {phoneCodeCountdown > 0 ? `${phoneCodeCountdown}s` : phoneCodeSending ? '发送中...' : '发送验证码'}
                              </button>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              验证码将发送到您的新手机号
                            </p>
                          </div>
                          <div className="flex space-x-4 pt-2">
                            <button
                              onClick={() => {
                                setIsEditingPhone(false);
                                setSecuritySettings(prev => ({
                                  ...prev,
                                  currentPhone: '',
                                  newPhone: '',
                                  phoneVerificationCode: ''
                                }));
                              }}
                              className="px-6 py-3 bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-zinc-600 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleChangePhone}
                              disabled={isLoading}
                              className={`px-6 py-3 rounded-lg transition-colors ${
                                isLoading
                                  ? 'bg-neutral-400 cursor-not-allowed'
                                  : 'bg-primary hover:bg-primary-hover'
                              } text-white`}
                            >
                              {isLoading ? '修改中...' : '确认修改'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 邮箱修改 */}
                    <div className="border border-neutral-200 dark:border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                          绑定邮箱
                        </h3>
                        {!isEditingEmail && (
                          <button
                            onClick={() => setIsEditingEmail(true)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                          >
                            修改邮箱
                          </button>
                        )}
                      </div>
                      
                      {!isEditingEmail ? (
                        <div className="space-y-2">
                          <div className="text-neutral-600 dark:text-neutral-400">
                            <p>当前绑定邮箱：{user?.email ? maskText(user.email, 3, 4) : '未绑定'}</p>
                            <p className="text-sm mt-1">邮箱用于登录和接收重要通知</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              当前邮箱验证
                            </label>
                            <input
                              type="email"
                              value={securitySettings.currentEmail}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentEmail: e.target.value }))}
                              className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="请输入当前完整邮箱地址进行验证"
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              为了安全起见，请完整输入您当前的邮箱地址
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              新邮箱
                            </label>
                            <input
                              type="email"
                              value={securitySettings.newEmail}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, newEmail: e.target.value }))}
                              className="w-full px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="请输入新邮箱"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              验证码
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={securitySettings.emailVerificationCode}
                                onChange={(e) => setSecuritySettings(prev => ({ ...prev, emailVerificationCode: e.target.value }))}
                                className="flex-1 px-4 py-3 border border-neutral-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-neutral-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="请输入验证码"
                              />
                              <button
                                onClick={handleSendEmailCode}
                                disabled={emailCodeSending || emailCodeCountdown > 0 || !securitySettings.currentEmail || !securitySettings.newEmail}
                                className={`px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                                  emailCodeSending || emailCodeCountdown > 0 || !securitySettings.currentEmail || !securitySettings.newEmail
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-hover'
                                } text-white`}
                              >
                                {emailCodeCountdown > 0 ? `${emailCodeCountdown}s` : emailCodeSending ? '发送中...' : '发送验证码'}
                              </button>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              验证码将发送到您的新邮箱地址
                            </p>
                          </div>
                          <div className="flex space-x-4 pt-2">
                            <button
                              onClick={() => {
                                setIsEditingEmail(false);
                                setSecuritySettings(prev => ({
                                  ...prev,
                                  currentEmail: '',
                                  newEmail: '',
                                  emailVerificationCode: ''
                                }));
                              }}
                              className="px-6 py-3 bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-300 dark:hover:bg-zinc-600 transition-colors"
                            >
                              取消
                            </button>
                            <button
                              onClick={handleChangeEmail}
                              disabled={isLoading}
                              className={`px-6 py-3 rounded-lg transition-colors ${
                                isLoading
                                  ? 'bg-neutral-400 cursor-not-allowed'
                                  : 'bg-primary hover:bg-primary-hover'
                              } text-white`}
                            >
                              {isLoading ? '修改中...' : '确认修改'}
                            </button>
                          </div>
                        </div>
                      )}
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