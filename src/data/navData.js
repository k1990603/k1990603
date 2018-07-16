// admin 部分-------------------------------------------------------
const adminAreaManage = {
  name: 'adminAreaManage',
  parentNode: '区域管理',
  index: '1',
  childNode: [
    {
      title: '区域',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/areaPage',
      icon: 'iconfont icon-ziyuan1'
    },
    {
      title: '机房',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/datacenterPage',
      icon: 'iconfont icon-ziyuan'
    },
    {
      title: '集群',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/hostPoolPage',
      icon: 'iconfont icon-ziyuan4'
    }
  ]
}
const adminNetWorkManage = {
  name: 'adminNetWorkManage',
  parentNode: '网络管理',
  index: '2',
  childNode: [
    {
      title: '虚拟路由网络管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/vRouter',
      icon: 'iconfont icon-ziyuan26'
    },
    {
      title: '专有网络',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/privatNet',
      icon: 'iconfont icon-ziyuan22'
    },
    {
      title: '子网',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/childNet',
      icon: 'iconfont icon-ziyuan20'
    },
    {
      title: 'VLAN管理',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/vlanManage',
      icon: 'iconfont icon-ziyuan24'
    },
    {
      title: 'IP管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/ipManage',
      icon: 'iconfont icon-ziyuan25'
    },
    {
      title: '公网IP管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/ipNetManage',
      icon: 'iconfont icon-ziyuan19'
    }
  ]
}
const adminResourcesManage = {
  name: 'adminResourcesManage',
  parentNode: '资源管理',
  index: '3',
  childNode: [
    {
      title: 'HOST',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/host',
      icon: 'iconfont icon-ziyuan5'
    },
    {
      title: 'VM',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/vm',
      icon: 'iconfont icon-ziyuan7'
    },
    {
      title: '安全组',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/safeGroup',
      icon: 'iconfont icon-ziyuan16'
    }
  ]
}
const adminUserPowerManage = {
  name: 'adminUserPowerManage',
  parentNode: '租户权限管理',
  index: '4',
  childNode: [
    {
      title: '租户管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/lesseeManage',
      icon: 'iconfont icon-ziyuan6'
    },
    {
      title: '项目管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/projectManage',
      icon: 'iconfont icon-ziyuan9'
    },
    {
      title: '用户列表',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/userManage',
      icon: 'iconfont icon-ziyuan30'
    }
  ]
}
const adminImage = {
  name: 'adminImage',
  parentNode: '镜像管理',
  index: '5',
  childNode: [
    {
      title: '镜像配置',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/imageManage',
      icon: 'iconfont icon-ziyuan28'
    }
  ]
}
const adminLoadBalancing = {
  name: 'adminLoadBalancing',
  parentNode: '负载均衡',
  index: '6',
  childNode: [
    {
      title: 'LB实例列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/loadBalancingList',
      icon: 'iconfont icon-ziyuan3'
    },
    {
      title: '证书管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/certificate',
      icon: 'iconfont icon-ziyuan27'
    }
  ]
}
const adminManage = {
  name: 'adminManage',
  parentNode: '系统权限管理',
  index: '7',
  childNode: [
    {
      title: '区域授权',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminImpower',
      icon: 'iconfont icon-ziyuan12'
    },
    {
      title: '用户管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/adminUser',
      icon: 'iconfont icon-ziyuan32'
    }
  ]
}
// const adminTransfer = {
//   name: 'adminTransfer',
//   parentNode: '迁移',
//   index: '8',
//   childNode: [
//     {
//       title: '迁移列表',
//       index: 1,
//       active: false,
//       link: '/sf_cloud/workbench/transfer',
//       icon: 'iconfont icon-ziyuan33'
//     }
//   ]
// }
const adminWorkOrder = {
  name: 'adminWorkOrder',
  parentNode: '工单',
  index: '9',
  childNode: [
    {
      title: '工单列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminWorkList',
      icon: 'iconfont icon-ziyuan31'
    }
  ]
}
const adminLog = {
  name: 'adminLog',
  parentNode: '日志管理',
  index: '10',
  childNode: [
    {
      title: '日志列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminLog',
      icon: 'iconfont icon-ziyuan34'
    }
  ]
}
// 一般管理员部分 -------------------------------------------------------
const areaAdminNetWorkManage = {
  name: 'areaAdminNetWorkManage',
  parentNode: '网络管理',
  index: '2',
  childNode: [
    // {
    //   title: '虚拟路由网络管理',
    //   index: 1,
    //   active: false,
    //   link: '/sf_cloud/workbench/vRouter',
    //   icon: 'iconfont icon-ziyuan26'
    // },
    {
      title: '专有网络',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/privatNet',
      icon: 'iconfont icon-ziyuan22'
    },
    {
      title: '子网',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/childNet',
      icon: 'iconfont icon-ziyuan20'
    },
    {
      title: 'VLAN管理',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/vlanManage',
      icon: 'iconfont icon-ziyuan24'
    },
    {
      title: 'IP管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/ipManage',
      icon: 'iconfont icon-ziyuan25'
    },
    {
      title: '公网IP管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/ipNetManage',
      icon: 'iconfont icon-ziyuan19'
    }
  ]
}
const areaAdminResourcesManage = {
  name: 'areaAdminResourcesManage',
  parentNode: '资源管理',
  index: '3',
  childNode: [
    {
      title: 'HOST',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/host',
      icon: 'iconfont icon-ziyuan5'
    },
    {
      title: 'VM',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/vm',
      icon: 'iconfont icon-ziyuan7'
    },
    {
      title: '安全组',
      index: 3,
      active: false,
      link: '/sf_cloud/workbench/safeGroup',
      icon: 'iconfont icon-ziyuan16'
    }
  ]
}
const areaAdminLoadBalancing = {
  name: 'areaAdminLoadBalancing',
  parentNode: '负载均衡',
  index: '6',
  childNode: [
    {
      title: 'LB实例列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/loadBalancingList',
      icon: 'iconfont icon-ziyuan3'
    },
    {
      title: '证书管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/certificate',
      icon: 'iconfont icon-ziyuan27'
    }
  ]
}
const areaAdminManage = {
  name: 'areaAdminManage',
  parentNode: '系统权限管理',
  index: '7',
  childNode: [
    {
      title: '区域授权',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminImpower',
      icon: 'iconfont icon-ziyuan12'
    },
    {
      title: '用户管理',
      index: 2,
      active: false,
      link: '/sf_cloud/workbench/adminUser',
      icon: 'iconfont icon-ziyuan32'
    }
  ]
}
const areaAdminWorkOrder = {
  name: 'areaAdminWorkOrder',
  parentNode: '工单',
  index: '9',
  childNode: [
    {
      title: '工单列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminWorkList',
      icon: 'iconfont icon-ziyuan31'
    }
  ]
}
const areaAdminLog = {
  name: 'areaAdminLog',
  parentNode: '日志管理',
  index: '10',
  childNode: [
    {
      title: '日志列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/adminLog',
      icon: 'iconfont icon-ziyuan34'
    }
  ]
}
// user 部分 -------------------------------------------------------
const userResourcesManage = {
  name: 'userResourcesManage',
  parentNode: '资源管理',
  index: 1,
  childNode: [
    {
      title: '安全组',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userSafeGroup',
      icon: 'iconfont icon-ziyuan16'
    },
    {
      title: '云主机',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userVm',
      icon: 'iconfont icon-ziyuan17'
    }
  ]
}
const userNetWorkManage = {
  name: 'userNetWorkManage',
  parentNode: '网络管理',
  index: 2,
  childNode: [
    {
      title: '专有网络',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userPrivatNet',
      icon: 'iconfont icon-ziyuan22'
    },
    {
      title: '子网',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userChildNet',
      icon: 'iconfont icon-ziyuan20'
    },
    {
      title: 'IP管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userIpManage',
      icon: 'iconfont icon-ziyuan25'
    }
  ]
}
const userLoadBalancing = {
  name: 'userLoadBalancing',
  parentNode: '负载均衡',
  index: 3,
  childNode: [
    {
      title: 'LB实例列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userLoadBalancingList',
      icon: 'iconfont icon-ziyuan3'
    },
    {
      title: '证书管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userCertificate',
      icon: 'iconfont icon-ziyuan27'
    }
  ]
}
const userPowerManage = {
  name: 'userPowerManage',
  parentNode: '权限管理',
  index: 4,
  childNode: [
    {
      title: '项目管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userProjectManage',
      icon: 'iconfont icon-ziyuan9'
    },
    {
      title: '我的信息',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/myManage',
      icon: 'iconfont icon-ziyuan32'
    }
  ]
}
const userWorkOrder = {
  name: 'userWorkOrder',
  parentNode: '工单',
  index: 5,
  childNode: [
    {
      title: '工单列表',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userWorkList',
      icon: 'iconfont icon-ziyuan31'
    }
  ]
}
const userLogManagement = {
  name: 'userLogManagement',
  parentNode: '日志管理',
  index: 6,
  childNode: [
    {
      title: '日志管理',
      index: 1,
      active: false,
      link: '/sf_cloud/workbench/userLogManagement',
      icon: 'iconfont icon-ziyuan34'
    }
  ]
}
export const navData = {
  // 注意各个导航的index排序
  admin: [
    adminAreaManage,
    adminNetWorkManage,
    adminResourcesManage,
    adminLoadBalancing,
    adminImage,
    // adminTransfer,
    adminWorkOrder,
    adminLog,
    adminUserPowerManage,
    adminManage
  ],
  areaAdmin: [
    areaAdminNetWorkManage,
    areaAdminResourcesManage,
    areaAdminLoadBalancing,
    areaAdminManage,
    areaAdminWorkOrder,
    areaAdminLog
  ],
  user: [
    userResourcesManage,
    userNetWorkManage,
    userLoadBalancing,
    userPowerManage,
    userWorkOrder,
    userLogManagement
  ]
}
export const navList = {
  adminAreaManage,
  adminNetWorkManage,
  adminResourcesManage,
  adminImage,
  adminLoadBalancing,
  adminUserPowerManage,
  adminManage,
  // adminTransfer,
  adminWorkOrder,
  adminLog,
  areaAdminNetWorkManage,
  areaAdminResourcesManage,
  areaAdminLoadBalancing,
  areaAdminManage,
  areaAdminWorkOrder,
  areaAdminLog,
  userResourcesManage,
  userNetWorkManage,
  userLoadBalancing,
  userPowerManage,
  userWorkOrder,
  userLogManagement
}
