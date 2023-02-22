import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
})

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // config.headers.auth = xxx
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log('打印***error===>请求拦截', error)
    return Promise.reject(error)
  },
)

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log('打印***error====>响应拦截', error)
    return Promise.reject(error)
  },
)

const post = (url, data) => {
  return new Promise((resolve) => {
    http
      .post(url, data)
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        console.log('打印***err===>post', err)
        resolve(err)
      })
  })
}
const get = (url, params) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, { params })
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        console.log('打印***err===>get', err)
        // 此时使用reject 会传递到下一个reject
        // resolve 返回是正常的
        reject(err)
        // resolve(err)
      })
  })
}
// const request = {
//   get: (url, params) => http.get(url, { params }),
//   post: (url, data) => http.post(url, data),
// }
export default {
  get,
  post,
}
