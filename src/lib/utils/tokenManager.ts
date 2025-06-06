/**
 * @file JWT令牌管理工具
 * @description 处理JWT令牌的刷新、过期检查和自动续期功能
 */

import { refreshTokenApi } from '@/lib/api/userApi';
import { useUserStore } from '@/store/userStore';

/**
 * 令牌信息接口
 */
interface TokenInfo {
  accessToken: string;
  tokenType: string;
  expiresIn: number; // 后端返回的过期时间（秒）
  issuedAt: number; // 令牌签发时间戳（毫秒）
}

/**
 * JWT令牌管理器
 */
export class TokenManager {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly TOKEN_TYPE_KEY = 'tokenType';
  private static readonly EXPIRES_IN_KEY = 'expiresIn';
  private static readonly ISSUED_AT_KEY = 'issuedAt';
  
  // 滑动刷新阈值：1天（24小时，单位：毫秒）
  private static readonly SLIDING_REFRESH_THRESHOLD = 24 * 60 * 60 * 1000;

  /**
   * 保存令牌信息到localStorage
   */
  static saveToken(tokenData: {
    accessToken: string;
    tokenType: string;
    expiresIn: number; // 后端返回的过期时间（秒）
  }): void {
    // 检查是否在客户端环境
    if (typeof window === 'undefined') {
      return;
    }
    
    const issuedAt = Date.now();
    
    localStorage.setItem(this.TOKEN_KEY, tokenData.accessToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenData.tokenType);
    localStorage.setItem(this.EXPIRES_IN_KEY, tokenData.expiresIn.toString());
    localStorage.setItem(this.ISSUED_AT_KEY, issuedAt.toString());
    
    // 注意：expiresIn是秒数，需要转换为毫秒
    const expirationTime = issuedAt + (tokenData.expiresIn * 1000);
    console.log('Token已保存，过期时间:', new Date(expirationTime));
  }

  /**
   * 获取令牌信息
   * 
   * @returns 令牌信息或null
   */
  static getTokenInfo(): TokenInfo | null {
    try {
      // 检查是否在客户端环境
      if (typeof window === 'undefined') {
        return null;
      }
      
      const accessToken = localStorage.getItem(this.TOKEN_KEY);
      const tokenType = localStorage.getItem(this.TOKEN_TYPE_KEY);
      const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
      const issuedAt = localStorage.getItem(this.ISSUED_AT_KEY);

      if (!accessToken || !tokenType || !expiresIn || !issuedAt) {
        return null;
      }

      return {
        accessToken,
        tokenType,
        expiresIn: parseInt(expiresIn), // 秒数
        issuedAt: parseInt(issuedAt) // 毫秒
      };
    } catch (error) {
      console.error('获取令牌信息失败:', error);
      return null;
    }
  }

  /**
   * 检查令牌是否需要滑动刷新
   * 
   * 只要令牌使用时间超过1天就可以刷新，充分利用7天有效期
   * 
   * @returns 是否需要滑动刷新
   */
  static needsSlidingRefresh(): boolean {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return false;

    const now = Date.now();
    const tokenAge = now - tokenInfo.issuedAt; // 令牌已使用时间
    const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
    const remainingTime = expirationTime - now;

    // 令牌使用时间超过1天且还未过期就可以刷新
    return tokenAge >= this.SLIDING_REFRESH_THRESHOLD && remainingTime > 0;
  }

  /**
   * 检查令牌是否已过期
   * 
   * @returns 是否已过期
   */
  static isTokenExpired(): boolean {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return true;

    const now = Date.now();
    const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);

    return now >= expirationTime;
  }

  /**
   * 获取令牌剩余有效时间
   * 
   * @returns 剩余时间（毫秒），如果已过期返回0
   */
  static getRemainingTime(): number {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return 0;

    const now = Date.now();
    const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
    const remaining = expirationTime - now;

    return Math.max(0, remaining);
  }

  /**
   * 获取令牌已使用时间
   * 
   * @returns 已使用时间（毫秒）
   */
  static getTokenAge(): number {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return 0;

    const now = Date.now();
    return now - tokenInfo.issuedAt;
  }

  /**
   * 刷新令牌
   * 
   * @returns 是否刷新成功
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const tokenInfo = this.getTokenInfo();
      if (!tokenInfo) {
        console.warn('⚠️ 没有找到令牌信息，无法刷新');
        return false;
      }

      console.log('正在刷新令牌...');

      // 调用刷新令牌API
      const refreshResult = await refreshTokenApi({
        token: tokenInfo.accessToken
      });

      // 保存新的令牌
      this.saveToken({
        accessToken: refreshResult.accessToken,
        tokenType: refreshResult.tokenType,
        expiresIn: refreshResult.expiresIn
      });

      // 更新localStorage中的用户信息
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          userInfo.accessToken = refreshResult.accessToken;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }

      console.log('✅ 令牌刷新成功');
      return true;

    } catch (error: any) {
      console.error('❌ 令牌刷新失败:', error);
      
      // 如果刷新失败，清除所有认证信息
      this.clearToken();
      
      // 触发登出
      const { logout } = useUserStore.getState();
      logout();
      
      return false;
    }
  }

  /**
   * 清除令牌信息
   */
  static clearToken(): void {
    // 检查是否在客户端环境
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
    localStorage.removeItem(this.ISSUED_AT_KEY);
    localStorage.removeItem('userInfo');
    
    console.log('令牌信息已清除');
  }

  /**
   * 每次API调用前检查令牌有效性
   * 
   * @returns 是否可以继续API调用
   */
  static async ensureValidToken(): Promise<boolean> {
    // 检查令牌是否存在
    if (!this.getTokenInfo()) {
      console.warn('⚠️ 没有令牌信息');
      return false;
    }

    // 如果已过期，尝试刷新
    if (this.isTokenExpired()) {
      console.log('令牌已过期，尝试刷新...');
      return await this.refreshToken();
    }

    return true;
  }

  /**
   * 获取令牌状态信息（用于调试）
   */
  static getTokenStatus(): {
    hasToken: boolean;
    isExpired: boolean;
    needsSlidingRefresh: boolean;
    remainingTime: number;
    remainingTimeFormatted: string;
    tokenAge: number;
    tokenAgeFormatted: string;
  } {
    const hasToken = !!this.getTokenInfo();
    const isExpired = this.isTokenExpired();
    const needsSlidingRefresh = this.needsSlidingRefresh();
    const remainingTime = this.getRemainingTime();
    const tokenAge = this.getTokenAge();
    
    // 格式化剩余时间
    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const remainingTimeFormatted = `${remainingHours}小时${remainingMinutes}分钟`;

    // 格式化已使用时间
    const ageHours = Math.floor(tokenAge / (1000 * 60 * 60));
    const ageMinutes = Math.floor((tokenAge % (1000 * 60 * 60)) / (1000 * 60));
    const tokenAgeFormatted = `${ageHours}小时${ageMinutes}分钟`;

    return {
      hasToken,
      isExpired,
      needsSlidingRefresh,
      remainingTime,
      remainingTimeFormatted,
      tokenAge,
      tokenAgeFormatted
    };
  }

  /**
   * 每次API调用成功后的滑动刷新机制
   * 
   * 只要令牌使用时间超过1天就刷新，充分利用7天有效期
   * 
   * @returns 是否处理成功
   */
  static async handleSlidingRefresh(): Promise<boolean> {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return false;

    // 检查是否需要滑动刷新
    if (!this.needsSlidingRefresh()) {
      return true; // 不需要刷新，返回成功
    }

    const tokenAge = this.getTokenAge();
    const ageDays = Math.floor(tokenAge / (1000 * 60 * 60 * 24));
    const ageHours = Math.floor((tokenAge % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    console.log(`API调用成功，令牌已使用超过1天（${ageDays}天${ageHours}小时），执行滑动刷新...`);
    
    return await this.refreshToken();
  }
}

/**
 * 用于在应用初始化时启动令牌管理
 */
export function initializeTokenManager(): void {
  if (typeof window !== 'undefined') {
    const tokenInfo = TokenManager.getTokenInfo();
    if (tokenInfo) {
      console.log('令牌管理器已初始化');
    }
  }
} 