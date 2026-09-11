import request from '@/utils/request'

// 兼容旧的调用方式
const http = {
  get: request.get.bind(request),
  post: request.post.bind(request),
  put: request.put.bind(request),
  delete: request.delete.bind(request)
}

export interface Product {
  id: number
  categoryId: number
  title: string
  subtitle: string
  mainImage: string
  images?: string[]
  detail: string
  price: number
  originalPrice: number | null
  stock: number
  sales: number
  rating: number
  reviewCount: number
  favoriteCount: number
  viewCount: number
  status: number
  isRecommend: number
  isFavorited?: boolean
  categoryName?: string
  skus?: ProductSku[]
  createTime: string
  updateTime: string
}

export interface ProductSku {
  id: number
  productId: number
  specName: string
  specValue: any
  price: number
  stock: number
  skuCode: string
  image: string
  status: number
}

export interface ProductCategory {
  id: number
  name: string
  parentId: number
  icon: string
  sort: number
  status: number
  children?: ProductCategory[]
}

export interface ProductReview {
  id: number
  productId: number
  userId: number
  userNickName: string
  userAvatar: string
  orderId: number
  rating: number
  content: string
  images: string[]
  skuName: string
  likeCount: number
  status: number
  replyContent: string
  replyTime: string
  isLiked?: boolean
  createTime: string
}

export interface ProductListResponse {
  list: Product[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

export interface ReviewListResponse {
  list: ProductReview[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

// ==================== 商品相关 ====================

// 获取商品列表
export function getProductList(params: {
  page?: number
  size?: number
  categoryId?: number
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sort?: string // sales | price-asc | price-desc
}) {
  return request.post<ProductListResponse>('/app/product/productList', params)
}

// 获取商品详情
export function getProductDetail(id: number) {
  return request.get<Product>('/app/product/productDetail', { id })
}

// 获取分类树
export function getCategoryTree() {
  return request.get<ProductCategory[]>('/app/product/categoryTree')
}

// ==================== 收藏相关 ====================

// 收藏商品
export function favoriteProduct(productId: number) {
  return request.post('/app/product/favoriteProduct', { productId })
}

// 取消收藏
export function unfavoriteProduct(productId: number) {
  return request.post('/app/product/unfavoriteProduct', { productId })
}

// 我的收藏列表
export function getMyFavorites(params: {
  page?: number
  size?: number
}) {
  return request.post<ProductListResponse>('/app/product/myFavorites', params)
}

// ==================== 评价相关 ====================

// 获取商品评价列表
export function getProductReviews(productId: number, params?: {
  page?: number
  size?: number
}) {
  return request.post<ReviewListResponse>('/app/product/review/reviewList', {
    productId,
    ...params
  })
}

// 发布评价
export function publishReview(data: {
  productId: number
  orderId?: number
  rating: number
  content: string
  images?: string[]
  skuName?: string
}) {
  return request.post('/app/product/review/publishReview', data)
}

// 点赞评价
export function likeReview(reviewId: number) {
  return request.post('/app/product/review/likeReview', { reviewId })
}

// 取消点赞评价
export function unlikeReview(reviewId: number) {
  return request.post('/app/product/review/unlikeReview', { reviewId })
}
