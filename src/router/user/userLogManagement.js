export default [
  {
    path: 'userLogManagement',
    name: 'userLogManagement',
    meta: {
      navInfo: 'userLogManagement'
    },
    component: resolve =>
      require([
        '@/components/user/userLogManagement/userLogManagement.vue'
      ], resolve)
  }
]
