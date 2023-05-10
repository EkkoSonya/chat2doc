import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

let base_url = import.meta.env.VITE_API_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL: base_url,
  timeout: 1000 * 60 * 5, // 5分钟超时
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;