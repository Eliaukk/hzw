// 城市相关接口
import myAxios from '../utils/axios'

// 获取轮播图
export function getCurCityReq(name) {
  return myAxios.get('/area/info', {
    params: name
  })
}

// 获取当前城市列表数据
export function getCurCityListReq(level) {
  return myAxios.get('/area/city', {
    params: { level }
  })
}

// 获取热门城市
export function getHotCityReq(level) {
  return myAxios.get('/area/hot')
}


// 查询房源数据
export function getHouseDataReq(id) {
  return myAxios.get('/area/map', {
    params: {
      id
    }
  })
}