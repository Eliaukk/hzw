// 导入axios实例
import myAxios from '.././utils/axios'
// 获取当前城市信息

export function getFilterDataReq(id) {
  return myAxios.get('/houses/condition', {
    params: {
      id
    }
  })
}


// 获取筛选城市数据
export function getFilterHouseReq(cityId, filters, start = 1, end = 20) {
  return myAxios.get('/houses', {
    params: {
      cityId,
      ...filters,
      start,
      end
    }
  })
}

// 获取房屋详情
export function getHouseDetailReq(id) {
  return myAxios.get(`/houses/${id}`)
}

// 获取房屋搜藏状态
export function getCollectStatusReq(id) {
  return myAxios.get(`/user/favorites/${id}`)
}

// 添加你收藏
export function addCollectReq(id) {
  return myAxios.post(`/user/favorites/${id}`)
}

// 移除你收藏
export function delCollectReq(id) {
  return myAxios.delete(`/user/favorites/${id}`)
}

// 上传图像的接口
export function getImgURLReq(fd) {
  return myAxios.post('houses/image', fd)
}


