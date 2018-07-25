export default [
  {
    path: 'host',
    name: 'host',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/host.vue'], resolve)
  },
  {
    path: 'imageSync/:uuid',
    name: 'imageSync',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/host/imageSync.vue'], resolve)
  },
  {
    path: 'hostDetails/:uuid',
    name: 'hostDetails',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/host/hostDetails'], resolve)
  },
  {
    path: 'vm',
    name: 'vm',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/vm.vue'], resolve)
  },
  {
    path: 'vmCreate',
    name: 'vmCreate',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/vm/vmCreate'], resolve)
  },
  {
    path: 'vmDetails/:uuid',
    name: 'vmDetails',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/vm/vmDetails'], resolve)
  },
  {
    path: 'vmDiskScale/:uuid',
    name: 'vmDiskScale',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/vm/diskScale'], resolve)
  },
  {
    path: 'safeGroup',
    name: 'safeGroup',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/safeGroup.vue'], resolve)
  },
  {
    path: 'cloneCreate/:uuid',
    name: 'cloneCreate',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require(['@/components/admin/resourceManage/vm/cloneCreate.vue'], resolve)
  },
  {
    path: 'safeGroupTemplate',
    name: 'safeGroupTemplate',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/admin/resourceManage/safeGroup/safeGroupTemplate.vue'
      ], resolve)
  },
  {
    path: 'safeGroupRule/:uuid',
    name: 'safeGroupRule',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/admin/resourceManage/safeGroup/safeGroupRule.vue'
      ], resolve)
  },
  {
    path: 'relateVm/:uuid',
    name: 'safeGroupRelateVm',
    meta: {
      navInfo: 'adminResourcesManage'
    },
    component: resolve =>
      require([
        '@/components/admin/resourceManage/safeGroup/relateVm.vue'
      ], resolve)
  }
]
