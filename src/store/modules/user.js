import { SET_LOADING, SET_USERINFO } from '../mutation-types'
import router from '@/router'
const state = {
  // baseURL: 'http://10.118.5.67:8099/api', // 请求接口地址前缀
  baseURL: process.env.API_ROOT, // 请求接口地址前缀
  // baseURL: 'https://123.58.36.1/api', // 请求接口地址前缀
  // baseURL: 'http://10.202.105.50/api', // 请求接口地址前缀
  isLogin: false,
  allRole: [, '系统管理员', '用户', '应用用户', '一般管理员'],
  userInfo: {
    // user_id: '01369659', // 当前登录用户的用户ID
    // user_name: '王子桐',
    // tenantInfo: {
    //   // 当前用户的默认租户
    //   name: '香港spa服务有限公司',
    //   uuid: '6b1fd3b1-3856-92ed-9890-fc4df33b8105'
    // }
  },
  hostConsoleData: {
    awsKey: '1234567812345678',
    // consoleAddress: 'http://10.118.5.48:4200',
    consoleAddress: 'http://123.58.36.1:4200',
    awsIv: 'Pkcs7'
  },
  ifLogin () {},
  refreshUserInfo () {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      state.userInfo = userInfo
    } else {
      state.userInfo = null
      localStorage.clear()
      router.push('/')
    }
  }
}

const mutations = {
  [SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  // 以下为测试数据
  [SET_LOADING] (state, isLogin) {
    state.isLogin = isLogin
  }
}

export default {
  state,
  mutations
}
