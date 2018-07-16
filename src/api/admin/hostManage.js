import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/

// 获取物理机列表 page_no page_size search:{}	"name": "主机名，可模糊搜索", 	"sn": "序列号，可模糊搜索", 	"host_ip": "物理机ip，可模糊搜索", 	"remote_manage_ip": "物理机远程管理ip，可模糊搜索", 	"status": "物理机状态", 	"area_uuid": "所属区域uuid", 	"datacenter_uuid": "所属机房uuid", 	"hostcluster_uuid": "所属物理机集群uuid" }
export function getHostList (options) {
  return axios.get('/host/list', { params: options })
}
// 创建物理机
export function addHost (options) {
  return axios.post(`/host/add`, options)
}
// agent升级上传代码包 /host/agent/package_upload
export function agengUpLoad () {
  return `${axios.defaults.baseURL}/host/agent/package_upload`
}

// agengt升级发布更新 /host/agent/package_deploy
export function agengUpNew (options) {
  return axios.post(`/host/agent/package_deploy`, options, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

// 物理机开机-关机-强制关机-重启-强制重启 host_uuid:1,2,3,4 flag: 0为开机，1为强制关机，2为关机，3重启，4强制重启
export function operateSome (options) {
  return axios.put('/host/operate', options)
}

// 物理机锁定 解除锁定 host/lock/2cb0355d-872e-8ace-c947-eb4c7f87f1d flag 0解除锁定，1锁定
export function lockHost (options) {
  return axios.put(`/host/lock`, options)
}

// 物理机维护 解除维护 /host/maintain/cc222 flage: 2为维护，0为解除维护
export function maintainHost (options) {
  return axios.put(`/host/maintain`, options)
}

// 物理机删除 /host/delete
export function deleteHost (options) {
  return axios.delete(`/host/delete`, { params: options })
}

// 物理机详情 /host/info/cc22
export function getHostDel (options) {
  return axios.get(`/host/info`, { params: options })
}
// 物理机编辑信息更新 /host/update/2cb0355d-872e-8ace-c947-eb4c7f87f1dd
export function editHostInfo (options) {
  return axios.put(`/host/update`, options)
}

// 获取指定host的镜像列表 /host/image_sync/list/
export function getImageList (options) {
  return axios.get(`/host/image_sync/list`, { params: options })
}
// 镜像同步 /host/image_sync/task_add/
export function syncImage (options) {
  return axios.post(`/host/image_sync/task_add`, options, {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

// 下载物理机信息 /instance/info/excel
export const downLoadHost = function () {
  return axios.get('/host/info/excel', { responseType: 'arraybuffer' })
}
// 修改物理机密码 /system_variable/update
export const resetPassWord = function (options) {
  return axios.put('/system_variable/update', options)
}
