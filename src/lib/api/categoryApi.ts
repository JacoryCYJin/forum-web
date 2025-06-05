/**
 * @file 分类API模块
 * @description 提供分类相关的API调用函数
 */

import { get } from "@/lib/utils/request";
import { Category, CategoryListResponse } from "@/types/categoryType";
import { ApiResponse } from "@/types/userType";

// 在文件顶部添加缓存
let categoriesCache: Category[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 获取分类列表
 * 
 * 从论坛服务获取分类列表数据
 *
 * @async
 * @returns {Promise<Category[]>} 分类列表数据
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取所有分类
 * const categories = await getCategoryListApi();
 */
export async function getCategoryListApi(): Promise<Category[]> {
  try {
    console.log('📡 正在调用分类API...');
    // const response: ApiResponse<CategoryListResponse> = await get("/categories/list", {
    const response: ApiResponse<CategoryListResponse> = await get("http://localhost:8084/categories/list", {
      page: 1,
      pageSize: 10,
      fetchAll: true,
    });
    
    console.log("✅ 获取分类列表响应:", response);
    
    if (response && response.data && response.data.list && Array.isArray(response.data.list)) {
      console.log(`📊 获取到 ${response.data.list.length} 个分类`);
      return response.data.list;
    } else {
      console.warn('⚠️ API响应数据格式异常:', response);
      return [];
    }
  } catch (error) {
    console.error("❌ 获取分类列表失败:", error);
    throw error;
  }
}

/**
 * 获取分类列表（带缓存）
 * 
 * 为了避免重复请求，添加了5分钟的缓存机制
 *
 * @async
 * @returns {Promise<Category[]>} 分类列表数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getCategoryListWithCacheApi(): Promise<Category[]> {
  const now = Date.now();
  
  // 检查缓存是否有效
  if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 使用缓存的分类数据');
    return categoriesCache;
  }
  
  try {
    console.log('🌐 重新获取分类数据');
    const categories = await getCategoryListApi();
    
    // 更新缓存
    categoriesCache = categories;
    cacheTimestamp = now;
    
    return categories;
  } catch (error) {
    console.error("❌ 获取分类列表失败:", error);
    
    // 如果请求失败但有缓存数据，返回缓存数据
    if (categoriesCache) {
      console.log('⚠️ 请求失败，使用缓存数据');
      return categoriesCache;
    }
    
    throw error;
  }
}

/**
 * 清除分类缓存
 * 
 * 当分类数据可能发生变化时调用此方法
 */
export function clearCategoryCache(): void {
  categoriesCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ 已清除分类缓存');
}

/**
 * 根据分类ID查找分类信息
 * 
 * 通过获取完整分类列表，然后在前端过滤出指定ID的分类
 * 这是因为后端目前只提供列表查询接口，没有单独的ID查询接口
 *
 * @async
 * @param {string} categoryId - 分类ID
 * @returns {Promise<Category | null>} 分类信息，未找到返回null
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getCategoryByIdApi(categoryId: string): Promise<Category | null> {
  try {
    console.log('🔍 查找分类信息，ID:', categoryId);
    
    // 使用缓存版本的API
    const categories = await getCategoryListWithCacheApi();
    
    const category = categories.find(cat => cat.categoryId === categoryId);
    
    if (category) {
      console.log('✅ 找到分类信息:', category);
      return category;
    } else {
      console.warn('⚠️ 未找到分类信息，ID:', categoryId);
      return null;
    }
  } catch (error) {
    console.error("❌ 获取分类信息失败:", error);
    throw error;
  }
}

/**
 * 根据分类名称查找分类信息
 * 
 * 利用后端的 category_name 参数进行查询
 *
 * @async
 * @param {string} categoryName - 分类名称
 * @returns {Promise<Category | null>} 分类信息，未找到返回null
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getCategoryByNameApi(categoryName: string): Promise<Category | null> {
  try {
    console.log('🔍 根据名称查找分类信息:', categoryName);
    
    // const response: ApiResponse<CategoryListResponse> = await get("/categories/list", {
    const response: ApiResponse<CategoryListResponse> = await get("http://localhost:8084/categories/list", {
      category_name: categoryName,
      page: 1,
      pageSize: 10,
      fetchAll: true,
    });
    
    console.log("✅ 根据名称获取分类响应:", response);
    
    if (response && response.data && response.data.list && Array.isArray(response.data.list)) {
      // 返回第一个匹配的分类（通常应该只有一个）
      const category = response.data.list[0] || null;
      
      if (category) {
        console.log('✅ 找到分类信息:', category);
      } else {
        console.warn('⚠️ 未找到分类信息，名称:', categoryName);
      }
      
      return category;
    } else {
      console.warn('⚠️ API响应数据格式异常:', response);
      return null;
    }
  } catch (error) {
    console.error("❌ 根据名称获取分类信息失败:", error);
    throw error;
  }
}
