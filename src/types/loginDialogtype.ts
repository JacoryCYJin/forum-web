/**
 * @file 登录对话框类型定义
 * @description 包含登录、注册、忘记密码等认证流程的类型定义
 */

/**
 * 动画方向枚举
 */
export enum AnimationDirection {
  LEFT = "left",
  RIGHT = "right",
  NONE = "none",
}

/**
 * 认证步骤枚举
 */
export enum AuthStep {
  LOGIN = "login",
  EMAIL_REGISTER = "email_register",
  PHONE_REGISTER = "phone_register",
  FORGOT_PASSWORD = "forgot_password",
  AVATAR = "avatar",
  TAGS = "tags",
}

/**
 * 密码强度等级枚举
 */
export enum PasswordStrength {
  /** 弱密码 */
  WEAK = "weak",
  /** 中等强度 */
  MEDIUM = "medium",
  /** 强密码 */
  STRONG = "strong",
}

/**
 * 密码验证结果接口
 */
export interface PasswordValidation {
  /** 是否有效 */
  isValid: boolean;
  /** 密码强度 */
  strength: PasswordStrength;
  /** 验证消息列表 */
  messages: string[];
  /** 强度百分比（0-100） */
  strengthPercent: number;
}

/**
 * 表单验证规则接口
 */
export interface ValidationRule {
  /** 规则名称 */
  name: string;
  /** 验证函数 */
  validate: (value: string) => boolean;
  /** 错误消息 */
  message: string;
}

/**
 * 登录对话框组件Props
 */
export interface LoginDialogProps {
  /**
   * 对话框是否可见
   */
  visible: boolean;
  
  /**
   * 关闭对话框的回调函数
   */
  onClose: () => void;
}

/**
 * Logo组件Props
 */
export interface LogoProps {
  /**
   * 是否在左侧（已废弃，现在始终显示）
   * @deprecated Logo现在始终显示
   */
  isOnLeft?: boolean;
}

/**
 * 基础面板Props
 */
interface BasePanelProps {
  /**
   * 是否正在滑动
   */
  isSliding?: boolean;
  
  /**
   * 滑动方向
   */
  slideDirection?: AnimationDirection;
}

/**
 * 登录面板组件Props
 */
export interface LoginPanelProps extends BasePanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (phone: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (password: string) => void;
  
  /**
   * 处理登录的函数
   */
  handleLogin: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
  
  /**
   * 处理忘记密码的函数（可选，已移到右下角）
   */
  onForgotPassword?: () => void;
}

/**
 * 注册面板组件Props
 */
export interface RegisterPanelProps extends BasePanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (phone: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (password: string) => void;
  
  /**
   * 处理注册的函数
   */
  handleRegister: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
  
  /**
   * 是否同意协议
   */
  agreeTerms: boolean;
  
  /**
   * 设置同意协议状态的函数
   */
  setAgreeTerms: (agree: boolean) => void;
  
  /**
   * 显示协议弹窗的函数
   */
  onShowTermsDialog: () => void;
  
  /**
   * 验证码
   */
  verificationCode: string;
  
  /**
   * 设置验证码的函数
   */
  setVerificationCode: (code: string) => void;
  
  /**
   * 发送注册验证码的函数
   */
  handleSendRegisterCode: () => void;
}

/**
 * 邮箱注册面板组件Props
 */
export interface EmailRegisterPanelProps extends BasePanelProps {
  /**
   * 邮箱地址
   */
  email: string;
  
  /**
   * 设置邮箱地址的函数
   */
  setEmail: (email: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (password: string) => void;
  
  /**
   * 验证码
   */
  verificationCode: string;
  
  /**
   * 设置验证码的函数
   */
  setVerificationCode: (code: string) => void;
  
  /**
   * 处理邮箱注册的函数
   */
  handleEmailRegister: () => void;
  
  /**
   * 发送邮箱验证码的函数
   */
  handleSendEmailCode: () => void;
  
  /**
   * 切换到登录页面的函数
   */
  toggleToLogin: () => void;
  
  /**
   * 切换到手机号注册的函数
   */
  toggleToPhoneRegister: () => void;
  
  /**
   * 是否同意协议
   */
  agreeTerms: boolean;
  
  /**
   * 设置同意协议状态的函数
   */
  setAgreeTerms: (agree: boolean) => void;
  
  /**
   * 显示协议弹窗的函数
   */
  onShowTermsDialog: () => void;
}

/**
 * 手机号注册面板组件Props
 */
export interface PhoneRegisterPanelProps extends BasePanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (phone: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (password: string) => void;
  
  /**
   * 验证码
   */
  verificationCode: string;
  
  /**
   * 设置验证码的函数
   */
  setVerificationCode: (code: string) => void;
  
  /**
   * 处理手机号注册的函数
   */
  handlePhoneRegister: () => void;
  
  /**
   * 发送手机验证码的函数
   */
  handleSendPhoneCode: () => void;
  
  /**
   * 切换到登录页面的函数
   */
  toggleToLogin: () => void;
  
  /**
   * 切换到邮箱注册的函数
   */
  toggleToEmailRegister: () => void;
  
  /**
   * 是否同意协议
   */
  agreeTerms: boolean;
  
  /**
   * 设置同意协议状态的函数
   */
  setAgreeTerms: (agree: boolean) => void;
  
  /**
   * 显示协议弹窗的函数
   */
  onShowTermsDialog: () => void;
}

/**
 * 忘记密码面板组件Props
 */
export interface ForgotPasswordPanelProps extends BasePanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (phone: string) => void;
  
  /**
   * 验证码
   */
  verificationCode: string;
  
  /**
   * 设置验证码的函数
   */
  setVerificationCode: (code: string) => void;
  
  /**
   * 新密码
   */
  newPassword: string;
  
  /**
   * 设置新密码的函数
   */
  setNewPassword: (password: string) => void;
  
  /**
   * 发送验证码的函数
   */
  handleSendCode: () => void;
  
  /**
   * 重置密码的函数
   */
  handleResetPassword: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
}

/**
 * 头像设置面板组件Props
 */
export interface AvatarPanelProps extends BasePanelProps {
  /**
   * 昵称
   */
  nickname: string;
  
  /**
   * 设置昵称的函数
   */
  setNickname: (nickname: string) => void;
  
  /**
   * 头像数据
   */
  avatar: string | null;
  
  /**
   * 设置头像的函数
   */
  setAvatar: (avatar: string | null) => void;
  
  /**
   * 文件输入引用
   */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  
  /**
   * 处理头像上传的函数
   */
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * 提交头像和昵称的函数
   */
  handleAvatarSubmit: () => void;
  
  /**
   * 跳过当前步骤的函数
   */
  skipCurrentStep: () => void;
}

/**
 * 标签选择面板组件Props
 */
export interface TagsPanelProps extends BasePanelProps {
  /**
   * 可选标签列表
   */
  availableTags: string[];
  
  /**
   * 已选标签列表
   */
  selectedTags: string[];
  
  /**
   * 切换标签选择的函数
   */
  toggleTag: (tag: string) => void;
  
  /**
   * 提交标签选择的函数
   */
  handleTagsSubmit: () => void;
  
  /**
   * 跳过当前步骤的函数
   */
  skipCurrentStep: () => void;
  
  /**
   * 返回上一步的函数
   */
  onPreviousStep: () => void;
}

/**
 * 对话框处理器配置接口
 */
export interface DialogHandlersConfig {
  /**
   * 当前步骤
   */
  currentStep: AuthStep;
  
  /**
   * 设置当前步骤的函数
   */
  setCurrentStep: (step: AuthStep) => void;
  
  /**
   * 设置滑动状态的函数
   */
  setIsSliding: (sliding: boolean) => void;
  
  /**
   * 设置滑动方向的函数
   */
  setSlideDirection: (direction: AnimationDirection) => void;
  
  /**
   * 关闭对话框的回调
   */
  onClose: () => void;
  
  /**
   * 表单数据
   */
  formData: {
    phone: string;
    email: string;
    password: string;
    nickname: string;
    avatar: string | null;
    selectedTags: string[];
    verificationCode: string;
    newPassword: string;
    bio: string;
    registerVerificationCode: string;
  };
  
  /**
   * 状态设置器
   */
  setters: {
    setPhone: (phone: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setNickname: (nickname: string) => void;
    setAvatar: (avatar: string | null) => void;
    setSelectedTags: (tags: string[]) => void;
    setVerificationCode: (code: string) => void;
    setNewPassword: (password: string) => void;
    setBio: (bio: string) => void;
    setRegisterVerificationCode: (code: string) => void;
  };
}

/**
 * 对话框处理器接口
 */
export interface DialogHandlers {
  handleLogin: () => void;
  handleRegister: () => void;
  handleEmailRegister: () => void;
  handlePhoneRegister: () => void;
  handleSendCode: () => void;
  handleSendEmailCode: () => void;
  handleSendPhoneCode: () => void;
  handleResetPassword: () => void;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarSubmit: () => void;
  toggleTag: (tag: string) => void;
  handleTagsSubmit: () => void;
  toggleAuthMode: (mode: AuthStep) => void;
  skipCurrentStep: () => void;
  handlePreviousStep: () => void;
  handleSendRegisterCode: () => void;
} 