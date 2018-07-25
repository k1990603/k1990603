import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/

// 租户列表
export function getLesseeList (options) {
  return axios.get('/tenant/list', {
    params: options
  })
}
// 创建获取区域信息
export function getAreaInfo () {
  return axios.get('/hostcluster/all_area_dc_hc')
}
// 创建获取指定区域机房信息 /area/area_data_init
export function getDatcenterInfo (options) {
  return axios.get('/hostcluster/get_direct_info_by_area', {
    params: options
  })
}
// 创建获取区域机房集群信息
export function getHostclusterInfo (options) {
  return axios.get('/hostcluster/all_area_dc_hc', {
    params: options
  })
}

// 创建租户
export function createLesseeList (options) {
  return axios.post('/tenant/add', options)
}

// 删除租户
export function deleteLessee (options) {
  return axios.delete('/tenant/delete', {
    params: options
  })
}

// 修改租户名称
export function editLesseeName (options) {
  return axios.post('/tenant/update_name', options)
}

// 修改租户配额
export function editLesseeQuato (options) {
  return axios.post('/tenant/update_quota', options)
}

// 获取租户信息 /tenant/one_tenant_info
export function getLesseeInfo (options) {
  return axios.get('/tenant/one_tenant_info', {
    params: options
  })
}

// 更新租户信息
export function editLesseeInfo (options) {
  return axios.post('/tenant/update_info', options)
}

// 修改租户集群信息 /tenant/update_hostcluster
export function editLesseeHostpoolInfo (options) {
  return axios.post('/tenant/update_hostcluster', options)
}
// 获取指定租户下面所有项目 /project/get_all_project_info_by_tenant_uuid
export function getProjectArr (options) {
  return axios.get('/project/get_all_project_info_by_tenant_uuid', {
    params: options
  })
}
// 项目列表 /project/list
export function getProjectList (options) {
  return axios.get('/project/list', {
    params: options
  })
}

// 项目新增 /project/add
export function addProject (options) {
  return axios.post('/project/add', options)
}

// 项目删除/project/delete_project
export function deleteProject (options) {
  return axios.delete('/project/delete_project', {
    params: options
  })
}

// 项目名称修改 /project/update_name
export function editProjectName (options) {
  return axios.put('/project/update_name', options)
}

// 获取单个项目信息 /project/detail_info
export function getProjectDetails (options) {
  return axios.get('/project/detail_info', {
    params: options
  })
}
// 项目配额修改 /project/update_config
export function editProjectQuato (options) {
  return axios.put('/project/update_config', options)
}
// 项目信息修改 /project/update_info
export function editProjectInfo (options) {
  return axios.put('/project/update_info', options)
}
// 获取所有租户名称 /user/init_tenants
export function getLesseeNameList () {
  return axios.get('/user/init_tenants')
}

// 获取指定租户下面所有用户
export function getLesseeMember (options) {
  return axios.get('/project/tenant_user_init', {
    params: options
  })
}

// 修改租户配额
export function editQuatoSubmit (options) {
  return axios.put('/project/update_attach_hostcluster', options)
}

// 获取项目下面所有用户
export function getProjectMember (options) {
  return axios.get('/project/project_user_init', {
    params: options
  })
}
// 获取项目下成员列表 /project/project_members
export function getUsers (options) {
  return axios.get('/project/project_members', {
    params: options
  })
}

// 删除项目下指定用户 /project/member_delete
export function deleteMember (options) {
  return axios.delete('/project/member_delete', {
    params: options
  })
}

// 增加项目成员 /project/add_member
export function addExistMember (options) {
  return axios.post('/project/add_member', options)
}
// 增加新用户到项目
export function addNewMember (options) {
  return axios.post('/project/add_new_member', options)
}

// 获取所有用户 /user/list
export function getAllUser (options) {
  return axios.get('/user/list', {
    params: options
  })
}

// 添加AD用户到指定租户
export function addAdUser (options) {
  return axios.post('/user/add_user_to_tenant', options)
}
// 添加外部用户到指定租户
export function addExternalUser (options) {
  return axios.post('/user/add_newuser_to_tenant', options)
}

// 删除用户 /user/delete_user
export function deleteUser (options) {
  return axios.delete('/user/delete_user', {
    params: options
  })
}
// 激活用户
export function activeUser (options) {
  return axios.put('/user/user_active', options)
}
// 禁用用户
export function disabledUser (options) {
  return axios.put('/user/user_disable', options)
}

// 修改密码
export function editUserPwd (options) {
  return axios.put('/user/update_user_pwd', options)
}
// 修改用户信息
export function editUserInfo (options) {
  return axios.post('/user/update_user', options)
}

// 获取指定用户的详情 /user/detail_user_info params:{user_id: 80002473}
export function userDeatils (options) {
  return axios.get('/user/detail_user_info', {
    params: options
  })
}
// 修改后接口：获取指定用户的详情 /user/query_user_info params:{user_id: 80002473}
export function userDeatilsList (options) {
  return axios.get('/user/query_user_info', {
    params: options
  })
}

// 显示一个用户的详细信息，用于租户用户页面详情
export function detailByUserId (options) {
  return axios.get('/user/detail_user_info_by_user_id', {
    params: options
  })
}
// 获取用户在指定租户下的项目信息 /project/one_tenant_under_project_list
export function getAppointProject (options) {
  return axios.get('/project/one_tenant_under_project_list', {
    params: options
  })
}
