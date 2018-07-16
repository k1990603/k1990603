import axios from 'axios'
// 获取用户首页总览信息
export function getUserOverview (params) {
  return axios.get('/user_homepage_overview', { params: params })
}
// 获取用户首页地区信息
export function getUserHomepageArea (params) {
  return axios.get('/user_homepage_area', { params: params })
}
// 获取admin首页信息
export function getAdminIndex () {
  return axios.get('/admin_homepage')
}
