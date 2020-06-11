// 这是profile页面专用  
import myAxios from '../utils/axios'
// 获取用户信息
export function getAuthInfoReq() {
  return myAxios.get('/user')
}