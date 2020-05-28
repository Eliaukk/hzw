// 主页相关请求
import myAxios from '../utils/axios'

// 获取轮播图
export function getSwiperaReq() {
  return myAxios.get('/home/swiper')
}


const area = 'AREA|88cff55c-aaa4-e2e0'
// 获取租房小组
export function getGroupReq() {
  return myAxios.get('/home/groups', {
    params: {
      area: area
    }
  })
}

