// utils/request.js - axios 请求封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器: 附加 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器: 统一错误提示
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res && res.code === 401) {
      localStorage.removeItem('token')
      router.push('/login')
      return Promise.reject(new Error(res.message || '未登录或token已过期'))
    }
    return res
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    const msg = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : (error.message || '请求失败')
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request
