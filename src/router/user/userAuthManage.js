export default [
  {
    path: 'userProjectManage',
    name: 'userProjectManage',
    meta: {
      navInfo: 'userPowerManage'
    },
    component: resolve =>
      require(['@/components/user/userAuthManage/projectManage.vue'], resolve)
  },
  {
    path: 'userProjectCreate',
    name: 'userProjectManageProjectCreate',
    meta: {
      navInfo: 'userPowerManage'
    },
    component: resolve =>
      require([
        '@/components/user/userAuthManage/project/projectCreate.vue'
      ], resolve)
  },
  {
    path: 'editProArea/:uuid',
    name: 'userProjectManageeditProArea',
    meta: {
      navInfo: 'userPowerManage'
    },
    component: resolve =>
      require(['@/components/user/userAuthManage/common/editArea.vue'], resolve)
  },
  {
    path: 'myManage',
    name: 'myManage',
    meta: {
      navInfo: 'userPowerManage'
    },
    component: resolve =>
      require(['@/components/user/userAuthManage/userManage.vue'], resolve)
  }
]
