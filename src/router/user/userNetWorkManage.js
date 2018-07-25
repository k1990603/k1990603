export default [
  {
    path: 'userPrivatNet',
    name: 'userPrivatNet',
    meta: {
      navInfo: 'userNetWorkManage'
    },
    component: resolve =>
      require(['@/components/user/netWork/privatNet.vue'], resolve)
  },
  {
    path: 'userPrivatNetCreate',
    name: 'userPrivatNetCreate',
    meta: {
      navInfo: 'userNetWorkManage'
    },
    component: resolve =>
      require([
        '@/components/user/netWork/privateNet/createPrivatNet.vue'
      ], resolve)
  },
  {
    path: 'userChildNet',
    name: 'userChildNet',
    meta: {
      navInfo: 'userNetWorkManage'
    },
    component: resolve =>
      require(['@/components/user/netWork/childNet.vue'], resolve)
  },
  {
    path: 'userIpManage',
    name: 'userIpManage',
    meta: {
      navInfo: 'userNetWorkManage'
    },
    component: resolve =>
      require(['@/components/user/netWork/ipManage.vue'], resolve)
  },
  {
    path: 'userIpDetails/:uuid',
    name: 'userIpManageIpDetails',
    meta: {
      navInfo: 'userNetWorkManage'
    },
    component: resolve =>
      require(['@/components/user/netWork/ipManage/ipDetails.vue'], resolve)
  }
]
