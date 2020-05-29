// 城市相关接口
import myAxios from '../utils/axios'

// 获取轮播图
export function getCurCityReq(name) {
  return myAxios.get('/area/info', {
    params: name
  })
}

// 获取城市列表数据
export function getCurCityListReq(level) {
  return myAxios.get('/area/city', {
    params: { level }
  })
}
