import axios from 'axios'
import { MessageBox } from 'element-ui'
import router from './router'

axios.defaults.timeout = 5000

axios.interceptors.request.use(config => {
  // config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  // config.headers.common['appid'] = 'shencom'
  return config
}, error => {
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(res => {
  if (res.status !== 200) {
    MessageBox({
      type: 'error',
      message: res.statusText
    })
    return
  }

  if (res.data.errcode === '4000') {
    MessageBox.alert('您没有相应的权限', '提示', {
      confirmButtonText: '确定',
      type: 'error'
    })
  } else if (res.data.errcode === '3000') {
    router.push({
      path: '/login'
    })
  }
  return res
}, error => {
  if (error.message === 'Network Error') {
    return Promise.reject(error)
  }
})

export default axios
