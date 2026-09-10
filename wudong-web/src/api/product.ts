import request from '@/utils/request'
import type { PaginationResponse } from '@/utils/request'

/**
 * 衣模块（非遗商品）API
 * =====================
 * 字段命名以后端为准，注意这里有**两种命名风格并存**：
 *  - 走原生 SQL 的接口（product / cart / order / refund / banner）返回 **snake_case**
 *  - 走 TypeORM 实体的接口（category）返回 **camelCase**
 * 不要"统一"成一种，否则会取不到值。
 */

// ---------------------------------------------------------------- 商品

/** 列表项。走原生 SQL，snake_case。 */
export interface Product {
  id: number
  category_id: number
  title: string
  subtitle: string
  main_image: string
  price: number
  market_price: number | null
  sales: number
  stock: number
  /** 无评价时为 null（详情接口里则是 0，见 ProductDetail.rating） */
  rating: number | null
  review_count: number
}

export interface ProductSku {
  id: number
  sku_name: string
  /** 可能为 null，此时回落到商品主图 */
  image: string | null
  price: number
  stock: number
  sales: number
  attrs: Record<string, string> | null
  status: string
}

/** 详情。注意 category_name 是字符串，images 是纯 URL 数组，没有嵌套对象。 */
export interface ProductDetail {
  id: number
  category_id: number
  category_name: string | null
  title: string
  subtitle: string
  main_image: string
  price: number
  market_price: number | null
  stock: number
  sales: number
  detail: string | null
  craft_intro: string | null
  inheritor_id: number | null
  status: string
  /** 详情接口里无评价时为 0（与列表的 null 不同） */
  rating: number
  review_count: number
  images: string[]
  skus: ProductSku[]
  created_at: string
}

export interface ProductQuery {
  page?: number
  size?: number
  /** 0 或不传表示全部分类 */
  category_id?: number | string
  keyword?: string
  /** 仅这三种；price 只有升序，没有降序选项 */
  sort?: 'sales' | 'price' | 'time'
}

/** 商品评价 */
export interface ProductReview {
  id: number
  product_id: number
  rating: number
  content: string
  images: string[] | null
  user: { nickname: string | null; avatar_url: string | null }
  reply_content: string | null
  replied_at: string | null
  created_at: string
}

/** 我的评价（无 user 对象，多返回商品标题图） */
export interface MyReview {
  id: number
  order_id: number
  product_id: number
  title: string
  main_image: string
  rating: number
  content: string
  images: string[] | null
  reply_content: string | null
  replied_at: string | null
  created_at: string
}

/** 我的收藏项：商品列表项 + favorited_at */
export interface FavoriteItem extends Product {
  favorited_at: string
}

/**
 * 商品分页列表（公开）
 */
export function getProductList(params: ProductQuery = {}) {
  return request.get<PaginationResponse<Product>>('/app/clothing/product/list', {
    page: 1,
    size: 12,
    ...params
  })
}

/**
 * 搜索商品（公开）。keyword 必填，否则后端报「请输入搜索关键词」。
 */
export function searchProducts(params: ProductQuery & { keyword: string }) {
  return request.get<PaginationResponse<Product>>('/app/clothing/product/search', {
    page: 1,
    size: 12,
    ...params
  })
}

/**
 * 商品详情（公开）
 */
export function getProductDetail(id: number | string) {
  return request.get<ProductDetail>('/app/clothing/product/detail', { id })
}

/**
 * 商品评价分页（公开）
 */
export function getProductReviews(
  productId: number | string,
  params: { page?: number; size?: number; rating?: number } = {}
) {
  return request.get<PaginationResponse<ProductReview>>('/app/clothing/product/reviews', {
    product_id: productId,
    page: 1,
    size: 10,
    ...params
  })
}

/**
 * 收藏 / 取消收藏（需登录）。
 * 返回 boolean：true 表示现在已收藏，false 表示已取消。
 */
export function toggleFavorite(productId: number) {
  return request.post<boolean>('/app/clothing/product/favorite', { productId })
}

/**
 * 我的收藏（需登录）
 */
export function getMyFavorites(page = 1, size = 12) {
  return request.get<PaginationResponse<FavoriteItem>>(
    '/app/clothing/product/my-favorites',
    { page, size }
  )
}

/**
 * 提交评价（需登录）。
 * 前置条件：订单状态必须是 completed，且该订单含此商品、未评价过。
 */
export function submitReview(data: {
  orderId: number
  productId: number
  rating: number
  content?: string
  images?: string[]
}) {
  return request.post<number>('/app/clothing/product/review', data)
}

/**
 * 我的评价（需登录）
 */
export function getMyReviews(page = 1, size = 10) {
  return request.get<PaginationResponse<MyReview>>('/app/clothing/product/my-reviews', {
    page,
    size
  })
}

// ---------------------------------------------------------------- 分类

/** 分类。走实体查询，**camelCase**，且是扁平数组（parentId=0 为顶级）。 */
export interface Category {
  id: number
  parentId: number
  name: string
  icon: string
  sort: number
  status: string
  createdAt: string
  updatedAt: string
}

/**
 * 分类列表（公开）—— 返回**裸数组**，不是分页对象
 */
export function getCategoryList() {
  return request.get<Category[]>('/app/clothing/category/list')
}

// ---------------------------------------------------------------- 轮播

/** 轮播图。snake_case，且只返回这 5 个字段。 */
export interface Banner {
  id: number
  title: string
  image: string
  link_type: string | null
  link_value: string | null
}

/**
 * 轮播图（公开）—— 返回**裸数组**。position 不传则默认 'home'
 */
export function getBannerList(position = 'home') {
  return request.get<Banner[]>('/app/clothing/banner/list', { position })
}
