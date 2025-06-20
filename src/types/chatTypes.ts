/**
 * @file 聊天系统相关类型定义
 * @description 定义聊天消息、用户、表单等数据类型
 */

/**
 * 聊天消息类型
 */
export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video';

/**
 * 消息状态类型
 */
export type MessageStatus = 'sent' | 'delivered' | 'read';

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /**
   * 消息唯一标识
   */
  messageId: string;
  
  /**
   * 发送者用户ID
   */
  fromUserId: string;
  
  /**
   * 接收者用户ID
   */
  toUserId: string;
  
  /**
   * 消息内容
   */
  content: string;
  
  /**
   * 消息类型
   */
  msgType: MessageType;
  
  /**
   * 消息状态
   */
  status: MessageStatus;
  
  /**
   * 是否已撤回
   */
  revoked: number;
  
  /**
   * 创建时间
   */
  ctime: string;
  
  /**
   * 修改时间
   */
  mtime: string;
}

/**
 * 发送文本消息请求参数
 */
export interface SendMessageRequest {
  /**
   * 接收者用户ID
   */
  to_user_id: string;
  
  /**
   * 消息内容
   */
  content: string;
  
  /**
   * 消息类型
   */
  msg_type: MessageType;
}

/**
 * 发送文件消息请求参数
 */
export interface SendFileMessageRequest {
  /**
   * 接收者用户ID
   */
  to_user_id: string;
  
  /**
   * 消息描述内容
   */
  content: string;
  
  /**
   * 消息类型
   */
  msg_type: MessageType;
  
  /**
   * 文件对象
   */
  file: File;
}

/**
 * 获取聊天记录请求参数
 */
export interface GetChatHistoryRequest {
  /**
   * 聊天对象用户ID
   */
  with_user_id: string;
  
  /**
   * 页码
   */
  page?: number;
  
  /**
   * 每页大小
   */
  size?: number;
}

/**
 * 撤回消息请求参数
 */
export interface RevokeMessageRequest {
  /**
   * 消息ID
   */
  message_id: string;
}

/**
 * 检查互相关注请求参数
 */
export interface CheckMutualFollowRequest {
  /**
   * 目标用户ID
   */
  target_id: string;
}

/**
 * 检查聊天权限请求参数
 */
export interface CheckChatPermissionRequest {
  /**
   * 目标用户ID
   */
  target_id: string;
}

/**
 * 互相关注状态响应
 */
export interface MutualFollowResponse {
  /**
   * 是否互相关注
   */
  isMutual: boolean;
}

/**
 * 聊天权限响应
 */
export interface ChatPermissionResponse {
  /**
   * 是否有聊天权限
   */
  hasPermission: boolean;
  
  /**
   * 消息提示
   */
  message?: string;
}

/**
 * 聊天联系人接口
 */
export interface ChatContact {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 昵称
   */
  nickname: string;
  
  /**
   * 头像URL
   */
  avatar: string;
  
  /**
   * 最后一条消息
   */
  lastMessage?: string;
  
  /**
   * 最后消息时间
   */
  lastMessageTime?: string;
  
  /**
   * 未读消息数
   */
  unreadCount?: number;
  
  /**
   * 是否在线
   */
  isOnline?: boolean;
}

/**
 * 聊天会话接口
 */
export interface ChatSession {
  /**
   * 聊天对象
   */
  contact: ChatContact;
  
  /**
   * 消息列表
   */
  messages: ChatMessage[];
  
  /**
   * 是否正在加载
   */
  loading: boolean;
  
  /**
   * 是否有更多消息
   */
  hasMore: boolean;
}
