/**
 * @file 用户API模块
 * @description 提供用户相关的API调用函数
 */

import { post } from '@/lib/util/request';
import type {
  LoginVO,
  LoginRequest,
  RegisterRequest,
  UpdateUsernameRequest,
  SendResetCodeRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  GetUserInfoRequest,
  User,
  ApiResponse,
} from '@/types/user.types';

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
    const response: ApiResponse<LoginVO> = await post('/user/login', params);
    console.log('response:', response);
    
    if (response.code == 0) {
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
 * 用户注册API
 * 
 * 第一步基础信息注册
 *
 * @async
 * @param {RegisterRequest} params - 注册参数
 * @returns {Promise<User>} 注册后的用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function registerUserApi(params: RegisterRequest): Promise<User> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('phoneOrEmail', params.phoneOrEmail);
    searchParams.append('password', params.password);
    searchParams.append('repassword', params.repassword);

    const response: ApiResponse<User> = await post('/user/register', searchParams);
    
    if (response.code === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '注册失败');
    }
  } catch (error: any) {
    console.error('注册失败:', error);
    throw new Error(error.message || '注册失败，请稍后重试');
  }
}

/**
 * 更新用户昵称API
 * 
 * 注册第二步或后续修改昵称
 *
 * @async
 * @param {UpdateUsernameRequest} params - 更新参数
 * @returns {Promise<User>} 更新后的用户信息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function updateUsernameApi(params: UpdateUsernameRequest): Promise<User> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('userId', params.userId);
    searchParams.append('username', params.username);

    const response: ApiResponse<User> = await post('/user/update-username', searchParams);
    
    if (response.code === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '更新昵称失败');
    }
  } catch (error: any) {
    console.error('更新昵称失败:', error);
    throw new Error(error.message || '更新昵称失败，请稍后重试');
  }
}

/**
 * 发送密码重置验证码API
 * 
 * 向用户邮箱发送重置密码的验证码
 *
 * @async
 * @param {SendResetCodeRequest} params - 发送验证码参数
 * @returns {Promise<string>} 发送结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function sendResetCodeApi(params: SendResetCodeRequest): Promise<string> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('email', params.email);

    const response: ApiResponse<string> = await post('/user/send-reset-code', searchParams);
    
    if (response.code === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '发送验证码失败');
    }
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    throw new Error(error.message || '发送验证码失败，请稍后重试');
  }
}

/**
 * 重置密码API
 * 
 * 使用验证码重置用户密码
 *
 * @async
 * @param {ResetPasswordRequest} params - 重置密码参数
 * @returns {Promise<string>} 重置结果消息
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function resetPasswordApi(params: ResetPasswordRequest): Promise<string> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('email', params.email);
    searchParams.append('code', params.code);
    searchParams.append('newPassword', params.newPassword);

    const response: ApiResponse<string> = await post('/user/reset-password', searchParams);
    
    if (response.code === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '重置密码失败');
    }
  } catch (error: any) {
    console.error('重置密码失败:', error);
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
    const response: ApiResponse<User> = await post('/user/info', {
      username: params.username,
    });
    
    if (response.code === 200) {
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
 *
 * @async
 * @param {RefreshTokenRequest} params - 刷新令牌参数
 * @returns {Promise<LoginVO>} 新的登录响应数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function refreshTokenApi(params: RefreshTokenRequest): Promise<LoginVO> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('token', params.token);

    const response: ApiResponse<LoginVO> = await post('/user/refresh-token', searchParams);
    
    if (response.code === 200) {
      return response.data;
    } else {
      throw new Error(response.message || '刷新令牌失败');
    }
  } catch (error: any) {
    console.error('刷新令牌失败:', error);
    throw new Error(error.message || '刷新令牌失败，请稍后重试');
  }
}
