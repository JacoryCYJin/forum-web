import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TokenManager } from './tokenManager';

// 定义接口返回数据的类型
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
}

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 修改为localhost，与前端域名保持一致
  timeout: 300000, // 请求超时时间 - 增加到5分钟（文件上传需要更长时间）
  withCredentials: true, // 重要：启用Cookie传递，支持跨域Cookie
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
});

// 请求拦截器 - 处理不同类型的请求数据
request.interceptors.request.use(
  async (config) => {
    console.log('🔍 请求拦截器调试信息:');
    console.log('  - URL:', (config.baseURL || '') + (config.url || ''));
    console.log('  - Method:', config.method?.toUpperCase());
    console.log('  - Headers:', config.headers);
    console.log('  - withCredentials:', config.withCredentials);
    console.log('  - Data type:', config.data?.constructor?.name);
    
    // 检查当前Cookie
    if (typeof document !== 'undefined') {
      console.log('  - 当前Cookie:', document.cookie);
    }
    
    // 检查并确保令牌有效（每次API调用时刷新令牌状态）
    const isTokenValid = await TokenManager.ensureValidToken();
    
    if (!isTokenValid) {
      // 如果令牌无效且无法刷新，记录警告但让请求继续
      console.warn('⚠️ 令牌无效且无法刷新，请求将继续但可能失败');
    }
    
    // 如果数据是FormData，删除Content-Type让浏览器自动设置multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('  - 检测到FormData，已删除Content-Type让浏览器自动设置');
    }
    // 如果数据是URLSearchParams，设置正确的Content-Type
    else if (config.data instanceof URLSearchParams) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理token过期和统一错误处理
request.interceptors.response.use(
    async (response: AxiosResponse): Promise<any> => {
      // 🔄 API调用成功，执行滑动刷新机制（令牌使用超过1天时刷新）
      try {
        await TokenManager.handleSlidingRefresh();
      } catch (error) {
        // 滑动刷新失败不影响正常响应
        console.warn('⚠️ 滑动刷新失败:', error);
      }
      
      // 直接返回数据
      return Promise.resolve(response.data);
    },
    (error: any) => {
      // 统一的错误处理
      let message = '请求失败，请稍后重试';
      let shouldShowLoginDialog = false;
  
      // console.error('=== 详细错误信息 ===');
      // console.error('错误对象:', error);
      // console.error('错误类型:', error.name);
      // console.error('错误消息:', error.message);
      // console.error('错误代码:', error.code);
      // console.error('错误config:', error.config);
      // console.error('错误request:', error.request);
      // console.error('错误response:', error.response);

      if (error.response) {
        // 服务器返回了错误状态码（如 4xx、5xx）
        const status = error.response.status;
        const headers = error.response.headers;
        
        // console.error('服务器响应状态:', status);
        // console.error('服务器响应数据:', error.response.data);
        // console.error('服务器响应头:', error.response.headers);
        
        if (status === 401) {
          // 检查是否需要弹出登录窗口
          if (headers['x-login-required'] === 'true' && headers['x-login-action'] === 'dialog') {
            shouldShowLoginDialog = true;
            message = '此操作需要登录';
          } else {
            // token过期或无效，清除本地存储的认证信息
            TokenManager.clearToken();
            message = '登录已过期，请重新登录';
          }
          
          // 如果需要，可以重定向到登录页面
          // window.location.href = '/login';
        } else {
          message = error.response.data?.message || error.response.statusText || `HTTP 错误 ${status}`;
        }
      } else if (error.request) {
        // 请求已发送，但没有收到响应（如网络错误、超时）
        // console.error('网络请求详情:');
        // console.error('  - readyState:', error.request.readyState);
        // console.error('  - status:', error.request.status);
        // console.error('  - statusText:', error.request.statusText);
        // console.error('  - responseURL:', error.request.responseURL);
        // console.error('  - timeout:', error.request.timeout);
        message = '网络错误，请检查网络连接';
      } else {
        // 请求未发出（如请求配置错误）
        // console.error('请求配置错误:', error.message);
        message = error.message || '请求配置错误';
      }
  
      // console.error('请求错误：', error); // 仍然打印完整错误，便于调试
  
      // 返回一个包含 message 和登录引导标志的 Promise.reject
      return Promise.reject({ 
        message,
        shouldShowLoginDialog,
        status: error.response?.status
      });
    }
  );

// 封装 GET 请求
export function get<T = any>(url: string, params?: any): Promise<ResponseData<T>> {
  return request.get(url, { params });
}

// 封装 POST 请求
export function post<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
  return request.post(url, data);
}

// 封装 PUT 请求
export function put<T = any>(url: string, data?: any): Promise<ResponseData<T>> {
  return request.put(url, data);
}

// 封装 DELETE 请求
export function del<T = any>(url: string, config?: { params?: any; data?: any }): Promise<ResponseData<T>> {
  // 如果传入的是旧格式的params参数，保持向后兼容
  if (config && !config.params && !config.data) {
    // 旧格式兼容：del(url, params)
    return request.delete(url, { params: config });
  }
  
  // 新格式：del(url, { data: requestBody, params: queryParams })
  return request.delete(url, config);
}

// 导出 axios 实例
export default request; 