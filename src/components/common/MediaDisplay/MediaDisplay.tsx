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
  /** 是否自动播放轮播图（对视频无效，视频总是自动播放） */
  autoPlay?: boolean;
  /** 轮播间隔时间（毫秒） */
  interval?: number;
  /** 是否显示指示器 */
  showIndicators?: boolean;
  /** 是否显示导航箭头 */
  showNavigation?: boolean;
}



/**
 * 媒体展示组件
 * 
 * 支持图片轮播和视频播放的通用组件，严格使用 16:9 长宽比
 *
 * @component
 * @example
 * // 图片轮播 (16:9 比例)
 * <MediaDisplay 
 *   type={MediaType.IMAGES}
 *   media={[
 *     { url: '/images/1.jpg', title: '图片1' },
 *     { url: '/images/2.jpg', title: '图片2' }
 *   ]}
 *   autoPlay={true}
 * />
 * 
 * // 视频展示 (16:9 比例)
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
  showNavigation = true
}: MediaDisplayProps) {
  // 当前展示的媒体索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 是否正在播放自动轮播
  const [isPlaying, setIsPlaying] = useState(false);
  // 是否hover状态（用于控制视频控件）
  const [isHovered, setIsHovered] = useState(false);

  /**
   * 组件挂载后设置自动播放状态
   */
  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  /**
   * 计算容器样式，严格限定为16:9长宽比
   */
  const getContainerStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    // 严格限定为 16:9 比例
    style.aspectRatio = '16/9'; // 16:9 = 1.777777...
    // 确保最小宽度，这样可以确保最小高度（因为比例是固定的）
    style.minWidth = '620px'; // 对应350px高度的16:9比例宽度
    
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
    // 对于占位符，我们希望文字始终可见，不需要hover效果
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
          className={`group relative overflow-hidden rounded-lg shadow-lg min-w-0 ${className}`}
          style={{ 
            ...getContainerStyle()
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay={true}
            controls={isHovered}
            loop
            muted
            poster={videoItem.thumbnail}
            aria-label={videoItem.title || '视频内容'}
          >
            <source src={videoItem.url} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
        
        {videoItem.title && (
          <div className="absolute bottom-12 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <h4 className="text-black font-medium drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{videoItem.title}</h4>
            {videoItem.description && (
              <p className="text-black/90 text-sm mt-1 drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{videoItem.description}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // 图片轮播
  
  return (
    <div 
      className={`media-display-container group relative overflow-hidden rounded-lg shadow-lg min-w-0 ${className}`}
      style={{ 
        ...getContainerStyle()
      }}
    >
      {/* 主图片展示区域 */}
      <div className="relative h-full">
        <img
          src={media[currentIndex].url}
          alt={media[currentIndex].title || `图片 ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* 底部渐变背景层 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 图片信息覆盖层 */}
        {media[currentIndex].title && (
          <div className="absolute bottom-10 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <h4 className="text-black font-medium drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{media[currentIndex].title}</h4>
            {media[currentIndex].description && (
              <p className="text-black/90 text-sm mt-1 drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{media[currentIndex].description}</p>
            )}
          </div>
        )}
      </div>

      {/* 导航控件 */}
      {/* 导航箭头 */}
      {showNavigation && media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            aria-label="上一张图片"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
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
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
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
              className={`w-2 h-2 rounded-full transition-colors drop-shadow-md ${
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
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}

export default MediaDisplay; 