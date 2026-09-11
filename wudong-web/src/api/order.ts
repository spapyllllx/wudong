import request from '@/utils/request'

export interface Order {
  id: number
  orderNo: string
  userId: number
  totalAmount: number
  payAmount: number
  freight: number
  discountAmount: number
  status: number
  payStatus: number
  payType: string | null
  payTime: string | null
  shipTime: string | null
  finishTime: string | null
  cancelTime: string | null
  cancelReason: string | null
  remark: string | null
  receiverName: string
  receiverPhone: string
  receiverProvince: string
  receiverCity: string
  receiverDistrict: string
  receiverAddress: string
  createTime: string
  updateTime: string
  items?: OrderItem[]
  logs?: OrderLog[]
}

export interface OrderItem {
  id: number
  orderId: number
  orderNo: string
  productId: number
  productTitle: string
  productImage: string
  skuId: number | null
  skuName: string | null
  price: number
  quantity: number
  totalAmount: number
}

export interface OrderLog {
  id: number
  orderId: number
  orderNo: string
  operateType: string
  operateContent: string
  operatorId: number | null
  operatorName: string | null
  createTime: string
}

export interface OrderStats {
  waitPayCount: number
  waitShipCount: number
  waitReceiveCount: number
  finishedCount: number
}

export interface OrderListResponse {
  list: Order[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

// 创建订单
export function createOrder(data: {
  items: any[]
  address: any
  remark?: string
}) {
  return request.post<Order>('/app/order/create', data)
}

// 订单列表
export function getOrderList(params: {
  page?: number
  size?: number
  status?: number // -1全部 0待付款 1待发货 2待收货 3已完成 4已取消
}) {
  return request.post<OrderListResponse>('/app/order/list', params)
}

// 订单详情
export function getOrderDetail(orderNo: string) {
  return request.post<Order>('/app/order/detail', { orderNo })
}

// 取消订单
export function cancelOrder(orderNo: string, reason?: string) {
  return request.post('/app/order/cancel', { orderNo, reason })
}

// 确认收货
export function confirmReceipt(orderNo: string) {
  return request.post('/app/order/confirmReceipt', { orderNo })
}

// 删除订单
export function deleteOrder(orderNo: string) {
  return request.post('/app/order/delete', { orderNo })
}

// 订单统计
export function getOrderStats() {
  return request.post<OrderStats>('/app/order/stats')
}
