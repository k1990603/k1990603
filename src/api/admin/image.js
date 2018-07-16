import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// 获取镜像展示接口
export const getImagesList = function (options) {
  return axios.get('/image/image_list', {
    params: options
  })
}
// 获取指定镜像的磁盘详细信息获取
export const getImagesDisk = function (options) {
  return axios.get('/image/volume_detail', {
    params: options
  })
}
// 更新镜像磁盘信息接口
export const updateDisk = function (options) {
  return axios.put('/image/update_volume_info', options)
}
// 新建镜像的init接口
export const createInitImages = function (options) {
  return axios.get('/image/image_create_init', options)
}
// 创建全新镜像接口
export const createNewImages = function (options) {
  return axios.post('/image/image_create_new', options)
}
// 从已有镜像创建新镜像的init接口
export const imageExistInit = function (options) {
  return axios.get('/image/image_exist_init', options)
}
// 从已有镜像创建新镜像的init接口
export const CreateImageExist = function (options) {
  return axios.post('/image/image_create_exist', options)
}
// 编辑镜像接口
export const imageEdit = function (options) {
  return axios.put('/image/image_edit', options)
}
// 生成镜像接口
export const imageCheckout = function (options) {
  return axios.put('/image/image_checkout', options)
}
// 发布镜像接口
export const imageRelease = function (options) {
  return axios.put('/image/image_release', options)
}
// console登入 /image/image_console
export const getConsoleImage = function (options) {
  return axios.get('/image/image_console', { params: options })
}