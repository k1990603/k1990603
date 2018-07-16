export default [
  {
    path: 'adminImpower',
    name: 'adminImpower',
    meta: {
      navInfo: 'adminManage'
    },
    component: resolve =>
      require(['@/components/admin/adminAuthManage/adminImpower.vue'], resolve)
  },
  {
    path: 'adminCreate',
    name: 'adminImpowerCreate',
    meta: {
      navInfo: 'adminManage'
    },
    component: resolve =>
      require([
        '@/components/admin/adminAuthManage/common/createAdminGroup.vue'
      ], resolve)
  },
  {
    path: 'adminArea/:uuid',
    name: 'adminImpowerArea',
    meta: {
      navInfo: 'adminManage'
    },
    component: resolve =>
      require([
        '@/components/admin/adminAuthManage/common/editArea.vue'
      ], resolve)
  },
  {
    path: 'adminUser',
    name: 'adminUser',
    meta: {
      navInfo: 'adminManage'
    },
    component: resolve =>
      require(['@/components/admin/adminAuthManage/adminUser.vue'], resolve)
  },
  {
    path: 'adminDetails/:uuid',
    name: 'adminUserDetails',
    meta: {
      navInfo: 'adminManage'
    },
    component: resolve =>
      require([
        '@/components/admin/adminAuthManage/common/adminDetails.vue'
      ], resolve)
  }
]
