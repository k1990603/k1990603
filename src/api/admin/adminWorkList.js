import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 工单列表展示
export const getWorkList = function (options) {
  return axios.get('/display_workorder_list', {
    params: options
  })
}
// 管理员确认工单
export const adminConfirm = function (options) {
  return axios.put('/admin_confirm_wk', options)
}
// 展示工单列表详情信息
export const wkDetails = function (options) {
  return axios.get('/display_workorder_details', {
    params: options
  })
}
// 添加工单详情信息
export const addWorkerOrder = function (options) {
  return axios.post('/add_workorder_msg', options)
}
// 工单类别信息初始化
export const initCategory = function (options) {
  return axios.get('/init_category_info')
}
// 工单列表下载
export const exportCategory = function (options) {
  return axios.get('/export_workorder_list', {
    params: options,
    responseType: 'arraybuffer'

  })
}
