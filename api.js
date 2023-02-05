import request from './index'

const getList = (params) => request.get('/getList', params)
const postList = (params) => request.post('/postList', params)

;(async () => {
  try {
    const postres = await postList({
      method: 'post',
    })
    console.log('打印***postres', postres)

    const getres = await getList({ method: 'get' })
    console.log('打印***getres', getres)
  } catch (error) {
    console.log('打印***error====>最后拦截', error)
  }
})()
