export default [
  {
    path: 'userWorkList',
    name: 'userWorkList',
    meta: {
      navInfo: 'userWorkOrder'
    },
    component: resolve =>
      require(['@/components/user/userWorkOrder/workList.vue'], resolve)
  },
  {
    path: 'userParticulars',
    name: 'userWorkListCreate',
    meta: {
      navInfo: 'userWorkOrder'
    },
    component: resolve =>
      require([
        '@/components/user/userWorkOrder/particulars/particulars.vue'
      ], resolve)
  }
]
