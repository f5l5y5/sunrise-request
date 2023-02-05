import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestInterceptors {
  //请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (err: AxiosError) => any

  //响应拦截
  responseInterceptors?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorsCatch?: (err: AxiosError) => any
}

export interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptors
}
