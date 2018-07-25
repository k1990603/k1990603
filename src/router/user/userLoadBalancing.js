export default [
  {
    path: 'userLoadBalancingList',
    name: 'userLoadBalancingList',
    meta: {
      navInfo: 'userLoadBalancing'
    },
    component: resolve =>
      require([
        '@/components/user/loadBalancing/LoadBalancingList.vue'
      ], resolve)
  },
  {
    path: 'userCertificate',
    name: 'userCertificate',
    meta: {
      navInfo: 'userLoadBalancing'
    },
    component: resolve =>
      require(['@/components/user/loadBalancing/Certificate.vue'], resolve)
  },
  {
    path: 'userLBdetails/:id',
    name: 'userLoadBalancingListLBdetails',
    meta: {
      navInfo: 'userLoadBalancing'
    },
    component: resolve =>
      require(['@/components/user/loadBalancing/lbList/LBdetails.vue'], resolve)
  },
  {
    path: 'userLBmonitor/:id',
    name: 'userLoadBalancingListmonitor',
    meta: {
      navInfo: 'userLoadBalancing'
    },
    component: resolve =>
      require([
        '@/components/user/loadBalancing/lbList/LBdetails_monitor.vue'
      ], resolve)
  }
]
