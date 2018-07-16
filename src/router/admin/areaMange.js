export default [
  {
    path: 'areaPage',
    name: 'areaPage',
    meta: {
      navInfo: 'adminAreaManage'
    },
    component: resolve =>
      require(['@/components/admin/areaManage/area.vue'], resolve)
  },
  {
    path: 'datacenterPage',
    name: 'datacenterPage',
    meta: {
      navInfo: 'adminAreaManage'
    },
    component: resolve =>
      require(['@/components/admin/areaManage/datacenterPage.vue'], resolve)
  },
  {
    path: 'hostPoolPage',
    name: 'hostPoolPage',
    meta: {
      navInfo: 'adminAreaManage'
    },
    component: resolve =>
      require(['@/components/admin/areaManage/hostpoolPage.vue'], resolve)
  }
]
