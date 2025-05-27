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
  REGISTER = "register", 
  FORGOT_PASSWORD = "forgot_password",
  AVATAR = "avatar",
  TAGS = "tags",
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
   * 处理忘记密码的函数
   */
  onForgotPassword: () => void;
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
    password: string;
    nickname: string;
    avatar: string | null;
    selectedTags: string[];
    verificationCode: string;
    newPassword: string;
  };
  
  /**
   * 状态设置器
   */
  setters: {
    setPhone: (phone: string) => void;
    setPassword: (password: string) => void;
    setNickname: (nickname: string) => void;
    setAvatar: (avatar: string | null) => void;
    setSelectedTags: (tags: string[]) => void;
    setVerificationCode: (code: string) => void;
    setNewPassword: (password: string) => void;
  };
}

/**
 * 对话框处理器接口
 */
export interface DialogHandlers {
  handleLogin: () => void;
  handleRegister: () => void;
  handleSendCode: () => void;
  handleResetPassword: () => void;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarSubmit: () => void;
  toggleTag: (tag: string) => void;
  handleTagsSubmit: () => void;
  toggleAuthMode: (mode: AuthStep) => void;
  skipCurrentStep: () => void;
  handlePreviousStep: () => void;
} 