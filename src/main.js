// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Loading } from 'element-ui'
import axios from './http/apiConfig.js'
import App from './App'
import router from './router'
import 'babel-polyfill'
import store from './store' // *

import { sync } from 'vuex-router-sync'
import 'font-awesome/css/font-awesome.css'
store.state.user.refreshUserInfo()

sync(store, router)
// state.getLoginInfo() // *

Vue.use(ElementUI)
Vue.prototype.$store = store
Vue.prototype.$axios = axios
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
