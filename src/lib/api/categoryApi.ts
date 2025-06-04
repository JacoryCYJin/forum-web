/**
 * @file 分类API模块
 * @description 提供分类相关的API调用函数
 */

import { get } from "@/lib/utils/request";
// import request from "@/lib/utils/request";
import { Category } from "@/types/categoryType";
import { ApiResponse } from "@/types/userType";

export async function getCategoryListApi() {
  try {
    // const response: ApiResponse<Category[]> = await get('/categories/list');
    const response: ApiResponse<Category[]> = await get("8084/categories/list", {
      page: 1,
      pageSize: 10,
      fetchAll: true,
    });
    console.log("获取分类列表响应:", response);
    return response.data;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    throw error;
  }
}
