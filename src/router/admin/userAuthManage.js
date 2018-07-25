export default [
  {
    path: 'lesseeManage',
    name: 'lesseeManage',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require(['@/components/admin/userAuthManage/lesseeManage.vue'], resolve)
  },
  {
    path: 'lesseeCreate',
    name: 'lesseeManageCreate',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require([
        '@/components/admin/userAuthManage/lessee/lesseeCreate.vue'
      ], resolve)
  },
  {
    path: 'projectManage',
    name: 'projectManage',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require(['@/components/admin/userAuthManage/projectManage.vue'], resolve)
  },
  {
    path: 'projectCreate',
    name: 'projectManageCreate',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require([
        '@/components/admin/userAuthManage/project/projectCreate.vue'
      ], resolve)
  },
  {
    path: 'userManage',
    name: 'userManage',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require(['@/components/admin/userAuthManage/userManage.vue'], resolve)
  },
  {
    path: 'userManageDetails/:uuid',
    name: 'userManageDetails',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require([
        '@/components/admin/userAuthManage/user/userDetails.vue'
      ], resolve)
  },
  {
    path: 'editLesseeHostpool/:uuid',
    name: 'lesseeManageEditLesseeHostpool',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require([
        '@/components/admin/userAuthManage/lessee/editArea.vue'
      ], resolve)
  },
  {
    path: 'editProjectHostpool/:uuid',
    name: 'editProjectHostpool',
    meta: {
      navInfo: 'adminUserPowerManage'
    },
    component: resolve =>
      require([
        '@/components/admin/userAuthManage/project/editArea.vue'
      ], resolve)
  }
]
