/**
 * @file 帖子API模块
 * @module lib/api/postsApi
 * @description 提供帖子相关的API调用函数
 */

import { get, del } from '@/lib/utils/request';
import type { 
  Post, 
  PostDetail,
  PostQueryParams,
  PostDetailQueryParams,
  PageResponse, 
  ApiResponse 
} from '@/types/postTypes';

/**
 * 获取帖子列表API
 * 
 * 从服务器获取分页的帖子列表数据，支持按用户ID过滤
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
 * 
 * // 获取指定用户的帖子数据
 * const userPosts = await getPostListApi({ 
 *   user_id: 'user-123',
 *   page_num: 1, 
 *   page_size: 10 
 * });
 */
export async function getPostListApi(params: PostQueryParams = {}): Promise<PageResponse<Post>> {
  try {
    // 转换为下划线格式
    const requestParams = {
      title: params.title,
      user_id: params.user_id,
      page_num: params.page_num,
      page_size: params.page_size,
      fetch_all: params.fetch_all
    };

    const response: ApiResponse<PageResponse<Post>> = await get('/posts/list', requestParams);
    
    if (response.code === 0 && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || '获取帖子列表失败');
    }
  } catch (error) {
    console.error('❌ 获取帖子列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取帖子详情API
 * 
 * 获取单个帖子的详细信息，包含分页的评论列表
 *
 * @async
 * @param {string} postId - 帖子ID
 * @param {PostDetailQueryParams} params - 查询参数（评论分页）
 * @returns {Promise<PostDetail>} 帖子详情数据
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取帖子详情（默认评论分页）
 * const post = await getPostByIdApi('post-123');
 * 
 * // 获取帖子详情（指定评论分页）
 * const post = await getPostByIdApi('post-123', { 
 *   comment_page_num: 2, 
 *   comment_page_size: 20 
 * });
 */
export async function getPostByIdApi(
  postId: string, 
  params: PostDetailQueryParams = {}
): Promise<PostDetail> {
  try {
    const queryParams = {
      comment_page_num: params.comment_page_num || 1,
      comment_page_size: params.comment_page_size || 10
    };
    
    const response: ApiResponse<PostDetail> = await get(`/posts/${postId}`, queryParams);
    
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
 * 根据分类ID获取帖子列表API
 * 
 * 获取指定分类下的帖子列表
 *
 * @async
 * @param {string} categoryId - 分类ID
 * @param {number} pageNum - 页码，从1开始
 * @param {number} pageSize - 每页大小
 * @returns {Promise<PageResponse<Post>>} 分页帖子列表数据
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取指定分类的帖子列表
 * const posts = await getPostsByCategoryIdApi('category-123', 1, 10);
 */
export async function getPostsByCategoryIdApi(
  categoryId: string, 
  pageNum: number = 1, 
  pageSize: number = 10
): Promise<PageResponse<Post>> {
  try {
    const url = `/posts/category/${categoryId}`;
    const params = { 
      page_num: pageNum,
      page_size: pageSize
    };
    
    const response: ApiResponse<PageResponse<Post>> = await get(url, params);

    if (response.code === 0 && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || '获取分类帖子列表失败');
    }
  } catch (error) {
    console.error(`获取分类 ${categoryId} 帖子列表失败:`, error);
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

/**
 * 获取用户帖子总数
 * 
 * 获取指定用户或当前登录用户的帖子总数
 *
 * @async
 * @param {Object} params - 查询参数
 * @param {string} [params.userId] - 用户ID，如果为空则获取当前登录用户的帖子数
 * @returns {Promise<number>} 帖子总数
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取当前用户的帖子数
 * const postCount = await getUserPostCountApi({});
 * 
 * // 获取指定用户的帖子数
 * const userPostCount = await getUserPostCountApi({ userId: 'user-123' });
 */
export async function getUserPostCountApi(params: {
  userId?: string;
}): Promise<number> {
  const queryParams = params.userId ? { user_id: params.userId } : {};
  const response: ApiResponse<number> = await get('/posts/user-post-count', queryParams);
  return response.data;
}



/**
 * 删除帖子API
 * 
 * 删除指定ID的帖子，需要用户权限验证
 *
 * @async
 * @param {string} postId - 要删除的帖子ID
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 删除指定帖子
 * await deletePostApi('post-123');
 */
export async function deletePostApi(postId: string): Promise<void> {
  try {
    // 使用正确的URL路径和请求体格式，匹配后端PostDeleteForm的SnakeCaseStrategy
    const response: ApiResponse<void> = await del('/posts/delete', {
      data: {
        post_id: postId
      }
    });
    
    if (response.code !== 0) {
      throw new Error(response.message || '删除帖子失败');
    }
  } catch (error) {
    console.error(`删除帖子(ID: ${postId})失败:`, error);
    throw error;
  }
}