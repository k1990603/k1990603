import axios from 'axios'

// =================================区域=================================
// 查询区域List
export function fetchList () {
  return axios.get('/area/top_list')
}
// 查询区域--子区域
export function fetchListChild (options) {
  return axios.post('/area/get_child_info', options)
}
// 查询区域及子区域相关信息
export function queryAreaList () {
  return axios.get('area/area_data_init')
}
// 创建新的区域
export function creatAreaInf (options) {
  return axios.post('area/add_area', options)
}
// 删除子区域
export function deleteSubareaData (options) {
  return axios.delete('/area/delete', { params: options })
}

// 编辑区域
export function editAreaData (options) {
  return axios.put('/area/edit', options)
}
// =================================机房=================================
// 获取所有区域机房的信息
export function queryDCList (options) {
  return axios.get(
    `datacenter/all_dc_data?page_size=${options.page_size}&page_num=${
      options.page_num
    }`
  )
}
// 获取省市信息 /datacenter/province_city_json
export function getProvinceCity () {
  return axios.get(`/datacenter/province_city_json`)
}
// 获取指定区域直连机房 /datacenter/get_direct_dc
export function getDirectDc (options) {
  return axios.get(`/datacenter/get_direct_dc`, { params: options })
}

// 新建机房弹框
export function creatComputerRoom (options) {
  return axios.post(`datacenter/add_datacenter`, options)
}
// 获取指定机房信息
export function findDCDetails (options) {
  return axios.get(`datacenter/sepc_area_dc_data`, { params: options })
}

// 删除机房
export function deleteDatacenterData (options) {
  return axios.delete('/datacenter/del_datacenter', { params: options })
}
// 编辑机房信息
export function editDatacenterData (options) {
  return axios.put('/datacenter/edit_datacenter', options)
}
// =================================集群=================================
// 获取所有集群信息
export function queryHostList (options) {
  // "datacenter_uuid": datacenter_uuid,
  // "name": name,      (模糊匹配)
  // "dc_name": dc_name       (模糊匹配)
  // "page_size": page_size,
  // "page_num": page_num
  return axios.get(`hostcluster/get_all_hostcluster`, { params: options })
}
// 新增集群
export function addHostpool (options) {
  return axios.post('hostcluster/add_hostcluster', options)
}
// 删除集群
export function deleteHostPoolPageData (options) {
  return axios.delete('/hostcluster/del_hostcluster', { params: options })
}
// 获取集群信息列表
export function filterHostPoolPageData (options) {
  return axios.get('/hostcluster/get_all_hostcluster', { params: options })
}
// 获取集群镜像缓存服务器地址 /hostcluster/get_imgcache
export function getImagecacheInfo (options) {
  return axios.get('/hostcluster/get_imgcache', { params: options })
}
// 编辑集群提交 /hostcluster/edit_hostcluster
export function editHcInfo (options) {
  return axios.put('/hostcluster/edit_hostcluster', options)
}
