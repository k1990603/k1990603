import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions' // 定义更新store函数
import * as getters from './getters' // 定义获取store函数
import user from './modules/user' // 定义 user模块
import dialog from './modules/dialog' // 定义 dialog模块
import common from './modules/common' // 定义 公用模态框状态
import { SET_LOADING, SET_LOCALNAV, SET_CURROLE } from './mutation-types' // 定义映射

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    curRole: 'admin', // 用户角色
    localNav: '' // 当前的nav导航标识
  },
  mutations: {
    [SET_LOCALNAV](state, localNav) {
      state.localNav = localNav
    },
    [SET_CURROLE](state, curRole) {
      state.curRole = curRole
    }
  },
  modules: {
    user,
    dialog,
    common
  },
  actions,
  getters
})

// 获取store实例上的使用

/* <el-input v-model="username"></el-input> */

// import { mapGetters } from 'vuex'

// computed : {
// 	...mapGetters({
// 	  username : 'getUserName'
// 	})
//   },

// 更新store实例使用

// import { mapActions } from 'vuex'

// methods: {
// 	...mapActions({
// 	  updateLoginStatus : 'updateLoginStatus', // 直接当函数调 this.updateLoginStatus(false)
//   }),
// }
