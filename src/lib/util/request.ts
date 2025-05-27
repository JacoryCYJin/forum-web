import axios, { AxiosInstance, AxiosResponse } from 'axios';

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

// // 请求拦截器 - 处理不同类型的请求数据
// request.interceptors.request.use(
//   (config) => {
//     // 如果数据是URLSearchParams，设置正确的Content-Type
//     if (config.data instanceof URLSearchParams) {
//       config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 响应拦截器 - 简化版
request.interceptors.response.use(
    (response: AxiosResponse): Promise<any> => {
      // 直接返回数据
      return Promise.resolve(response.data);
    },
    (error: any) => {
      // 统一的错误处理
      let message = '请求失败，请稍后重试';
  
      if (error.response) {
        // 服务器返回了错误状态码（如 4xx、5xx）
        message = error.response.data?.message || error.response.statusText || `HTTP 错误 ${error.response.status}`;
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