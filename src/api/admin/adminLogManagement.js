import axios from 'axios'

// api 配置说明
/*
 1 get方法：(1)有参数: options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
 2 其他方法：(1)有参数：options=>axios.get(URL,{params: options})
            (2)无参数 () => axios.get(URL)
*/

//日志
export let getData = options => {
  return axios.get("/operation", {
    params: options
  })
}
//
export let logJson = options => {
  return axios.get("../../data/logJson.json")
}
