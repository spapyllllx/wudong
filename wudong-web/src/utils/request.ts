import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './auth'

// API 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7001'
const TIMEOUT = 15000

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginationResponse<T = any> {
  list: T[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data

        // 成功响应
        if (code === 1000) {
          return data
        }

        // 业务错误
        if (code === 1002) {
          // 未登录
          ElMessage.error('请先登录')
          removeToken()
          window.location.href = '/login'
          return Promise.reject(new Error(message))
        }

        // 其他错误
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message))
      },
      (error) => {
        // 网络错误
        if (!error.response) {
          ElMessage.error('网络连接失败')
          return Promise.reject(error)
        }

        const { status } = error.response

        switch (status) {
          case 401:
            ElMessage.error('未授权，请重新登录')
            removeToken()
            window.location.href = '/login'
            break
          case 403:
            ElMessage.error('拒绝访问')
            break
          case 404:
            ElMessage.error('请求资源不存在')
            break
          case 500:
            ElMessage.error('服务器错误')
            break
          default:
            ElMessage.error('请求失败')
        }

        return Promise.reject(error)
      }
    )
  }

  // GET 请求
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config })
  }

  // POST 请求
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  // DELETE 请求
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, { params, ...config })
  }

  // 文件上传
  upload<T = any>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
  }
}

export default new Request()
