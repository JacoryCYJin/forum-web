/**
 * @file 媒体展示组件
 * @description 支持图片轮播和视频播放的通用展示组件
 */

'use client';

import React, { useState, useEffect } from 'react';

/**
 * 媒体类型枚举
 */
export enum MediaType {
  /** 图片轮播 */
  IMAGES = 'images',
  /** 单个视频 */
  VIDEO = 'video'
}

/**
 * 媒体项接口
 */
export interface MediaItem {
  /** 媒体文件URL */
  url: string;
  /** 媒体标题 */
  title?: string;
  /** 媒体描述 */
  description?: string;
  /** 可选的缩略图URL（用于视频） */
  thumbnail?: string;
}

/**
 * 媒体展示组件属性
 */
export interface MediaDisplayProps {
  /** 媒体类型 */
  type: MediaType;
  /** 媒体列表（图片轮播）或单个媒体（视频） */
  media: MediaItem[];
  /** 展示容器的CSS类名 */
  className?: string;
  /** 是否自动播放轮播图 */
  autoPlay?: boolean;
  /** 轮播间隔时间（毫秒） */
  interval?: number;
  /** 是否显示指示器 */
  showIndicators?: boolean;
  /** 是否显示导航箭头 */
  showNavigation?: boolean;
  /** 长宽比（如 "16:10" 或 "1.6:1"），不设置则使用图片原始比例 */
  aspectRatio?: string;
  /** 是否保持图片原始长宽比 */
  maintainAspectRatio?: boolean;
}

/**
 * 媒体展示组件
 * 
 * 支持图片轮播和视频播放的通用组件
 *
 * @component
 * @example
 * // 图片轮播
 * <MediaDisplay 
 *   type={MediaType.IMAGES}
 *   media={[
 *     { url: '/images/1.jpg', title: '图片1' },
 *     { url: '/images/2.jpg', title: '图片2' }
 *   ]}
 *   autoPlay={true}
 * />
 * 
 * // 视频展示
 * <MediaDisplay 
 *   type={MediaType.VIDEO}
 *   media={[{ url: '/videos/demo.mp4', title: '演示视频' }]}
 * />
 */
export function MediaDisplay({
  type,
  media,
  className = '',
  autoPlay = false,
  interval = 5000,
  showIndicators = true,
  showNavigation = true,
  aspectRatio,
  maintainAspectRatio = true
}: MediaDisplayProps) {
  // 当前展示的媒体索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 是否正在播放自动轮播
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  /**
   * 计算容器样式，包括长宽比
   */
  const getContainerStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    if (aspectRatio) {
      // 解析长宽比字符串（如 "16:10" 或 "1.6:1"）
      const [width, height] = aspectRatio.split(':').map(Number);
      const ratio = width / height;
      style.aspectRatio = `${ratio}`;
    } else if (maintainAspectRatio && type === MediaType.IMAGES) {
      // 针对您的图片（3600x2252）使用精确比例
      style.aspectRatio = '1.599';
    }
    
    return style;
  };

  /**
   * 自动播放效果
   */
  useEffect(() => {
    if (type === MediaType.IMAGES && isPlaying && media.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === media.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);

      return () => clearInterval(timer);
    }
  }, [type, isPlaying, media.length, interval]);

  /**
   * 切换到指定索引
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /**
   * 上一个媒体
   */
  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? media.length - 1 : currentIndex - 1);
  };

  /**
   * 下一个媒体
   */
  const goToNext = () => {
    setCurrentIndex(currentIndex === media.length - 1 ? 0 : currentIndex + 1);
  };

  /**
   * 切换播放状态
   */
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // 如果没有媒体数据，显示占位符
  if (!media || media.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg ${className}`}>
        <div className="text-center py-16">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📷</div>
          <p className="text-gray-500 dark:text-gray-400">暂无媒体内容</p>
        </div>
      </div>
    );
  }

  // 视频展示
  if (type === MediaType.VIDEO) {
    const videoItem = media[0]; // 只取第一个视频
    return (
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg min-w-0 ${className}`}
        style={{ 
          ...getContainerStyle(),
          minHeight: '300px'  // 设置最小高度，确保组件不会太小
        }}
      >
        <video
          className="w-full h-full object-cover"
          controls
          loop
          poster={videoItem.thumbnail}
          aria-label={videoItem.title || '视频内容'}
        >
          <source src={videoItem.url} type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>
        
        {videoItem.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h4 className="text-white font-medium">{videoItem.title}</h4>
            {videoItem.description && (
              <p className="text-white/80 text-sm mt-1">{videoItem.description}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // 图片轮播
  return (
    <div 
      className={`media-display-container relative overflow-hidden rounded-lg shadow-lg min-w-0 ${className}`}
      style={{ 
        ...getContainerStyle(),
        minHeight: '300px'  // 设置最小高度，确保组件不会太小
      }}
    >
      {/* 主图片展示区域 */}
      <div className="relative h-full">
        <img
          src={media[currentIndex].url}
          alt={media[currentIndex].title || `图片 ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* 图片信息覆盖层 */}
        {media[currentIndex].title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h4 className="text-white font-medium">{media[currentIndex].title}</h4>
            {media[currentIndex].description && (
              <p className="text-white/80 text-sm mt-1">{media[currentIndex].description}</p>
            )}
          </div>
        )}
      </div>

      {/* 导航箭头 */}
      {showNavigation && media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="media-nav-button media-nav-button-left"
            aria-label="上一张图片"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="media-nav-button media-nav-button-right"
            aria-label="下一张图片"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 播放控制按钮 */}
      {autoPlay && media.length > 1 && (
        <button
          onClick={togglePlayback}
          className="media-control-button"
          aria-label={isPlaying ? '暂停自动播放' : '开始自动播放'}
        >
          {isPlaying ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
            </svg>
          )}
        </button>
      )}

      {/* 指示器 */}
      {showIndicators && media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`跳转到第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      )}

      {/* 计数器 */}
      {media.length > 1 && (
        <div className="media-counter">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}

export default MediaDisplay; 