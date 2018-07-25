import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 获取负载均衡列表
export const getLbList = function (options) {
  return axios.get('/loadbalance_display', { params: options })
}
// 修改负载均衡名称 /loadbalance_modify
export const changeName = function (options) {
  return axios.put('/loadbalance_modify', options)
}
// 负载均衡详情 /loadbalance_display_one
export const lbDetails = function (options) {
  return axios.get('/loadbalance_display_one', { params: options })
}
// 获取证书列表 /certificate_display
export const getCertificateList = function (options) {
  return axios.get('/certificate_display', { params: options })
}
// 负载均衡初始化信息 /loadbalance_cidr_init
export const createLbInit = function (options) {
  return axios.get('/loadbalance_cidr_init', { params: options })
}
// 负载均衡创建 /loadbalance_create
export const createLb = function (options) {
  return axios.post('/loadbalance_create', options)
}
// LB删除 /loadbalance_delete
export const deleteLb = function (options) {
  return axios.delete('/loadbalance_delete', { params: options })
}
// 证书创建 /certificate_create
export const createCertificate = function (options) {
  return axios.post('/certificate_create', options)
}
// 更新证书 /certificate_update
export const upDateCertificate = function (options) {
  return axios.put('/certificate_update', options)
}
// 删除证书 /certificate_delete
export const deleteCertificate = function (options) {
  return axios.delete('/certificate_delete', { params: options })
}
// 获取负载均衡监听器列表 /loadbalance_listener_display
export const getListenerList = function (options) {
  return axios.get('/loadbalance_listener_display', { params: options })
}
// 监听器创建 /loadbalance_listener_create
export const createListener = function (options) {
  return axios.post('/loadbalance_listener_create', options)
}

// 监听器删除 /loadbalance_listener_delete
export const deleteListener = function (options) {
  return axios.delete('/loadbalance_listener_delete', { params: options })
}
// 监听器可绑定云主机列表 /loadbalance_init_vm
export const getVmList = function (options) {
  return axios.get('/loadbalance_init_vm', { params: options })
}
// 监听器绑定云主机 /loadbalance_bind_vm
export const bindVm = function (options) {
  return axios.post('/loadbalance_bind_vm', options)
}
// 监听器已绑定云主机
export const getBindedVmlist = function (options) {
  return axios.get('/loadbalance_display_vm', { params: options })
}
// 监听器解绑云主机 /loadbalance_unbind_vm
export const unBindedVmlist = function (options) {
  return axios.delete('/loadbalance_unbind_vm', { params: options })
}
// 修改监听器信息 /loadbalance_listener_modify
export const editListenerInfo = function (options) {
  return axios.put('/loadbalance_listener_modify', options)
}
