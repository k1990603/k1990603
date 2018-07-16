import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 创建虚拟路由网络 /vrnet/create_vr_net
export function vrnetCreate (options) {
  return axios.post('/vrnet/create_vr_net', options)
}
// 所有私有网络的展示接口 /network_segment/network_segment_list
export function getNetWorkList (options) {
  return axios.get('/network_segment/network_segment_list', {
    params: options
  })
}
export function getUserList () {
  return axios.get('/user/init_tenants')
}
export function getTopAreaList () {
  return axios.get('/area/top_list')
}
// 获取cidr信息
export function getsegment_init () {
  return axios.get('/network_segment/network_segment_init')
}
// 获取大区信息以及子网信息
export function get_area_data_init () {
  return axios.get('/area/area_data_init')
}
// 获取大区信息
export function getAllAreaDcHcNet () {
  return axios.get('/hostcluster/all_area_dc_hc_net')
}
export function get_hostcluster_by_area (options) {
  return axios.get('/hostcluster/get_direct_info_by_area', {
    params: options
  })
}
// 添加专有网络
export function addNetwork (options) {
  return axios.post('/network_segment/add_network_segment', options)
}
// 删除专有网络
export function deleteNetWork (options) {
  return axios.delete('/network_segment/delete_network_segment', {
    params: options
  })
}
// 修改专有网络名称
export function editNetworkName (options) {
  return axios.put('/network_segment/update_network_segment', options)
}
// 获取所有子网络的展示接口
export function getSubNetWorkList (options) {
  return axios.get('/subnetwork_segment/subnetwork_segment_list', {
    params: options
  })
}
// 获取一个租户下信息的展示接口
export function getUserNetworkList (options) {
  return axios.get('/tenant/one_tenant_info', {
    params: options
  })
}
// 添加子有网络
export function addSubNetwork (options) {
  return axios.post('/subnetwork_segment/add_subnetwork_segment', options)
}
// 修改vlanId信息
export function editSubnetVlan (options) {
  return axios.put('/subnetwork_segment/edit_subnet_vlan', options)
}
// 修改子有网络名称
export function editSubNetworkName (options) {
  return axios.put('/subnetwork_segment/edit_subnetwork', options)
}
// 删除子有网络
export function deleteSubNetWork (options) {
  return axios.delete('/subnetwork_segment/delete_subnet', {
    params: options
  })
}
// 根据机房和id获取vlan
export function getVlan (options) {
  return axios.get('/vlan/vlan_list', {
    params: options
  })
}
// 初始化vlan
export function initVlan (options) {
  return axios.post('/vlan/vlan_init', options)
}
// 获取IP的展示接口
export function getIpList (options) {
  return axios.get('/ip/subnetwork_list', {
    params: options
  })
}
// // 获取IP的展示接口 /ip/ip_init
// export function getIpList  (options) {
//   return axios.get('/ip/subnetwork_list', { params: options })
// }
// 获取指定子网下的IP详情
export function getIpDetailIp (options) {
  return axios.get('/ip/subnetwork_ip_detail', {
    params: options
  })
}

// IP初始化 /ip/ip_init
export function ipInit (options) {
  return axios.post('/ip/ip_init', options)
}
// IP取消初始化
export function ipCancelInit (options) {
  return axios.delete('/ip/ip_cancel_init', {
    params: options
  })
}
// IP保留
export function ipRetain (options) {
  return axios.put('/ip/ip_keep', options)
}
// IP取消保留
export function ipCancelRetain (options) {
  return axios.put('/ip/cancel_ip_keep', options)
}
// IP预分配
export function ipDistribution (options) {
  return axios.put('/ip/ip_prealloc', options)
}
// IP取消预分配
export function ipCancelDistribution (options) {
  return axios.put('/ip/cancel_ip_prealloc', options)
}
// VIP申请
export function vipApply (options) {
  return axios.put('/ip/vip_apply', options)
}
// 已使用IP信息查看
export function IpSee (options) {
  return axios.post('/ip/subnetwork_ip_detail', options)
}

// 公网IP录入 /internet_segment/add_internet_segment
export function ipNetWriteInf (options) {
  return axios.post('/internet_segment/add_internet_segment', options)
}
// 公网IP列表 /internet_segment/internet_segment_list
export function ipNetList (options) {
  return axios.get('/internet_segment/internet_segment_list', options)
}
// 获取公网IP详情 /internet_ip/internet_ip_list
export function getipNetDetails (options) {
  return axios.get('/internet_ip/internet_ip_list', {
    params: options
  })
}
// 初始化公网IP
export function ipNetInit (options) {
  return axios.post('/internet_ip/internet_ip_init', options)
}
// 取消初始化公网IP
export function ipNetCancelInit (options) {
  return axios.delete('/internet_ip/internet_ip_cancel_init', {
    params: options
  })
}
// 保留公网IP
export function ipNetRetain (options) {
  return axios.put('/internet_ip/internet_ip_keep', options)
}
// 取消保留公网IP
export function ipNetCancelRetain (options) {
  return axios.put('/internet_ip/internet_ip_cancel_keep', options)
}
// 授权项目公网IP
export function ipNetDistribution (options) {
  return axios.put('/internet_ip/confer_to_project', options)
}
