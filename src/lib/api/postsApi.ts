/**
 * @file 帖子API模块
 * @module lib/api/postsApi
 * @description 提供帖子相关的API调用函数
 */

import { get } from '@/lib/utils/request';
import type { 
  Post, 
  PostQueryParams, 
  PageResponse, 
  ApiResponse 
} from '@/types/postType';

/**
 * 获取帖子列表API
 * 
 * 从服务器获取分页的帖子列表数据
 *
 * @async
 * @param {PostQueryParams} params - 查询参数
 * @returns {Promise<PageResponse<Post>>} 分页帖子列表数据
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取第一页帖子数据
 * const posts = await getPostListApi({ page_num: 1, page_size: 10 });
 * 
 * // 获取带搜索条件的帖子数据
 * const searchResults = await getPostListApi({ 
 *   title: 'Next.js',
 *   page_num: 1, 
 *   page_size: 20 
 * });
 */
export async function getPostListApi(params: PostQueryParams = {}): Promise<PageResponse<Post>> {
  try {
    // const response: ApiResponse<PageResponse<Post>> = await get('/posts/list', params);
    const response: ApiResponse<PageResponse<Post>> = await get('http://localhost:8084/posts/list', params);
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '获取帖子列表失败');
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取帖子详情API
 * 
 * 获取单个帖子的详细信息
 *
 * @async
 * @param {string} postId - 帖子ID
 * @returns {Promise<Post>} 帖子详情数据
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * const post = await getPostByIdApi('post-123');
 */
export async function getPostByIdApi(postId: string): Promise<Post> {
  try {
    // const response: ApiResponse<Post> = await get(`/posts/${postId}`);
    const response: ApiResponse<Post> = await get(`http://localhost:8084/posts/${postId}`);
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '获取帖子详情失败');
    }
  } catch (error) {
    console.error(`获取帖子(ID: ${postId})详情失败:`, error);
    throw error;
  }
}

/**
 * 根据分类获取帖子列表API
 * 
 * 获取指定分类下的帖子列表
 *
 * @async
 * @param {string} categoryName - 分类名称
 * @param {number} pageNum - 页码
 * @param {number} pageSize - 每页大小
 * @returns {Promise<PageResponse<Post>>} 分页帖子列表数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getPostsByCategoryApi(
  categoryName: string, 
  pageNum: number = 1, 
  pageSize: number = 10
): Promise<PageResponse<Post>> {
  try {
    const response: ApiResponse<PageResponse<Post>> = await get(
      `http://localhost:8084/posts/category/${categoryName}`,
      { page_num: pageNum, page_size: pageSize }
    );
    
    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || '获取分类帖子列表失败');
    }
  } catch (error) {
    console.error(`获取分类(${categoryName})帖子列表失败:`, error);
    throw error;
  }
}

// 地图帖子数据类型
export interface MapPost {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
}

/**
 * 获取地图上显示的帖子
 * @returns 帖子列表
 */
export async function fetchMapPostsApi(): Promise<MapPost[]> {
  // 实际项目中，这里应该是真实的API调用
  // 例如：const response = await fetch('/api/map-posts');
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  return [
    {
      id: 1,
      latitude: 39.9042,
      longitude: 116.4074,
      title: "北京天安门附近有什么好吃的?",
      author: "美食家",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5分钟前
      content: "求推荐北京天安门附近的美食，最好是老字号"
    },
    {
      id: 2,
      latitude: 39.9142,
      longitude: 116.3974,
      title: "故宫今天人多吗?",
      author: "旅行者",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15分钟前
      content: "计划明天去故宫，想问问今天人多不多"
    },
    {
      id: 3,
      latitude: 39.9242,
      longitude: 116.4174,
      title: "王府井附近有什么好玩的?",
      author: "探险家",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25分钟前
      content: "第一次来北京，想在王府井附近找些有意思的地方"
    }
  ];
}