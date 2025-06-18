/**
 * @file 位置显示组件
 * @description 显示地理位置信息，支持将经纬度转换为地址
 */

'use client';

import React, { useState, useEffect } from 'react';
import { locationToAddress } from '@/lib/utils/geoUtils';

/**
 * 位置显示组件Props
 */
interface LocationDisplayProps {
  /** 位置字符串，格式为 "经度,纬度" */
  location: string;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 是否显示完整地址，false时只显示城市名 */
  showFullAddress?: boolean;
}

/**
 * 位置显示组件
 * 
 * 将经纬度坐标转换为可读的地址信息
 *
 * @component
 * @example
 * // 基本用法
 * <LocationDisplay location="116.4074,39.9042" />
 * 
 * // 自定义样式
 * <LocationDisplay 
 *   location="116.4074,39.9042" 
 *   showIcon={true}
 *   className="text-blue-600"
 *   showFullAddress={true}
 * />
 */
export function LocationDisplay({ 
  location, 
  showIcon = true, 
  className = '',
  showFullAddress = true 
}: LocationDisplayProps) {
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 转换位置为地址
   */
  useEffect(() => {
    const convertLocation = async () => {
      if (!location) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const addressResult = await locationToAddress(location);
        
        if (!showFullAddress && addressResult) {
          // 提取城市名称（简化显示）
          const parts = addressResult.split(/[省市区县]/);
          if (parts.length >= 2) {
            setAddress(parts[1] + '市');
          } else {
            setAddress(addressResult);
          }
        } else {
          setAddress(addressResult);
        }
      } catch (err) {
        console.error('位置转换失败:', err);
        setError('位置解析失败');
        setAddress(location); // 显示原始坐标
      } finally {
        setIsLoading(false);
      }
    };

    convertLocation();
  }, [location, showFullAddress]);

  // 如果没有位置信息，不渲染组件
  if (!location) {
    return null;
  }

  const baseClasses = "inline-flex items-center space-x-1 text-sm";
  const finalClassName = className || "text-blue-600 dark:text-blue-400";

  return (
    <div className={`${baseClasses} ${finalClassName}`}>
      {showIcon && (
        <svg 
          className="w-4 h-4 flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      )}
      
      <span className="truncate">
        {isLoading ? (
          <span className="flex items-center space-x-1">
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
            <span>定位中...</span>
          </span>
        ) : error ? (
          <span className="text-red-500" title={location}>
            位置解析失败
          </span>
        ) : (
          <span title={showFullAddress ? address : location}>
            {address || location}
          </span>
        )}
      </span>
    </div>
  );
}

export default LocationDisplay; 