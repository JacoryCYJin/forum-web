'use client';

/**
 * @file 帖子查看跟踪组件
 * @module components/features/post/PostViewTracker
 * @description 在帖子页面加载时发送查看事件到埋点系统
 */

import { useEffect } from 'react';
import { trackViewPost } from '../../../lib/api/trackingApi';

/**
 * 帖子查看跟踪组件属性
 */
interface PostViewTrackerProps {
  /**
   * 帖子ID
   */
  postId: string;
  
  /**
   * 帖子标题
   */
  postTitle?: string;
}

/**
 * 帖子查看跟踪组件
 * 
 * 在组件挂载时发送帖子查看事件到埋点系统
 * 
 * @component
 */
export default function PostViewTracker({ postId }: PostViewTrackerProps) {
  useEffect(() => {
    // 发送帖子查看事件
    trackViewPost(postId);
    
    // 这里可以添加计时逻辑，记录用户查看帖子的时长
    const startTime = Date.now();
    
    return () => {
      // 组件卸载时可以计算查看时长
      const viewDuration = Math.round((Date.now() - startTime) / 1000);
      console.log(`用户查看帖子 ${postId} 时长: ${viewDuration}秒`);
    };
  }, [postId]);

  // 这是一个纯逻辑组件，不需要渲染任何内容
  return null;
} 