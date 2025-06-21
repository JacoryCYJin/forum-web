/**
 * @file 事件跟踪类型定义
 * @module types/trackingTypes
 * @description 定义事件跟踪相关的类型和接口
 */

/**
 * 事件名称枚举
 */
export enum EventName {
  VIEW_POST = 'view_post',
  LIKE_POST = 'like_post',
  COMMENT_POST = 'comment_post',
  SHARE_POST = 'share_post',
  FAVOURITE_POST = 'favourite_post'
}

/**
 * 事件日志数据接口
 */
export interface EventLogData {
  user_id?: string;
  post_id: string;
  event_name: EventName;
  event_time?: string;
  user_ip?: string;
  os?: string;
  browser?: string;
}

/**
 * 事件日志请求接口
 */
export interface EventLogRequest {
  event_type: number;
  log_data: string; // JSON字符串化的EventLogData
}
