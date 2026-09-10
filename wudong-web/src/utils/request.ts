import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './auth'

// API 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'
const TIMEOUT = 15000

/**
 * 后端响应码（cool-admin GlobalConfig）
 * - 1000 SUCCESS       成功
 * - 1001 COMMFAIL      通用失败（业务错误、路由不存在、登录失效都用它）
 * - 1002 VALIDATEFAIL  参数校验失败
 *
 * 注意：1001 并不专属于登录失效，因此只能结合 message 判断。
 */
const CODE_SUCCESS = 1000
const CODE_COMM_FAIL = 1001
const CODE_VALIDATE_FAIL = 1002

/**
 * 后端登录失效时固定抛出 "登录失效~"，且 HTTP 状态被错误处理器改写为 200，
 * 无法仅凭状态码或响应码区分，只能匹配 message。
 */
const AUTH_ERROR_PATTERN = /登录失效|token|未登录/i

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PaginationResponse<T = any> {
  list: T[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

/** 防止并发请求同时触发跳转（多次 401 会连续 replace 造成白屏） */
let redirecting = false

/**
 * 登录失效统一处理：清理本地凭证并跳转登录页（带 redirect 回跳参数）
 */
function handleAuthExpired(message: string): never {
  removeToken()

  if (!redirecting) {
    redirecting = true
    ElMessage.error(message || '登录已失效，请重新登录')

    const { pathname, search, hash } = window.location
    const current = `${pathname}${search}${hash}`

    // 已在登录页就不再跳，避免死循环
    if (!current.startsWith('/login')) {
      const redirect = encodeURIComponent(current)
      window.location.replace(`/login?redirect=${redirect}`)
    } else {
      redirecting = false
    }
  }

  throw new Error(message || '登录已失效')
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
          // ⚠️ 后端直接 jwt.verify(ctx.get('Authorization'))，
          // 必须传裸 token，加 "Bearer " 前缀会导致验签失败、所有需登录接口 401。
          config.headers.Authorization = token
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 非标准响应（如文件流）直接透传
        if (!response.data || typeof response.data.code !== 'number') {
          return response.data
        }

        const { code, message, data } = response.data

        if (code === CODE_SUCCESS) {
          return data
        }

        // 登录失效
        if (code === CODE_COMM_FAIL && AUTH_ERROR_PATTERN.test(message || '')) {
          return handleAuthExpired(message)
        }

        // 参数校验失败：后端 message 已是可读提示
        if (code === CODE_VALIDATE_FAIL) {
          ElMessage.error(message || '参数校验失败')
          return Promise.reject(new Error(message || '参数校验失败'))
        }

        // 其余业务错误
        ElMessage.error(message || '请求失败')
        return Promise.reject(new Error(message || '请求失败'))
      },
      (error) => {
        // 网络错误
        if (!error.response) {
          const msg =
            error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '网络连接失败'
          ElMessage.error(msg)
          return Promise.reject(new Error(msg))
        }

        const { status } = error.response

        // HTTP 401 同样视为登录失效
        if (status === 401) {
          return handleAuthExpired('登录已失效，请重新登录')
        }

        const statusMessages: Record<number, string> = {
          403: '拒绝访问',
          404: '请求资源不存在',
          500: '服务器错误',
          502: '网关错误',
          503: '服务暂不可用'
        }

        const msg = statusMessages[status] || `请求失败（${status}）`
        ElMessage.error(msg)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 注意：下面的方法都做了 `as unknown as Promise<T>` 断言。
   * 响应拦截器已经把 `{code,message,data}` 直接解包成 `data` 返回了，
   * 但 axios 的类型签名仍认为返回的是 AxiosResponse，因此必须显式收窄。
   * 若去掉断言，调用方拿到的类型会是 AxiosResponse 而不是业务数据。
   */

  // GET 请求
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, { params, ...config }) as unknown as Promise<T>
  }

  // POST 请求
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config) as unknown as Promise<T>
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config) as unknown as Promise<T>
  }

  // DELETE 请求
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, { params, ...config }) as unknown as Promise<T>
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
    }) as unknown as Promise<T>
  }
}

export default new Request()
