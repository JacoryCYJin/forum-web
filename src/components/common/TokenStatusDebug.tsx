'use client';

import React, { useState, useEffect } from 'react';

/**
 * Token状态调试组件
 * 用于调试Cookie和Token的状态，支持缩小/展开功能
 */
export function TokenStatusDebug() {
  const [cookieInfo, setCookieInfo] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    // 检查Cookie
    const checkCookie = () => {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie;
        setCookieInfo(cookies);
        
        // 检查localStorage中的token信息
        const accessToken = localStorage.getItem('accessToken');
        const tokenType = localStorage.getItem('tokenType');
        const expiresIn = localStorage.getItem('expiresIn');
        const issuedAt = localStorage.getItem('issuedAt');
        
        setTokenInfo({
          accessToken: accessToken ? accessToken.substring(0, 20) + '...' : null,
          tokenType,
          expiresIn,
          issuedAt: issuedAt ? new Date(parseInt(issuedAt)).toLocaleString() : null
        });
      }
    };

    checkCookie();
    
    // 每5秒更新一次
    const interval = setInterval(checkCookie, 5000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 切换最小化状态
   */
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  // const handleSetTestCookie = () => {
  //   if (typeof document !== 'undefined') {
  //     const testToken = 'test-token-' + Date.now();
  //     const expireDate = new Date();
  //     expireDate.setTime(expireDate.getTime() + (24 * 60 * 60 * 1000)); // 24小时
      
  //     document.cookie = `Authorization=${testToken}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`;
  //     console.log('已设置测试Cookie:', testToken);
  //   }
  // };

  // const handleClearCookie = () => {
  //   if (typeof document !== 'undefined') {
  //     document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
  //     console.log('已清除Cookie');
  //   }
  // };

  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-dark-secondary border border-neutral-200 dark:border-neutral-300 rounded-lg shadow-lg transition-all duration-300 ${
      isMinimized ? 'w-12 h-12' : 'max-w-md'
    }`}>
      {/* 标题栏和缩小按钮 */}
      <div className="flex items-center justify-between p-2">
        {!isMinimized && (
          <h3 className="font-bold text-sm text-neutral-500 dark:text-neutral-400">
            🔍 Token调试
          </h3>
        )}
        <button
          onClick={toggleMinimized}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-neutral-400 dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-100"
          title={isMinimized ? '展开调试信息' : '收起调试信息'}
        >
          {isMinimized ? (
            // 展开图标
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          ) : (
            // 收起图标
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12l-1.414-1.414L16 13.172V8h-2v5.172l-2.586-2.586L10 12l6 6 6-6z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* 详细信息内容 */}
      {!isMinimized && (
        <div className="px-3 pb-3 text-xs">
          <div className="mb-3">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Cookie信息:
            </h4>
            <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded mt-1 break-all text-neutral-600 dark:text-neutral-400">
              {cookieInfo || '无Cookie'}
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              LocalStorage Token:
            </h4>
            <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded mt-1 text-neutral-600 dark:text-neutral-400">
              {tokenInfo ? (
                <div className="space-y-1">
                  <div>Token: {tokenInfo.accessToken || '无'}</div>
                  <div>类型: {tokenInfo.tokenType || '无'}</div>
                  <div>过期时间: {tokenInfo.expiresIn || '无'}秒</div>
                  <div>签发时间: {tokenInfo.issuedAt || '无'}</div>
                </div>
              ) : (
                '无Token信息'
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TokenStatusDebug; 