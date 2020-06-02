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