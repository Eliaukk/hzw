// 主页相关请求
import myAxios from '../utils/axios'

// 获取轮播图
export function getSwiperaReq() {
  return myAxios.get('/home/swiper')
}

// 获取租房小组
export function getGroupReq(area) {
  return myAxios.get('/home/groups', {
    params: {
      area
    }
  })
}

// 获取新闻列表
export function getNewsList(level) {
  return myAxios.get('/home/news', {
    params: {
      level
    }
  })
}

