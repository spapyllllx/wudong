import request from '@/utils/request'
import type { PaginationResponse } from '@/utils/request'

/**
 * 订单 API（全部需要登录）
 *
 * ⚠️ 三个关键点：
 * 1. `order/create` **没有 addressId**，收货信息要**内联传入**并会被快照到订单上。
 * 2. `pay` / `cancel` / `confirm` **都不返回 data**（后端用的是裸 `this.ok()`）。
 * 3. 订单 id 是 Date.now()*100+rand 生成的，约 1.75e14，
 *    超出 32 位整数范围，类型必须是 number（不要用 int 语义处理）。
 */

/** 订单状态机 */
export type OrderStatus =
  | 'pending'    // 待支付
  | 'paid'       // 已支付（待发货）
  | 'shipped'    // 已发货（可确认收货）
  | 'cancelled'  // 已取消
  | 'completed'  // 已完成（可评价）
  | 'refunded'   // 已退款

export interface OrderItem {
  product_id: number
  sku_id: number | null
  product_name: string
  sku_name: string | null
  image: string | null
  price: number
  quantity: number
  total_amount: number
}

export interface OrderLogistics {
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  logistics_company: string | null
  logistics_no: string | null
  shipped_at: string | null
  received_at: string | null
}

export interface Order {
  /** 约 1.75e14，超出 int32 */
  id: number
  order_type: string
  total_amount: number
  status: OrderStatus
  remark: string
  paid_at: string | null
  cancelled_at: string | null
  created_at: string
  items: OrderItem[]
  logistics: OrderLogistics | null
}

/** 创建订单的收货信息（内联，不是 addressId） */
export interface OrderAddressInput {
  consignee: string
  /** 必须匹配 /^1\d{10}$/，否则后端报「手机号格式不正确(需 11 位数字)」 */
  phone: string
  detail: string
  province?: string
  city?: string
  district?: string
  remark?: string
}

export interface CreateOrderInput extends OrderAddressInput {
  items: Array<{ skuId: number; quantity: number }>
}

/**
 * 创建订单（需登录）。返回新订单 id。
 */
export function createOrder(data: CreateOrderInput) {
  return request.post<number>('/app/clothing/order/create', data)
}

/**
 * 支付订单（需登录）。
 * 后端是 mock 支付：直接置为已支付并写入 MOCK 流水号。
 * 该接口不返回 data。
 */
export function payOrder(orderId: number | string) {
  return request.post<void>('/app/clothing/order/pay', { orderId })
}

/**
 * 取消订单（需登录）。仅 pending 状态可取消，会回滚库存。不返回 data。
 */
export function cancelOrder(orderId: number | string) {
  return request.post<void>('/app/clothing/order/cancel', { orderId })
}

/**
 * 确认收货（需登录）。
 * ⚠️ 仅 `shipped` 状态可调用，其他状态会报「订单发货后才能确认收货」。不返回 data。
 */
export function confirmOrder(orderId: number | string) {
  return request.post<void>('/app/clothing/order/confirm', { orderId })
}

/**
 * 我的订单分页（需登录）
 */
export function getOrderList(page = 1, size = 10) {
  return request.get<PaginationResponse<Order>>('/app/clothing/order/list', {
    page,
    size
  })
}

// ---------------------------------------------------------------- 退款

export interface Refund {
  id: number
  order_id: number
  refund_amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  reject_reason: string | null
  handled_at: string | null
  created_at: string
}

/**
 * 申请退款（需登录）。目前仅支持**全额退款**——
 * 不要传 amount，或传的值必须等于 paidAmount，否则报「当前仅支持全额退款」。
 * 只有 paid / completed 状态可申请。返回退款单 id。
 */
export function applyRefund(orderId: number | string, reason: string) {
  return request.post<number>('/app/clothing/refund/apply', { orderId, reason })
}

/**
 * 我的退款申请（需登录）
 */
export function getRefundList(page = 1, size = 10) {
  return request.get<PaginationResponse<Refund>>('/app/clothing/refund/list', {
    page,
    size
  })
}
