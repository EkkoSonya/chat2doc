import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5173/chat2doc',
    timeout: 5000,
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