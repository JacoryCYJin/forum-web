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
  baseURL: 'http://localhost:8080', // 设置后端服务地址
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  }
});

// 请求拦截器 - 自动添加JWT token和处理不同类型的请求数据
request.interceptors.request.use(
  async (config) => {
    // 检查并确保令牌有效（每次API调用时刷新令牌状态）
    const isTokenValid = await TokenManager.ensureValidToken();
    
    if (isTokenValid) {
      // 从localStorage获取JWT token
      const accessToken = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      
      // 如果存在token，添加到请求头
      if (accessToken) {
        config.headers.Authorization = `${tokenType} ${accessToken}`;
      }
    } else {
      // 如果令牌无效且无法刷新，可以选择拦截请求或让其继续
      console.warn('⚠️ 令牌无效且无法刷新，请求将继续但可能失败');
    }
    
    // 如果数据是URLSearchParams，设置正确的Content-Type
    if (config.data instanceof URLSearchParams) {
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
      // 🔄 API调用成功，在token最后30分钟内时重置令牌时间（滑动过期机制）
      try {
        await TokenManager.resetTokenTimeOnApiCall();
      } catch (error) {
        // 重置令牌时间失败不影响正常响应
        console.warn('⚠️ 重置令牌时间失败:', error);
      }
      
      // 直接返回数据
      return Promise.resolve(response.data);
    },
    (error: any) => {
      // 统一的错误处理
      let message = '请求失败，请稍后重试';
  
      if (error.response) {
        // 服务器返回了错误状态码（如 4xx、5xx）
        const status = error.response.status;
        
        if (status === 401) {
          // token过期或无效，清除本地存储的认证信息
          TokenManager.clearToken();
          
          // 可以在这里触发重新登录逻辑
          message = '登录已过期，请重新登录';
          
          // 如果需要，可以重定向到登录页面
          // window.location.href = '/login';
        } else {
          message = error.response.data?.message || error.response.statusText || `HTTP 错误 ${status}`;
        }
      } else if (error.request) {
        // 请求已发送，但没有收到响应（如网络错误、超时）
        message = '网络错误，请检查网络连接';
      } else {
        // 请求未发出（如请求配置错误）
        message = error.message || '请求配置错误';
      }
  
      console.error('请求错误：', error); // 仍然打印完整错误，便于调试
  
      // 返回一个包含 message 的 Promise.reject
      return Promise.reject({ message });
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
export function del<T = any>(url: string, params?: any): Promise<ResponseData<T>> {
  return request.delete(url, { params });
}

// 导出 axios 实例
export default request; 