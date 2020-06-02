// 对请求进行配置
import axios from 'axios'
// 导入对话框
import { Toast } from 'antd-mobile'

// 基准地址
export const BASE_URL = 'https://api-haoke-web.itheima.net'

// 创建axios实例并进行配置
const request = axios.create({
  baseURL: BASE_URL,
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 添加等待动画
  Toast.loading('加载中...', 0)

  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
request.interceptors.response.use(response => {
  // 隐藏提示框
  Toast.hide()

  // 筛选响应数据
  const res = {}
  res.status = response.status

  res.description = response.data.description
  res.data = response.data.body
  return res
}, err => {
  return Promise.reject(err)
})
export default request