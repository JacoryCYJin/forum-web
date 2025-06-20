/**
 * @file 性能优化工具函数
 * @description 提供统一的性能优化方法，包括懒加载、代码分割、性能监控等
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import dynamic from 'next/dynamic';

/**
 * 创建懒加载组件的统一方法
 * 
 * @param importFn - 动态导入函数
 * @returns 懒加载组件
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(importFn);
}

/**
 * 创建 Next.js 动态组件的统一方法
 * 
 * @param importFn - 动态导入函数
 * @param options - 动态组件选项
 * @returns 动态组件
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: () => React.JSX.Element;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading,
    ssr: options?.ssr ?? true,
  });
}

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  /**
   * 开始性能标记
   * 
   * @param name - 标记名称
   */
  static start(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.marks.set(name, performance.now());
    }
  }

  /**
   * 结束性能标记并返回耗时
   * 
   * @param name - 标记名称
   * @returns 耗时（毫秒）
   */
  static end(name: string): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const startTime = this.marks.get(name);
      if (startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.marks.delete(name);
        
        // 开发环境下输出性能信息
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      }
    }
    return 0;
  }

  /**
   * 测量函数执行时间
   * 
   * @param name - 测量名称
   * @param fn - 要测量的函数
   * @returns 函数执行结果
   */
  static async measure<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(name);
    }
  }
}

/**
 * 图片预加载工具
 * 
 * @param src - 图片地址
 * @returns Promise
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 * 
 * @param srcs - 图片地址数组
 * @returns Promise
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * 防抖函数
 * 
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 * 
 * @param fn - 要节流的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * 检查是否为慢网络连接
 * 
 * @returns 是否为慢网络
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  return connection?.effectiveType === 'slow-2g' || 
         connection?.effectiveType === '2g' ||
         connection?.saveData === true;
}

/**
 * 根据网络状况调整组件加载策略
 * 
 * @param componentImport - 组件导入函数
 * @param fallbackImport - 简化版组件导入函数
 * @returns 动态组件
 */
export function createAdaptiveComponent<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  fallbackImport?: () => Promise<{ default: T }>
) {
  return createDynamicComponent(
    () => {
      // 如果是慢网络且有fallback，使用简化版本
      if (isSlowConnection() && fallbackImport) {
        return fallbackImport();
      }
      return componentImport();
    },
    {
      ssr: !isSlowConnection(), // 慢网络时禁用SSR以减少首屏时间
    }
  );
} 