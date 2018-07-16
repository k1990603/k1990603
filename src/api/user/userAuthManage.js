import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/

// 获取租户绑定区域信息 /tenant/one_tenant_info
export function getTenantArea(options) {
  return axios.get('/tenant/one_tenant_info', { params: options })
}

// 获取项目详情 /project/detail_info
export function getprojectInfo(options) {
  return axios.get('/project/detail_info', { params: options })
}

// 获取项目成员列表 /project/project_members
export function getprojectUsers(options) {
  return axios.get('/project/project_members', { params: options })
}
// 获取用户详情 /user/detail_user_info
export function getUserDetails() {
  return axios.get('/user/detail_user_info')
}