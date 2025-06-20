/**
 * @file 聊天系统API接口
 * @description 提供聊天相关的API调用函数
 */

import { get, post } from '@/lib/utils/request';
import {
  ChatMessage,
  SendMessageRequest,
  SendFileMessageRequest,
  GetChatHistoryRequest,
  RevokeMessageRequest,
  CheckMutualFollowRequest,
  CheckChatPermissionRequest,
  MutualFollowResponse,
  ChatPermissionResponse,
} from '@/types/chatTypes';

// 定义接口返回数据的类型
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 定义分页数据类型  
interface PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 发送文本聊天消息
 * 
 * 发送文本类型的聊天消息到指定用户
 *
 * @async
 * @param {SendMessageRequest} params - 发送消息参数
 * @returns {Promise<{success: boolean, messageId: string}>} 发送结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 发送文本消息
 * const result = await sendTextMessageApi({
 *   to_user_id: 'user123',
 *   content: '你好！',
 *   msg_type: 'text'
 * });
 */
export async function sendTextMessageApi(params: SendMessageRequest): Promise<{
  success: boolean;
  messageId: string;
}> {
  const response: ResponseData<{
    success: boolean;
    messageId: string;
  }> = await post('/chat/send', params);
  return response.data;
}

/**
 * 发送文件聊天消息
 * 
 * 发送包含文件的聊天消息到指定用户
 *
 * @async
 * @param {SendFileMessageRequest} params - 发送文件消息参数
 * @returns {Promise<{success: boolean, messageId: string, msgType: string, fileName: string}>} 发送结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 发送图片消息
 * const result = await sendFileMessageApi({
 *   to_user_id: 'user123',
 *   content: '分享一张图片',
 *   msg_type: 'image',
 *   file: imageFile
 * });
 */
export async function sendFileMessageApi(params: SendFileMessageRequest): Promise<{
  success: boolean;
  messageId: string;
  msgType: string;
  fileName: string;
}> {
  const formData = new FormData();
  formData.append('to_user_id', params.to_user_id);
  formData.append('content', params.content);
  formData.append('msg_type', params.msg_type);
  formData.append('file', params.file);

  const response: ResponseData<{
    success: boolean;
    messageId: string;
    msgType: string;
    fileName: string;
  }> = await post('/chat/send-file', formData);
  return response.data;
}

/**
 * 获取聊天记录
 * 
 * 获取与指定用户的聊天历史记录
 *
 * @async
 * @param {GetChatHistoryRequest} params - 查询参数
 * @returns {Promise<PageData<ChatMessage>>} 分页聊天记录
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取与用户的聊天记录
 * const history = await getChatHistoryApi({
 *   with_user_id: 'user123',
 *   page: 1,
 *   size: 20
 * });
 */
export async function getChatHistoryApi(params: GetChatHistoryRequest): Promise<PageData<ChatMessage>> {
  const queryParams = {
    with_user_id: params.with_user_id,
    page: params.page || 1,
    size: params.size || 20,
  };

  const response: ResponseData<PageData<ChatMessage>> = await get('/chat/history', queryParams);
  return response.data;
}

/**
 * 撤回聊天消息
 * 
 * 撤回指定的聊天消息（仅限2分钟内）
 *
 * @async
 * @param {RevokeMessageRequest} params - 撤回消息参数
 * @returns {Promise<{success: boolean, message?: string}>} 撤回结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 撤回消息
 * const result = await revokeMessageApi({
 *   message_id: 'msg123'
 * });
 */
export async function revokeMessageApi(params: RevokeMessageRequest): Promise<{
  success: boolean;
  message?: string;
}> {
  const response: ResponseData<{
    success: boolean;
    message?: string;
  }> = await post('/chat/revoke', params);
  return response.data;
}

/**
 * 检查互相关注状态
 * 
 * 检查当前用户与目标用户是否互相关注
 *
 * @async
 * @param {CheckMutualFollowRequest} params - 检查参数
 * @returns {Promise<MutualFollowResponse>} 互相关注状态
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 检查互相关注状态
 * const result = await checkMutualFollowApi({
 *   target_id: 'user123'
 * });
 */
export async function checkMutualFollowApi(params: CheckMutualFollowRequest): Promise<MutualFollowResponse> {
  const response: ResponseData<MutualFollowResponse> = await post('/chat/mutual-follow', params);
  return response.data;
}

/**
 * 检查聊天权限
 * 
 * 检查对指定用户的聊天权限（每日消息限制）
 *
 * @async
 * @param {CheckChatPermissionRequest} params - 检查参数
 * @returns {Promise<ChatPermissionResponse>} 聊天权限状态
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 检查聊天权限
 * const permission = await checkChatPermissionApi({
 *   target_id: 'user123'
 * });
 */
export async function checkChatPermissionApi(params: CheckChatPermissionRequest): Promise<ChatPermissionResponse> {
  const queryParams = {
    target_id: params.target_id,
  };

  const response: ResponseData<ChatPermissionResponse> = await get('/chat/permission', queryParams);
  return response.data;
}

/**
 * 获取所有聊天联系人列表（不分页）
 * 
 * 获取当前用户的所有聊天联系人列表，按最后消息时间排序
 *
 * @async
 * @returns {Promise<any[]>} 所有聊天联系人列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取所有聊天联系人列表
 * const contacts = await getChatContactsApi();
 */
export async function getChatContactsApi(): Promise<any[]> {
  const response: ResponseData<any[]> = await get('/chat/contacts/all');
  return response.data;
}
