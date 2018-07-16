import {
  DIALOG_UPDATE
} from '../mutation-types'

const state = {
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
  }
}

const mutations = {
  [DIALOG_UPDATE] (state, areaManageDialog) {
    state[areaManageDialog.tag[0]][areaManageDialog.tag[1]] =
      areaManageDialog.value
  }
}

export default {
  state,
  mutations
}

// dialog更新使用
// 更新：
// ...mapActions({
//   updateUserName : 'updateUserName', // 直接当函数调 this.updateUserName(false)
//   updateDialog: 'updateDialog',
// }),
// testchange () {
//   this.updateDialog({
//     tag: ['areaManageDialog', 'areCreate'],
//     value: true
//   })
// },

// 使用：
// computed : {
//   count() {
//     return this.$store.state.dialog.areaManageDialog.areCreate
//   }
// },
