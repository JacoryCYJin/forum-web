/**
 * @file 登录对话框工具方法
 * @description 包含登录对话框的所有业务逻辑处理方法
 */

import { AuthStep } from "@/types/auth.types";

/**
 * 登录对话框的工具方法集合
 */
export class LoginDialogUtils {
  /**
   * 处理登录
   * 
   * @param phone - 手机号
   * @param password - 密码
   * @param onClose - 关闭对话框的回调
   */
  static handleLogin(phone: string, password: string, onClose: () => void): void {
    console.log("登录信息:", { phone, password });
    onClose();
  }

  /**
   * 处理注册
   * 
   * @param phone - 手机号
   * @param password - 密码
   * @param setCurrentStep - 设置当前步骤的函数
   */
  static handleRegister(
    phone: string, 
    password: string, 
    setCurrentStep: (step: AuthStep) => void
  ): void {
    console.log("注册信息:", { phone, password });
    setCurrentStep(AuthStep.AVATAR);
  }

  /**
   * 处理发送验证码
   * 
   * @param phone - 手机号
   */
  static handleSendCode(phone: string): void {
    console.log("发送验证码到:", phone);
  }

  /**
   * 处理重置密码
   * 
   * @param phone - 手机号
   * @param verificationCode - 验证码
   * @param newPassword - 新密码
   * @param setCurrentStep - 设置当前步骤的函数
   */
  static handleResetPassword(
    phone: string,
    verificationCode: string,
    newPassword: string,
    setCurrentStep: (step: AuthStep) => void
  ): void {
    console.log("重置密码:", { phone, verificationCode, newPassword });
    setCurrentStep(AuthStep.LOGIN);
  }

  /**
   * 处理头像上传
   * 
   * @param e - 文件选择事件
   * @param setAvatar - 设置头像的函数
   */
  static handleAvatarUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setAvatar: (avatar: string) => void
  ): void {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * 处理头像和昵称提交
   * 
   * @param avatar - 头像数据
   * @param nickname - 昵称
   * @param setCurrentStep - 设置当前步骤的函数
   */
  static handleAvatarSubmit(
    avatar: string | null,
    nickname: string,
    setCurrentStep: (step: AuthStep) => void
  ): void {
    console.log("头像和昵称:", { avatar, nickname });
    setCurrentStep(AuthStep.TAGS);
  }

  /**
   * 处理标签选择切换
   * 
   * @param tag - 标签名
   * @param selectedTags - 当前选中的标签列表
   * @param setSelectedTags - 设置标签列表的函数
   */
  static toggleTag(
    tag: string,
    selectedTags: string[],
    setSelectedTags: (tags: string[]) => void
  ): void {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  /**
   * 处理标签提交
   * 
   * @param selectedTags - 选中的标签列表
   * @param onClose - 关闭对话框的回调
   */
  static handleTagsSubmit(selectedTags: string[], onClose: () => void): void {
    console.log("选择的标签:", selectedTags);
    onClose();
  }

  /**
   * 切换认证模式
   * 
   * @param mode - 目标认证步骤
   * @param setIsSliding - 设置滑动状态的函数
   * @param setCurrentStep - 设置当前步骤的函数
   */
  static toggleAuthMode(
    mode: AuthStep,
    setIsSliding: (sliding: boolean) => void,
    setCurrentStep: (step: AuthStep) => void
  ): void {
    setIsSliding(true);
    setTimeout(() => {
      setCurrentStep(mode);
      setIsSliding(false);
    }, 300);
  }

  /**
   * 跳过当前步骤
   * 
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param onClose - 关闭对话框的回调
   */
  static skipCurrentStep(
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    onClose: () => void
  ): void {
    if (currentStep === AuthStep.AVATAR) {
      setCurrentStep(AuthStep.TAGS);
    } else if (currentStep === AuthStep.TAGS) {
      onClose();
    }
  }

  /**
   * 判断红色区域是否在左侧
   * 
   * @param currentStep - 当前步骤
   * @returns 是否在左侧
   */
  static isRedOnLeft(currentStep: AuthStep): boolean {
    return currentStep === AuthStep.LOGIN || currentStep === AuthStep.FORGOT_PASSWORD;
  }

  /**
   * 获取可选标签列表
   * 
   * @returns 标签列表
   */
  static getAvailableTags(): string[] {
    return [
      "生活",
      "摄影",
      "旅游",
      "摄影",
      "XXXXXX",
      "XXXXXX",
      "XXXXXX",
    ];
  }
} 