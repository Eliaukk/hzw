// 主页相关请求
import myAxios from '../utils/axios'


export function loginReq(username, password) {
  return myAxios.post('/user/login', {
    username, password
  })
}