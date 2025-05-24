/**
 * @file 认证相关类型定义
 * @description 包含登录、注册、忘记密码等认证流程的类型定义
 */

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
 * 认证流程步骤枚举
 */
export enum AuthStep {
  /**
   * 登录步骤
   */
  LOGIN = "login",
  
  /**
   * 注册步骤
   */
  REGISTER = "register",
  
  /**
   * 忘记密码步骤
   */
  FORGOT_PASSWORD = "forgot_password",
  
  /**
   * 头像设置步骤
   */
  AVATAR = "avatar",
  
  /**
   * 标签选择步骤
   */
  TAGS = "tags",
}

/**
 * Logo组件Props
 */
export interface LogoProps {
  /**
   * Logo是否在左侧
   */
  isOnLeft: boolean;
}

/**
 * 登录面板组件Props
 */
export interface LoginPanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (value: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (value: string) => void;
  
  /**
   * 登录处理函数
   */
  handleLogin: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
  
  /**
   * 忘记密码处理函数
   */
  onForgotPassword: () => void;
  
  /**
   * 是否正在滑动动画中
   */
  isSliding: boolean;
}

/**
 * 注册面板组件Props
 */
export interface RegisterPanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (value: string) => void;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 设置密码的函数
   */
  setPassword: (value: string) => void;
  
  /**
   * 注册处理函数
   */
  handleRegister: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
  
  /**
   * 是否正在滑动动画中
   */
  isSliding: boolean;
}

/**
 * 忘记密码面板组件Props
 */
export interface ForgotPasswordPanelProps {
  /**
   * 手机号
   */
  phone: string;
  
  /**
   * 设置手机号的函数
   */
  setPhone: (value: string) => void;
  
  /**
   * 验证码
   */
  verificationCode: string;
  
  /**
   * 设置验证码的函数
   */
  setVerificationCode: (value: string) => void;
  
  /**
   * 新密码
   */
  newPassword: string;
  
  /**
   * 设置新密码的函数
   */
  setNewPassword: (value: string) => void;
  
  /**
   * 发送验证码处理函数
   */
  handleSendCode: () => void;
  
  /**
   * 重置密码处理函数
   */
  handleResetPassword: () => void;
  
  /**
   * 切换认证模式的函数
   */
  toggleAuthMode: () => void;
  
  /**
   * 是否正在滑动动画中
   */
  isSliding: boolean;
}

/**
 * 头像设置面板组件Props
 */
export interface AvatarPanelProps {
  /**
   * 昵称
   */
  nickname: string;
  
  /**
   * 设置昵称的函数
   */
  setNickname: (value: string) => void;
  
  /**
   * 头像数据
   */
  avatar: string | null;
  
  /**
   * 文件输入引用
   */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  
  /**
   * 头像上传处理函数
   */
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * 头像提交处理函数
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
export interface TagsPanelProps {
  /**
   * 可选标签列表
   */
  availableTags: string[];
  
  /**
   * 已选择的标签列表
   */
  selectedTags: string[];
  
  /**
   * 切换标签选择状态的函数
   */
  toggleTag: (tag: string) => void;
  
  /**
   * 标签提交处理函数
   */
  handleTagsSubmit: () => void;
  
  /**
   * 跳过当前步骤的函数
   */
  skipCurrentStep: () => void;
} 