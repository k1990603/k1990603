// 验证邮箱格式
export function checkEmail (email) {
  let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
  if (reg.test(email)) {
    return true
  } else {
    return false
  }
}
// 验证电话号码格式
export function checkTel (tel) {
  let reg = /^1(3|4|5|7|8)\d{9}$/
  if (reg.test(tel)) {
    return true
  } else {
    return false
  }
}

// 验证配额
export function checkQuatoVal (val) {
  let reg = /^([1-9][0-9]*)$/
  if (!reg.test(val)) {
    return false
  } else {
    return true
  }
}
// 配额格式化
export function formateQuato (scope) {
  // CPU / MEM / DISK /VM/安全组/LB/私有网络/公网IP/公网带宽 security_count
  return (
    scope.cpu +
    '核/' +
    scope.mem +
    'G/' +
    scope.disk +
    'Mb/' +
    scope.vm_count +
    '个/' +
    scope.security_count +
    '个/' +
    scope.lb_count +
    '个/' +
    scope.private_network_count +
    '个/' +
    scope.internet_ip_count +
    '个/' +
    scope.internet_bandwidth +
    '个'
  )
}
// 密码格式验证 大小写字母+数字+特殊字符8位以上
export function checkPassword (pwd) {
  var reg = /(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+{}\:"<>?,./;'=-]+)).{8,}/
  return reg.test(pwd)
}
// 名称格式验证 字母开头大小写字母+数字6位以上
export function checkUserName (pwd) {
  var reg = /^[A-Za-z0-9]{6,20}$/
  return reg.test(pwd)
}

export function formateStatus (status) {
  return status === '0' ? '正常' : status === '1' ? '禁用' : '异常'
}

// 网络类型转换
export function formateNetworkType (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '公有基础网络'
      break
    case '1':
      str = '私有网络'
      break
    case '2':
      str = '管理员专用网络'
      break
    case '3':
      str = '公有NAS网络'
      break
    case '4':
      str = '模板机网络'
      break
    case '5':
      str = '虚拟路由网络'
      break
  }
  return str
}
// vlan状态转换
export function formateVlanType (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '未使用'
      break
    case '1':
      str = '使用'
      break
  }
  return str
}

// 管理员权限
export function formateRoleType (type) {
  let str = ''
  switch (type) {
    case 1:
      str = '系统管理员'
      break
    case 2:
      str = '租户下的用户'
      break
    case 3:
      str = '应用用户'
      break
    case 4:
      str = '区域管理员'
      break
  }
  return str
}
// IP格式验证
export function checkIp (ip) {
  let reg = new RegExp(
    '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
  )
  return reg.test(ip)
}

// 物理机状态转换
export function formateHostStatu (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '运行中'
      break
    case '1':
      str = '关机'
      break
    case '2':
      str = '开机中'
      break
    case '3':
      str = '关机中'
      break
    case '99':
      str = '未知状态'
      break
  }
  return str
}

// 物理机业务状态转换
export function formateMaintainStatu (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '正常'
      break
    case '1':
      str = '锁定'
      break
    case '2':
      str = '维护'
      break
    case '3':
      str = 'agent更新中'
      break
  }
  return str
}

// agent状态转换
export function formateAgentStatu (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '正常'
      break
    case '1':
      str = '在线服务异常'
      break
    case '2':
      str = '更新中'
      break
    case '3':
      str = '离线服务异常'
      break
    case '4':
      str = '状态超时未更新'
      break
  }
  return str
}

// 时间转换为 2015-03-19 12:00：00
export function formatDateTime (date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute
}
// 获取时间的时分秒12:00：00
export function formatHour (date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  var second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  return h + ':' + minute + ':' + second
}

// 安全组名称
export function formatSecurityName (val) {
  let reg = new RegExp('^[\u4e00-\u9fa5A-Za-z0-9-_.]{1,20}$')
  if (reg.test(val)) {
    return true
  } else {
    return false
  }
}
// 安全组规则协议
export function formatProtocol (val) {
  let protocol = ''
  switch (val) {
    case '0':
      protocol = 'ALL'
      break
    case '1':
      protocol = 'TCP'
      break
    case '2':
      protocol = 'UDP'
      break
    case '3':
      protocol = 'ICMP'
      break
  }
  return protocol
}
// IP状态转换
export function formateIpStatus (type) {
  let str = ''
  // 默认未初始化
  switch (type) {
    case '0':
      str = 'primary'
      // 已初始化
      break
    case '1':
      str = 'danger'
      // 已使用
      break
    case '2':
      str = 'warning'
      // 已保留
      break
    case '3':
      str = 'success'
      // 预分配
      break
  }
  return str
}
// vm类型转换
export function formateVmType (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '普通虚拟机'
      break
    case '1':
      str = 'haproxy+keepalive服务虚拟机'
      break
    case '2':
      str = '虚拟路由DHCP设备'
      break
    case '3':
      str = '虚拟路由设备'
      break
  }
  return str
}

// VM状态转换
export function formateVmStatus (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '创建中'
      break
    case '1':
      str = '关机'
      break
    case '2':
      str = '关机中'
      break
    case '3':
      str = '运行中'
      break
    case '4':
      str = '开机中'
      break
    case '5':
      str = '挂起'
      break
    case '6':
      str = '暂停'
      break
    case '7':
      str = '热迁移中'
      break
    case '8':
      str = '冷迁移中'
      break
    case '9':
      str = '转化中'
      break
    case '10':
      str = '克隆中'
      break
    case '98':
      str = '其他'
      break
    case '99':
      str = '错误'
      break
    case '100':
      str = '虚机创建失败'
      break
    case '101':
      str = '克隆备份失败'
      break
    case '102':
      str = '克隆创建失败'
      break
    case '103':
      str = '被克隆中'
      break
    case '104':
      str = '配置中'
      break
    case '105':
      str = '热迁移失败'
      break
    case '106':
      str = '冷迁移失败'
      break
  }
  return str
}
// 网卡类型
// 网段的类型'0'为公有基础网络，'1'为私有网络，'2'为管理员专用网络，'3'为公有NAS网络,'4'模板机网络,'5'虚拟路由网络    '-1' 为外网网络
export function formateNetCardType (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '公有基础网络'
      break
    case '1':
      str = '私有网络'
      break
    case '2':
      str = '管理员专用网络'
      break
    case '3':
      str = '公有NAS网络'
      break
    case '4':
      str = '模板机网络'
      break
    case '5':
      str = '虚拟路由网络'
      break
    case '-1':
      str = '外网网络'
      break
  }
  return str
}
// 转换IP网卡类型的字段
export function formateNetCardKey (type) {
  let str = ''
  switch (type) {
    case '0':
      str = 'public_ip'
      break
    case '1':
      str = 'private_ip'
      break
    case '2':
      str = 'admin_ip'
      break
    case '3':
      str = 'public_nas_ip'
      break
    case '4':
      str = 'template_ip'
      break
    case '5':
      str = 'route_ip'
      break
    case '-1':
      str = 'public_ip'
      break
  }
  return str
}
// 负载均衡状态转换
export function formateLbStatus (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '正常'
      break
    case '1':
      str = '异常'
      break
    case '2':
      str = '创建中'
      break
    case '3':
      str = '创建失败'
      break
    case '4':
      str = '配置中'
      break
  }
  return str
}
// 负载均衡健康状态转换
export function formateHealthStatus (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '正常'
      break
    case '1':
      str = '异常'
      break
  }
  return str
}
// 镜像状态转换
export function formateImagethStatus (type) {
  let str = ''
  switch (type) {
    case '0':
      str = '使用中'
      break
    case '1':
      str = '编辑中'
      break
    case '-1':
      str = '初始化'
      break
    case '2':
      str = '待发布'
      break
    case '3':
      str = '发布中'
      break
    case '4':
      str = '生成镜像中'
      break
  }
  return str
}
// 监听器的均衡方式转换
export function formatebalanceStrategy (type) {
  let str = ''
  switch (type) {
    case 4:
      str = '轮询(roundrobin)'
      break
    case 1:
      str = '静态轮询(static-rr)'
      break
    case 2:
      str = '源ip(source)'
      break
    case 3:
      str = '最小连接(leastconn)'
      break
  }
  return str
}
// 监听器的协议转换
export function formateProtocol (type) {
  let str = ''
  switch (type) {
    case '0':
      str = 'TCP'
      break
    case '1':
      str = 'HTTP'
      break
    case '2':
      str = 'https'
      break
  }
  return str
}
// 虚拟路由网络管理
export function formateRouter (type) {
  let str = ''
  switch (type) {
    case '-1':
      str = '初始化'
      break
    case '0':
      str = '正常'
      break
    case '1':
      str = '服务异常'
      break
    case '2':
      str = '无法访问'
      break
  }
  return str
}
// 下载文件
export function downloadFile (data, fileName) {
  let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    let link = document.createElement('a')
    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', false, false)
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}

// 网络创建状态转换
export function formateNetStatus(statu){
  let str = ''
   switch (statu) {
    case '0':
      str = '创建中'
      break
    case '1':
      str = '使用中'
      break
    case '2':
      str = '创建失败'
      break
  }
  return str
}
// 验证CIDR格式
export function checkCidr(value) {
      if (value == '') {
        return { type: false, message: '请输入CIDR' }
      } else if (value.indexOf('/') >= 0) {
        let ip = value.split('/')[0]
        let netMask = parseInt(value.split('/')[1])
        if (netMask < 0 || netMask > 32) {
          return { type: false, message: 'CIDR中掩码为0-32中的整数' }
        }
        if (ip == '0.0.0.0') {
          return { type: true }
        } else if (!this.checkIp(ip)) {
          return { type: false, message: 'CIDR格式不正确(例：10.1.1.1/16)' }
        }
        return { type: true }
      } else {
        return { type: false, message: 'CIDR格式不正确(例：10.1.1.1/16)' }
      }
    }