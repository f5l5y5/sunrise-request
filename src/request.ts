import axios, { AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { code } from './config'
import { ExpriesCache } from '@/utils/localStorage/index'
import { useCommonStore, useUserStore } from '@/store'
import { handleLoginOut } from '@/Layout/utils'

const config = {
  baseURL: process.env.VUE_APP_API,
  // timeout: 60 * 1000 // Timeout
  // withCredentials: true, // Check cross-site Access-Control,
}

const _axios = axios.create(config)

export const PSB_BASE_URL = 'http://127.0.0.1:19196' // psb读卡接口

_axios.interceptors.request.use(
  (config) => {
    // 处理不同标签页切换酒店问题
    if (
      localStorage.getItem('currentCompanyCode') !==
      useUserStore().hotel.companyCode
    ) {
      useUserStore().changeHotel({
        companyName: '',
        // @ts-ignore-next-line
        companyCode: localStorage.getItem('currentCompanyCode'), // TODO:这块判断逻辑有问题,需要优化
      })

      location.assign('/home')
      return Promise.reject()
    }
    return config
  },
  (error) =>
    // Do something with request error
    Promise.reject(error)
)

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      const resCode = response.data.code
      const url = response.config.url || null
      // http://127.0.0.1:19196/readcard为psb读卡服务接口
      if (resCode !== code && url && url !== `${PSB_BASE_URL}/readcard`) {
        const errCode = response.data.errorCode

        if (['GATEWAY_LOST_TOKEN', 'PLATFORM-LOST-TOKEN'].includes(errCode)) {
          handleLoginOut() // token失效重新登录
        } else if (errCode === 'GATEWAY_MERCHANT_LOCK') {
          // 夜审锁屏
          useCommonStore().setLock(true)
        } else if (errCode !== 'AUDITOR-ERROR' && response.data.msg) {
          message.error(response.data.msg)
        }
      }
    }
    return response
  },
  (error) =>
    // Do something with response error
    Promise.reject(error)
)

class Request {
  private getHeaders = () => ({
    'uc-token': useUserStore().token || '',
    'X-HOTEL-CODE': useUserStore().hotel.companyCode || '',
    'uc-application': 'pms-service',
  })

  // NOTE:处理接口缓存逻辑(优先返回缓存数据)
  private getCacheData = async (url: string, params: Indexable) => {
    const cacheKey = ExpriesCache.initKey(url, this.getHeaders(), params)
    const cacheData = await ExpriesCache.get({
      api: url,
      key: cacheKey,
    })
    return cacheData
  }

  // NOTE:接口数据存入缓存
  private setCacheData = (url: string, params: Indexable, data: TBaseRes) => {
    const cacheKey = ExpriesCache.initKey(url, this.getHeaders(), params)
    ExpriesCache.set(
      {
        api: url,
        key: cacheKey,
      },
      data
    )
  }

  public async get<T = any>(
    url: string,
    params: Indexable = {},
    config: AxiosRequestConfig = {}
  ) {
    const cacheData: TBaseRes<T> | false = await this.getCacheData(url, params)
    if (cacheData) return cacheData
    const res = await _axios
      .get<TBaseRes<T>>(url, {
        ...config,
        headers: url === '/readcard' ? {} : this.getHeaders(), // 读取psb时特殊处理
        params,
      })
      .catch((err) => Promise.reject(err))
    res && this.setCacheData(url, params, res.data) // 缓存数据
    return res?.data
  }

  public async post<T = any>(
    url: string,
    data: Indexable = {},
    config: AxiosRequestConfig = {}
  ) {
    const cacheData: TBaseRes<T> = await this.getCacheData(url, data)
    if (cacheData) return cacheData
    const res = await _axios
      .post<TBaseRes<T>>(url, data, {
        ...config,
        headers: this.getHeaders(),
      })
      .catch((err) => Promise.reject(err))
    res && this.setCacheData(url, data, res.data) // 缓存数据
    return res?.data
  }
}

export const request = new Request()
