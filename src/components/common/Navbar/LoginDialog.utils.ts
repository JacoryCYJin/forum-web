/**
 * @file 登录对话框工具方法
 * @description 包含登录对话框的所有业务逻辑处理方法
 */

import { 
  AuthStep, 
  AnimationDirection, 
  DialogHandlersConfig, 
  DialogHandlers 
} from "@/types/LoginDialog";

/**
 * 登录对话框的工具方法集合
 */
export class LoginDialogUtils {
  /**
   * 获取面板动画CSS类名
   *
   * @param isSliding - 是否正在滑动
   * @param slideDirection - 滑动方向
   * @param isEntering - 是否是进入动画
   * @returns CSS类名
   */
  static getPanelAnimationClass(
    isSliding: boolean,
    slideDirection: AnimationDirection,
    isEntering: boolean = false
  ): string {
    if (!isSliding) return "auth-panel";
    
    if (isEntering) {
      // 进入动画
      switch (slideDirection) {
        case AnimationDirection.LEFT:
          return "auth-panel slide-in-left";
        case AnimationDirection.RIGHT:
          return "auth-panel slide-in-right";
        default:
          return "auth-panel";
      }
    } else {
      // 退出动画
      switch (slideDirection) {
        case AnimationDirection.LEFT:
          return "auth-panel slide-out-left";
        case AnimationDirection.RIGHT:
          return "auth-panel slide-out-right";
        default:
          return "auth-panel";
      }
    }
  }

  /**
   * 创建对话框处理器
   * 
   * @param config - 处理器配置
   * @returns 对话框处理器对象
   */
  static createDialogHandlers(config: DialogHandlersConfig): DialogHandlers {
    const {
      currentStep,
      setCurrentStep,
      setIsSliding,
      setSlideDirection,
      onClose,
      formData,
      setters,
    } = config;

    return {
      /**
       * 处理登录
       */
      handleLogin: () => {
        console.log("登录信息:", { 
          phone: formData.phone, 
          password: formData.password 
        });
        onClose();
      },

      /**
       * 处理注册
       */
      handleRegister: () => {
        console.log("注册信息:", { 
          phone: formData.phone, 
          password: formData.password 
        });
        this.switchToStepWithAnimation(
          currentStep,
          AuthStep.AVATAR,
          setCurrentStep,
          setIsSliding,
          setSlideDirection
        );
      },

      /**
       * 处理发送验证码
       */
      handleSendCode: () => {
        console.log("发送验证码到:", formData.phone);
      },

      /**
       * 处理重置密码
       */
      handleResetPassword: () => {
        console.log("重置密码:", { 
          phone: formData.phone, 
          verificationCode: formData.verificationCode, 
          newPassword: formData.newPassword 
        });
        this.switchToStepWithAnimation(
          currentStep,
          AuthStep.LOGIN,
          setCurrentStep,
          setIsSliding,
          setSlideDirection
        );
      },

      /**
       * 处理头像上传
       */
      handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setters.setAvatar(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      },

      /**
       * 处理头像和昵称提交
       */
      handleAvatarSubmit: () => {
        console.log("头像和昵称:", { 
          avatar: formData.avatar, 
          nickname: formData.nickname 
        });
        this.switchToStepWithAnimation(
          currentStep,
          AuthStep.TAGS,
          setCurrentStep,
          setIsSliding,
          setSlideDirection
        );
      },

      /**
       * 处理标签选择切换
       */
      toggleTag: (tag: string) => {
        if (formData.selectedTags.includes(tag)) {
          setters.setSelectedTags(formData.selectedTags.filter((t) => t !== tag));
        } else {
          setters.setSelectedTags([...formData.selectedTags, tag]);
        }
      },

      /**
       * 处理标签提交
       */
      handleTagsSubmit: () => {
        console.log("选择的标签:", formData.selectedTags);
        onClose();
      },

      /**
       * 切换认证模式
       */
      toggleAuthMode: (mode: AuthStep) => {
        this.switchToStepWithAnimation(
          currentStep,
          mode,
          setCurrentStep,
          setIsSliding,
          setSlideDirection
        );
      },

      /**
       * 跳过当前步骤
       */
      skipCurrentStep: () => {
        if (currentStep === AuthStep.AVATAR) {
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.TAGS,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );
        } else if (currentStep === AuthStep.TAGS) {
          onClose();
        }
      },

      /**
       * 返回上一步
       */
      handlePreviousStep: () => {
        if (currentStep === AuthStep.TAGS) {
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.AVATAR,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );
        }
      },
    };
  }

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
   * 处理注册（增强版）
   * 
   * @param phone - 手机号
   * @param password - 密码
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static handleRegisterEnhanced(
    phone: string,
    password: string,
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    console.log("注册信息:", { phone, password });
    this.switchToStepWithAnimation(
      currentStep,
      AuthStep.AVATAR,
      setCurrentStep,
      setIsSliding,
      setSlideDirection
    );
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
   * 处理重置密码（增强版）
   * 
   * @param phone - 手机号
   * @param verificationCode - 验证码
   * @param newPassword - 新密码
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static handleResetPasswordEnhanced(
    phone: string,
    verificationCode: string,
    newPassword: string,
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    console.log("重置密码:", { phone, verificationCode, newPassword });
    this.switchToStepWithAnimation(
      currentStep,
      AuthStep.LOGIN,
      setCurrentStep,
      setIsSliding,
      setSlideDirection
    );
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
   * 处理头像和昵称提交（增强版）
   * 
   * @param avatar - 头像数据
   * @param nickname - 昵称
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static handleAvatarSubmitEnhanced(
    avatar: string | null,
    nickname: string,
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    console.log("头像和昵称:", { avatar, nickname });
    this.switchToStepWithAnimation(
      currentStep,
      AuthStep.TAGS,
      setCurrentStep,
      setIsSliding,
      setSlideDirection
    );
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
   * 处理上一步操作（增强版）
   * 
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static handlePreviousStepEnhanced(
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    if (currentStep === AuthStep.TAGS) {
      this.switchToStepWithAnimation(
        currentStep,
        AuthStep.AVATAR,
        setCurrentStep,
        setIsSliding,
        setSlideDirection
      );
    }
  }

  /**
   * 获取动画方向
   * 
   * @param currentStep - 当前步骤
   * @param targetStep - 目标步骤
   * @returns 动画方向
   */
  static getAnimationDirection(currentStep: AuthStep, targetStep: AuthStep): AnimationDirection {
    // 定义步骤顺序
    const stepOrder = [AuthStep.LOGIN, AuthStep.REGISTER, AuthStep.AVATAR, AuthStep.TAGS];
    const forgotPasswordStep = AuthStep.FORGOT_PASSWORD;
    
    // 忘记密码相关动画 - 只有内容滑动，不改变红白区域位置
    if (currentStep === AuthStep.LOGIN && targetStep === forgotPasswordStep) {
      return AnimationDirection.LEFT; // 登录 -> 忘记密码，内容向左滑出
    }
    if (currentStep === forgotPasswordStep && targetStep === AuthStep.LOGIN) {
      return AnimationDirection.RIGHT; // 忘记密码 -> 登录，内容向右滑出
    }
    
    // 登录和注册之间的切换 - 红白区域会移动，不需要内容动画
    if ((currentStep === AuthStep.LOGIN && targetStep === AuthStep.REGISTER) ||
        (currentStep === AuthStep.REGISTER && targetStep === AuthStep.LOGIN)) {
      return AnimationDirection.NONE; // 红白区域移动，不需要内容动画
    }
    
    // 流程中的向前和向后移动
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(targetStep);
    
    if (currentIndex !== -1 && targetIndex !== -1) {
      if (targetIndex > currentIndex) {
        return AnimationDirection.LEFT; // 向前，内容向左滑出
      } else if (targetIndex < currentIndex) {
        return AnimationDirection.RIGHT; // 向后，内容向右滑出
      }
    }
    
    return AnimationDirection.NONE;
  }

  /**
   * 带动画的步骤切换
   * 
   * @param currentStep - 当前步骤
   * @param targetStep - 目标步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static switchToStepWithAnimation(
    currentStep: AuthStep,
    targetStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    const currentRedOnLeft = this.isRedOnLeft(currentStep);
    const targetRedOnLeft = this.isRedOnLeft(targetStep);
    const animationDirection = this.getAnimationDirection(currentStep, targetStep);
    
    // 如果红白区域位置会改变，不需要内容滑动动画（区域本身在移动）
    if (currentRedOnLeft !== targetRedOnLeft) {
      setCurrentStep(targetStep);
      return;
    }
    
    // 红白区域位置不变，使用内容滑动动画
    if (animationDirection !== AnimationDirection.NONE) {
      setSlideDirection(animationDirection);
      setIsSliding(true);
      
      setTimeout(() => {
        setCurrentStep(targetStep);
        setIsSliding(false);
        setSlideDirection(AnimationDirection.NONE);
      }, 300);
    } else {
      setCurrentStep(targetStep);
    }
  }

  /**
   * 切换认证模式（增强版）
   * 
   * @param currentStep - 当前步骤
   * @param targetStep - 目标步骤
   * @param setIsSliding - 设置滑动状态的函数
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setSlideDirection - 设置滑动方向的函数
   */
  static toggleAuthModeEnhanced(
    currentStep: AuthStep,
    targetStep: AuthStep,
    setIsSliding: (sliding: boolean) => void,
    setCurrentStep: (step: AuthStep) => void,
    setSlideDirection: (direction: AnimationDirection) => void
  ): void {
    this.switchToStepWithAnimation(
      currentStep,
      targetStep,
      setCurrentStep,
      setIsSliding,
      setSlideDirection
    );
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
   * 跳过当前步骤（增强版）
   * 
   * @param currentStep - 当前步骤
   * @param setCurrentStep - 设置当前步骤的函数
   * @param setIsSliding - 设置滑动状态的函数
   * @param setSlideDirection - 设置滑动方向的函数
   * @param onClose - 关闭对话框的回调
   */
  static skipCurrentStepEnhanced(
    currentStep: AuthStep,
    setCurrentStep: (step: AuthStep) => void,
    setIsSliding: (sliding: boolean) => void,
    setSlideDirection: (direction: AnimationDirection) => void,
    onClose: () => void
  ): void {
    if (currentStep === AuthStep.AVATAR) {
      this.switchToStepWithAnimation(
        currentStep,
        AuthStep.TAGS,
        setCurrentStep,
        setIsSliding,
        setSlideDirection
      );
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
      "美食",
      "科技",
      "音乐",
      "运动",
    ];
  }
} 