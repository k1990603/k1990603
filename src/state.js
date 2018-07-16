// import axios from 'axios'
// import router from './router'
// import { Message } from 'element-ui'

// let dev = (() => {
//   if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production') {
//     return false
//   }
//   return true
// })()
const store = {
  state: {
    id: '',
    // baseURL: 'http://10.202.105.50/api',
    baseURL: 'http://10.202.69.253:19405/api',
    setCookie: '',
    currentRole: '',
    userInfo: {}, // 用户信息
    /*
    * 区域状态管理
    */
    areaManageDialog: {
      areCreate: false, // 区域创建
      areaEdit: false, // 区域编辑
      areaAdd: false, // 添加子区域
      areaChildCheck: false // 查看子区域
    },
    /*
    * 机房状态管理
    */
    datacenterDialog: {
      create: false, // 机房创建
      edit: false, // 机房编辑
      delete: false // 删除机房
    },
    /*
    * 集群状态管理
    */
    hostpoolDialog: {
      create: false, // 集群创建
      edit: false, // 集群编辑
      delete: false // 集群机房
    },
    /*
    * 专有网络管理
    */
    privatNet: {
      create: false, // 专有网络创建
      edit: false, // 专有网络编辑
      delete: false, // 专有网络删除
      check: false // 查看指定网络下的子网信息
    },
    /*
    * 子网管理
    */
    subNet: {
      create: false,
      editName: false,
      editVlanId: false,
      delete: false
    },
    /*
    * vlan管理
    */
    vlan: {
      initShow: false // 初始化vlan
    },
    /*
    * vlan管理
    */
    ipPage: {
      ipDialog: false // ip操作弹框
    },
    /*
    * 公网IP管理
    */
    ipNetPage: {
      writeIp: false, // 公网录入
      ipOperate: false,
      vip: false,
      projectIp: false
    },
    /* 资源管理模块 */
    /*
    * host管理
    */
    hostPage: {
      create: false,
      edit: false,
      someOperate: false, // 开机 关机 删除 强制关机 强制重启 重启 锁定解除锁定 维护 解除维护
      agentUpGrade: false,
      tableColumName: false // 自定列名
    },
    /*
    * VM管理
    */
    vmPage: {
      someOperate: false, // 开机、关机、重试、删除、重启
      resetPwd: false, // 重置密码
      editName: false, // 修改名称
      editNet: false, // 调整网络
      editConfig: false, // 调整配置
      assignProject: false, // 分配至项目
      editSafeGroup: false, // 配置安全组
      // cloneCopy: false, // 克隆备份
      // cloneCreate: false, // 克隆创建
      coldMigrate: false, // 冷迁移
      hotMigrate: false, // 热迁移
      bindPubNetIp: false, // 绑定公网IP
      unBindPubNetIp: false, // 解绑公网IP
      syncImage: false // 镜像同步
    },
    /*
    * 安全组管理
    */
    safeGroup: {
      create: false, // 安全组的创建
      clone: false, // 克隆安全组
      delete: false, // 删除安全组
      createSafeGroupTmp: false, // 创建安全组模板
      deleteSafeGroupTmp: false, // 删除安全组模板
      addRules: false, // 添加安全组规则
      addVmInstance: false // 添加安全组实例
    },
    /*
    * 租户管理
    */
    lessee: {
      delete: false, // 租户的创建
      adjustQuato: false, // 调整配额
      adjustArea: false, // 调整租户关联的区域
      editLesseeInfo: false // 修改租户信息
    }
  },
  getLoginInfo () {
    // debugger
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      store.state.userInfo = userInfo
    } else {
      store.state.userInfo = null
    }
  }
}
export default store
