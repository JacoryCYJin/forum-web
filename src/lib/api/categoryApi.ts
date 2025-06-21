/**
 * @file 分类API模块
 * @description 提供分类相关的API调用函数
 */

import { get } from "@/lib/utils/request";
import { Category, CategoryListResponse } from "@/types/categoryTypes";
import { ApiResponse } from "@/types/userTypes";

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
    console.log('正在调用分类API...');
    const response: ApiResponse<CategoryListResponse> = await get("/categories/list", {
      page_num: 1,
      page_size: 10,
      fetch_all: true,
    });
    
    console.log("✅ 获取分类列表响应:", response);
    
    if (response && response.data && response.data.list && Array.isArray(response.data.list)) {
      console.log(`获取到 ${response.data.list.length} 个分类`);
      return response.data.list;
    } else {
      console.warn('API响应数据格式异常:', response);
      return [];
    }
  } catch (error) {
    console.error("❌ 获取分类列表失败:", error);
    throw error;
  }
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
    console.log('查找分类信息，ID:', categoryId);
    
    // 直接调用API，不使用缓存
    const categories = await getCategoryListApi();
    
    const category = categories.find(cat => cat.categoryId === categoryId);
    
    if (category) {
      console.log('✅ 找到分类信息:', category);
      return category;
    } else {
      console.warn('未找到分类信息，ID:', categoryId);
      return null;
    }
  } catch (error) {
    console.error("❌ 获取分类信息失败:", error);
    throw error;
  }
}

/**
 * 获取分类列表（不带缓存）
 * 
 * 直接调用API获取最新数据
 *
 * @async
 * @returns {Promise<Category[]>} 分类列表数据
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getCategoryListWithCacheApi(): Promise<Category[]> {
  console.log('直接获取分类数据（已移除缓存）');
  return getCategoryListApi();
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
    console.log('根据名称查找分类信息:', categoryName);
    
    const response: ApiResponse<CategoryListResponse> = await get("/categories/list", {
      category_name: categoryName,
      page_num: 1,
      page_size: 10,
      fetch_all: true,
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
      console.warn('API响应数据格式异常:', response);
      return null;
    }
  } catch (error) {
    console.error("❌ 根据名称获取分类信息失败:", error);
    throw error;
  }
}
