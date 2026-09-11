import request from '@/utils/request'

export interface Restaurant {
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
  businessHours: string
  avgPrice: number
  rating: number
  tags: string
  facilities: string
  status: number
  sort: number
  viewCount: number
  orderCount: number
  createTime: string
  updateTime: string
  categories?: DishCategory[]
  dishes?: Dish[]
}

export interface DishCategory {
  id: number
  restaurantId: number
  name: string
  sort: number
}

export interface Dish {
  id: number
  restaurantId: number
  categoryId: number
  name: string
  image: string
  description: string
  price: number
  originalPrice: number
  unit: string
  tags: string
  isRecommend: number
  stock: number
  sales: number
  status: number
  sort: number
}

export interface RestaurantBooking {
  id: number
  bookingNo: string
  userId: number
  restaurantId: number
  restaurantName: string
  bookingDate: string
  bookingTime: string
  peopleCount: number
  contactName: string
  contactPhone: string
  remark: string
  status: number
  cancelReason: string
  createTime: string
  updateTime: string
}

// 餐厅列表
export function getRestaurantList(params: {
  page?: number
  size?: number
  city?: string
  district?: string
  priceRange?: string
  sort?: string
}) {
  return request.post<{
    list: Restaurant[]
    pagination: { page: number; size: number; total: number }
  }>('/app/restaurant/list', params)
}

// 餐厅详情
export function getRestaurantDetail(id: number) {
  return request.post<Restaurant>('/app/restaurant/detail', { id })
}

// 推荐餐厅
export function getRecommendRestaurants(limit?: number) {
  return request.post<Restaurant[]>('/app/restaurant/recommend', { limit })
}

// 创建预订
export function createBooking(data: {
  restaurantId: number
  bookingDate: string
  bookingTime: string
  peopleCount: number
  contactName: string
  contactPhone: string
  remark?: string
}) {
  return request.post<RestaurantBooking>('/app/restaurant/booking/create', data)
}

// 预订列表
export function getBookingList(params: {
  page?: number
  size?: number
  status?: number
}) {
  return request.post<{
    list: RestaurantBooking[]
    pagination: { page: number; size: number; total: number }
  }>('/app/restaurant/booking/list', params)
}

// 预订详情
export function getBookingDetail(bookingNo: string) {
  return request.post<RestaurantBooking>('/app/restaurant/booking/detail', { bookingNo })
}

// 取消预订
export function cancelBooking(bookingNo: string, reason?: string) {
  return request.post('/app/restaurant/booking/cancel', { bookingNo, reason })
}
