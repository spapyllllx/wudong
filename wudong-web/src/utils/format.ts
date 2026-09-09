/**
 * 格式化日期时间
 */
export function formatDate(date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 相对时间（刚刚、几分钟前等）
 */
export function formatRelativeTime(date: string | Date): string {
  if (!date) return ''

  const now = new Date().getTime()
  const then = new Date(date).getTime()
  const diff = now - then

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 2 * day) {
    return '昨天'
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return formatDate(date, 'MM-DD')
  } else {
    return formatDate(date, 'YYYY-MM-DD')
  }
}

/**
 * 格式化数字（千位分隔符）
 */
export function formatNumber(num: number): string {
  if (num === undefined || num === null) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化金额
 */
export function formatPrice(price: number): string {
  if (price === undefined || price === null) return '¥0.00'
  return `¥${price.toFixed(2)}`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 格式化数字为简短形式（1.2k, 3.4w）
 */
export function formatCount(count: number): string {
  if (count < 1000) {
    return String(count)
  } else if (count < 10000) {
    return (count / 1000).toFixed(1) + 'k'
  } else {
    return (count / 10000).toFixed(1) + 'w'
  }
}

/**
 * 手机号脱敏
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}
