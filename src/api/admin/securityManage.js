import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 获取安全组列表
export function getSecurityList (options) {
  return axios.get('/display_security_group', { params: options })
}

// 获取租户项目信息 /init_security_group
export function getTenantPro (options) {
  return axios.get('/init_security_group', { params: options })
}
// 获取安全组模板信息 模板列表
export function getSecurityTmp (options) {
  return axios.get('/display_securitygroup_template', { params: options })
}
// 创建安全组 /new_security_group
export function createSecurity (options) {
  return axios.post('/new_security_group', options)
}
// 克隆安全组 /clone_security_group
export function cloneSecurity (options) {
  return axios.post('/clone_security_group', options)
}
// 删除安全组 /delete_security_group
export function deleteSecurity (options) {
  return axios.delete('/delete_security_group', { params: options })
}
// 获取安全规则列表
export function getRules (options) {
  return axios.get('/display_securitygroup_rule', { params: options })
}
// 获取安全组云主机实例 /display_securitygroup_instance
export function getVms (options) {
  return axios.get('/display_securitygroup_instance', { params: options })
}
// 获取该安全组可绑定的虚拟机 /init_securityinstance
export function getAllVm (options) {
  return axios.get('/init_securityinstance', { params: options })
}
// 移除安全组绑定的虚拟机 /delete_securitygroup_instance
export function deleteIntance (options) {
  return axios.delete('/delete_securitygroup_instance', { params: options })
}
// 新增关联VM /new_securitygroup_instance
export function addNewIntance (options) {
  return axios.post('/new_securitygroup_instance', options)
}
// 获取安全组规则列表 /display_securitygroup_rule
export function getAllRules (options) {
  return axios.get('/display_securitygroup_rule', { params: options })
}
// 增加安全组规则 /new_securitygroup_rule
export function addSecurityRules (options) {
  return axios.post('/new_securitygroup_rule', options)
}
// 安全组规则排序 /sort_securitygroup_rule
export function sortUpdate (options) {
  return axios.put('/sort_securitygroup_rule', options)
}
// 删除安全组规则 /delete_securitygroup_rule
export function deleteRule (options) {
  return axios.delete('/delete_securitygroup_rule', { params: options })
}
// 编辑安全组规则 /edit_securitygroup_rule
export function editRule (options) {
  return axios.put('/edit_securitygroup_rule', options)
}
// 插入安全组规则 /insert_securitygroup_rule
export function insertRule (options) {
  return axios.post('/insert_securitygroup_rule', options)
}
// 下载安全组规则 /export_securitygroup_rule
export function downLoadRules (options) {
  return axios.get('/export_securitygroup_rule', {
    params: options,
    responseType: 'arraybuffer'
  })
}
// 上传安全组规则 /upload_securitygroup_rule
export function upLoadRules (str) {
  return `${axios.defaults.baseURL}/upload_securitygroup_rule?${str}`
}
// 下载安全组模板
export function downLoadTmp () {
  return axios.get('/export_standard_rule_tem', { responseType: 'arraybuffer' })
}
// 获取安全组模板列表 /display_securitygroup_template
export function srcurityTmpList (options) {
  return axios.get('/display_securitygroup_template', { params: options })
}
// 添加安全组模板 /new_securitygroup_template
export function addSecurityTmp (options) {
  return axios.post('/new_securitygroup_template', options)
}
