/**
 * @file 登录对话框工具方法
 * @description 包含登录对话框的所有业务逻辑处理方法
 */

import { 
  AuthStep, 
  AnimationDirection, 
  DialogHandlersConfig, 
  DialogHandlers 
} from "@/types/loginDialogType";
import { loginUserApi, updateAvatarAndUsernameAndProfileApi, sendUnifiedEmailCodeApi, resetPasswordApi, registerWithCodeApi, sendPhoneCodeApi } from "@/lib/api/userApi";
import { useUserStore } from "@/store/userStore";
import { TokenManager } from "@/lib/utils/tokenManager";
import type { UserInfo as User } from "@/types/userType";
import { processAvatarPath, validateAvatarFile } from "@/lib/utils/avatarUtils";
import { getCategoryListWithCacheApi } from "@/lib/api/categoryApi";
import type { Category } from "@/types/categoryType";

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

          // 使用TokenManager保存令牌信息（会自动启动定时器）
          TokenManager.saveToken({
            accessToken: loginResult.accessToken,
            tokenType: loginResult.tokenType,
            expiresIn: loginResult.expiresIn
          });

          // 保存用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            userId: loginResult.userId,
            username: loginResult.username,
            phone: loginResult.phone,
            email: loginResult.email,
            avatarUrl: loginResult.avatarUrl,
            profile: loginResult.profile,
            ctime: loginResult.ctime,
            mtime: loginResult.mtime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            userId: loginResult.userId,
            username: loginResult.username,
            nickname: loginResult.username, // 使用username作为nickname
            email: loginResult.email || '',
            phone: loginResult.phone || '',
            avatar: processAvatarPath(loginResult.avatarUrl), // 使用工具函数处理头像路径
            bio: loginResult.profile,
            createdAt: loginResult.ctime ? new Date(loginResult.ctime) : new Date(),
            lastLoginAt: new Date(),
            updatedAt: loginResult.mtime ? new Date(loginResult.mtime) : undefined
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
            alert('请输入手机号/邮箱和密码');
            return;
          }

          // 判断是否为邮箱或手机号
          const isEmail = formData.phone.includes('@');
          const isPhoneNumber = /^1[3-9]\d{9}$/.test(formData.phone);
          
          // 验证码是必需的
          if (!formData.registerVerificationCode) {
            alert('注册需要验证码，请先发送验证码');
            return;
          }

          // 必须是有效的邮箱或手机号
          if (!isEmail && !isPhoneNumber) {
            alert('请输入有效的邮箱地址或手机号');
            return;
          }

          console.log("注册信息:", { 
            phone: formData.phone, 
            password: formData.password,
            verificationCode: formData.registerVerificationCode,
            isEmail: isEmail,
            isPhoneNumber: isPhoneNumber
          });

          // 带验证码的注册（邮箱或手机号）
          const registerResult = await registerWithCodeApi({
            phoneOrEmail: formData.phone,
            password: formData.password,
            verificationCode: formData.registerVerificationCode
          });

          console.log("注册成功:", registerResult);

          // 使用TokenManager保存令牌信息（会自动启动定时器）
          TokenManager.saveToken({
            accessToken: registerResult.accessToken,
            tokenType: registerResult.tokenType,
            expiresIn: registerResult.expiresIn
          });

          // 保存用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            userId: registerResult.userId,
            username: registerResult.username,
            phone: registerResult.phone,
            email: registerResult.email,
            avatarUrl: registerResult.avatarUrl,
            profile: registerResult.profile,
            ctime: registerResult.ctime,
            mtime: registerResult.mtime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            userId: registerResult.userId,
            username: registerResult.username,
            nickname: registerResult.username, // 使用username作为nickname
            email: registerResult.email || '',
            phone: registerResult.phone || '',
            avatar: processAvatarPath(registerResult.avatarUrl), // 使用工具函数处理头像路径
            bio: registerResult.profile,
            createdAt: registerResult.ctime ? new Date(registerResult.ctime) : new Date(),
            lastLoginAt: new Date(),
            updatedAt: registerResult.mtime ? new Date(registerResult.mtime) : undefined
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
       * 处理邮箱注册
       */
      handleEmailRegister: async () => {
        try {
          // 验证输入
          if (!formData.email || !formData.password || !formData.registerVerificationCode) {
            alert('请填写完整的邮箱注册信息');
            return;
          }

          // 验证邮箱格式
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            alert('请输入有效的邮箱地址');
            return;
          }

          console.log("邮箱注册信息:", { 
            email: formData.email, 
            password: formData.password,
            verificationCode: formData.registerVerificationCode
          });

          // 带验证码的邮箱注册
          const registerResult = await registerWithCodeApi({
            phoneOrEmail: formData.email,
            password: formData.password,
            verificationCode: formData.registerVerificationCode
          });

          console.log("邮箱注册成功:", registerResult);

          // 使用TokenManager保存令牌信息（会自动启动定时器）
          TokenManager.saveToken({
            accessToken: registerResult.accessToken,
            tokenType: registerResult.tokenType,
            expiresIn: registerResult.expiresIn
          });

          // 保存用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            userId: registerResult.userId,
            username: registerResult.username,
            phone: registerResult.phone,
            email: registerResult.email,
            avatarUrl: registerResult.avatarUrl,
            profile: registerResult.profile,
            ctime: registerResult.ctime,
            mtime: registerResult.mtime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            userId: registerResult.userId,
            username: registerResult.username,
            nickname: registerResult.username,
            email: registerResult.email || '',
            phone: registerResult.phone || '',
            avatar: processAvatarPath(registerResult.avatarUrl),
            bio: registerResult.profile,
            createdAt: registerResult.ctime ? new Date(registerResult.ctime) : new Date(),
            lastLoginAt: new Date(),
            updatedAt: registerResult.mtime ? new Date(registerResult.mtime) : undefined
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
          alert('邮箱注册成功！现在可以设置头像和昵称');

          // 进入头像设置步骤
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.AVATAR,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );

        } catch (error: any) {
          console.error("邮箱注册失败:", error);
          alert(error.message || '邮箱注册失败，请稍后重试');
        }
      },

      /**
       * 处理手机号注册
       */
      handlePhoneRegister: async () => {
        try {
          // 验证输入
          if (!formData.phone || !formData.password || !formData.registerVerificationCode) {
            alert('请填写完整的手机号注册信息');
            return;
          }

          // 验证手机号格式
          const phoneRegex = /^1[3-9]\d{9}$/;
          if (!phoneRegex.test(formData.phone)) {
            alert('请输入有效的手机号');
            return;
          }

          console.log("手机号注册信息:", { 
            phone: formData.phone, 
            password: formData.password,
            verificationCode: formData.registerVerificationCode
          });

          // 带验证码的手机号注册
          const registerResult = await registerWithCodeApi({
            phoneOrEmail: formData.phone,
            password: formData.password,
            verificationCode: formData.registerVerificationCode
          });

          console.log("手机号注册成功:", registerResult);

          // 使用TokenManager保存令牌信息（会自动启动定时器）
          TokenManager.saveToken({
            accessToken: registerResult.accessToken,
            tokenType: registerResult.tokenType,
            expiresIn: registerResult.expiresIn
          });

          // 保存用户信息到localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            userId: registerResult.userId,
            username: registerResult.username,
            phone: registerResult.phone,
            email: registerResult.email,
            avatarUrl: registerResult.avatarUrl,
            profile: registerResult.profile,
            ctime: registerResult.ctime,
            mtime: registerResult.mtime
          }));

          // 转换LoginVO为User格式并保存到userStore
          const userInfo: User = {
            userId: registerResult.userId,
            username: registerResult.username,
            nickname: registerResult.username,
            email: registerResult.email || '',
            phone: registerResult.phone || '',
            avatar: processAvatarPath(registerResult.avatarUrl),
            bio: registerResult.profile,
            createdAt: registerResult.ctime ? new Date(registerResult.ctime) : new Date(),
            lastLoginAt: new Date(),
            updatedAt: registerResult.mtime ? new Date(registerResult.mtime) : undefined
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
          alert('手机号注册成功！现在可以设置头像和昵称');

          // 进入头像设置步骤
          this.switchToStepWithAnimation(
            currentStep,
            AuthStep.AVATAR,
            setCurrentStep,
            setIsSliding,
            setSlideDirection
          );

        } catch (error: any) {
          console.error("手机号注册失败:", error);
          alert(error.message || '手机号注册失败，请稍后重试');
        }
      },

      /**
       * 处理发送注册验证码
       */
      handleSendRegisterCode: async () => {
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

          console.log("发送注册验证码到:", formData.phone);

          // 调用发送注册验证码API (type=1表示注册)
          const result = await sendUnifiedEmailCodeApi(formData.phone, 1);
          
          console.log("注册验证码发送成功:", result);
          alert('验证码已发送到您的邮箱，请查收');

        } catch (error: any) {
          console.error("发送注册验证码失败:", error);
          
          // 检查是否是"验证码已发送"类型的错误
          if (error.message && error.message.includes('验证码已发送')) {
            // 对于这种情况，提示用户检查邮箱，但不阻止倒计时
            alert('验证码已发送到您的邮箱，请查收！如未收到，请稍后重试');
            return; // 不抛出异常，让调用方开始倒计时
          }
          
          // 其他类型的错误才抛出异常
          throw error;
        }
      },

      /**
       * 处理发送验证码
       */
      handleSendCode: async () => {
        try {
          // 验证输入
          if (!formData.phone) {
            alert('请输入手机号或邮箱');
            return;
          }

          // 判断是邮箱还是手机号
          const isEmail = formData.phone.includes('@');
          const isPhone = /^1[3-9]\d{9}$/.test(formData.phone);

          if (!isEmail && !isPhone) {
            alert('请输入有效的手机号或邮箱地址');
            return;
          }

          console.log("发送验证码到:", formData.phone, "类型:", isEmail ? "邮箱" : "手机号");

          if (isEmail) {
            // 发送邮箱验证码
            const result = await sendUnifiedEmailCodeApi(formData.phone, 2); // type=2表示密码重置
            console.log("邮箱验证码发送成功:", result);
            alert('验证码已发送到您的邮箱，请查收');
          } else {
            // 发送手机验证码
            const result = await sendPhoneCodeApi(formData.phone, 2); // type=2表示密码重置
            console.log("手机验证码发送成功:", result);
            alert('验证码已发送到您的手机，请查收');
          }

        } catch (error: any) {
          console.error("发送验证码失败:", error);
          
          // 检查是否是"验证码已发送"类型的错误
          if (error.message && error.message.includes('验证码已发送')) {
            // 判断是邮箱还是手机号
            const isEmail = formData.phone.includes('@');
            const target = isEmail ? '邮箱' : '手机';
            alert(`验证码已发送到您的${target}，请查收！如未收到，请稍后重试`);
            return; // 不抛出异常，让调用方开始倒计时
          }
          
          // 其他类型的错误才抛出异常
          throw error;
        }
      },

      /**
       * 处理重置密码
       */
      handleResetPassword: async () => {
        try {
          console.log("🔍 开始重置密码流程");
          console.log("📋 当前表单数据:", {
            phone: formData.phone,
            verificationCode: formData.verificationCode,
            newPassword: formData.newPassword ? "已填写" : "未填写"
          });

          // 验证输入
          if (!formData.phone || !formData.verificationCode || !formData.newPassword) {
            console.log("❌ 验证失败: 必填字段为空");
            alert('请填写完整的重置密码信息');
            return;
          }

          // 判断是邮箱还是手机号
          const isEmail = formData.phone.includes('@');
          const isPhone = /^1[3-9]\d{9}$/.test(formData.phone);

          if (!isEmail && !isPhone) {
            console.log("❌ 验证失败: 格式不正确");
            alert('请输入有效的手机号或邮箱地址');
            return;
          }

          console.log("✅ 验证通过:", { 
            phoneOrEmail: formData.phone, 
            verificationCode: formData.verificationCode, 
            newPassword: "***",
            type: isEmail ? "邮箱" : "手机号"
          });

          console.log("🚀 调用重置密码API...");
          
          // 构造API参数
          const apiParams = {
            phoneOrEmail: formData.phone,
            code: formData.verificationCode,
            newPassword: formData.newPassword
          };
          
          console.log("📤 准备发送的API参数:", {
            phoneOrEmail: apiParams.phoneOrEmail,
            phoneOrEmailType: typeof apiParams.phoneOrEmail,
            phoneOrEmailLength: apiParams.phoneOrEmail?.length,
            code: apiParams.code,
            codeType: typeof apiParams.code,
            codeLength: apiParams.code?.length,
            newPassword: apiParams.newPassword ? '***' : '未提供',
            newPasswordType: typeof apiParams.newPassword,
            newPasswordLength: apiParams.newPassword?.length
          });
          
          // 调用重置密码API
          const result = await resetPasswordApi(apiParams);

          console.log("✅ 密码重置成功:", result);
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
          console.error("❌ 重置密码失败:", error);
          console.error("❌ 错误详情:", {
            message: error.message,
            stack: error.stack
          });
          alert(error.message || '重置密码失败，请稍后重试');
        }
      },

      /**
       * 处理头像上传 - 尝试获取最完整的路径信息
       */
      handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          try {
            // 验证文件
            const validation = validateAvatarFile(file);
            if (!validation.valid) {
              alert(validation.message);
              return;
            }

            // 创建文件的本地预览URL（用于显示）
            const fileURL = URL.createObjectURL(file);
            
            // 尝试获取文件路径信息（受浏览器安全限制）
            const pathInfo = {
              // 标准File API属性
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified,
              
              // 相对路径（如果是文件夹上传）
              webkitRelativePath: file.webkitRelativePath || '',
              
              // 尝试从文件名提取路径信息
              fullName: file.name,
              fileName: file.name.split('/').pop() || file.name,
              directory: file.name.includes('/') ? file.name.substring(0, file.name.lastIndexOf('/')) : '',
              
              // 预览URL
              previewURL: fileURL,
              
              // 注意：出于安全考虑，浏览器不允许获取真实的绝对路径
              // 真实路径类似：C:\Users\Username\Documents\image.jpg
              // 但JavaScript无法访问这些信息
              absolutePath: '无法获取（浏览器安全限制）'
            };
            
            // 如果是通过文件夹选择器上传的，webkitRelativePath可能包含部分路径
            let pathToUse = file.name;
            if (file.webkitRelativePath) {
              pathToUse = file.webkitRelativePath;
              console.log('检测到文件夹上传，相对路径:', file.webkitRelativePath);
            }
            
            // 设置头像路径
            setters.setAvatar(pathToUse);
            
            console.log('📁 文件路径信息:', pathInfo);
            console.log('🎯 使用的路径:', pathToUse);
            console.log('⚠️  注意：浏览器安全限制，无法获取文件的真实绝对路径');
            
            // 如果您需要绝对路径，可能需要考虑以下方案：
            // 1. 使用Electron等桌面应用框架
            // 2. 让用户手动输入路径
            // 3. 使用服务器端的文件选择器

          } catch (error: any) {
            console.error('头像处理失败:', error);
            alert(error.message || '头像处理失败，请重试');
          }
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

          // 获取当前用户ID
          const { user: currentUser } = useUserStore.getState();
          if (!currentUser?.userId) {
            throw new Error('用户未登录');
          }

          // 调用更新资料API
          const updatedUser = await updateAvatarAndUsernameAndProfileApi({
            userId: currentUser.userId,
            username: formData.nickname || undefined,
            avatarUrl: formData.avatar || undefined,
            profile: formData.bio || undefined
          });

          console.log("资料更新成功:", updatedUser);

          // 更新userStore中的用户信息
          const { user, setUser } = useUserStore.getState();
          if (user) {
            const updatedUserInfo: User = {
              ...user,
              username: updatedUser.username || user.username,
              nickname: updatedUser.username || user.nickname,
              avatar: processAvatarPath(updatedUser.avatarUrl) || user.avatar,
              bio: updatedUser.profile || user.bio
            };
            setUser(updatedUserInfo);

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

      /**
       * 处理发送邮箱验证码
       */
      handleSendEmailCode: async () => {
        try {
          // 验证邮箱格式
          if (!formData.email) {
            alert('请输入邮箱地址');
            return;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            alert('请输入有效的邮箱地址');
            return;
          }

          console.log("发送邮箱验证码到:", formData.email);

          // 调用发送邮箱验证码API (type=1表示注册)
          const result = await sendUnifiedEmailCodeApi(formData.email, 1);
          
          console.log("邮箱验证码发送成功:", result);
          alert('验证码已发送到您的邮箱，请查收');

        } catch (error: any) {
          console.error("发送邮箱验证码失败:", error);
          
          // 检查是否是"验证码已发送"类型的错误
          if (error.message && error.message.includes('验证码已发送')) {
            // 对于这种情况，提示用户检查邮箱，但不阻止倒计时
            alert('验证码已发送到您的邮箱，请查收！如未收到，请稍后重试');
            return; // 不抛出异常，让调用方开始倒计时
          }
          
          // 其他类型的错误才抛出异常
          throw error;
        }
      },

      /**
       * 处理发送手机验证码
       */
      handleSendPhoneCode: async () => {
        try {
          // 验证手机号格式
          if (!formData.phone) {
            alert('请输入手机号');
            return;
          }

          const phoneRegex = /^1[3-9]\d{9}$/;
          if (!phoneRegex.test(formData.phone)) {
            alert('请输入有效的手机号');
            return;
          }

          console.log("发送手机验证码到:", formData.phone);

          // 调用发送手机验证码API (type=1表示注册)
          const result = await sendPhoneCodeApi(formData.phone, 1);
          
          console.log("手机验证码发送成功:", result);
          alert('验证码已发送到您的手机，请查收');

        } catch (error: any) {
          console.error("发送手机验证码失败:", error);
          
          // 检查是否是"验证码已发送"类型的错误
          if (error.message && error.message.includes('验证码已发送')) {
            // 对于这种情况，提示用户检查手机，但不阻止倒计时
            alert('验证码已发送到您的手机，请查收！如未收到，请稍后重试');
            return; // 不抛出异常，让调用方开始倒计时
          }
          
          // 其他类型的错误才抛出异常
          throw error;
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
    const stepOrder = [AuthStep.LOGIN, AuthStep.EMAIL_REGISTER, AuthStep.PHONE_REGISTER, AuthStep.AVATAR, AuthStep.TAGS];
    const forgotPasswordStep = AuthStep.FORGOT_PASSWORD;
    
    // 忘记密码相关动画 - 只有内容滑动，不改变红白区域位置
    if (currentStep === AuthStep.LOGIN && targetStep === forgotPasswordStep) {
      return AnimationDirection.LEFT; // 登录 -> 忘记密码，内容向左滑出
    }
    if (currentStep === forgotPasswordStep && targetStep === AuthStep.LOGIN) {
      return AnimationDirection.RIGHT; // 忘记密码 -> 登录，内容向右滑出
    }
    
    // 登录和注册之间的切换 - 红白区域会移动，不需要内容动画
    if ((currentStep === AuthStep.LOGIN && (targetStep === AuthStep.EMAIL_REGISTER || targetStep === AuthStep.PHONE_REGISTER)) ||
        ((currentStep === AuthStep.EMAIL_REGISTER || currentStep === AuthStep.PHONE_REGISTER) && targetStep === AuthStep.LOGIN)) {
      return AnimationDirection.NONE; // 红白区域移动，不需要内容动画
    }
    
    // 邮箱注册和手机号注册之间的切换 - 红白区域位置不变，使用内容滑动
    if ((currentStep === AuthStep.EMAIL_REGISTER && targetStep === AuthStep.PHONE_REGISTER) ||
        (currentStep === AuthStep.PHONE_REGISTER && targetStep === AuthStep.EMAIL_REGISTER)) {
      return currentStep === AuthStep.EMAIL_REGISTER ? AnimationDirection.LEFT : AnimationDirection.RIGHT;
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
    // 登录和忘记密码都保持红色区域在左侧，避免红色区域移动
    return currentStep === AuthStep.LOGIN || currentStep === AuthStep.FORGOT_PASSWORD;
  }

  /**
   * 获取分类列表
   * 
   * 从API获取分类数据，用于用户注册时选择感兴趣的分类
   *
   * @async
   * @returns {Promise<Category[]>} 分类列表
   * @throws {Error} 当API请求失败时抛出错误
   * @example
   * // 获取分类列表
   * const categories = await LoginDialogUtils.getCategoriesApi();
   */
  static async getCategoriesApi(): Promise<Category[]> {
    try {
      console.log('正在获取分类列表...');
      const categories = await getCategoryListWithCacheApi();
      console.log('✅ 获取分类列表成功:', categories);
      return categories;
    } catch (error) {
      console.error('❌ 获取分类列表失败:', error);
      // 如果API失败，返回默认分类
      return this.getDefaultCategories();
    }
  }

  /**
   * 获取默认分类列表
   * 
   * 当API请求失败时使用的备用分类列表
   *
   * @returns {Category[]} 默认分类列表
   */
  static getDefaultCategories(): Category[] {
    return [
      { categoryId: 'default-life', categoryName: '生活' },
      { categoryId: 'default-photography', categoryName: '摄影' },
      { categoryId: 'default-travel', categoryName: '旅游' },
      { categoryId: 'default-food', categoryName: '美食' },
      { categoryId: 'default-technology', categoryName: '科技' },
      { categoryId: 'default-music', categoryName: '音乐' },
      { categoryId: 'default-sports', categoryName: '运动' },
    ];
  }

  /**
   * 获取可选标签列表（保留原有方法用于向后兼容）
   * 
   * @deprecated 建议使用 getCategoriesApi() 获取真实分类数据
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

  /**
   * 获取推荐标签列表
   * 
   * 用于帖子编辑时的标签推荐，可以是分类名称的扩展
   *
   * @returns {string[]} 推荐标签列表
   */
  static getRecommendedTags(): string[] {
    return [
      '日常', '生活记录', '心情', '分享',
      '风景', '人像', '街拍', '静物',
      '国内游', '出国', '自驾', '攻略',
      '家常菜', '甜品', '探店', '下厨',
      '数码', '软件', '编程', '科普',
      '流行', '古典', '民谣', '乐器',
      '健身', '跑步', '球类', '户外'
    ];
  }
} 