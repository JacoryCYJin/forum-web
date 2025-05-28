/**
 * @file JWT令牌状态调试组件
 * @description 显示JWT令牌的详细状态信息，用于开发调试
 */

'use client';

import { useState, useEffect } from 'react';
import { TokenManager } from '@/lib/utils/tokenManager';

/**
 * JWT令牌状态调试组件
 * 
 * 仅在开发环境显示，用于调试JWT令牌状态
 * 
 * @component
 */
export function TokenStatusDebug() {
  const [tokenStatus, setTokenStatus] = useState(TokenManager.getTokenStatus());
  const [isVisible, setIsVisible] = useState(false);

  // 每5秒更新一次状态
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenStatus(TokenManager.getTokenStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 切换按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
      >
        {isVisible ? '隐藏' : '显示'} Token状态
      </button>

      {/* 状态面板 */}
      {isVisible && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 min-w-64 text-xs">
          <h3 className="text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
            🔐 JWT令牌状态
          </h3>
          
          <div className="space-y-2">
            {/* 令牌存在状态 */}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">令牌状态:</span>
              <span className={`font-medium ${
                tokenStatus.hasToken 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {tokenStatus.hasToken ? '✅ 存在' : '❌ 不存在'}
              </span>
            </div>

            {/* 过期状态 */}
            {tokenStatus.hasToken && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">过期状态:</span>
                  <span className={`font-medium ${
                    tokenStatus.isExpired 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {tokenStatus.isExpired ? '❌ 已过期' : '✅ 有效'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">需要滑动刷新:</span>
                  <span className={`font-medium ${
                    tokenStatus.needsSlidingRefresh 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {tokenStatus.needsSlidingRefresh ? '⚠️ 是（已使用>1天）' : '✅ 否（使用<1天）'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">已使用时间:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {tokenStatus.tokenAgeFormatted}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">剩余时间:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {tokenStatus.remainingTimeFormatted}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setTokenStatus(TokenManager.getTokenStatus())}
              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
            >
              刷新状态
            </button>
            
            {tokenStatus.hasToken && (
              <button
                onClick={async () => {
                  const success = await TokenManager.refreshToken();
                  if (success) {
                    setTokenStatus(TokenManager.getTokenStatus());
                  }
                }}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                手动刷新Token
              </button>
            )}

            {tokenStatus.hasToken && (
              <button
                onClick={() => {
                  TokenManager.clearToken();
                  setTokenStatus(TokenManager.getTokenStatus());
                }}
                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              >
                清除Token
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 