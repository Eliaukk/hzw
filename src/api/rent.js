// 这是发布房屋组件相关接口
import myAxios from '../utils/axios'

// 获取已发布房屋列表
export function getPublishListReq() {
  return myAxios.get('/user/houses')
}

// 获取联想建议
export function getRequestionReq(option) {
  return myAxios.get('/area/community', {
    params: option
  })
}

// 发布房源
export function publishHouseReq(option) {
  return myAxios.post('/user/houses', option)
}