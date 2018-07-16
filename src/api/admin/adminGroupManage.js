import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 创建管理员组 /group/list
export function getGroupList(options) {
  return axios.get('/group/list', {
    params: options
  })
}

// 创建管理员组 /api/group/add_group
export function addGroup(options) {
  return axios.post('/group/add_group', options)
}

// 修改名称 /group/update_group_name
export function editName(options) {
  return axios.put('/group/update_group_name', options)
}

// 修改所有者
export function editowner(options) {
  return axios.put('/group/update_group_info', options)
}
// 获取组的详情 /group/detail_group_info
export function getAdminDetail(options) {
  return axios.get('/group/detail_group_info', {
    params: options
  })
}
// 修改所属集群 /group/update_group_attach_hostcluster
export function editArea(options) {
  return axios.put('/group/update_group_attach_hostcluster', options)
}
// 删除组 /group/update_group_name
export function deleteGroup(options) {
  return axios.delete('/group/delete_group', {
    params: options
  })
}
// 删除组成员
export function deleteGroupMember(options) {
  return axios.delete('/group/delete_group_member', {
    params: options
  })
}

// 成员列表 /group/user_list group_id: 111
export function getMembers(options) {
  return axios.get('/group/user_list', {
    params: options
  })
}

// 获取管理员所有用户
export function getAllAdmin(options) {
  return axios.get('/group_user/admin_user_init', {
    params: options
  })
}

// 添加已有用户到组 /group/add_sf_user_group_member
export function addExistAdmin(options) {
  return axios.post('/group/add_sf_user_group_member', options)
}
// 添加新用户到组 /group/add_new_user_group_member
export function addNewAdmin(options) {
  return axios.post('/group/add_new_user_group_member', options)
}

// 获取所有管理员 /group_user/all_user_list
export function getAllAdminUser(options) {
  return axios.get('/group_user/all_user_list', {
    params: options
  })
}

// 添加管理员(内部员工) /group_user/add_sf_admin_user
export function addAdUser(options) {
  return axios.post('/group_user/add_sf_admin_user', options)
}
// 添加外部用户 /group_user/add_new_admin_user
export function addNewUser(options) {
  return axios.post('/group_user/add_new_admin_user', options)
}

// 获取管理员用户详细信息 /group_user/detail_admin_user_info
export function getAdminUserInfo(options) {
  return axios.get('/group_user/detail_admin_user_info', {
    params: options
  })
}

// 获取管理员可选组 /group_user/update_group_init
export function getAviableGroup() {
  return axios.get('/group_user/update_group_init')
}

// 分配到组 /group_user/update_user_group
export function allotGroup(options) {
  return axios.put('/group_user/update_user_group', options)
}
// 删除用户
export function deleteUser(options) {
  return axios.delete('/group_user/del_user_admin', {
    params: options
  })
}
// 管理组用户的详细信息
export function detailUser(options) {
  return axios.get('/group_user/detail_admin_user_info', {
    params: options
  })
}
// 修改密码
export function editUserPwd(options) {
  return axios.put('/user/update_user_pwd', options)
}
