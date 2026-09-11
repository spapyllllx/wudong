import request from '@/utils/request'

export interface CartItem {
  id: number
  userId: number
  productId: number
  skuId: number | null
  quantity: number
  selected: number
  productTitle: string
  productImage: string
  productPrice: number
  productStock: number
  productStatus: number
  skuName: string | null
  skuPrice: number | null
  skuStock: number | null
  skuImage: string | null
  skuStatus: number | null
  currentPrice: number
  currentStock: number
  currentImage: string
  isAvailable: boolean
  isInStock: boolean
}

// 添加到购物车
export function addToCart(data: {
  productId: number
  skuId?: number
  quantity?: number
}) {
  return request.post('/app/cart/add', data)
}

// 获取购物车列表
export function getCartList() {
  return request.post<CartItem[]>('/app/cart/list')
}

// 更新数量
export function updateCartQuantity(id: number, quantity: number) {
  return request.post('/app/cart/updateQuantity', { id, quantity })
}

// 更新选中状态
export function updateCartSelected(id: number, selected: number) {
  return request.post('/app/cart/updateSelected', { id, selected })
}

// 全选/取消全选
export function selectAllCart(selected: number) {
  return request.post('/app/cart/selectAll', { selected })
}

// 删除购物车商品
export function removeFromCart(id: number) {
  return request.post('/app/cart/remove', { id })
}

// 批量删除
export function batchRemoveCart(ids: number[]) {
  return request.post('/app/cart/batchRemove', { ids })
}

// 清空购物车
export function clearCart() {
  return request.post('/app/cart/clear')
}

// 获取购物车数量
export function getCartCount() {
  return request.post<number>('/app/cart/count')
}

// 获取选中的商品
export function getSelectedItems() {
  return request.post<CartItem[]>('/app/cart/selectedItems')
}
