export default [
  {
    path: 'adminWorkList',
    name: 'adminWorkList',
    meta: {
      navInfo: 'adminWorkOrder'
    },
    component: resolve =>
      require(['@/components/admin/adminWorkOrder/workList.vue'], resolve)
  },
  {
    path: 'adminParticulars',
    name: 'adminWorkListParticulars',
    meta: {
      navInfo: 'adminWorkOrder'
    },
    component: resolve =>
      require([
        '@/components/admin/adminWorkOrder/particulars/particulars.vue'
      ], resolve)
  }
]
