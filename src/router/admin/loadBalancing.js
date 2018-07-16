export default [
  {
    path: 'loadBalancingList',
    name: 'loadBalancingList',
    meta: {
      navInfo: 'adminLoadBalancing'
    },
    component: resolve =>
      require([
        '@/components/admin/loadBalancing/LoadBalancingList.vue'
      ], resolve)
  },
  {
    path: 'certificate',
    name: 'certificate',
    meta: {
      navInfo: 'adminLoadBalancing'
    },
    component: resolve =>
      require(['@/components/admin/loadBalancing/Certificate.vue'], resolve)
  },
  {
    path: 'certificateDetails',
    name: 'certificateDetails',
    meta: {
      navInfo: 'adminLoadBalancing'
    },
    component: resolve =>
      require(['@/components/admin/loadBalancing/certificate/details'], resolve)
  },
  {
    path: 'LBdetails/:id',
    name: 'loadBalancingListdetails',
    meta: {
      navInfo: 'adminLoadBalancing'
    },
    component: resolve =>
      require([
        '@/components/admin/loadBalancing/lbList/LBdetails.vue'
      ], resolve)
  },
  {
    path: 'LBmonitor/:id',
    name: 'loadBalancingListmonitor',
    meta: {
      navInfo: 'adminLoadBalancing'
    },
    component: resolve =>
      require([
        '@/components/admin/loadBalancing/lbList/LBdetails_monitor.vue'
      ], resolve)
  }
]
