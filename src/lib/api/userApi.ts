/**
 * @file 用户API模块
 * @description 提供用户相关的API调用函数
 */

import { post, get } from "@/lib/utils/request";
import request from "@/lib/utils/request";
import { useUserStore } from "@/store/userStore";
import type {
  LoginVO,
  LoginRequest,
  RegisterWithCodeRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  GetUserInfoRequest,
  User,
  ApiResponse,
  UpdateAvatarAndUsernameAndProfileRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  UpdatePrivacySettingsRequest,
  PrivacySettings,
} from "@/types/userTypes";

/**
 * 设置认证Cookie
 *
 * @param {string} token - JWT令牌
 * @param {number} expiresIn - 过期时间（秒）
 */
function setAuthCookie(token: string, expiresIn: number): void {
  if (typeof document === "undefined") {
    return; // 服务端渲染时跳过
  }

  // 计算过期日期
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + expiresIn * 1000);

  // 设置Cookie（与后端常量COOKIE_AUTH_FIELD保持一致）
  // 注意：不设置domain，让Cookie在当前域名下生效
  document.cookie = `Authorization=${token}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`;

  console.log("已设置认证Cookie，过期时间:", expireDate);
  console.log("当前域名:", window.location.hostname);
  console.log(
    "Cookie设置:",
    `Authorization=${token}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`
  );
}

/**
 * 清除认证Cookie
 */
function clearAuthCookie(): void {
  if (typeof document === "undefined") {
    return; // 服务端渲染时跳过
  }

  // 清除Cookie时也不设置domain
  document.cookie =
    "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
  console.log("已清除认证Cookie");
}

/**
 * 用户登录API
 *
 * 支持手机号或邮箱登录
 *
 * @async
 * @param {LoginRequest} params - 登录参数
 * @returns {Promise<LoginVO>} 登录响应数据（包含JWT令牌）
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 使用手机号登录
 * const loginResult = await loginUserApi({
 *   phoneOrEmail: '13800138000',
 *   password: 'password123'
 * });
 *
 * // 使用邮箱登录
 * const loginResult = await loginUserApi({
 *   phoneOrEmail: 'user@example.com',
 *   password: 'password123'
 * });
 */
export async function loginUserApi(params: LoginRequest): Promise<LoginVO> {
  try {
    console.log("登录参数:", params);

    // 转换为下划线格式
    const requestData = {
      phone_or_email: params.phoneOrEmail,
      password: params.password,
    };

    const response: ApiResponse<LoginVO> = await post(
      "/user/login",
      requestData
    );
    console.log("登录响应:", response);

    if (response.code === 0) {
      // 登录成功后设置Cookie
      setAuthCookie(response.data.accessToken, response.data.expiresIn);
      return response.data;
    } else {
      throw new Error(response.message || "登录失败");
    }
  } catch (error: any) {
    console.error("登录失败:", error);
    throw new Error(error.message || "登录失败，请稍后重试");
  }
}

/**
 * 统一发送邮箱验证码API
 *
 * 根据类型发送不同用途的邮箱验证码
 *
 * @async
 * @param {string} email - 邮箱地址
 * @param {number} type - 验证码类型：1-注册，2-重置密码，3-修改邮箱
 * @returns {Promise<string>} 发送结果消息
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 发送注册验证码
 * await sendUnifiedEmailCodeApi('user@example.com', 1);
 *
 * // 发送密码重置验证码
 * await sendUnifiedEmailCodeApi('user@example.com', 2);
 *
 * // 发送邮箱修改验证码
 * await sendUnifiedEmailCodeApi('user@example.com', 3);
 */
export async function sendUnifiedEmailCodeApi(
  email: string,
  type: number
): Promise<string> {
  try {
    console.log("发送统一邮箱验证码参数:", { email, type });

    const response: ApiResponse<string> = await post(
      "/user/send-unified-email-code",
      { email, type }
    );
    console.log("发送统一邮箱验证码响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "发送验证码失败");
    }
  } catch (error: any) {
    console.error("发送统一邮箱验证码失败:", error);
    throw new Error(error.message || "发送验证码失败，请稍后重试");
  }
}

/**
 * 重置密码API
 *
 * 使用验证码重置用户密码，支持手机号/邮箱
 *
 * @async
 * @param {ResetPasswordRequest} params - 重置密码参数
 * @returns {Promise<string>} 重置结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function resetPasswordApi(
  params: ResetPasswordRequest
): Promise<string> {
  try {
    console.log("resetPasswordApi - 开始处理重置密码请求");
    console.log("接收到的参数:", params);

    // 转换为下划线格式
    const requestData = {
      phone_or_email: params.phoneOrEmail,
      code: params.code,
      new_password: params.newPassword,
    };
    console.log("发送给后端的数据:", {
      ...requestData,
      new_password: requestData.new_password ? "***" : requestData.new_password,
    });

    const response: ApiResponse<string> = await post(
      "/user/reset-password",
      requestData
    );

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "重置密码失败");
    }
  } catch (error: any) {
    console.error("重置密码失败:", error);
    throw new Error(error.message || "重置密码失败，请稍后重试");
  }
}

/**
 * 获取用户信息API
 *
 * 根据用户ID获取用户详细信息
 *
 * @async
 * @param {GetUserInfoRequest} params - 获取用户信息参数
 * @returns {Promise<User>} 用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getUserInfoApi(
  params: GetUserInfoRequest
): Promise<User> {
  try {
    console.log("获取用户信息参数:", params);

    const response: ApiResponse<User> = await get("/user/info", {
      user_id: params.userId,
    });
    console.log("获取用户信息响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "获取用户信息失败");
    }
  } catch (error: any) {
    console.error("获取用户信息失败:", error);
    throw new Error(error.message || "获取用户信息失败，请稍后重试");
  }
}

/**
 * 刷新JWT令牌API
 *
 * 使用当前令牌获取新的JWT令牌
 *
 * @async
 * @param {RefreshTokenRequest} params - 刷新令牌参数
 * @returns {Promise<LoginVO>} 新的登录响应数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function refreshTokenApi(
  params: RefreshTokenRequest
): Promise<LoginVO> {
  try {
    console.log("刷新令牌请求");

    const response: ApiResponse<LoginVO> = await request({
      url: "/user/refresh-token",
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    });

    console.log("刷新令牌响应:", response);

    if (response.code === 0) {
      // 刷新成功后更新Cookie
      setAuthCookie(response.data.accessToken, response.data.expiresIn);
      return response.data;
    } else {
      throw new Error(response.message || "刷新令牌失败");
    }
  } catch (error: any) {
    console.error("刷新令牌失败:", error);
    throw new Error(error.message || "刷新令牌失败，请重新登录");
  }
}

/**
 * 更新用户头像、昵称和个人简介API
 *
 * @async
 * @param {UpdateAvatarAndUsernameAndProfileRequest} params - 更新参数
 * @returns {Promise<User>} 更新后的用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function updateAvatarAndUsernameAndProfileApi(
  params: UpdateAvatarAndUsernameAndProfileRequest
): Promise<User> {
  try {
    console.log("更新用户资料参数:", params);

    // 创建 FormData 对象
    const formData = new FormData();
    if (params.username) {
      formData.append('username', params.username);
    }
    if (params.avatar) {
      formData.append('avatar', params.avatar);
    }
    if (params.profile) {
      formData.append('profile', params.profile);
    }

    const response: ApiResponse<User> = await post(
      "/forum/user/update-avatar-username-profile",
      formData
    );
    
    console.log("更新用户资料响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "更新用户资料失败");
    }
  } catch (error: any) {
    console.error("更新用户资料失败:", error);
    throw new Error(error.message || "更新用户资料失败，请稍后重试");
  }
}

/**
 * 修改密码API
 *
 * 修改用户登录密码
 *
 * @async
 * @param {ChangePasswordRequest} params - 修改密码参数
 * @returns {Promise<string>} 修改结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function changePasswordApi(
  params: ChangePasswordRequest
): Promise<string> {
  try {
    console.log("修改密码请求");

    // 获取当前用户ID
    const userStore = useUserStore.getState();
    if (!userStore.user?.userId) {
      throw new Error("用户未登录");
    }

    // 转换为下划线格式
    const requestData = {
      user_id: userStore.user.userId,
      current_password: params.currentPassword,
      new_password: params.newPassword,
      new_password_confirm: params.newPasswordConfirm,
    };

    const response: ApiResponse<string> = await post(
      "/user/change-password",
      requestData
    );
    console.log("修改密码响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "修改密码失败");
    }
  } catch (error: any) {
    console.error("修改密码失败:", error);
    throw new Error(error.message || "修改密码失败，请稍后重试");
  }
}

/**
 * 发送手机验证码API
 *
 * 发送手机验证码
 *
 * @async
 * @param {string} phone - 手机号
 * @param {number} type - 验证码类型
 * @returns {Promise<string>} 发送结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function sendPhoneCodeApi(
  phone: string,
  type: number
): Promise<string> {
  try {
    console.log("发送手机验证码参数:", { phone, type });

    const response: ApiResponse<string> = await post(
      "/user/send-unified-phone-code",
      { phone, type }
    );
    console.log("发送手机验证码响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "发送验证码失败");
    }
  } catch (error: any) {
    console.error("发送手机验证码失败:", error);
    throw new Error(error.message || "发送验证码失败，请稍后重试");
  }
}

/**
 * 修改手机号API
 *
 * 修改用户手机号
 *
 * @async
 * @param {Object} data - 修改手机号数据
 * @returns {Promise<string>} 修改结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function changePhoneApi(data: {
  currentPhone: string;
  newPhone: string;
  verificationCode: string;
}): Promise<string> {
  try {
    console.log("修改手机号请求");

    // 获取当前用户ID
    const userStore = useUserStore.getState();
    if (!userStore.user?.userId) {
      throw new Error("用户未登录");
    }

    // 转换为下划线格式
    const requestData = {
      user_id: userStore.user.userId,
      current_phone: data.currentPhone,
      new_phone: data.newPhone,
      verification_code: data.verificationCode,
    };

    const response: ApiResponse<string> = await post(
      "/user/change-phone",
      requestData
    );
    console.log("修改手机号响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "修改手机号失败");
    }
  } catch (error: any) {
    console.error("修改手机号失败:", error);
    throw new Error(error.message || "修改手机号失败，请稍后重试");
  }
}

/**
 * 修改邮箱API
 *
 * 修改用户邮箱地址
 *
 * @async
 * @param {ChangeEmailRequest} params - 修改邮箱参数
 * @returns {Promise<string>} 修改结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function changeEmailApi(
  params: ChangeEmailRequest
): Promise<string> {
  try {
    console.log("修改邮箱请求");

    // 转换为下划线格式
    const requestData = {
      user_id: params.userId,
      email: params.email,
      verification_code: params.verificationCode,
    };

    const response: ApiResponse<string> = await post(
      "/user/change-email",
      requestData
    );
    console.log("修改邮箱响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "修改邮箱失败");
    }
  } catch (error: any) {
    console.error("修改邮箱失败:", error);
    throw new Error(error.message || "修改邮箱失败，请稍后重试");
  }
}

/**
 * 用户注册API（验证码注册）
 *
 * 使用验证码进行用户注册
 *
 * @async
 * @param {RegisterWithCodeRequest} params - 注册参数
 * @returns {Promise<LoginVO>} 注册响应数据（包含JWT令牌）
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function registerWithCodeApi(
  params: RegisterWithCodeRequest
): Promise<LoginVO> {
  try {
    console.log("注册参数:", params);

    // 转换为下划线格式
    const requestData = {
      phone_or_email: params.phoneOrEmail,
      password: params.password,
      verification_code: params.verificationCode,
    };

    const response: ApiResponse<LoginVO> = await post(
      "/user/register-with-code",
      requestData
    );
    console.log("注册响应:", response);

    if (response.code === 0) {
      // 注册成功后设置Cookie
      setAuthCookie(response.data.accessToken, response.data.expiresIn);
      return response.data;
    } else {
      throw new Error(response.message || "注册失败");
    }
  } catch (error: any) {
    console.error("注册失败:", error);
    throw new Error(error.message || "注册失败，请稍后重试");
  }
}

/**
 * 更新隐私设置API
 *
 * 更新用户的隐私设置
 *
 * @async
 * @param {UpdatePrivacySettingsRequest} params - 隐私设置参数
 * @returns {Promise<PrivacySettings>} 更新后的隐私设置
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function updatePrivacySettingsApi(
  params: UpdatePrivacySettingsRequest
): Promise<PrivacySettings> {
  try {
    console.log("更新隐私设置参数:", params);

    // 转换为下划线格式
    const requestData = {
      user_id: params.userId,
      show_email: params.showEmail,
      show_phone: params.showPhone,
      allow_friend_requests: params.allowFriendRequests,
    };

    const response: ApiResponse<PrivacySettings> = await post(
      "/user/update-privacy-settings",
      requestData
    );
    console.log("更新隐私设置响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "更新隐私设置失败");
    }
  } catch (error: any) {
    console.error("更新隐私设置失败:", error);
    throw new Error(error.message || "更新隐私设置失败，请稍后重试");
  }
}

/**
 * 获取隐私设置API
 *
 * 获取用户的隐私设置
 *
 * @async
 * @returns {Promise<PrivacySettings>} 隐私设置数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getPrivacySettingsApi(): Promise<PrivacySettings> {
  try {
    console.log("获取隐私设置请求");

    const response: ApiResponse<PrivacySettings> = await get(
      "/user/privacy-settings"
    );
    console.log("获取隐私设置响应:", response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "获取隐私设置失败");
    }
  } catch (error: any) {
    console.error("获取隐私设置失败:", error);
    throw new Error(error.message || "获取隐私设置失败，请稍后重试");
  }
}

/**
 * 用户登出API
 *
 * 清除用户登录状态和认证信息
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function logoutUserApi(): Promise<void> {
  try {
    console.log("用户登出请求");

    // 清除认证Cookie
    clearAuthCookie();

    // 清除用户状态
    const userStore = useUserStore.getState();
    userStore.logout();

    console.log("用户登出成功");
  } catch (error: any) {
    console.error("用户登出失败:", error);
    throw new Error(error.message || "登出失败，请稍后重试");
  }
}
