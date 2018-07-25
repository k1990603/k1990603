export default [
  {
    path: 'transfer',
    name: 'transfer',
    meta: {
      navInfo: 'adminTransfer'
    },
    component: resolve =>
      require(['@/components/admin/transfer/Transfer.vue'], resolve)
  },
  {
    path: 'openstack',
    meta: {
      navInfo: 'adminTransfer'
    },
    name: 'transferOpenstack',
    component: resolve =>
      require(['@/components/admin/transfer/Openstack.vue'], resolve)
  }
]
