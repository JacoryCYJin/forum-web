/**
 * @file 事件跟踪API
 * @module lib/api/trackingApi
 * @description 提供事件跟踪相关的API调用
 */

import request from '../utils/request';
import { EventLogRequest, EventLogData, EventName } from '../../types/trackingTypes';
import { useUserStore } from '../../store/userStore';

/**
 * 获取当前环境信息
 * 
 * @returns 包含系统和浏览器信息的对象
 */
const getEnvironmentInfo = () => {
  if (typeof window === 'undefined') {
    return { os: 'server', browser: 'server' };
  }
  
  // 获取操作系统信息
  const userAgent = navigator.userAgent;
  let os = 'unknown';
  
  if (/Windows/.test(userAgent)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS';
  }
  
  // 获取浏览器信息
  let browser = 'unknown';
  
  if (/Firefox/.test(userAgent)) {
    browser = 'Firefox';
  } else if (/SamsungBrowser/.test(userAgent)) {
    browser = 'Samsung Browser';
  } else if (/MSIE|Trident/.test(userAgent)) {
    browser = 'Internet Explorer';
  } else if (/Edge/.test(userAgent)) {
    browser = 'Edge';
  } else if (/Chrome/.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Safari/.test(userAgent)) {
    browser = 'Safari';
  }
  
  return { os, browser };
};

/**
 * 获取用户IP地址
 * 
 * 使用公共API获取用户IP地址
 * 
 * @returns 用户IP地址的Promise
 */
const getUserIp = async (): Promise<string> => {
  try {
    // 使用ipify API获取用户IP
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('获取用户IP失败:', error);
    return '0.0.0.0'; // 返回默认值
  }
};

/**
 * 格式化当前时间为yyyy-MM-dd HH:mm:ss格式
 * 
 * @returns 格式化后的时间字符串
 */
const formatCurrentTime = (): string => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 检查用户是否已登录
 * 
 * @returns 用户是否已登录
 */
const isUserLoggedIn = (): boolean => {
  try {
    const user = useUserStore.getState().user;
    return !!user && !!user.userId;
  } catch (error) {
    console.error('获取用户登录状态失败:', error);
    return false;
  }
};

/**
 * 报告事件日志
 * 
 * @param data - 事件日志数据
 * @returns API响应
 */
export const reportEventLogApi = async (data: EventLogData): Promise<any> => {
  try {
    // 检查用户是否已登录，未登录用户不触发埋点
    if (!isUserLoggedIn()) {
      console.log('未登录用户，不触发埋点事件');
      return null;
    }
    
    // 获取当前用户ID
    const user = useUserStore.getState().user;
    
    // 获取环境信息
    const { os, browser } = getEnvironmentInfo();
    
    // 获取用户IP
    const userIp = await getUserIp();
    
    // 构建完整的事件数据，严格按照格式要求
    const eventData: EventLogData = {
      user_id: user?.userId ? String(user.userId) : undefined,
      post_id: data.post_id,
      event_name: data.event_name,
      event_time: formatCurrentTime(), // yyyy-MM-dd HH:mm:ss 格式
      user_ip: userIp, // 从前端获取的用户IP
      os: os,
      browser: browser
    };
    
    // 构建请求体，event_type固定为0
    const requestBody: EventLogRequest = {
      event_type: 0, // 论坛服务的标识
      log_data: JSON.stringify(eventData)
    };
    
    console.log('发送埋点数据:', requestBody);
    
    // 发送API请求
    return await request.post('/event_log/report', requestBody);
  } catch (error) {
    console.error('报告事件日志失败:', error);
    // 埋点失败不影响主要业务流程，所以不抛出异常
    return null;
  }
};

/**
 * 跟踪查看帖子事件
 * 
 * @param postId - 帖子ID
 */
export const trackViewPost = async (postId: string): Promise<void> => {
  // 未登录用户不触发埋点
  if (!isUserLoggedIn()) {
    return;
  }
  
  try {
    await reportEventLogApi({
      post_id: postId,
      event_name: EventName.VIEW_POST
    });
  } catch (error) {
    console.error('跟踪查看帖子事件失败:', error);
  }
};

/**
 * 跟踪点赞帖子事件
 * 
 * @param postId - 帖子ID
 */
export const trackLikePost = async (postId: string): Promise<void> => {
  // 未登录用户不触发埋点
  if (!isUserLoggedIn()) {
    return;
  }
  
  try {
    await reportEventLogApi({
      post_id: postId,
      event_name: EventName.LIKE_POST
    });
  } catch (error) {
    console.error('跟踪点赞帖子事件失败:', error);
  }
};

/**
 * 跟踪评论帖子事件
 * 
 * @param postId - 帖子ID
 */
export const trackCommentPost = async (postId: string): Promise<void> => {
  // 未登录用户不触发埋点
  if (!isUserLoggedIn()) {
    return;
  }
  
  try {
    await reportEventLogApi({
      post_id: postId,
      event_name: EventName.COMMENT_POST
    });
  } catch (error) {
    console.error('跟踪评论帖子事件失败:', error);
  }
};

/**
 * 跟踪分享帖子事件
 * 
 * @param postId - 帖子ID
 */
export const trackSharePost = async (postId: string): Promise<void> => {
  // 未登录用户不触发埋点
  if (!isUserLoggedIn()) {
    return;
  }
  
  try {
    await reportEventLogApi({
      post_id: postId,
      event_name: EventName.SHARE_POST
    });
  } catch (error) {
    console.error('跟踪分享帖子事件失败:', error);
  }
};

/**
 * 跟踪收藏帖子事件
 * 
 * @param postId - 帖子ID
 */
export const trackFavouritePost = async (postId: string): Promise<void> => {
  // 未登录用户不触发埋点
  if (!isUserLoggedIn()) {
    return;
  }
  
  try {
    await reportEventLogApi({
      post_id: postId,
      event_name: EventName.FAVOURITE_POST
    });
  } catch (error) {
    console.error('跟踪收藏帖子事件失败:', error);
  }
};
