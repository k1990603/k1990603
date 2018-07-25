export default [
  {
    path: 'vRouter',
    name: 'vRouter',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/vRouter.vue'], resolve)
  },
  {
    path: 'privatNet',
    name: 'privatNet',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/privatNet.vue'], resolve)
  },
  {
    path: 'privatNetCreate',
    name: 'privatNetCreate',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require([
        '@/components/admin/netWork/privateNet/createPrivatNet.vue'
      ], resolve)
  },
  {
    path: 'childNet',
    name: 'childNet',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/childNet.vue'], resolve)
  },
  {
    path: 'childNetCreate',
    name: 'childNetCreate',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/subNet/createSubNet.vue'], resolve)
  },
  {
    path: 'vlanManage',
    name: 'vlanManage',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/vlanManage.vue'], resolve)
  },
  {
    path: 'ipManage',
    name: 'ipManage',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/ipManage.vue'], resolve)
  },
  {
    path: 'ipDetails/:uuid',
    name: 'ipManageDetails',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/ipManage/ipDetails.vue'], resolve)
  },
  {
    path: 'ipNetManage',
    name: 'ipNetManage',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require(['@/components/admin/netWork/ipNetManage.vue'], resolve)
  },
  {
    path: 'ipNetDetails/:uuid',
    name: 'ipNetManageDetails',
    meta: {
      navInfo: 'adminNetWorkManage'
    },
    component: resolve =>
      require([
        '@/components/admin/netWork/ipNetManage/ipNetDetails.vue'
      ], resolve)
  }
]
