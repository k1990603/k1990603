export default [
  {
    path: 'userVm',
    name: 'userVm',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/vm.vue'], resolve)
  },
  {
    path: 'userVmCreate',
    name: 'userVmCreate',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/vm/vmCreate'], resolve)
  },
  {
    path: 'userSafeGroup',
    name: 'userSafeGroup',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/safeGroup.vue'], resolve)
  },
  {
    path: 'userSafeGroupTmp',
    name: 'userSafeGroupTmp',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/user/resourceManage/safeGroup/tmpRule.vue'
      ], resolve)
  },
  {
    path: 'userSafeGroupTmpRule/:uuid',
    name: 'userSafeGroupTmpRule',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/user/resourceManage/safeGroup/tmpRulesDetails.vue'
      ], resolve)
  },
  {
    path: 'userVmDetails/:uuid',
    name: 'userVmDetails',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/vm/vmDetails.vue'], resolve)
  },
  {
    path: 'userCloneCreate/:uuid',
    name: 'userCloneCreate',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/vm/cloneCreate.vue'], resolve)
  },
  {
    path: 'userVmDiskScale/:uuid',
    name: 'userVmDiskScale',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require(['@/components/user/resourceManage/vm/diskScale.vue'], resolve)
  },
  {
    path: 'userSafeGroupRule/:uuid',
    name: 'userSafeGroupRule',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/user/resourceManage/safeGroup/safeGroupRule.vue'
      ], resolve)
  },
  {
    path: 'userRelateVm/:uuid',
    name: 'userSafeGroupRelateVm',
    meta: {
      navInfo: 'userResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/user/resourceManage/safeGroup/relateVm.vue'
      ], resolve)
  }
]
