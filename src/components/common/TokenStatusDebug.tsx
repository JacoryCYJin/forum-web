'use client';

import React, { useState, useEffect } from 'react';

/**
 * Token状态调试组件
 * 用于调试Cookie和Token的状态
 */
export function TokenStatusDebug() {
  const [cookieInfo, setCookieInfo] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

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
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md text-xs">
      <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">🔍 Token调试信息</h3>
      
      <div className="mb-3">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Cookie信息:</h4>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 break-all">
          {cookieInfo || '无Cookie'}
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">LocalStorage Token:</h4>
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
          {tokenInfo ? (
            <div>
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
      
      {/* <div className="flex gap-2">
        <button 
          onClick={handleSetTestCookie}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          设置测试Cookie
        </button>
        <button 
          onClick={handleClearCookie}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          清除Cookie
        </button>
      </div> */}
    </div>
  );
}

export default TokenStatusDebug; 