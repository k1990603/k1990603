import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/
// DHCP模块展示页面
export const getDHCPList = function (options) {
  return axios.get('/vrouter/dhcp_list', {
    params: options
  })
}
// VROUTER展示页面
export const getRoutList = function (options) {
  return axios.get('/vrouter/vrouter_list', {
    params: options
  })
}
