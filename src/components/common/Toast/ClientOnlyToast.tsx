"use client";

import React, { useState, useEffect } from 'react';
import Toast from './Toast';

/**
 * 客户端专用Toast组件属性接口
 */
interface ClientOnlyToastProps {
  messages: any[];
  onRemove: (id: string) => void;
}

/**
 * 客户端专用Toast组件
 * 
 * 确保Toast组件只在客户端渲染，避免SSR水合错误
 *
 * @component
 */
function ClientOnlyToast({ messages, onRemove }: ClientOnlyToastProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 服务器端渲染时返回null
  if (!isClient) {
    return null;
  }

  // 客户端渲染Toast组件
  return <Toast messages={messages} onRemove={onRemove} />;
}

export default ClientOnlyToast; 