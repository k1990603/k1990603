import axios from 'axios'
import qs from 'qs'
import store from './../store'
import { Message } from 'element-ui'

import router from '@/router'
// base请求url
axios.defaults.baseURL = store.state.user.baseURL
// axios.defaults.headers['Content-Type'] =
//   'application/x-www-form-urlencoded;charset=UTF-8' // 此处是增加的代码，设置请求头的类型
// http请求拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.user.userInfo) {
      if (
        store.state.user.userInfo.curRole == '系统管理员' ||
        store.state.user.userInfo.curRole == '一般管理员'
      ) {
        config.headers.currentUserInfo = JSON.stringify({
          tab: '2'
        })
      } else if (store.state.user.userInfo.curRole == '用户') {
        config.headers.currentUserInfo = JSON.stringify({
          tab: '1',
          tenant_uuid: store.state.user.userInfo.tenantInfo.tenant_uuid
        })
      }
    }

    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      if (typeof config.data !== 'string') {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// http响应拦截器
axios.interceptors.response.use(
  response => {
    if (!response.headers['page-type']) {
      if (response.data.code != 0) {
        // Do something with response data
        Message({
          showClose: true,
          type: 'warning',
          message: response.data.msg
        })
      }
      if (response.data.code == '-10005') {
        store.state.user.userInfo = []
        localStorage.clear()
        router.push({
          path: '/'
        })
        return false
      }
    }
    return response
  },
  error => {
    if (error.response.status == 401) {
      store.state.user.userInfo = []
      localStorage.clear()
      router.push({
        path: '/'
      })
    }
    console.log(error.response.status)
    // Do something with response error
    return Promise.reject(error)
  }
)
export default axios
