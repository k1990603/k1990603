export default [
  {
    path: 'imageManage',
    name: 'imageManage',
    meta: {
      navInfo: 'adminImage'
    },
    component: resolve =>
      require(['@/components/admin/image/ImageManage.vue'], resolve)
  },
  {
    path: 'imageCreate',
    name: 'imageManageCreate',
    meta: {
      navInfo: 'adminImage'
    },
    component: resolve =>
      require(['@/components/admin/image/imageCreate/ImageCreate.vue'], resolve)
  }
]
