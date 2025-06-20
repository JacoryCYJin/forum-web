/**
 * @file 优化图片组件
 * @description 基于 Next.js Image 的优化图片组件，支持懒加载、占位符等
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { preloadImage } from '@/lib/utils/performance';

/**
 * 优化图片组件 Props
 */
interface OptimizedImageProps {
  /**
   * 图片源地址
   */
  src: string;
  
  /**
   * 备用图片地址
   */
  fallbackSrc?: string;
  
  /**
   * 图片描述文本
   */
  alt: string;
  
  /**
   * 图片宽度
   */
  width?: number;
  
  /**
   * 图片高度
   */
  height?: number;
  
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否填充容器
   * @default false
   */
  fill?: boolean;
  
  /**
   * 图片适应方式
   * @default 'cover'
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  
  /**
   * 图片质量 (1-100)
   * @default 75
   */
  quality?: number;
  
  /**
   * 是否显示加载占位符
   * @default true
   */
  placeholder?: boolean;
  
  /**
   * 自定义占位符内容
   */
  placeholderContent?: React.ReactNode;
  
  /**
   * 是否启用模糊占位符
   * @default false
   */
  blurPlaceholder?: boolean;
  
  /**
   * 模糊占位符的 Base64 数据
   */
  blurDataURL?: string;
  
  /**
   * 优先级（用于 LCP 图片）
   * @default false
   */
  priority?: boolean;
  
  /**
   * 图片加载完成回调
   */
  onLoad?: () => void;
  
  /**
   * 图片加载错误回调
   */
  onError?: () => void;
  
  /**
   * 是否可点击放大
   * @default false
   */
  zoomable?: boolean;
  
  /**
   * 圆角样式
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

/**
 * 圆角样式映射
 */
const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * 生成简单的模糊占位符
 */
function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}

/**
 * 默认占位符组件
 */
function DefaultPlaceholder({ 
  className, 
  rounded = 'md' 
}: { 
  className?: string; 
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}) {
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center ${roundedClasses[rounded]} ${className}`}
    >
      <svg
        className="w-8 h-8 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

/**
 * 优化图片组件
 * 
 * 基于 Next.js Image 的增强版图片组件
 *
 * @component
 * @example
 * // 基本用法
 * <OptimizedImage src="/image.jpg" alt="描述" width={300} height={200} />
 * 
 * // 填充容器
 * <OptimizedImage src="/image.jpg" alt="描述" fill />
 * 
 * // 高优先级图片（LCP）
 * <OptimizedImage src="/hero.jpg" alt="主图" priority width={800} height={400} />
 */
export default function OptimizedImage({
  src,
  fallbackSrc = '/images/placeholder.png',
  alt,
  width,
  height,
  className = '',
  fill = false,
  objectFit = 'cover',
  quality = 75,
  placeholder = true,
  placeholderContent,
  blurPlaceholder = false,
  blurDataURL,
  priority = false,
  onLoad,
  onError,
  zoomable = false,
  rounded = 'md',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isZoomed, setIsZoomed] = useState(false);

  // 处理图片加载完成
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // 处理图片加载错误
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // 尝试使用备用图片
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    if (onError) onError();
  };

  // 预加载图片（用于优化用户体验）
  React.useEffect(() => {
    if (priority) {
      preloadImage(src).catch(() => {
        // 预加载失败时静默处理
      });
    }
  }, [src, priority]);

  // 生成模糊占位符
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    if (blurPlaceholder && typeof window !== 'undefined') {
      return generateBlurDataURL(width || 10, height || 10);
    }
    return undefined;
  };

  // 图片容器样式
  const containerClasses = `
    relative overflow-hidden ${roundedClasses[rounded]} ${className}
    ${zoomable ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}
  `.trim();

  // 图片样式
  const imageClasses = `
    transition-opacity duration-300
    ${isLoading ? 'opacity-0' : 'opacity-100'}
  `.trim();

  // 处理图片点击放大
  const handleImageClick = () => {
    if (zoomable) {
      setIsZoomed(true);
    }
  };

  // 渲染占位符
  const renderPlaceholder = () => {
    if (!placeholder || !isLoading) return null;

    if (placeholderContent) {
      return (
        <div className={`absolute inset-0 flex items-center justify-center ${roundedClasses[rounded]}`}>
          {placeholderContent}
        </div>
      );
    }

    return (
      <DefaultPlaceholder 
        className={fill ? 'absolute inset-0' : `w-full h-full`}
        rounded={rounded}
      />
    );
  };

  // 渲染错误状态
  const renderError = () => {
    if (!hasError) return null;

    return (
      <div 
        className={`
          bg-gray-100 dark:bg-gray-800 flex items-center justify-center
          ${roundedClasses[rounded]}
          ${fill ? 'absolute inset-0' : 'w-full h-full'}
        `}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-xs">加载失败</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={containerClasses} onClick={handleImageClick}>
        {/* 占位符 */}
        {renderPlaceholder()}
        
        {/* 错误状态 */}
        {renderError()}
        
        {/* 主图片 */}
        {!hasError && (
          <Image
            src={currentSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            quality={quality}
            priority={priority}
            className={imageClasses}
            style={fill ? { objectFit } : undefined}
            placeholder={blurPlaceholder ? 'blur' : 'empty'}
            blurDataURL={getBlurDataURL()}
            onLoad={handleLoad}
            onError={handleError}
            sizes={fill ? '100vw' : undefined}
          />
        )}
      </div>
      
      {/* 放大模态框 */}
      {isZoomed && zoomable && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] cursor-zoom-out">
            <Image
              src={currentSrc}
              alt={alt}
              width={width}
              height={height}
              className="max-w-full max-h-full object-contain"
              quality={90}
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 