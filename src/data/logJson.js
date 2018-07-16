export function logJsonData() {
  let option = [{
      value: '登录/登出',
      label: '登录/登出',
      children: [{
          value: '登录',
          label: '登录'
        },
        {
          value: '登出',
          label: '登出'
        }
      ]
    },
    {
      value: '区域',
      label: '区域',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: '机房',
      label: '机房',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: '集群',
      label: '集群',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: 'HOST',
      label: 'HOST',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '锁定',
          label: '锁定'
        },
        {
          value: '维护',
          label: '维护'
        },
        {
          value: '其他操作',
          label: '其他操作'
        },
        {
          value: '添加镜像同步任务',
          label: '添加镜像同步任务'
        },
        {
          value: 'agent状态调整',
          label: 'agent状态调整'
        },
        {
          value: '更新agent包',
          label: '更新agent包'
        },
        {
          value: '更新agent包配置',
          label: '更新agent包配置'
        }
      ]
    },
    {
      value: '云主机',
      label: '云主机',
      children: [{
          value: '重试',
          label: '重试'
        },
        {
          value: '开机',
          label: '开机'
        },
        {
          value: '关机',
          label: '关机'
        },
        {
          value: '重启',
          label: '重启'
        },
        {
          value: '重置密码',
          label: '重置密码'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '更新名称',
          label: '更新名称'
        },
        {
          value: '更新配额',
          label: '更新配额'
        },
        {
          value: '磁盘扩容',
          label: '磁盘扩容'
        },
        {
          value: '绑定公网IP',
          label: '绑定公网IP'
        },
        {
          value: '修改公网带宽',
          label: '修改公网带宽'
        },
        {
          value: '热迁移',
          label: '热迁移'
        },
        {
          value: '冷迁移',
          label: '冷迁移'
        },
        {
          value: '克隆创建',
          label: '克隆创建'
        },
        {
          value: '克隆备份',
          label: '克隆备份'
        },
        {
          value: '绑定安全组',
          label: '绑定安全组'
        },
        {
          value: '其他平台创建',
          label: '其他平台创建'
        },
        {
          value: '更改IP网络',
          label: '更改IP网络'
        },
        {
          value: '添加网卡',
          label: '添加网卡'
        },
        {
          value: '删除网卡',
          label: '删除网卡'
        },
        {
          value: '更改关联项目',
          label: '更改关联项目'
        }
      ]
    },
    {
      value: '安全组',
      label: '安全组',
      children: [{
          value: '规则修改',
          label: '规则修改'
        },
        {
          value: '新增',
          label: '新增'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '克隆创建',
          label: '克隆创建'
        },
        {
          value: '规则插入',
          label: '规则插入'
        },
        {
          value: '规则导入',
          label: '规则导入'
        },
        {
          value: '规则新增',
          label: '规则新增'
        },
        {
          value: '规则修改',
          label: '规则修改'
        },
        {
          value: '规则删除',
          label: '规则删除'
        },
        {
          value: '规则排序',
          label: '规则排序'
        },
        {
          value: '绑定云主机',
          label: '绑定云主机'
        },
        {
          value: '解绑云主机',
          label: '解绑云主机'
        },
        {
          value: '模板创建',
          label: '模板创建'
        }
      ]
    },
    {
      value: '专有网络',
      label: '专有网络',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: '子网',
      label: '子网',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '修改子网VLAN',
          label: '修改子网VLAN'
        }
      ]
    },
    {
      value: 'VLAN',
      label: 'VLAN',
      children: [{
        value: '新增',
        label: '新增'
      }]
    },
    {
      value: '公网IP',
      label: '公网IP',
      children: [{
          value: '分配到项目',
          label: '分配到项目'
        },
        {
          value: '保留IP',
          label: '保留IP'
        },
        {
          value: '取消保留IP',
          label: '取消保留IP'
        },
        {
          value: '初始化IP',
          label: '初始化IP'
        },
        {
          value: '取消初始化IP',
          label: '取消初始化IP'
        }
      ]
    },
    {
      value: '租户管理',
      label: '租户管理',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '更新名称',
          label: '更新名称'
        },
        {
          value: '更新详细信息',
          label: '更新详细信息'
        },
        {
          value: '更新关联集群',
          label: '更新关联集群'
        },
        {
          value: '更新配额',
          label: '更新配额'
        }
      ]
    },
    {
      value: '项目管理',
      label: '项目管理',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '添加用户',
          label: '添加用户'
        },
        {
          value: '添加新用户',
          label: '添加新用户'
        },
        {
          value: '更新名称',
          label: '更新名称'
        },
        {
          value: '更新详细信息',
          label: '更新详细信息'
        },
        {
          value: '更新关联集群',
          label: '更新关联集群'
        },
        {
          value: '更新配额',
          label: '更新配额'
        },
        {
          value: '删除成员',
          label: '删除成员'
        }
      ]
    },
    {
      value: '用户管理',
      label: '用户管理',
      children: [{
          value: '删除',
          label: '删除'
        },
        {
          value: '激活',
          label: '激活'
        },
        {
          value: '禁用',
          label: '禁用'
        },
        {
          value: '添加用户',
          label: '添加用户'
        },
        {
          value: '添加新用户',
          label: '添加新用户'
        },
        {
          value: '更新用户',
          label: '更新用户'
        },
        {
          value: '更新用户密码',
          label: '更新用户密码'
        }
      ]
    },
    {
      value: '系统管理组',
      label: '系统管理组',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '更新名称',
          label: '更新名称'
        },
        {
          value: '新增域用户',
          label: '新增域用户'
        },
        {
          value: '添加新用户',
          label: '添加新用户'
        },
        {
          value: '更新关联集群',
          label: '更新关联集群'
        },
        {
          value: '更新详细信息',
          label: '更新详细信息'
        },
        {
          value: '删除成员',
          label: '删除成员'
        }
      ]
    },
    {
      value: '系统管理员',
      label: '系统管理员',
      children: [{
          value: '删除',
          label: '删除'
        },
        {
          value: '添加新用户',
          label: '添加新用户'
        },
        {
          value: '新增域用户',
          label: '新增域用户'
        },
        {
          value: '更新用户',
          label: '更新用户'
        }
      ]
    },
    {
      value: '应用接口用户管理',
      label: '应用接口用户管理',
      children: [{
          value: '删除',
          label: '删除'
        },
        {
          value: '添加用户',
          label: '添加用户'
        },
      ]
    },
    {
      value: '工单',
      label: '工单',
      children: [{
          value: '提交',
          label: '提交'
        },
        {
          value: '添加信息内容',
          label: '添加信息内容'
        },
        {
          value: '用户确认',
          label: '用户确认'
        },
        {
          value: '用户拒绝',
          label: '用户拒绝'
        },
        {
          value: '管理员确认',
          label: '管理员确认'
        },
        {
          value: '撤销',
          label: '撤销'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: '负载均衡',
      label: '负载均衡',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '删除',
          label: '删除'
        },
        {
          value: '绑定云主机',
          label: '绑定云主机'
        },
        {
          value: '解绑云主机',
          label: '解绑云主机'
        },
        {
          value: '更新名称',
          label: '更新名称'
        },
        {
          value: '创建监听器',
          label: '创建监听器'
        },
        {
          value: '修改监听器',
          label: '修改监听器'
        },
        {
          value: '删除监听器',
          label: '删除监听器'
        },
        {
          value: '更新dhcp设备状态',
          label: '更新dhcp设备状态'
        }
      ]
    },
    {
      value: '负载均衡证书',
      label: '负载均衡证书',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '删除',
          label: '删除'
        }
      ]
    },
    {
      value: 'IP管理',
      label: 'IP管理',
      children: [{
          value: '初始化IP',
          label: '初始化IP'
        },
        {
          value: '取消初始化IP',
          label: '取消初始化IP'
        },
        {
          value: '保留IP',
          label: '保留IP'
        },
        {
          value: '取消保留IP',
          label: '取消保留IP'
        },
        {
          value: '预分配IP',
          label: '预分配IP'
        },
        {
          value: '取消预分配IP',
          label: '取消预分配IP'
        },
        {
          value: '申请IP',
          label: '申请IP'
        }
      ]
    },
    {
      value: '公网网段',
      label: '公网网段',
      children: [{
        value: '新增',
        label: '新增'
      }]
    },
    {
      value: '镜像管理',
      label: '镜像管理',
      children: [{
          value: '新增',
          label: '新增'
        },
        {
          value: '修改',
          label: '修改'
        },
        {
          value: '更新详细信息',
          label: '更新详细信息'
        },
        {
          value: '生成',
          label: '生成'
        },
        {
          value: '全新发布',
          label: '全新发布'
        }
      ]
    },
    {
      value: '虚拟路由',
      label: '虚拟路由',
      children: [{
        value: '更新dhcp设备状态',
        label: '更新dhcp设备状态'
      }]
    }
  ]
  return option
}
