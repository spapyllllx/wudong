/**
 * 图片 URL 归一化
 *
 * 后端返回的图片地址有两种形态：
 *  1. 绝对地址（形如 http://127.0.0.1:8001/upload/xxx.jpg）——直接可用，
 *     但如果后端换了域名/端口，前端会指向错误主机，因此按 API 主机重写。
 *  2. 相对路径（形如 /upload/xxx.jpg）——补上 API 主机前缀。
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'

/** API 主机，如 http://localhost:8001 */
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin
  } catch {
    return ''
  }
})()

/** 占位图（内联 SVG，避免额外静态资源请求） */
export const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" font-size="16" fill="#adb5bd"
            text-anchor="middle" dominant-baseline="middle">暂无图片</text>
    </svg>`
  )

/**
 * 把后端返回的图片字段转成浏览器可直接加载的 URL。
 * 空值统一返回占位图，避免出现 broken image。
 */
export function resolveImage(url?: string | null): string {
  if (!url) return FALLBACK_IMAGE

  const value = String(url).trim()
  if (!value) return FALLBACK_IMAGE

  // base64 / data URI 直接用
  if (value.startsWith('data:')) return value

  // 绝对地址：把主机替换成当前 API 主机（含协议）
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      // 只重写主机，保留路径与查询串
      return `${API_ORIGIN}${parsed.pathname}${parsed.search}`
    } catch {
      return value
    }
  }

  // 相对路径
  return `${API_ORIGIN}${value.startsWith('/') ? '' : '/'}${value}`
}
