import request from '@/utils/request'

export interface Homestay {
  id: number
  name: string
  cover: string
  images: string[]
  description: string
  address: string
  province: string
  city: string
  district: string
  phone: string
  minPrice: number
  rating: number
  tags: string
  facilities: string
  checkInTime: string
  checkOutTime: string
  status: number
  sort: number
  viewCount: number
  orderCount: number
  createTime: string
  updateTime: string
  roomTypes?: RoomType[]
}

export interface RoomType {
  id: number
  homestayId: number
  name: string
  image: string
  images: string[]
  description: string
  area: number
  bedType: string
  maxGuests: number
  price: number
  weekendPrice: number
  facilities: string
  totalRooms: number
  status: number
  sort: number
}

export interface HomestayOrder {
  id: number
  orderNo: string
  userId: number
  homestayId: number
  homestayName: string
  roomTypeId: number
  roomTypeName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  roomCount: number
  guestCount: number
  contactName: string
  contactPhone: string
  totalAmount: number
  payAmount: number
  remark: string
  status: number
  payStatus: number
  payTime: string
  cancelReason: string
  createTime: string
  updateTime: string
}

// 民宿列表
export function getHomestayList(params: {
  page?: number
  size?: number
  city?: string
  district?: string
  priceRange?: string
  sort?: string
}) {
  return request.post<{
    list: Homestay[]
    pagination: { page: number; size: number; total: number }
  }>('/app/homestay/list', params)
}

// 民宿详情
export function getHomestayDetail(id: number) {
  return request.post<Homestay>('/app/homestay/detail', { id })
}

// 推荐民宿
export function getRecommendHomestays(limit?: number) {
  return request.post<Homestay[]>('/app/homestay/recommend', { limit })
}

// 创建订单
export function createHomestayOrder(data: {
  homestayId: number
  roomTypeId: number
  checkInDate: string
  checkOutDate: string
  roomCount: number
  guestCount: number
  contactName: string
  contactPhone: string
  remark?: string
}) {
  return request.post<HomestayOrder>('/app/homestay/order/create', data)
}

// 订单列表
export function getHomestayOrderList(params: {
  page?: number
  size?: number
  status?: number
}) {
  return request.post<{
    list: HomestayOrder[]
    pagination: { page: number; size: number; total: number }
  }>('/app/homestay/order/list', params)
}

// 订单详情
export function getHomestayOrderDetail(orderNo: string) {
  return request.post<HomestayOrder>('/app/homestay/order/detail', { orderNo })
}

// 取消订单
export function cancelHomestayOrder(orderNo: string, reason?: string) {
  return request.post('/app/homestay/order/cancel', { orderNo, reason })
}

// 模拟支付
export function mockPayHomestay(orderNo: string) {
  return request.post('/app/homestay/order/mockPay', { orderNo })
}
