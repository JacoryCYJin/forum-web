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

// 响应拦截器 - 简化版
request.interceptors.response.use(
  (response: AxiosResponse): Promise<any> => {
    // 直接返回数据
    return Promise.resolve(response.data);
  },
  (error: any) => {
    // 简单的错误处理
    console.error('请求错误：', error);
    return Promise.reject(error);
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