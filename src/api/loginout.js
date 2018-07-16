import axios from 'axios'
// 登出
export const loginout = function () {
  return axios.post('/logout')
}
