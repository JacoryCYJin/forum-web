'use client';

import { useState } from 'react';
import { MapPost } from '@/lib/api/posts';

interface MapBubbleProps {
  post: MapPost;
  opacity: number;
}

export default function MapBubble({ post, opacity }: MapBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 如果透明度为0，不渲染气泡
  if (opacity <= 0) return null;
  
  // 根据经纬度计算气泡位置（这里是模拟计算，实际项目需要根据地图API进行转换）
  // 实际项目中，应该使用地图API提供的经纬度转像素坐标的方法
  const positionStyle = {
    left: `${((post.longitude - 116.3) / 0.3) * 100}%`,
    top: `${((39.95 - post.latitude) / 0.1) * 100}%`,
    opacity: opacity
  };

  // 计算创建时间到现在的分钟数
  const getTimeAgo = (dateString: string): string => {
    const created = new Date(dateString).getTime();
    const now = Date.now();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    
    if (diffMinutes < 1) return '刚刚';
    return `${diffMinutes}分钟前`;
  };

  return (
    <div 
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
      style={positionStyle}
    >
      {/* 自定义弹出卡片 */}
      <div className="relative">
        {/* 气泡点 */}
        <div 
          className={`
            w-4 h-4 rounded-full bg-primary shadow-md 
            ${isHovered ? 'scale-150' : 'scale-100'} 
            transition-transform duration-300
            animate-pulse cursor-pointer
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        ></div>
        
        {/* 弹出卡片 */}
        {isHovered && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-3 w-64 z-20">
            {/* 小三角形 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-dark-secondary"></div>
            
            <h3 className="text-base font-medium mb-1 text-neutral-800 dark:text-white">{post.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">{post.content}</p>
            <div className="text-xs text-neutral-400 flex justify-between">
              <span>作者: {post.author}</span>
              <span>{getTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}