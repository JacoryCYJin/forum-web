/**
 * @file 登录对话框组件
 * @description 包含登录、注册、忘记密码和头像设置的完整认证流程
 */

"use client";

import React, { useState, useRef } from "react";
import "./LoginDialog.css";

// 导入类型定义
import type {
  LoginDialogProps,
  AuthStep,
  LogoProps,
  LoginPanelProps,
  RegisterPanelProps,
  ForgotPasswordPanelProps,
  AvatarPanelProps,
  TagsPanelProps,
} from "@/types/auth.types";

// 导入枚举
import { AuthStep as AuthStepEnum } from "@/types/auth.types";

// 导入工具方法
import { LoginDialogUtils } from "./LoginDialog.utils";

/**
 * Logo组件
 *
 * 显示在红色区域的Logo和标题
 */
const Logo: React.FC<LogoProps> = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-3xl font-bold mb-2">LOGO</div>
        <div className="text-sm opacity-80">论坛名称</div>
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
  onForgotPassword,
  isSliding,
}) => {
  return (
    <div className={`auth-panel ${isSliding ? "slide-out-right" : ""}`}>
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        登录
      </h2>
      <div className="mb-6 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-12 flex-shrink-0 text-sm">
          账号
        </label>
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-input-border-light dark:border-input-border-dark rounded-md bg-input-background-light dark:bg-input-background-dark text-input-text-light dark:text-input-text-dark placeholder:text-input-placeholder-light dark:placeholder:text-input-placeholder-dark focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus transition-colors"
          placeholder="请输入账号/手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="mb-8 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-12 flex-shrink-0 text-sm">
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
        <button
          onClick={handleLogin}
          className="py-3 px-10 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium"
        >
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
      <div className="absolute bottom-4 right-4">
        <button
          onClick={onForgotPassword}
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          忘记密码
        </button>
      </div>
    </div>
  );
};

/**
 * 注册面板组件
 *
 * 用户注册表单面板
 */
const RegisterPanel: React.FC<RegisterPanelProps> = ({
  phone,
  setPhone,
  password,
  setPassword,
  handleRegister,
  toggleAuthMode,
  isSliding,
}) => {
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className={`auth-panel ${isSliding ? "slide-out-left" : ""}`}>
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        注册
      </h2>
      <div className="mb-6 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
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
      <div className="mb-6 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
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
      <div className="flex items-center justify-center mb-8">
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
            同意协议
          </span>
        </label>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleRegister}
          disabled={!agreeTerms}
          className="py-3 px-10 bg-primary text-white rounded-full hover:bg-primary-hover disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          注册
        </button>
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
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
  isSliding,
}) => {
  return (
    <div className={`auth-panel px-8 ${isSliding ? "slide-out-right" : ""}`}>
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        忘记密码
      </h2>
      <div className="mb-6 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
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
      <div className="mb-6 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
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
            className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors whitespace-nowrap text-sm font-medium"
          >
            发送验证码
          </button>
        </div>
      </div>
      <div className="mb-8 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-14 flex-shrink-0 text-sm">
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
        <button
          onClick={handleResetPassword}
          className="py-3 px-10 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium"
        >
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
  fileInputRef,
  handleAvatarUpload,
  handleAvatarSubmit,
  skipCurrentStep,
}) => {
  return (
    <div className="auth-panel py-8">
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
              src={avatar}
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
      <div className="mb-4 flex items-center">
        <label className="text-neutral-500 dark:text-dark-neutral mr-3 w-12 flex-shrink-0 text-sm">
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
        <button
          onClick={handleAvatarSubmit}
          className="py-3 px-10 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors font-medium"
        >
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
}) => {
  return (
    <div className="auth-panel">
      <h2 className="text-2xl font-bold mb-8 text-center text-neutral-500 dark:text-dark-neutral">
        选择喜欢的分类
      </h2>
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {availableTags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
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
      <div className="mt-8 text-center">
        <button
          onClick={handleTagsSubmit}
          className="py-3 px-10 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors mx-auto block font-medium"
        >
          完成
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
 * 主登录对话框组件
 *
 * 完整的认证流程对话框，包含登录、注册、忘记密码、头像设置和标签选择
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ visible, onClose }) => {
  // 当前认证步骤
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStepEnum.LOGIN);

  // 表单数据
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 忘记密码相关状态
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 滑动动画状态
  const [isSliding, setIsSliding] = useState(false);

  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 可选标签列表
  const availableTags = LoginDialogUtils.getAvailableTags();

  // 判断红色区域是否在左侧
  const isRedOnLeft = LoginDialogUtils.isRedOnLeft(currentStep);

  // 创建包装的处理函数
  const handleLogin = () =>
    LoginDialogUtils.handleLogin(phone, password, onClose);
  const handleRegister = () =>
    LoginDialogUtils.handleRegister(phone, password, setCurrentStep);
  const handleSendCode = () => LoginDialogUtils.handleSendCode(phone);
  const handleResetPassword = () =>
    LoginDialogUtils.handleResetPassword(
      phone,
      verificationCode,
      newPassword,
      setCurrentStep
    );
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    LoginDialogUtils.handleAvatarUpload(e, setAvatar);
  const handleAvatarSubmit = () =>
    LoginDialogUtils.handleAvatarSubmit(avatar, nickname, setCurrentStep);
  const toggleTag = (tag: string) =>
    LoginDialogUtils.toggleTag(tag, selectedTags, setSelectedTags);
  const handleTagsSubmit = () =>
    LoginDialogUtils.handleTagsSubmit(selectedTags, onClose);
  const toggleAuthMode = (mode: AuthStep) =>
    LoginDialogUtils.toggleAuthMode(mode, setIsSliding, setCurrentStep);
  const skipCurrentStep = () =>
    LoginDialogUtils.skipCurrentStep(currentStep, setCurrentStep, onClose);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        visible ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="bg-white dark:bg-neutral-800 shadow-xl relative z-10 overflow-hidden"
        style={{ width: "600px", height: "400px", borderRadius: "16px" }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
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

        <div className="flex h-full relative">
          {/* 红色区域 - 根据步骤调整位置 */}
          <div
            className={`w-1/3 bg-primary transition-transform duration-300 ease-in-out relative ${
              isRedOnLeft ? "translate-x-0" : "translate-x-[200%]"
            }`}
          >
            {/* Logo */}
            <Logo isOnLeft={isRedOnLeft} />

            {/* 圆弧效果 */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-16 bg-white dark:bg-neutral-800 ${
                isRedOnLeft ? "right-0 rounded-l-full" : "left-0 rounded-r-full"
              }`}
            ></div>
          </div>

          {/* 白色内容区域 - 根据步骤调整位置 */}
          <div
            className={`w-2/3 p-6 flex items-center justify-center transition-transform duration-300 ease-in-out bg-white dark:bg-neutral-800 ${
              isRedOnLeft ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            {currentStep === AuthStepEnum.LOGIN && (
              <LoginPanel
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                toggleAuthMode={() => toggleAuthMode(AuthStepEnum.REGISTER)}
                onForgotPassword={() =>
                  toggleAuthMode(AuthStepEnum.FORGOT_PASSWORD)
                }
                isSliding={isSliding}
              />
            )}

            {currentStep === AuthStepEnum.REGISTER && (
              <RegisterPanel
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                handleRegister={handleRegister}
                toggleAuthMode={() => toggleAuthMode(AuthStepEnum.LOGIN)}
                isSliding={isSliding}
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
                handleSendCode={handleSendCode}
                handleResetPassword={handleResetPassword}
                toggleAuthMode={() => toggleAuthMode(AuthStepEnum.LOGIN)}
                isSliding={isSliding}
              />
            )}

            {currentStep === AuthStepEnum.AVATAR && (
              <AvatarPanel
                nickname={nickname}
                setNickname={setNickname}
                avatar={avatar}
                fileInputRef={fileInputRef}
                handleAvatarUpload={handleAvatarUpload}
                handleAvatarSubmit={handleAvatarSubmit}
                skipCurrentStep={skipCurrentStep}
              />
            )}

            {currentStep === AuthStepEnum.TAGS && (
              <TagsPanel
                availableTags={availableTags}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                handleTagsSubmit={handleTagsSubmit}
                skipCurrentStep={skipCurrentStep}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
