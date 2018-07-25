import Vue from 'vue'
import Router from 'vue-router'
// 管理员路由引入
// import admin from './admin'
import adminOverView from '@/components/admin/OverView.vue'
import areaManage from './admin/areaMange'
import netWork from './admin/netWork'
import resourceManage from './admin/resourceManage'
import userAuthManage from './admin/userAuthManage'
import adminAuthManage from './admin/adminManage'
import image from './admin/image'
import loadBalancing from './admin/loadBalancing'
import transfer from './admin/transfer'
import adminWorkList from './admin/adminWorkOrder'
import adminLog from './admin/adminLogManage'

// 用户路由引入
// import user from './user'
import UserOverView from './../components/user/OverView.vue'
import userResourceManage from './user/userResourceManage'
import userNetWork from './user/userNetWorkManage'
import userWorkOrder from './user/userWorkOrderManage'
import userLogManagement from './user/userLogManagement'
import userLoadBalancing from './user/userLoadBalancing'
import myAuthManage from './user/userAuthManage'
import store from '@/store'
import { Message } from 'element-ui'
// 导航信息引入
import { navList } from '@/data/navData.js'
Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'Login',
    component: resolve => require(['@/components/login/Login.vue'], resolve)
  },
  {
    path: '/vmConsole',
    name: 'vmConsole',
    component: resolve =>
      require(['@/components/admin/resourceManage/vm/console.vue'], resolve)
  },
  {
    path: '/sf_cloud',
    name: 'sf_cloud',
    redirect: '/',
    component: resolve => require(['@/components/common/SfCloud.vue'], resolve),
    children: [
      {
        path: 'UserOverView',
        name: 'UserOverView',
        meta: {
          navInfo: 'UserOverView'
        },
        component: UserOverView
      },
      {
        path: 'adminOverView',
        name: 'adminOverView',
        meta: {
          navInfo: 'adminOverView'
        },
        component: adminOverView
      },
      {
        path: 'workbench',
        name: 'workbench',
        redirect: '/',
        component: resolve =>
          require(['@/components/common/Workbench.vue'], resolve),
        children: [].concat(
          areaManage,
          netWork,
          resourceManage,
          userAuthManage,
          image,
          loadBalancing,
          adminAuthManage,
          adminWorkList,
          transfer,
          adminLog,
          userResourceManage,
          userNetWork,
          userWorkOrder,
          userLogManagement,
          userLoadBalancing,
          myAuthManage,
          userResourceManage,
          userNetWork,
          userWorkOrder
        )
      }
    ]
  }
]
// ].concat(areaManage, netWork, resourceManage, userAuthManage, image)
const router = new Router({
  // mode: 'history',
  routes: routes
})
router.beforeEach((to, from, next) => {
  // 当进入路由 重新获取导航信息
  if (
    !(
      to.meta.navInfo == 'adminOverView' ||
      to.meta.navInfo == 'UserOverView' ||
      to.name == 'Login'
    )
  ) {
    localStorage.setItem('localNav', to.meta.navInfo)
    store.dispatch('updateLocalNav', to.meta.navInfo)
  }
  // 判断用户是否已登录 已登录则不能进入登录页面
  if (
    store.getters.getUserInfo &&
    localStorage.getItem('userInfo') &&
    to.name == 'Login'
  ) {
    if (from.fullPath && from.fullPath != '/') {
      next({
        path: from.fullPath
      })
    } else {
      switch (store.getters.getUserInfo.curRole) {
        case '系统管理员':
          next({
            path: '/sf_cloud/adminOverView'
          })
          break
        case '一般管理员':
          next({
            path: '/sf_cloud/adminOverView'
          })
          break
        case '用户':
          next({
            path: '/sf_cloud/UserOverView'
          })
          break
        default:
          next()
      }
    }
  } else {
    next()
  }

  // console.log(to.path)
  // console.log(store)
  //   if(to.path=="/"){
  //     console.log('-------------')
  //     if(store.getters.getUserInfo){
  //       if(store.getters.getUserInfo.curRole=='系统管理员'||store.getters.getUserInfo.curRole=="一般管理员"){
  //         next('/sf_cloud/adminOverView')
  //       }else{
  //         next('/sf_cloud/UserOverView')
  //       }
  //     }else{
  //       next()
  //     }
  //   // console.log(store.getters.getUserInfo.curRole)
  //   }else{
  //     next()
  //   }
  // console.log(localStorage)
  // console.log(document.cookie)
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
export default router
