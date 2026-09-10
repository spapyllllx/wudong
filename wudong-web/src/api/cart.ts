import request from '@/utils/request'

/**
 * 购物车 API（全部需要登录）
 *
 * 后端 `cart/list` 返回的是**裸数组**，且每一项是**扁平结构**——
 * 没有嵌套的 product / sku 对象，字段直接平铺在顶层。
 */

export interface CartItem {
  /** 购物车行 id。update / remove 用的都是它，不是商品 id */
  id: number
  product_id: number
  /** 可能为 null（历史数据或 SKU 被删） */
  sku_id: number | null
  quantity: number
  /** tinyint 0 / 1 */
  selected: number
  title: string
  subtitle: string
  main_image: string
  sku_name: string | null
  /** SKU 单价；SKU 行缺失时为 null */
  price: number | null
  /** SKU 库存；SKU 行缺失时为 null */
  sku_stock: number | null
  /** 商品已下架或 SKU 已停用 */
  invalid: boolean
  /** 库存为 0。注意 invalid 在"SKU 行完全缺失"时是 false，所以要两个都看 */
  sold_out: boolean
}

/**
 * 购物车列表（需登录）
 */
export function getCartList() {
  return request.get<CartItem[]>('/app/clothing/cart/list')
}

/**
 * 加入购物车（需登录）
 *
 * 同一 SKU 重复加入会**累加数量**，不会新增一行。
 * 超过库存会报「库存不足,仅剩 N」。
 */
export function addToCart(skuId: number, quantity = 1) {
  return request.post<{ id: number; quantity: number }>('/app/clothing/cart/add', {
    skuId,
    quantity
  })
}

/**
 * 修改数量（需登录）。id 传的是**购物车行 id**。
 * 该接口不返回 data。
 */
export function updateCartQuantity(id: number, quantity: number) {
  return request.post<void>('/app/clothing/cart/update', { id, quantity })
}

/**
 * 批量删除（需登录）。该接口不返回 data。
 */
export function removeCartItems(ids: number[]) {
  return request.post<void>('/app/clothing/cart/remove', { ids })
}
