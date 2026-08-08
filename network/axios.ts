/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_DOMAIN_URL || '';

const axoisAPI: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axoisAPI.interceptors.request.use(
  (config: any) => {
    if (config.delayed) {
      return new Promise<AxiosRequestConfig>((resolve) => setTimeout(() => resolve(config), 100));
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axoisAPI;
