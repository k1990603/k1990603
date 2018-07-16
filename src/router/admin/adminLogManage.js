export default [
  {
    path: 'adminLog',
    name: 'adminLog',
    meta: {
      navInfo: 'adminLog'
    },
    component: resolve =>
      require([
        '@/components/admin/adminLogManage/adminLogManagement.vue'
      ], resolve)
  }
]
