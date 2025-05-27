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
  
  // 提前刷新时间（5分钟，单位：毫秒）
  private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000;
  
  // 自动刷新定时器
  private static refreshTimer: NodeJS.Timeout | null = null;

  /**
   * 保存令牌信息
   * 
   * @param tokenData - 令牌数据
   */
  static saveToken(tokenData: {
    accessToken: string;
    tokenType: string;
    expiresIn: number; // 后端返回的过期时间（秒）
  }): void {
    const issuedAt = Date.now();
    
    localStorage.setItem(this.TOKEN_KEY, tokenData.accessToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenData.tokenType);
    localStorage.setItem(this.EXPIRES_IN_KEY, tokenData.expiresIn.toString());
    localStorage.setItem(this.ISSUED_AT_KEY, issuedAt.toString());
    
    // 注意：expiresIn是秒数，需要转换为毫秒
    const expirationTime = issuedAt + (tokenData.expiresIn * 1000);
    console.log('💾 Token已保存，过期时间:', new Date(expirationTime));
    
    // 启动自动刷新定时器
    this.startAutoRefresh();
  }

  /**
   * 获取令牌信息
   * 
   * @returns 令牌信息或null
   */
  static getTokenInfo(): TokenInfo | null {
    try {
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
   * 检查令牌是否即将过期
   * 
   * @returns 是否即将过期
   */
  static isTokenExpiringSoon(): boolean {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) return true;

    const now = Date.now();
    // 注意：expiresIn是秒数，需要转换为毫秒
    const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
    const timeUntilExpiry = expirationTime - now;

    return timeUntilExpiry <= this.REFRESH_THRESHOLD;
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
    // 注意：expiresIn是秒数，需要转换为毫秒
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
    // 注意：expiresIn是秒数，需要转换为毫秒
    const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
    const remaining = expirationTime - now;

    return Math.max(0, remaining);
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

      console.log('🔄 正在刷新令牌...');

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
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userInfo.accessToken = refreshResult.accessToken;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
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
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
    localStorage.removeItem(this.ISSUED_AT_KEY);
    localStorage.removeItem('userInfo');
    
    // 停止自动刷新定时器
    this.stopAutoRefresh();
    
    console.log('🗑️ 令牌信息已清除');
  }

  /**
   * 启动自动刷新定时器
   */
  static startAutoRefresh(): void {
    // 先停止现有定时器
    this.stopAutoRefresh();
    
    const checkInterval = 60 * 1000; // 每分钟检查一次
    
    this.refreshTimer = setInterval(async () => {
      if (this.isTokenExpiringSoon()) {
        console.log('⏰ 检测到令牌即将过期，尝试自动刷新...');
        await this.refreshToken();
      }
    }, checkInterval);
    
    console.log('⚡ 自动刷新定时器已启动');
  }

  /**
   * 停止自动刷新定时器
   */
  static stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      console.log('⏹️ 自动刷新定时器已停止');
    }
  }

  /**
   * 每次API调用前检查并刷新令牌
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
      console.log('🔄 令牌已过期，尝试刷新...');
      return await this.refreshToken();
    }

    // 如果即将过期，主动刷新
    if (this.isTokenExpiringSoon()) {
      console.log('⏰ 令牌即将过期，主动刷新...');
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
    isExpiringSoon: boolean;
    remainingTime: number;
    remainingTimeFormatted: string;
  } {
    const hasToken = !!this.getTokenInfo();
    const isExpired = this.isTokenExpired();
    const isExpiringSoon = this.isTokenExpiringSoon();
    const remainingTime = this.getRemainingTime();
    
    // 格式化剩余时间
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const remainingTimeFormatted = `${hours}小时${minutes}分钟`;

    return {
      hasToken,
      isExpired,
      isExpiringSoon,
      remainingTime,
      remainingTimeFormatted
    };
  }
}

/**
 * 用于在应用初始化时启动令牌管理
 */
export function initializeTokenManager(): void {
  if (typeof window !== 'undefined') {
    const tokenInfo = TokenManager.getTokenInfo();
    if (tokenInfo) {
      TokenManager.startAutoRefresh();
      console.log('🚀 令牌管理器已初始化');
    }
  }
} 