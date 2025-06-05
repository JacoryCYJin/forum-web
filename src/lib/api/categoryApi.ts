/**
 * @file 分类API模块
 * @description 提供分类相关的API调用函数
 */

import { get } from "@/lib/utils/request";
import { Category, CategoryListResponse } from "@/types/categoryType";
import { ApiResponse } from "@/types/userType";

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
    
    // 使用完整路径，与 userApi.ts 保持一致
    // const response: ApiResponse<CategoryListResponse> = await get("/categories/list", {
    const response: ApiResponse<CategoryListResponse> = await get("http://localhost:8084/categories/list", {
      page: 1,
      pageSize: 10,
      fetchAll: true,
    });
    
    console.log("✅ 获取分类列表响应:", response);
    
    // 检查响应数据结构 - 实际数据在 response.data.list 中
    if (response && response.data && response.data.list && Array.isArray(response.data.list)) {
      console.log(`📊 获取到 ${response.data.list.length} 个分类`);
      console.log('🏷️ 分类列表:', response.data.list);
      return response.data.list;
    } else {
      console.warn('⚠️ API响应数据格式异常:', response);
      console.warn('⚠️ response.data:', response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ 获取分类列表失败:", error);
    throw error;
  }
}
