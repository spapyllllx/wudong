import request from '@/utils/request'

export interface Address {
  id: number
  userId: number
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  address: string
  isDefault: number
  createTime: string
  updateTime: string
}

// 获取地址列表
export function getAddressList() {
  return request.post<Address[]>('/app/address/list')
}

// 获取默认地址
export function getDefaultAddress() {
  return request.post<Address>('/app/address/default')
}

// 添加地址
export function addAddress(data: {
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  address: string
  isDefault?: number
}) {
  return request.post<Address>('/app/address/create', data)
}

// 更新地址
export function updateAddress(id: number, data: any) {
  return request.post<Address>('/app/address/modify', { id, ...data })
}

// 设置默认地址
export function setDefaultAddress(id: number) {
  return request.post('/app/address/setDefault', { id })
}

// 删除地址
export function deleteAddress(id: number) {
  return request.post('/app/address/remove', { id })
}
