import request from '@/utils/request'

export interface Attraction {
  id: number
  name: string
  cover: string
  images: string[]
  description: string
  detailContent: string
  address: string
  province: string
  city: string
  district: string
  phone: string
  openTime: string
  minPrice: number
  rating: number
  tags: string
  tips: string
  traffic: string
  type: number
  status: number
  sort: number
  viewCount: number
  orderCount: number
  createTime: string
  updateTime: string
  ticketTypes?: TicketType[]
}

export interface TicketType {
  id: number
  attractionId: number
  name: string
  description: string
  price: number
  originalPrice: number
  stock: number
  validDays: number
  refundRule: string
  useRule: string
  status: number
  sort: number
}

export interface TicketOrder {
  id: number
  orderNo: string
  userId: number
  attractionId: number
  attractionName: string
  ticketTypeId: number
  ticketTypeName: string
  quantity: number
  useDate: string
  contactName: string
  contactPhone: string
  contactIdCard: string
  totalAmount: number
  payAmount: number
  remark: string
  status: number
  payStatus: number
  payTime: string
  useTime: string
  refundTime: string
  refundReason: string
  cancelReason: string
  qrCode: string
  createTime: string
  updateTime: string
}

// 景点列表
export function getAttractionList(params: {
  page?: number
  size?: number
  city?: string
  type?: number
  priceRange?: string
  sort?: string
}) {
  return request.post<{
    list: Attraction[]
    pagination: { page: number; size: number; total: number }
  }>('/app/ticket/attraction/list', params)
}

// 景点详情
export function getAttractionDetail(id: number) {
  return request.post<Attraction>('/app/ticket/attraction/detail', { id })
}

// 推荐景点
export function getRecommendAttractions(limit?: number) {
  return request.post<Attraction[]>('/app/ticket/attraction/recommend', { limit })
}

// 创建订单
export function createTicketOrder(data: {
  attractionId: number
  ticketTypeId: number
  quantity: number
  useDate: string
  contactName: string
  contactPhone: string
  contactIdCard: string
  remark?: string
}) {
  return request.post<TicketOrder>('/app/ticket/order/create', data)
}

// 订单列表
export function getTicketOrderList(params: {
  page?: number
  size?: number
  status?: number
}) {
  return request.post<{
    list: TicketOrder[]
    pagination: { page: number; size: number; total: number }
  }>('/app/ticket/order/list', params)
}

// 订单详情
export function getTicketOrderDetail(orderNo: string) {
  return request.post<TicketOrder>('/app/ticket/order/detail', { orderNo })
}

// 取消订单
export function cancelTicketOrder(orderNo: string, reason?: string) {
  return request.post('/app/ticket/order/cancel', { orderNo, reason })
}

// 模拟支付
export function mockPayTicket(orderNo: string) {
  return request.post('/app/ticket/order/mockPay', { orderNo })
}
