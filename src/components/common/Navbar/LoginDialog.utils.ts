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
import { loginUserApi, registerApi, updateAvatarAndUsernameApi, sendResetCodeApi, resetPasswordApi } from "@/lib/api/userApi";
import { useUserStore } from "@/store/userStore";
import type { UserInfo as User } from "@/types/user.types";
import { processAvatarPath, validateAvatarFile, compressAvatar } from "@/lib/utils/avatarUtils";

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
      handleLogin: async () => {
        try {
          // 验证输入
          if (!formData.phone || !formData.password) {
            alert('请输入账号和密码');
            return;
          }

          console.log("正在登录...", { 
            phoneOrEmail: formData.phone, 
            password: formData.password 
          });

          // 调用登录API
          const loginResult = await loginUserApi({
            phoneOrEmail: formData.phone,
            password: formData.password
          });

          console.log("登录成功:", loginResult);

          // 保存登录信息到localStorage
          localStorage.setItem('accessToken', loginResult.accessToken);
          localStorage.setItem('tokenType', loginResult.tokenType);
          localStorage.setItem('userInfo', JSON.stringify({
            userId: loginResult.userId,
            username: loginResult.username,
            phone: loginResult.phone,
            email: loginResult.email,
            avatarUrl: loginResult.avatarUrl,
            profile: loginResult.profile,
            ctime: loginResult.ctime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            id: loginResult.userId,
            username: loginResult.username,
            nickname: loginResult.username, // 使用username作为nickname
            email: loginResult.email || '',
            phone: loginResult.phone || '',
            avatar: processAvatarPath(loginResult.avatarUrl), // 使用工具函数处理头像路径
            bio: loginResult.profile,
            createdAt: loginResult.ctime ? new Date(loginResult.ctime) : new Date(),
            lastLoginAt: new Date()
          };

          // 更新userStore状态
          const { setUser, setUserStats } = useUserStore.getState();
          setUser(userInfo);
          
          // 设置默认的用户统计信息
          setUserStats({
            followingCount: 0,
            followersCount: 0,
            postsCount: 0,
            viewsCount: 0
          });

          // 显示成功消息
          alert('登录成功！');

          // 关闭对话框
          onClose();

          // 不需要刷新页面，因为状态已经更新
          console.log('✅ 登录成功，用户信息已更新到状态管理');

        } catch (error: any) {
          console.error("登录失败:", error);
          alert(error.message || '登录失败，请稍后重试');
        }
      },

      /**
       * 处理注册
       */
      handleRegister: async () => {
        try {
          // 验证输入
          if (!formData.phone || !formData.password) {
            alert('请输入手机号和密码');
            return;
          }

          console.log("注册信息:", { 
            phone: formData.phone, 
            password: formData.password 
          });

          // 调用注册API
          const registerResult = await registerApi({
            phoneOrEmail: formData.phone,
            password: formData.password,
            repassword: formData.password
          });

          console.log("注册成功:", registerResult);

          // 保存登录信息到localStorage
          localStorage.setItem('accessToken', registerResult.accessToken);
          localStorage.setItem('tokenType', registerResult.tokenType);
          localStorage.setItem('userInfo', JSON.stringify({
            userId: registerResult.userId,
            username: registerResult.username,
            phone: registerResult.phone,
            email: registerResult.email,
            avatarUrl: registerResult.avatarUrl,
            profile: registerResult.profile,
            ctime: registerResult.ctime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            id: registerResult.userId,
            username: registerResult.username,
            nickname: registerResult.username, // 使用username作为nickname
            email: registerResult.email || '',
            phone: registerResult.phone || '',
            avatar: processAvatarPath(registerResult.avatarUrl), // 使用工具函数处理头像路径
            bio: registerResult.profile,
            createdAt: registerResult.ctime ? new Date(registerResult.ctime) : new Date(),
            lastLoginAt: new Date()
          };

          // 更新userStore状态
          const { setUser, setUserStats } = useUserStore.getState();
          setUser(userInfo);
          
          // 设置默认的用户统计信息
          setUserStats({
            followingCount: 0,
            followersCount: 0,
            postsCount: 0,
            viewsCount: 0
          });

          // 显示成功消息
          alert('注册成功！现在可以设置头像和昵称');

          // 进入头像设置步骤
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.AVATAR,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );

        } catch (error: any) {
          console.error("注册失败:", error);
          alert(error.message || '注册失败，请稍后重试');
        }
      },

      /**
       * 处理发送验证码
       */
      handleSendCode: async () => {
        try {
          // 验证邮箱格式
          if (!formData.phone) {
            alert('请输入邮箱地址');
            return;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.phone)) {
            alert('请输入有效的邮箱地址');
            return;
          }

          console.log("发送验证码到:", formData.phone);

          // 调用发送验证码API
          const result = await sendResetCodeApi({ email: formData.phone });
          
          console.log("验证码发送成功:", result);
          alert('验证码已发送到您的邮箱，请查收');

        } catch (error: any) {
          console.error("发送验证码失败:", error);
          alert(error.message || '发送验证码失败，请稍后重试');
        }
      },

      /**
       * 处理重置密码
       */
      handleResetPassword: async () => {
        try {
          // 验证输入
          if (!formData.phone || !formData.verificationCode || !formData.newPassword) {
            alert('请填写完整的重置密码信息');
            return;
          }

          console.log("重置密码:", { 
            email: formData.phone, 
            verificationCode: formData.verificationCode, 
            newPassword: formData.newPassword 
          });

          // 调用重置密码API
          const result = await resetPasswordApi({
            email: formData.phone,
            code: formData.verificationCode,
            newPassword: formData.newPassword
          });

          console.log("密码重置成功:", result);
          alert('密码重置成功，请使用新密码登录');

          // 返回登录页面
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.LOGIN,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );

        } catch (error: any) {
          console.error("重置密码失败:", error);
          alert(error.message || '重置密码失败，请稍后重试');
        }
      },

      /**
       * 处理头像上传
       */
      handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          // 验证文件
          const validation = validateAvatarFile(file);
          if (!validation.valid) {
            alert(validation.message);
            return;
          }

          // 压缩并处理头像
          compressAvatar(file)
            .then((compressedDataUrl) => {
              setters.setAvatar(compressedDataUrl);
            })
            .catch((error) => {
              console.error('头像压缩失败:', error);
              alert('头像处理失败，请重试');
            });
        }
      },

      /**
       * 处理头像提交
       */
      handleAvatarSubmit: async () => {
        try {
          console.log("提交头像和昵称:", { 
            nickname: formData.nickname, 
            avatar: formData.avatar 
          });

          // 调用更新资料API
          const updatedUser = await updateAvatarAndUsernameApi({
            username: formData.nickname || undefined,
            avatarUrl: formData.avatar || undefined
          });

          console.log("资料更新成功:", updatedUser);

          // 更新userStore中的用户信息
          const { user, setUser } = useUserStore.getState();
          if (user) {
            const updatedUserInfo: User = {
              ...user,
              username: updatedUser.username || user.username,
              nickname: updatedUser.username || user.nickname,
              avatar: processAvatarPath(updatedUser.avatarUrl) || user.avatar
            };
            setUser(updatedUserInfo);

            // 同时更新localStorage中的用户信息
            const userInfoStr = localStorage.getItem('userInfo');
            if (userInfoStr) {
              const userInfo = JSON.parse(userInfoStr);
              userInfo.username = updatedUser.username || userInfo.username;
              userInfo.avatarUrl = updatedUser.avatarUrl || userInfo.avatarUrl;
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }
          }

          // 显示成功消息
          alert('头像和昵称更新成功！');

          // 进入标签选择步骤
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.TAGS,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );

        } catch (error: any) {
          console.error("更新资料失败:", error);
          alert(error.message || '更新资料失败，请稍后重试');
        }
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
        alert('设置完成！欢迎使用我们的平台');
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
          alert('设置完成！欢迎使用我们的平台');
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