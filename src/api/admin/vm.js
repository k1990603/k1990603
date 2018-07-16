import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 获取虚拟机列表
export const getVmList = function (options) {
  return axios.get('/instance/instance_list', { params: options })
}
// 虚拟机详情 /instance/instance_detail
export const getVmDetails = function (options) {
  return axios.get('/instance/instance_detail', { params: options })
}

// 虚拟机创建 /instance/instance_create
export const createVm = function (options) {
  return axios.post('/instance/instance_create', options)
}
// 虚拟机开机
export const startUpVm = function (options) {
  return axios.post('/instance/instance_startup', options)
}
// 虚拟关机
export const shutDownVm = function (options) {
  return axios.post('/instance/instance_shutdown', options)
}
// 虚拟机重启 /instance/instance_reboot
export const restartVm = function (options) {
  return axios.post('/instance/instance_reboot', options)
}
// 虚拟机删除 /instance/instance_delete
export const deleteVm = function (options) {
  return axios.delete('/instance/admin_instance_delete', { params: options })
}
// 虚拟机重试 /instance/instance_retry_creat
export const retryVm = function (options) {
  return axios.post('/instance/instance_retry_create', options)
}
// 获取当前管理员所可管理的租户项目信息 /tenant/group_user_under_tenant_and_project
export const getUseTenant = function (options) {
  return axios.get('/tenant/group_user_under_tenant_and_project', options)
}
// 获取当前管理员可管理的指定项目的区域集群信息 /project/get_area_chain_filter_by_hc_uuid_list
export const getUseArea = function (options) {
  return axios.get('/project/get_area_chain_filter_by_hc_uuid_list', {
    params: options
  })
}
// 获取指定租户指定项目可用镜像 /instance/image_init
export const getUseImage = function (options) {
  return axios.get('/instance/image_init', {
    params: options
  })
}
// 获取cpu mem信息 /instance/flavor_init
export const getConfigInfo = function () {
  return axios.get('/instance/flavor_init')
}
// 获取虚拟机可创建的目标网段 /instance/subnetwork_segment_init
export const getSegementInfo = function (options) {
  return axios.get('/instance/subnetwork_segment_init', { params: options })
}
// 获取指定项目的专有安全组信息
export const getSecurityInfo = function (options) {
  return axios.get('/instance/securitygroup_project_init', { params: options })
}
// 获取指定项目的公用安全组信息
export const getPubSecurityInfo = function (options) {
  return axios.get('/instance/securitygroup_all_use_init', { params: options })
}
// 磁盘扩容init /instance/extend_disk_init
export const getdiskScaleInfo = function (options) {
  return axios.get('/instance/extend_disk_init', { params: options })
}
// 磁盘扩容提交 /instance/extend_disk
export const diskScale = function (options) {
  return axios.put('/instance/extend_disk', options)
}
// root密码修改 /instance/reset_root_pwd
export const resetPass = function (options) {
  return axios.put('/instance/reset_root_pwd', options)
}
// 修改虚拟机配额 /instance/change_instance_flavor
export const resetFlovr = function (options) {
  return axios.put('/instance/change_instance_flavor', options)
}
// 获取指定虚拟机网卡信息 /instance/nic_configure_init
export const getNetCardInfo = function (options) {
  return axios.get('/instance/bind_securitygroup_init', { params: options })
}
// 配置虚拟机安全组信息 /instance/bind_instance_securitygroup
export const changeSecurity = function (options) {
  return axios.put('/instance/bind_instance_securitygroup', options)
}
// 调整网络带宽 /instance/internet_bandwidth_change
export const changeNetWidth = function (options) {
  return axios.put('/instance/internet_bandwidth_change', options)
}
// 网卡配置信息初始化 /instance/nic_configure_init
export const netCardInitInfo = function (options) {
  return axios.get('/instance/nic_configure_init', { params: options })
}
// 网卡配置信息--修改 /instance/change_instance_ip
export const changeNetCardInitInfo = function (options) {
  return axios.put('/instance/change_instance_ip', options)
}
// 网卡配置信息--添加网卡/instance/add_instance_nic
export const addNetCard = function (options) {
  return axios.post('/instance/add_instance_nic', options)
}
// 热迁移获取host /instance/hot_migrate_init
export const getHotMigrateInfo = function (options) {
  return axios.get('/instance/hot_migrate_init', { params: options })
}
// 热迁移提交 /instance/instance_hot_migrate
export const hotMigrate = function (options) {
  return axios.put('/instance/instance_hot_migrate', options)
}
// 冷迁移获取host
export const getColdMigrateInfo = function (options) {
  return axios.get('/instance/cold_migrate_init', { params: options })
}
// 冷迁移提交
export const coldMigrate = function (options) {
  return axios.put('/instance/instance_cold_migrate', options)
}
// 克隆备份 /instance/instance_clone
export function cloneBackUp (options) {
  return axios.post(`/instance/instance_clone`, options, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}
// 克隆创建
export const cloneCreate = function (options) {
  return axios.post('/instance/clone_create', options)
}
// 分配至指定的项目
export const distributionTarget = function (options) {
  return axios.put('/instance/change_instance_project', options)
}
// 修改虚拟机名称 /instance/update_instance_name
export const changeInstanceName = function (options) {
  return axios.put('/instance/update_instance_name', options)
}
// console登入 /instance/console
export const getConsoleHost = function (options) {
  return axios.get('/instance/console', { params: options })
}
// 下载虚拟机信息 /instance/info/excel
export const downLoadVm = function () {
  return axios.get('/instance/info/excel', { responseType: 'arraybuffer' })
}
