/**
 * 结算载荷
 * =========
 * 后端 `order/create` 只接受 `items: [{ skuId, quantity }]`——
 * 只有 skuId 无法还原商品标题/图片/规格名，确认订单页就没东西可展示。
 *
 * 所以在跳转前把展示所需的快照信息一起带过去（存 sessionStorage，避免塞进 URL）。
 * 真正下单时只提交 skuId + quantity，展示字段不参与请求。
 */

export interface CheckoutItem {
  skuId: number
  quantity: number
  productId: number
  title: string
  image: string
  skuName: string | null
  price: number
}

const ITEMS_KEY = 'wudong_checkout_items'
const CART_IDS_KEY = 'wudong_checkout_cart_ids'

export function setCheckoutItems(items: CheckoutItem[], cartIds: number[] = []) {
  sessionStorage.setItem(ITEMS_KEY, JSON.stringify(items))
  sessionStorage.setItem(CART_IDS_KEY, JSON.stringify(cartIds))
}

export function getCheckoutItems(): CheckoutItem[] {
  try {
    const raw = sessionStorage.getItem(ITEMS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** 结算成功后要一并从购物车移除的行 id（非购物车下单时为空数组） */
export function getCheckoutCartIds(): number[] {
  try {
    const raw = sessionStorage.getItem(CART_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function clearCheckout() {
  sessionStorage.removeItem(ITEMS_KEY)
  sessionStorage.removeItem(CART_IDS_KEY)
}
