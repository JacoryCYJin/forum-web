/**
 * @file 举报API模块
 * @module lib/api/reportApi
 * @description 提供举报相关的API调用函数
 */

import { get, post } from "@/lib/utils/request";
import type {
  ComponentType,
  SubmitReportRequest,
  SubmitReportResponse,
  ReportReason,
} from "@/types/reportTypes";

/**
 * 获取举报原因列表
 *
 * 根据组件类型获取对应的举报原因列表
 *
 * @async
 * @param {ComponentType} componentType - 组件类型（USER/POST/COMMENT）
 * @returns {Promise<ReportReason[]>} 举报原因列表
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 * // 获取用户举报原因
 * const userReasons = await getReportReasonsApi('USER');
 *
 * // 获取帖子举报原因
 * const postReasons = await getReportReasonsApi('POST');
 */
export async function getReportReasonsApi(
  componentType: ComponentType
): Promise<ReportReason[]> {
  try {
    const requestParams = {
      component_type: componentType,
    };
    
    const response = await get<ReportReason[]>("/report/reason", requestParams);

    if (response.code === 0) {
      return response.data;
    } else {
      throw new Error(response.message || "获取举报原因失败");
    }
  } catch (error: any) {
    console.error("获取举报原因失败:", error);

    // 处理不同类型的错误
    if (error.response?.status === 401) {
      throw new Error("请先登录后再进行操作");
    } else if (error.response?.status === 403) {
      throw new Error("没有权限进行此操作");
    } else if (error.response?.status >= 500) {
      throw new Error("服务器繁忙，请稍后重试");
    } else if (error.code === "NETWORK_ERROR") {
      throw new Error("网络连接失败，请检查网络设置");
    } else {
      throw new Error(error.message || "获取举报原因失败");
    }
  }
}

/**
 * 提交举报
 *
 * 向服务器提交举报信息
 *
 * @async
 * @param {SubmitReportRequest} reportData - 举报数据
 * @returns {Promise<void>}
 * @throws {Error} 当API请求失败时抛出错误
 * @example
 */
export async function submitReportApi(
  reportData: SubmitReportRequest
): Promise<void> {
  try {
    // 将字段名转换为下划线格式，符合后端期望
    const requestData = {
      component_type: reportData.componentType,
      component_id: reportData.componentId,
      reason_type: reportData.reasonType,
      ...(reportData.reason && { reason: reportData.reason })
    };

    const response = await post<SubmitReportResponse>(
      "/report/add",
      requestData
    );

    if (response.code !== 0) {
      throw new Error(response.message || "举报提交失败");
    }
  } catch (error: any) {
    console.error("提交举报失败:", error);

    // 处理不同类型的错误
    if (error.response?.status === 401) {
      throw new Error("请先登录后再进行举报");
    } else if (error.response?.status === 403) {
      throw new Error("没有权限进行举报操作");
    } else if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.message || "举报信息有误，请检查后重试"
      );
    } else if (error.response?.status === 409) {
      throw new Error("您已经举报过此内容，请勿重复举报");
    } else if (error.response?.status >= 500) {
      throw new Error("服务器繁忙，请稍后重试");
    } else if (error.code === "NETWORK_ERROR") {
      throw new Error("网络连接失败，请检查网络设置");
    } else {
      throw new Error(error.message || "举报提交失败，请稍后重试");
    }
  }
}

/**
 * 批量获取多种类型的举报原因
 *
 * 同时获取用户、帖子、评论的举报原因，用于缓存
 *
 * @async
 * @returns {Promise<Record<ComponentType, ReportReason[]>>} 按类型分组的举报原因
 * @throws {Error} 当API请求失败时抛出错误
 */
export async function getAllReportReasonsApi(): Promise<
  Record<ComponentType, ReportReason[]>
> {
  try {
    const [userReasons, postReasons, commentReasons] = await Promise.all([
      getReportReasonsApi("USER"),
      getReportReasonsApi("POST"),
      getReportReasonsApi("COMMENT"),
    ]);

    return {
      USER: userReasons,
      POST: postReasons,
      COMMENT: commentReasons,
    };
  } catch (error: any) {
    console.error("批量获取举报原因失败:", error);
    throw new Error("获取举报原因失败，请稍后重试");
  }
}
