/**
 * @file 帖子API模块
 * @module lib/api/postsApi
 * @description 提供帖子相关的API调用函数
 */

import { get, del, post } from '@/lib/utils/request';
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

    console.log('📤 getPostListApi请求参数:', {
      originalParams: params,
      requestParams,
      url: '/posts/list'
    });

    const response: ApiResponse<PageResponse<Post>> = await get('/posts/list', requestParams);
    
    console.log('📥 getPostListApi响应:', response);
    
    if (response.code === 0 && response.data) {
      console.log('✅ 返回数据:', response.data);
      return response.data;
    } else {
      console.error('❌ API响应错误:', response);
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

/**
 * 创建帖子API
 * 
 * 创建一个新的帖子，支持文件上传
 *
 * @async
 * @param {Object} params - 创建帖子的参数
 * @param {string} params.title - 帖子标题
 * @param {string} params.content - 帖子内容
 * @param {string} params.category_id - 分类ID (使用下划线格式，后端自动转换为categoryId)
 * @param {string[]} [params.tag_names] - 标签名称列表 (使用下划线格式，后端自动转换为tagNames)
 * @param {string} [params.location] - 发帖位置
 * @param {File[]} [params.files] - 上传的附件文件列表
 * @param {File[]} [params.content_images] - 富文本内容中的图片文件列表 (使用下划线格式，后端自动转换为contentImages)
 * @returns {Promise<boolean>} 创建结果
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 创建图文帖子
 * await createPostApi({
 *   title: '我的帖子',
 *   content: '帖子内容',
 *   category_id: 'category-123',
 *   tag_names: ['技术', '前端'],
 *   location: '116.4074,39.9042',
 *   files: [file1, file2],
 *   content_images: [image1, image2]
 * });
 */
export async function createPostApi(params: FormData | {
  title: string;
  content: string;
  category_id: string;
  tag_names?: string[];
  location?: string;
  files?: File[];
  content_images?: File[];
}): Promise<boolean> {
  console.log('📤 createPostApi请求参数:', params);

  try {
    let formData: FormData;
    
    if (params instanceof FormData) {
      // 如果已经是FormData，直接使用
      formData = params;
    } else {
      // 如果是普通对象，转换为FormData
      formData = new FormData();
      
      // 添加基本字段 - 使用snake_case格式，后端会自动转换为camelCase
      formData.append('title', params.title);
      formData.append('content', params.content);
      formData.append('category_id', params.category_id); // 使用下划线格式
      
      console.log('📋 FormData基本字段:');
      console.log('  - title:', params.title);
      console.log('  - content:', params.content ? `${params.content.substring(0, 50)}...` : 'empty');
      console.log('  - category_id:', params.category_id);
      
      // 添加可选字段
      if (params.location) {
        formData.append('location', params.location);
        console.log('  - location:', params.location);
      }
      
      // 标签名称列表 - 使用下划线格式
      if (params.tag_names && params.tag_names.length > 0) {
        params.tag_names.forEach(tagName => {
          formData.append('tag_names', tagName); // 使用下划线格式
        });
        console.log('  - tag_names:', params.tag_names);
      }
      
      // 添加附件文件
      if (params.files && params.files.length > 0) {
        params.files.forEach(file => {
          formData.append('files', file);
        });
        console.log('  - files count:', params.files.length);
      }
      
      // 添加富文本内容图片 - 使用下划线格式
      if (params.content_images && params.content_images.length > 0) {
        params.content_images.forEach(image => {
          formData.append('content_images', image); // 使用下划线格式
        });
        console.log('  - content_images count:', params.content_images.length);
      }
      
      // 打印FormData的所有字段（调试用）
      console.log('📋 完整FormData内容:');
      for (const [key, value] of formData.entries()) {
        console.log(`  - ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }
    }

    const response = await post('/posts/add', formData);
    
    console.log('📥 createPostApi响应:', response);
    
    if (response.code === 0) {
      console.log('✅ 创建帖子成功');
      return true;
    } else {
      throw new Error(response.message || '创建帖子失败');
    }
  } catch (error: any) {
    console.error('❌ createPostApi错误:', error);
    throw new Error(error.message || '创建帖子失败');
  }
}