import { code } from '../config'
import { CACHE_APIS, TCacheMethodReq } from './enum'
import localforage from 'localforage'
import { isBoolean } from 'lodash'

type TCache = {
  api: string // api名称
  key: string // initkey字符串
}

type TValue = {
  data: TBaseRes // 缓存数据
  createTime: number
}

export class ExpriesCache {
  static cacheMap = new Map()

  // 拼接key(api+参数+headers)
  static initKey(api: string, headers: Indexable<string>, params: Indexable) {
    return JSON.stringify({ api, headers, params })
  }

  // 解析initKey
  static parseInitKey(key: string): TCacheMethodReq {
    return JSON.parse(key)
  }

  // 判断是否缓存条件
  static _isCache(params: TCache) {
    const cacheOption = CACHE_APIS[params.api]
    if (!cacheOption) return false
    if (isBoolean(cacheOption.cache)) return cacheOption.cache
    return cacheOption.cache(this.parseInitKey(params.key))
  }

  // 判断是否过期(time缓存时间小时; createTime数据存入时间(时间戳))
  static _isOut(time: number, createTime: number) {
    if (!createTime) return false
    const now = new Date().getTime()
    return now > createTime + time * 1000 * 60 * 60
  }

  /** 拿取数据 */
  static async get(params: TCache) {
    const cacheOption = CACHE_APIS[params.api]
    if (!this._isCache(params)) return false // 判断缓存条件

    // 优先从内存里拿数据
    if (this.cacheMap.has(params.key)) {
      const value: TValue = this.cacheMap.get(params.key) // 从map里拿取数据
      const isOk =
        !this._isOut(cacheOption.time, value?.createTime) && value?.data // 判断是否过期且存在
      return isOk ? Promise.resolve(value.data) : false // 过期则返回false
    }

    // 从local里拿
    if (cacheOption.cacheType === 'local') {
      const value: any = await localforage.getItem(params.key) // 拿取缓存数据
      console.log(`localforage.getItem:${params.api}`, value)
      const isOut = this._isOut(cacheOption.time, value?.createTime) // 是否过期
      isOut && localforage.removeItem(params.key) // 过期时清除local

      const isOk = !isOut && value?.data // 判断是否过期且存在

      isOk && this.cacheMap.set(params.key, value) // NOTE:如果local存在,重新加入到内存里

      return isOk ? Promise.resolve(value.data) : false // 过期则返回false
    }

    // 从session里拿
    if (cacheOption.cacheType === 'session') {
      const value: any = JSON.parse(
        sessionStorage.getItem(params.key) ?? 'false'
      ) // 拿取session缓存数据
      const isOut = this._isOut(cacheOption.time, value?.createTime) // 是否过期
      isOut && sessionStorage.removeItem(params.key) // 过期时清除session

      const isOk = !isOut && value?.data // 判断是否过期且存在

      isOk && this.cacheMap.set(params.key, value) // NOTE:如果local存在,重新加入到内存里

      return isOk ? Promise.resolve(value.data) : false // 过期则返回false
    }
  }

  /** 存储数据 */
  static set(params: TCache, data: TBaseRes) {
    const cacheOption = CACHE_APIS[params.api]
    if (!this._isCache(params)) return false // 判断缓存条件

    if (!data || data?.code !== code) return false // 接口返回失败状态return

    const value = {
      data, // 缓存数据
      createTime: new Date().getTime(), // 缓存时间(毫秒)
    }
    this.cacheMap.set(params.key, value) // 存入map

    switch (cacheOption.cacheType) {
      // 存入local
      case 'local':
        try {
          localforage.setItem(params.key, value)
        } catch (error) {
          console.log(error) // local存储空间溢出
        }
        break
      case 'session':
        try {
          sessionStorage.setItem(params.key, JSON.stringify(value))
        } catch (error) {
          console.log(error) // session存储空间溢出
        }
        break
      default:
        break
    }
  }

  /** 清除local和session */
  static clear() {
    localforage.clear()
    localStorage.clear() // 手动清除:localforage不会清楚未记录的localStorage
    sessionStorage.clear()
    this.cacheMap.clear()
  }
}
