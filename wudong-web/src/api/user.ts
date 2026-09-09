import request from '@/utils/request'

export interface LoginParams {
  phone: string
  password?: string
  smsCode?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expire: number
  user: UserInfo
}

export interface UserInfo {
  id: number
  phone: string
  nickName: string
  avatarUrl: string
  gender: number
  birthday?: string
  region?: string
  bio?: string
}

export interface Address {
  id: number
  consignee: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: number
}

/**
 * 用户名密码登录
 */
export function loginByPassword(username: string, password: string) {
  return request.post<LoginResponse>('/app/user/login/password', { username, password })
}

/**
 * 用户注册
 */
export function register(username: string, password: string, phone?: string) {
  return request.post<LoginResponse>('/app/user/login/register', { username, password, phone })
}

/**
 * 手机号验证码登录
 */
export function loginByPhone(phone: string, smsCode: string) {
  return request.post<LoginResponse>('/app/user/login/phone', { phone, smsCode })
}

/**
 * 发送验证码
 */
export function sendSmsCode(phone: string, captchaId: string, code: string) {
  return request.post('/app/user/login/smsCode', { phone, captchaId, code })
}

/**
 * 获取图形验证码
 */
export function getCaptcha() {
  return request.get<{ id: string; img: string }>('/app/user/login/captcha', {
    width: 100,
    height: 40
  })
}

/**
 * 刷新 Token
 */
export function refreshToken(refreshToken: string) {
  return request.post<LoginResponse>('/app/user/login/refreshToken', { refreshToken })
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get<UserInfo>('/app/user/info/person')
}

/**
 * 更新用户信息
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return request.post('/app/user/info/updatePerson', data)
}

/**
 * 更新密码
 */
export function updatePassword(password: string, code: string) {
  return request.post('/app/user/info/updatePassword', { password, code })
}

/**
 * 绑定手机号
 */
export function bindPhone(phone: string, code: string) {
  return request.post('/app/user/info/bindPhone', { phone, code })
}

/**
 * 获取地址列表
 */
export function getAddressList() {
  return request.get<Address[]>('/app/user/address/list')
}

/**
 * 获取地址详情
 */
export function getAddressDetail(id: number) {
  return request.get<Address>('/app/user/address/info', { id })
}

/**
 * 新增地址
 */
export function addAddress(data: Omit<Address, 'id'>) {
  return request.post('/app/user/address/add', data)
}

/**
 * 更新地址
 */
export function updateAddress(data: Address) {
  return request.post('/app/user/address/update', data)
}

/**
 * 删除地址
 */
export function deleteAddress(id: number) {
  return request.post('/app/user/address/delete', { ids: [id] })
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: number) {
  return request.post('/app/user/address/setDefault', { id })
}
