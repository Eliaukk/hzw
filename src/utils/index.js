// 封装了一些公共方法
import { getCurCityReq } from '../api/citylist'

// 用于操作本地存储的方法
// 获取本地存储
export function getAuth(key) {
  return JSON.parse(window.localStorage.getItem(key))
}
// 添加本地存储
export function setAuth(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val))
}
// 移除本地存储
export function delAuth(key) {
  return window.localStorage.removeItem(key)
}


// 用来获取当前定位
export function getCurCityUtils() {

  // 先判断本地有没有定位数据
  const curCity = getAuth('curCity')


  if (!curCity) {
    // 如果本地没有定位数据 返回一个Promise对象
    return new Promise(resolve => {
      const { BMap } = window
      // 生成定位信息
      const myCity = new BMap.LocalCity();
      // 获取当前城市 (异步操作)  
      myCity.get(async ({ name }) => {
        // 前后交互获取城市信息
        const { data } = await getCurCityReq(name)
        // 更新本地数据
        setAuth('curCity', data)
        // 保存异步成功的数据
        resolve(data)
      });
    })
  } else {
    // 如果有就返回本地的数据
    return Promise.resolve(curCity)
  }

}