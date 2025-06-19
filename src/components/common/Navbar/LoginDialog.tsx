/**
 * @file 登录对话框组件
 * @description 包含登录、注册、忘记密码和头像设置的完整认证流程
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import "./LoginDialog.css";

// 导入协议弹窗组件
import TermsDialog from "@/components/common/TermsDialog/TermsDialog";

// 导入类型定义
import type {
  LoginDialogProps,
  AuthStep,
  AnimationDirection,
  LogoProps,
  LoginPanelProps,
  EmailRegisterPanelProps,
  PhoneRegisterPanelProps,
  ForgotPasswordPanelProps,
  AvatarPanelProps,
  TagsPanelProps,
} from "@/types/loginDialogTypes";

// 导入枚举
import {
  AuthStep as AuthStepEnum,
  AnimationDirection as AnimationDirectionEnum,
} from "@/types/loginDialogTypes";

// 导入工具方法
import { LoginDialogUtils } from "./LoginDialog.utils";
import type { Category } from "@/types/categoryTypes";

/**
 * 验证码倒计时Hook
 * @param initialTime 初始倒计时时间（秒）
 * @returns [倒计时秒数, 开始倒计时函数, 重置倒计时函数]
 */
const useCountdown = (initialTime: number = 60) => {
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    if (countdown > 0) return; // 如果已经在倒计时，不重复开始
    
    setCountdown(initialTime);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCountdown(0);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return [countdown, startCountdown, resetCountdown] as const;
};

/**
 * Logo组件
 *
 * 显示在红色区域的Logo和标题
 */
const Logo: React.FC<LogoProps> = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img 
              src="/images/logo.png" 
              alt="OpenShare Logo" 
              className="h-full w-full object-contain brightness-0 invert scale-[2]" 
              />
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">云社</div>
        <div className="text-sm opacity-80">OpenShare</div>
      </div>
    </div>
  );
};

/**
 * 登录面板组件
 *
 * 用户登录表单面板
 */
const LoginPanel: React.FC<LoginPanelProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  handleLogin,
  toggleAuthMode,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
}) => {
  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        登录
      </h2>
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          账号
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入手机号或邮箱"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          密码
        </label>
        <input
          type="password"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-8 text-center">
        <button onClick={handleLogin} className="btn-primary">
          登录
        </button>
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            没有账号，注册
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 邮箱注册面板组件
 *
 * 邮箱注册表单面板
 */
const EmailRegisterPanel: React.FC<EmailRegisterPanelProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  verificationCode,
  setVerificationCode,
  handleEmailRegister,
  handleSendEmailCode,
  toggleToLogin,
  toggleToPhoneRegister,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
  agreeTerms,
  setAgreeTerms,
  onShowTermsDialog,
}) => {
  // 添加倒计时Hook
  const [emailCountdown, startEmailCountdown] = useCountdown(60);

  /**
   * 处理发送邮箱验证码
   */
  const handleSendCode = async () => {
    try {
      await handleSendEmailCode();
      // 发送成功后开始倒计时
      startEmailCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      // 发送失败不开始倒计时
    }
  };

  /**
   * 处理注册
   */
  const handleRegisterWithTerms = () => {
    if (!agreeTerms) {
      return;
    }
    handleEmailRegister();
  };

  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-2 text-center text-neutral-500 dark:text-dark-neutral">
        邮箱注册
      </h2>
      
      {/* 切换到手机号注册的小按钮 */}
      <div className="mb-2 text-center">
        <button
          onClick={toggleToPhoneRegister}
          className="text-xs text-neutral-400 hover:text-primary transition-colors"
        >
          使用手机号注册
        </button>
      </div>
      
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          邮箱
        </label>
        <input
          type="email"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      {/* 验证码字段 - 默认显示 */}
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          验证码
        </label>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
            placeholder="请输入验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button
            onClick={handleSendCode}
            disabled={emailCountdown > 0 || !email.trim()}
            className={`px-4 py-3 rounded-md whitespace-nowrap text-sm font-medium transition-colors ${
              emailCountdown > 0 || !email.trim()
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {emailCountdown > 0 ? `${emailCountdown}秒后重试` : '发送验证码'}
          </button>
        </div>
      </div>
      
      <div className="mb-5 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          密码
        </label>
        <input
          type="password"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
              agreeTerms
                ? "bg-primary border-primary"
                : "border-checkbox-unchecked-light dark:border-checkbox-unchecked-dark bg-transparent"
            }`}
          >
            {agreeTerms && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-neutral-500 dark:text-dark-neutral">
            同意
            <button
              type="button"
              onClick={onShowTermsDialog}
              className="text-primary hover:text-primary-hover underline mx-1"
            >
              协议
            </button>
          </span>
        </label>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleRegisterWithTerms}
          disabled={!agreeTerms}
          className="btn-primary"
        >
          注册
        </button>
        <div className="mt-3 text-center">
          <button
            onClick={toggleToLogin}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            已有账号，返回登录
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 手机号注册面板组件
 *
 * 手机号注册表单面板
 */
const PhoneRegisterPanel: React.FC<PhoneRegisterPanelProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  verificationCode,
  setVerificationCode,
  handlePhoneRegister,
  handleSendPhoneCode,
  toggleToLogin,
  toggleToEmailRegister,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
  agreeTerms,
  setAgreeTerms,
  onShowTermsDialog,
}) => {
  // 添加倒计时Hook
  const [phoneCountdown, startPhoneCountdown] = useCountdown(60);

  /**
   * 处理发送手机验证码
   */
  const handleSendCode = async () => {
    try {
      await handleSendPhoneCode();
      // 发送成功后开始倒计时
      startPhoneCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      // 发送失败不开始倒计时
    }
  };

  /**
   * 处理注册
   */
  const handleRegisterWithTerms = () => {
    if (!agreeTerms) {
      return;
    }
    handlePhoneRegister();
  };

  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-2 text-center text-neutral-500 dark:text-dark-neutral">
        手机号注册
      </h2>
      
      {/* 切换到邮箱注册的小按钮 */}
      <div className="mb-2 text-center">
        <button
          onClick={toggleToEmailRegister}
          className="text-xs text-neutral-400 hover:text-primary transition-colors"
        >
          使用邮箱注册
        </button>
      </div>
      
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          手机号
        </label>
        <input
          type="tel"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      {/* 验证码字段 - 默认显示 */}
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          验证码
        </label>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
            placeholder="请输入验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button
            onClick={handleSendCode}
            disabled={phoneCountdown > 0 || !phone.trim()}
            className={`px-4 py-3 rounded-md whitespace-nowrap text-sm font-medium transition-colors ${
              phoneCountdown > 0 || !phone.trim()
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {phoneCountdown > 0 ? `${phoneCountdown}秒后重试` : '发送验证码'}
          </button>
        </div>
      </div>
      
      <div className="mb-5 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          密码
        </label>
        <input
          type="password"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-colors ${
              agreeTerms
                ? "bg-primary border-primary"
                : "border-checkbox-unchecked-light dark:border-checkbox-unchecked-dark bg-transparent"
            }`}
          >
            {agreeTerms && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-neutral-500 dark:text-dark-neutral">
            同意
            <button
              type="button"
              onClick={onShowTermsDialog}
              className="text-primary hover:text-primary-hover underline mx-1"
            >
              协议
            </button>
          </span>
        </label>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleRegisterWithTerms}
          disabled={!agreeTerms}
          className="btn-primary"
        >
          注册
        </button>
        <div className="mt-3 text-center">
          <button
            onClick={toggleToLogin}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            已有账号，返回登录
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 忘记密码面板组件
 *
 * 密码重置表单面板
 */
const ForgotPasswordPanel: React.FC<ForgotPasswordPanelProps> = ({
  phone,
  setPhone,
  verificationCode,
  setVerificationCode,
  newPassword,
  setNewPassword,
  handleSendCode,
  handleResetPassword,
  toggleAuthMode,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
}) => {
  // 添加倒计时Hook
  const [forgotCountdown, startForgotCountdown] = useCountdown(60);

  /**
   * 处理发送验证码
   */
  const handleSendCodeWithCountdown = async () => {
    try {
      await handleSendCode();
      // 发送成功后开始倒计时
      startForgotCountdown();
    } catch (error) {
      console.error('发送验证码失败:', error);
      // 发送失败不开始倒计时
    }
  };

  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        忘记密码
      </h2>
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          账号
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入手机号或邮箱"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-6 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          验证码
        </label>
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
            placeholder="请输入验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button
            onClick={handleSendCodeWithCountdown}
            disabled={forgotCountdown > 0}
            className={`px-4 py-3 rounded-md whitespace-nowrap text-sm font-medium transition-colors ${
              forgotCountdown > 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {forgotCountdown > 0 ? `${forgotCountdown}秒后重试` : '发送验证码'}
          </button>
        </div>
      </div>
      <div className="mb-8 mx-3 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral w-14 flex-shrink-0 text-sm">
          新密码
        </label>
        <input
          type="password"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入新密码"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="mt-8 text-center">
        <button onClick={handleResetPassword} className="btn-primary">
          重置密码
        </button>
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            返回登录
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 头像设置面板组件
 *
 * 用户头像和昵称设置面板
 */
const AvatarPanel: React.FC<AvatarPanelProps> = ({
  nickname,
  setNickname,
  avatar,
  // setAvatar,
  fileInputRef,
  handleAvatarUpload,
  handleAvatarSubmit,
  skipCurrentStep,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
}) => {
  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-neutral-500 dark:text-dark-neutral">
        上传头像
      </h2>
      <div className="mb-4 flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-600 mb-4 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-neutral-300 dark:border-neutral-500 hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="头像预览"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">
              上传头像
            </span>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleAvatarUpload}
        />
        <span className="text-sm text-neutral-400 mt-1">点击上传头像</span>
      </div>
      
      {/* 手动输入文件路径 */}
      {/* <div className="mb-4 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
          路径
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="或输入文件绝对路径，如：C:\Users\用户名\Pictures\avatar.jpg"
          value={avatar || ''}
          onChange={(e) => {
            const path = e.target.value;
            setAvatar(path || null);
            console.log('手动设置头像路径:', path);
          }}
        />
      </div> */}
      
      <div className="mb-4 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
          昵称
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className="mt-4 text-center">
        <button onClick={handleAvatarSubmit} className="btn-primary">
          下一步
        </button>
        <div className="mt-6 text-center">
          <button
            onClick={skipCurrentStep}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            跳过
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 标签选择面板组件
 *
 * 用户兴趣标签选择面板
 */
const TagsPanel: React.FC<TagsPanelProps> = ({
  availableTags,
  selectedTags,
  toggleTag,
  handleTagsSubmit,
  skipCurrentStep,
  onPreviousStep,
  isSliding = false,
  slideDirection = AnimationDirectionEnum.NONE,
}) => {
  return (
    <div
      className={LoginDialogUtils.getPanelAnimationClass(
        isSliding,
        slideDirection
      )}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-neutral-500 dark:text-dark-neutral">
        选择感兴趣的分类
      </h2>
      <p className="text-sm text-neutral-400 text-center mb-6">
        选择您感兴趣的内容分类，帮助我们为您推荐更好的内容
      </p>
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {availableTags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 border-2 border-neutral-200 dark:border-neutral-700 ${
              selectedTags.includes(tag)
                ? "bg-primary text-white shadow-sm"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="mb-6 text-center">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            已选择 {selectedTags.length} 个分类:
          </div>
          <div className="text-sm text-primary">
            {selectedTags.join(', ')}
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={handleTagsSubmit}
          className="btn-primary mx-auto block"
        >
          完成
        </button>
        <div className="mt-6 text-center space-x-4">
          <button
            onClick={onPreviousStep}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            上一步
          </button>
          <button
            onClick={skipCurrentStep}
            className="text-sm text-neutral-400 hover:text-primary transition-colors"
          >
            跳过
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 主登录对话框组件
 *
 * 完整的认证流程对话框，包含登录、注册、忘记密码、头像设置和标签选择
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ visible, onClose }) => {
  // 当前认证步骤
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStepEnum.LOGIN);

  // 表单数据
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  // 忘记密码相关状态
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 注册验证码相关状态
  const [registerVerificationCode, setRegisterVerificationCode] = useState("");

  // 协议相关状态
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  // 动画状态
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<AnimationDirection>(
    AnimationDirectionEnum.NONE
  );

  // 分类数据状态
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 加载分类数据
   */
  const loadCategories = async () => {
    if (availableCategories.length > 0) return; // 避免重复加载
    
    try {
      setCategoriesLoading(true);
      const categories = await LoginDialogUtils.getCategoriesApi();
      setAvailableCategories(categories);
    } catch (error) {
      console.error('加载分类数据失败:', error);
      // 使用默认分类
      setAvailableCategories(LoginDialogUtils.getDefaultCategories());
    } finally {
      setCategoriesLoading(false);
    }
  };

  /**
   * 监听步骤变化，在进入标签选择步骤时加载分类数据
   */
  useEffect(() => {
    if (currentStep === AuthStepEnum.TAGS && visible) {
      loadCategories();
    }
  }, [currentStep, visible]);

  /**
   * 重置所有表单数据
   */
  const resetFormData = () => {
    setPhone("");
    setEmail("");
    setPassword("");
    setNickname("");
    setAvatar(null);
    setSelectedTags([]);
    setBio("");
    setVerificationCode("");
    setNewPassword("");
    setRegisterVerificationCode("");
    setAgreeTerms(false);
  };

  /**
   * 自定义关闭处理函数
   */
  const handleClose = () => {
    // 重置到登录步骤
    setCurrentStep(AuthStepEnum.LOGIN);
    // 清空表单数据
    resetFormData();
    // 关闭协议弹窗
    setShowTermsDialog(false);
    // 调用原始关闭函数
    onClose();
  };

  /**
   * 处理同意协议
   */
  const handleAgreeTerms = () => {
    setAgreeTerms(true);
    setShowTermsDialog(false);
  };

  /**
   * 显示协议弹窗
   */
  const handleShowTermsDialog = () => {
    setShowTermsDialog(true);
  };

  /**
   * 监听弹窗可见性变化，重置状态
   */
  useEffect(() => {
    if (visible) {
      // 弹窗打开时重置到登录状态
      setCurrentStep(AuthStepEnum.LOGIN);
    }
  }, [visible]);

  // 使用工具类中的方法
  const dialogUtils = LoginDialogUtils.createDialogHandlers({
    currentStep,
    setCurrentStep,
    setIsSliding,
    setSlideDirection,
    onClose: handleClose,
    formData: {
      phone,
      email,
      password,
      nickname,
      avatar,
      selectedTags,
      verificationCode,
      newPassword,
      bio,
      registerVerificationCode,
    },
    setters: {
      setPhone,
      setEmail,
      setPassword,
      setNickname,
      setAvatar,
      setSelectedTags,
      setVerificationCode,
      setNewPassword,
      setBio,
      setRegisterVerificationCode,
    },
  });

  // 创建自定义切换函数，在切换时清空输入框
  const customToggleAuthMode = (targetStep: AuthStep) => {
    // 如果从登录页面切换到注册页面，清空登录表单
    if (currentStep === AuthStepEnum.LOGIN && (targetStep === AuthStepEnum.EMAIL_REGISTER || targetStep === AuthStepEnum.PHONE_REGISTER)) {
      setPhone("");
      setEmail("");
      setPassword("");
    }
    // 如果切换到登录页面，清空其他表单数据
    if (targetStep === AuthStepEnum.LOGIN) {
      setVerificationCode("");
      setNewPassword("");
      setRegisterVerificationCode("");
    }
    // 从登录页面切换到忘记密码时，保留phone字段的内容，只清空password
    if (currentStep === AuthStepEnum.LOGIN && targetStep === AuthStepEnum.FORGOT_PASSWORD) {
      // 保留phone字段，清空密码
      setPassword("");
    }
    
    dialogUtils.toggleAuthMode(targetStep);
  };

  // 判断红色区域是否在左侧
  const isRedOnLeft = LoginDialogUtils.isRedOnLeft(currentStep);

  // 可选标签列表 - 使用分类名称
  const availableTags = availableCategories.map(category => category.categoryName);

  // 如果正在加载分类且没有可用分类，显示默认标签
  const displayTags = availableTags.length > 0 ? availableTags : LoginDialogUtils.getAvailableTags();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          visible ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        ></div>
        <div
          className="bg-white dark:bg-neutral-800 shadow-xl relative z-10 overflow-hidden"
          style={{ width: "600px", height: "400px", borderRadius: "16px" }}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 忘记密码链接 - 只在登录页面显示 */}
          {currentStep === AuthStepEnum.LOGIN && (
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => customToggleAuthMode(AuthStepEnum.FORGOT_PASSWORD)}
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                忘记密码
              </button>
            </div>
          )}

          <div className="dialog-container">
            {/* 红色区域 */}
            <div
              className={`red-area ${
                isRedOnLeft ? "red-on-left" : "red-on-right"
              }`}
            >
              <Logo />
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-16 bg-white dark:bg-neutral-800 ${
                  isRedOnLeft ? "right-0 rounded-l-full" : "left-0 rounded-r-full"
                }`}
              ></div>
            </div>

            {/* 白色内容区域 */}
            <div
              className={`white-area ${
                isRedOnLeft ? "red-on-left" : "red-on-right"
              }`}
            >
              {currentStep === AuthStepEnum.LOGIN && (
                <LoginPanel
                  phone={phone}
                  setPhone={setPhone}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={dialogUtils.handleLogin}
                  toggleAuthMode={() =>
                    customToggleAuthMode(AuthStepEnum.EMAIL_REGISTER)
                  }
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                />
              )}

              {currentStep === AuthStepEnum.EMAIL_REGISTER && (
                <EmailRegisterPanel
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  verificationCode={registerVerificationCode}
                  setVerificationCode={setRegisterVerificationCode}
                  handleEmailRegister={dialogUtils.handleEmailRegister}
                  handleSendEmailCode={dialogUtils.handleSendEmailCode}
                  toggleToLogin={() => customToggleAuthMode(AuthStepEnum.LOGIN)}
                  toggleToPhoneRegister={() => customToggleAuthMode(AuthStepEnum.PHONE_REGISTER)}
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  onShowTermsDialog={handleShowTermsDialog}
                />
              )}

              {currentStep === AuthStepEnum.PHONE_REGISTER && (
                <PhoneRegisterPanel
                  phone={phone}
                  setPhone={setPhone}
                  password={password}
                  setPassword={setPassword}
                  verificationCode={registerVerificationCode}
                  setVerificationCode={setRegisterVerificationCode}
                  handlePhoneRegister={dialogUtils.handlePhoneRegister}
                  handleSendPhoneCode={dialogUtils.handleSendPhoneCode}
                  toggleToLogin={() => customToggleAuthMode(AuthStepEnum.LOGIN)}
                  toggleToEmailRegister={() => customToggleAuthMode(AuthStepEnum.EMAIL_REGISTER)}
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  onShowTermsDialog={handleShowTermsDialog}
                />
              )}

              {currentStep === AuthStepEnum.FORGOT_PASSWORD && (
                <ForgotPasswordPanel
                  phone={phone}
                  setPhone={setPhone}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  handleSendCode={dialogUtils.handleSendCode}
                  handleResetPassword={dialogUtils.handleResetPassword}
                  toggleAuthMode={() =>
                    customToggleAuthMode(AuthStepEnum.LOGIN)
                  }
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                />
              )}

              {currentStep === AuthStepEnum.AVATAR && (
                <AvatarPanel
                  nickname={nickname}
                  setNickname={setNickname}
                  avatar={avatar}
                  setAvatar={setAvatar}
                  fileInputRef={fileInputRef}
                  handleAvatarUpload={dialogUtils.handleAvatarUpload}
                  handleAvatarSubmit={dialogUtils.handleAvatarSubmit}
                  skipCurrentStep={dialogUtils.skipCurrentStep}
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                />
              )}

              {currentStep === AuthStepEnum.TAGS && (
                <TagsPanel
                  availableTags={categoriesLoading ? ['加载中...'] : displayTags}
                  selectedTags={selectedTags}
                  toggleTag={categoriesLoading ? () => {} : dialogUtils.toggleTag}
                  handleTagsSubmit={dialogUtils.handleTagsSubmit}
                  skipCurrentStep={dialogUtils.skipCurrentStep}
                  onPreviousStep={dialogUtils.handlePreviousStep}
                  isSliding={isSliding}
                  slideDirection={slideDirection}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 协议弹窗 - 渲染在最高层级，不受父容器限制 */}
      <TermsDialog
        visible={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        onAgree={handleAgreeTerms}
      />
    </>
  );
};

export default LoginDialog;
