/**
 * @file 标签API模块
 * @description 提供标签相关的API调用函数
 */

import { get, post } from '@/lib/utils/request';
import type { ApiResponse } from '@/types/userTypes';

/**
 * 标签数据类型
 */
export interface Tag {
  /**
   * 标签ID
   */
  tagId: string;
  
  /**
   * 标签名称
   */
  tagName: string;
  
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
 * 模糊查询标签
 * 
 * 根据关键词模糊查询标签，用于前端智能提示
 *
 * @async
 * @param keyword - 搜索关键词
 * @param limit - 返回数量限制，默认10个
 * @returns 匹配的标签列表
 * @throws API请求失败时抛出错误
 * @example
 * // 搜索包含"技术"的标签
 * const tags = await searchTagsApi('技术', 5);
 */
export async function searchTagsApi(keyword: string, limit: number = 10): Promise<Tag[]> {
  const params = {
    keyword,
    limit: limit.toString()
  };
  
  const response = await get<Tag[]>('/tags/search', params);
  return response.data;
}

/**
 * 批量创建或获取标签
 * 
 * 根据标签名称列表，存在的返回ID，不存在的创建新标签并返回ID
 *
 * @async
 * @param tagNames - 标签名称列表
 * @returns 标签ID列表
 * @throws API请求失败时抛出错误
 * @example
 * // 批量处理标签
 * const tagIds = await batchCreateOrGetTagsApi(['技术', '前端', '新标签']);
 */
export async function batchCreateOrGetTagsApi(tagNames: string[]): Promise<string[]> {
  const response = await post<string[]>('/tags/batch-create-or-get', tagNames);
  return response.data;
}

/**
 * 获取标签列表
 * 
 * 获取分页的标签列表数据
 *
 * @async
 * @param params - 查询参数
 * @returns 标签列表数据
 * @throws API请求失败时抛出错误
 */
export async function getTagListApi(params: {
  tag_name?: string;
  page_num?: number;
  page_size?: number;
  fetch_all?: boolean;
}): Promise<ApiResponse<Tag[]>> {
  const response = await get<ApiResponse<Tag[]>>('/tags/list', params);
  return response.data;
} 