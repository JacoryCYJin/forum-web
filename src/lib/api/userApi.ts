/**
 * @file 用户API模块
 * @description 提供用户相关的API调用函数
 */

import { post, get } from '@/lib/utils/request';
import request from '@/lib/utils/request';
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
  PrivacySettings
} from '@/types/userType';

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
    console.log('登录参数:', params);

    // 直接发送JSON格式数据
    // const response: ApiResponse<LoginVO> = await post('/user/login', params);
    const response: ApiResponse<LoginVO> = await post('http://localhost:8080/user/login', params);
    console.log('登录响应:', response);
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '登录失败');
    }
  } catch (error: any) {
    console.error('登录失败:', error);
    throw new Error(error.message || '登录失败，请稍后重试');
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
export async function sendUnifiedEmailCodeApi(email: string, type: number): Promise<string> {
  try {
    console.log('发送统一邮箱验证码参数:', { email, type });

    // const response: ApiResponse<string> = await post('/user/send-unified-email-code', { email, type });
    const response: ApiResponse<string> = await post('http://localhost:8080/user/send-unified-email-code', { email, type });
    console.log('发送统一邮箱验证码响应:', response);
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '发送验证码失败');
    }
  } catch (error: any) {
    console.error('发送统一邮箱验证码失败:', error);
    throw new Error(error.message || '发送验证码失败，请稍后重试');
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
export async function resetPasswordApi(params: ResetPasswordRequest): Promise<string> {
  try {
    console.log('🔍 resetPasswordApi - 开始处理重置密码请求');
    console.log('📋 接收到的参数:', params);
    console.log('📋 参数详情:', { 
      phoneOrEmail: params.phoneOrEmail,
      phoneOrEmailType: typeof params.phoneOrEmail,
      phoneOrEmailLength: params.phoneOrEmail?.length,
      code: params.code,
      codeType: typeof params.code,
      codeLength: params.code?.length,
      newPassword: params.newPassword ? '已提供' : '未提供',
      newPasswordType: typeof params.newPassword,
      newPasswordLength: params.newPassword?.length
    });

    // 发送给后端的实际数据
    const requestData = { 
      phoneOrEmail: params.phoneOrEmail, 
      code: params.code, 
      newPassword: params.newPassword 
    };
    console.log('📤 发送给后端的数据:', {
      ...requestData,
      newPassword: requestData.newPassword ? '***' : requestData.newPassword
    });

    const url = 'http://localhost:8080/user/reset-password';
    console.log('🌐 请求URL:', url);
    console.log('📝 请求方法: POST');
    console.log('📋 请求Content-Type: application/json;charset=utf-8');

    // const response: ApiResponse<string> = await post('/user/reset-password', { phoneOrEmail: params.phoneOrEmail, code: params.code, newPassword: params.newPassword });
    const response: ApiResponse<string> = await post(url, requestData);
    console.log('📥 重置密码响应:', response);
    console.log('📊 响应状态码:', response.code);
    console.log('📝 响应消息:', response.message);
    
    if (response.code === 0) {
      console.log('✅ 重置密码成功');
      return response.data;
    } else {
      console.log('❌ 后端返回错误:', response.message);
      console.log('❌ 后端错误代码:', response.code);
      throw new Error(response.message || '重置密码失败');
    }
  } catch (error: any) {
    console.error('❌ resetPasswordApi - 请求过程中发生错误:', error);
    console.error('❌ 错误对象详情:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.response?.config?.url,
      method: error.response?.config?.method,
      headers: error.response?.config?.headers,
      data: error.response?.config?.data
    });
    throw new Error(error.message || '重置密码失败，请稍后重试');
  }
}

/**
 * 获取用户信息API
 * 
 * 根据用户名查询用户信息
 *
 * @async
 * @param {GetUserInfoRequest} params - 查询参数
 * @returns {Promise<User>} 用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getUserInfoApi(params: GetUserInfoRequest): Promise<User> {
  try {
    // const response: ApiResponse<User> = await get('/user/info', {
    const response: ApiResponse<User> = await get('http://localhost:8080/user/info', {
      username: params.username,
    });
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '获取用户信息失败');
    }
  } catch (error: any) {
    console.error('获取用户信息失败:', error);
    throw new Error(error.message || '获取用户信息失败，请稍后重试');
  }
}

/**
 * 刷新JWT令牌API
 * 
 * 使用现有令牌获取新的JWT令牌
 * 注意：此方法需要特殊处理，避免循环调用
 *
 * @async
 * @param {RefreshTokenRequest} params - 刷新令牌参数
 * @returns {Promise<LoginVO>} 新的登录响应数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function refreshTokenApi(params: RefreshTokenRequest): Promise<LoginVO> {
  try {
    // 创建一个临时的axios实例，绕过拦截器
    const tempAxios = request.create({
      baseURL: 'http://localhost:8080',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${params.token}`
      }
    });

    const response = await tempAxios.post('/user/refresh-token', {});
    const result: ApiResponse<LoginVO> = response.data;
    
    if (result.code === 0) {
      return result.data;
    } else {
      throw new Error(result.message || '刷新令牌失败');
    }
  } catch (error: any) {
    console.error('刷新令牌失败:', error);
    throw new Error(error.response?.data?.message || error.message || '刷新令牌失败，请稍后重试');
  }
}

/**
 * 修改用户资料API
 * 
 * 通过JWT令牌验证身份并修改用户资料（昵称、头像和个人简介）
 * 注意：此API会自动从请求头中获取JWT令牌进行身份验证
 *
 * @async
 * @param {UpdateAvatarAndUsernameRequest} params - 更新参数
 * @param {string} [params.username] - 新昵称（可选）
 * @param {string} [params.avatarUrl] - 新头像URL（可选）
 * @param {string} [params.profile] - 新个人简介（可选）
 * @returns {Promise<User>} 更新后的用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function updateAvatarAndUsernameAndProfileApi(params: UpdateAvatarAndUsernameAndProfileRequest): Promise<User> {
  try {
    console.log('更新用户资料参数:', params);

    // const response: ApiResponse<LoginVO> = await post('/user/update-avatar-username-profile', params);
    const response: ApiResponse<LoginVO> = await post('http://localhost:8080/user/update-avatar-username-profile', params);
    console.log('更新用户资料响应:', response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '更新资料失败');
    }
  } catch (error: any) {
    console.error('更新资料失败:', error);
    throw new Error(error.message || '更新资料失败，请稍后重试');
  }
}

/**
 * 修改密码API
 * 
 * 通过JWT令牌验证身份并修改用户密码
 * 注意：此API会自动从请求头中获取JWT令牌进行身份验证
 *
 * @async
 * @param {ChangePasswordRequest} params - 修改密码参数
 * @param {string} params.currentPassword - 当前密码
 * @param {string} params.newPassword - 新密码
 * @param {string} params.newPasswordConfirm - 确认新密码
 * @returns {Promise<string>} 修改结果消息
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 修改密码
 * await changePasswordApi({
 *   currentPassword: 'old123456',
 *   newPassword: 'new123456', 
 *   newPasswordConfirm: 'new123456'
 * });
 */
export async function changePasswordApi(params: ChangePasswordRequest): Promise<string> {
  try {
    console.log('修改密码参数:', { 
      ...params, 
      currentPassword: '***', 
      newPassword: '***', 
      newPasswordConfirm: '***' 
    });

    // 直接传递参数，字段名已与后端匹配
    // const response: ApiResponse<string> = await post('/user/change-password', params);
    const response: ApiResponse<string> = await post('http://localhost:8080/user/change-password', params);
    console.log('修改密码响应:', response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '修改密码失败');
    }
  } catch (error: any) {
    console.error('修改密码失败:', error);
    throw new Error(error.message || '修改密码失败，请稍后重试');
  }
}

/**
 * 发送手机验证码API
 * 
 * @param phone 手机号
 * @param type 验证码类型：1-注册，2-重置密码，3-修改手机号
 * @returns Promise<string> 发送结果消息
 */
export async function sendPhoneCodeApi(phone: string, type: number): Promise<string> {
  // const response = await request.post('/user/send-unified-phone-code', {
  const response = await request.post('http://localhost:8080/user/send-unified-phone-code', {
    phone,
    type
  });
  return response.data;
}

/**
 * 修改手机号API
 * 
 * @param data 修改手机号数据
 * @returns Promise<string> 修改结果消息
 */
export async function changePhoneApi(data: {
  currentPhone: string;
  newPhone: string;
  verificationCode: string;
}): Promise<string> {
  // const response = await request.post('/user/change-phone', data);
  const response = await request.post('http://localhost:8080/user/change-phone', data);
  return response.data;
}

/**
 * 修改邮箱API
 * 
 * 通过JWT令牌验证身份并修改用户邮箱
 *
 * @async
 * @param {ChangeEmailRequest} params - 修改邮箱参数
 * @returns {Promise<string>} 修改结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function changeEmailApi(params: ChangeEmailRequest): Promise<string> {
  try {
    console.log('修改邮箱参数:', params);

    // 发送JSON格式数据，与后端@RequestBody注解匹配
    // const response: ApiResponse<string> = await post('/user/change-email', {
    const response: ApiResponse<string> = await post('http://localhost:8080/user/change-email', {
      email: params.newEmail,
      verificationCode: params.verificationCode
    });
    console.log('修改邮箱响应:', response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '修改邮箱失败');
    }
  } catch (error: any) {
    console.error('修改邮箱失败:', error);
    throw new Error(error.message || '修改邮箱失败，请稍后重试');
  }
}

/**
 * 带验证码的用户注册API
 * 
 * 使用邮箱验证码进行用户注册
 *
 * @async
 * @param {RegisterWithCodeRequest} params - 注册参数（包含验证码）
 * @returns {Promise<LoginVO>} 注册后的登录信息（包含JWT令牌）
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function registerWithCodeApi(params: RegisterWithCodeRequest): Promise<LoginVO> {
  try {
    console.log('带验证码注册参数:', params);

    // 调用正确的带验证码注册端点
    // const response: ApiResponse<LoginVO> = await post('/user/register-with-code', params);
    const response: ApiResponse<LoginVO> = await post('http://localhost:8080/user/register-with-code', params);
    console.log('带验证码注册响应:', response);
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '注册失败');
    }
  } catch (error: any) {
    console.error('带验证码注册失败:', error);
    throw new Error(error.message || '注册失败，请稍后重试');
  }
}

/**
 * 更新隐私设置API
 * 
 * 通过JWT令牌验证身份并更新用户隐私设置
 *
 * @async
 * @param {UpdatePrivacySettingsRequest} params - 更新隐私设置参数
 * @returns {Promise<PrivacySettings>} 更新后的隐私设置
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function updatePrivacySettingsApi(params: UpdatePrivacySettingsRequest): Promise<PrivacySettings> {
  try {
    console.log('更新隐私设置参数:', params);

    // const response: ApiResponse<PrivacySettings> = await post('/user/update-privacy-settings', params);
    const response: ApiResponse<PrivacySettings> = await post('http://localhost:8080/user/update-privacy-settings', params);
    console.log('更新隐私设置响应:', response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '更新隐私设置失败');
    }
  } catch (error: any) {
    console.error('更新隐私设置失败:', error);
    throw new Error(error.message || '更新隐私设置失败，请稍后重试');
  }
}

/**
 * 获取隐私设置API
 * 
 * 获取当前用户的隐私设置
 *
 * @async
 * @returns {Promise<PrivacySettings>} 隐私设置数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getPrivacySettingsApi(): Promise<PrivacySettings> {
  try {
    // const response: ApiResponse<PrivacySettings> = await get('/user/privacy-settings');
    const response: ApiResponse<PrivacySettings> = await get('http://localhost:8080/user/privacy-settings');
    console.log('获取隐私设置响应:', response);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '获取隐私设置失败');
    }
  } catch (error: any) {
    console.error('获取隐私设置失败:', error);
    throw new Error(error.message || '获取隐私设置失败，请稍后重试');
  }
}
