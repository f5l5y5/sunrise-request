import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

class Request {
  instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    // 类拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config
      },
      (error: AxiosError) => error,
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => error,
    )
  }
  request(config: AxiosRequestConfig) {
    return this.instance.request(config)
  }
}
export default Request
