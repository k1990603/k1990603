import axios from 'axios'
// 虚拟机删除
export const deleteVm = function (options) {
  return axios.delete('/instance/user_instance_delete', { params: options })
}
