import { message } from 'ant-design-vue'
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { BaseURL, PrivateKey, RegistrationInfo } from './constants'
import { Env, TokenResponse } from './types'
import jsrsasign, { KJUR } from 'jsrsasign'

class RequestOpenApi {
  static instance: null | AxiosInstance

  private token = ''

  constructor(config?: AxiosRequestConfig) {
    if (!RequestOpenApi.instance) {
      RequestOpenApi.instance = axios.create(config)
      this.interceptorsAxios()
      this.getToken()
    }
  }

  private getSign() {
    const signPrivateKey = `-----BEGIN PRIVATE KEY-----${
      PrivateKey[process.env.VUE_APP_ENV as Env]
    }-----END PRIVATE KEY-----`

    const sig = new KJUR.crypto.Signature({ alg: 'SHA1withRSA' })
    sig.init(signPrivateKey)
    sig.updateString(
      RegistrationInfo[process.env.VUE_APP_ENV as Env].toString(),
    )
    const sign = jsrsasign.hextob64(sig.sign()) // 签名得到十六进制密文

    return sign
  }

  private interceptorsAxios() {
    RequestOpenApi.instance?.interceptors.response.use(
      (response) => {
        if (response && response.data) {
          if (response.data.code !== 10000) {
            message.error(response.data.result)
          }
        }
        return response.data
      },
      (error) => Promise.reject(error),
    )
  }

  private async getToken() {
    const sign = this.getSign()
    const res = await this.post<TokenResponse>(
      '/platform/open-api/token/apply',
      {
        sign,
        timestamp: Date.now(),
        version: 'v1.0.0',
        ...RegistrationInfo[process.env.VUE_APP_ENV as Env],
      },
    )
    this.token = res.tokenValue
  }

  public async get<T>(
    url: string,
    params: Indexable = {},
    config: AxiosRequestConfig = { headers: {} },
  ): Promise<T> {
    this.token
      ? (config.headers = { ...config.headers, token: this.token })
      : ''
    config = { ...config, params }

    const res = await RequestOpenApi.instance?.get<T>(url, config)
    return res?.data as T
  }

  public async post<T>(
    url: string,
    params: Indexable = {},
    config: AxiosRequestConfig = { headers: {} },
  ): Promise<T> {
    this.token
      ? (config.headers = { ...config.headers, token: this.token })
      : ''

    const res = await RequestOpenApi.instance?.post<T>(url, params, config)
    return res?.data as T
  }
}

export const requestOpenApi = new RequestOpenApi({
  baseURL: BaseURL[process.env.VUE_APP_ENV as keyof typeof BaseURL],
})
