import request from '@/utils/request'
import type { PaginationResponse } from '@/utils/request'

export interface LoginParams {
  phone: string
  password?: string
  smsCode?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  expire?: number
  user?: UserInfo
}

/**
 * 与后端 user_info 表对齐。
 * 注意字段名是 nickName / avatarUrl，不是 nickname / avatar。
 */
export interface UserInfo {
  id: number
  username?: string
  phone: string
  nickName: string
  avatarUrl: string
  gender: number
  status?: number
  description?: string
  createTime?: string
  updateTime?: string
}

/**
 * 与后端 user_address 表对齐。
 * 联系人字段是 contact（不是 consignee），详细地址是 address（不是 detail），
 * isDefault 是 boolean（不是 0/1）。
 */
export interface Address {
  id?: number
  contact: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  isDefault: boolean
}

/**
 * 密码登录
 *
 * 后端 AppUserLoginController.password 取的是 @Body('username')，
 * 走 UserLoginService.password(username, password) → findOneBy({ username })。
 * 注意：字段名必须是 username（手机号只用于验证码登录 /register）。
 */
export function loginByPassword(username: string, password: string) {
  return request.post<LoginResponse>('/app/user/login/password', { username, password })
}

/**
 * 注册
 */
export function register(username: string, password: string, phone?: string) {
  return request.post<LoginResponse>('/app/user/login/register', {
    username,
    password,
    phone
  })
}

/**
 * 手机号验证码登录
 */
export function loginByPhone(phone: string, smsCode: string) {
  return request.post<LoginResponse>('/app/user/login/phone', { phone, smsCode })
}

/**
 * 发送短信验证码
 */
export function sendSmsCode(phone: string, captchaId: string, code: string) {
  return request.post('/app/user/login/smsCode', { phone, captchaId, code })
}

/**
 * 获取图形验证码
 */
export function getCaptcha(width = 100, height = 40) {
  return request.get<{ id: string; img: string }>('/app/user/login/captcha', {
    width,
    height
  })
}

/**
 * 刷新 Token
 */
export function refreshToken(refreshTokenValue: string) {
  return request.post<LoginResponse>('/app/user/login/refreshToken', {
    refreshToken: refreshTokenValue
  })
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
 * 获取地址列表（返回数组，默认地址排首位）
 *
 * ⚠️ 实测该接口是 **POST** 而非 GET（CoolController 自动生成的 CRUD 都是 POST），
 * 用 GET 会得到 `/app/user/address/list Not Found`。
 */
export function getAddressList() {
  return request.post<Address[]>('/app/user/address/list')
}

/**
 * 获取地址分页
 */
export function getAddressPage(page = 1, size = 10) {
  return request.post<PaginationResponse<Address>>('/app/user/address/page', {
    page,
    size
  })
}

/**
 * 获取地址详情（GET，必须带 id）
 */
export function getAddressDetail(id: number) {
  return request.get<Address>('/app/user/address/info', { id })
}

/**
 * 新增地址
 */
export function addAddress(data: Address) {
  return request.post('/app/user/address/add', data)
}

/**
 * 更新地址（也用于设置默认地址，见 setDefaultAddress）
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
 *
 * 后端没有 setDefault 接口（address 控制器只暴露 add/delete/update/info/list/page），
 * 因此通过 update 改写 isDefault 实现。
 */
export function setDefaultAddress(address: Address) {
  return updateAddress({ ...address, isDefault: true })
}

/**
 * 获取默认地址
 *
 * ⚠️ 后端**没有** `/app/user/address/default` 接口（实测 Not Found，
 * 源码里的 `@Get('/default')` 并未生效）。这里在客户端从列表里挑默认项，
 * 避免调用一个不存在的地址。
 */
export async function getDefaultAddress(): Promise<Address | null> {
  const list = await getAddressList()
  return (list || []).find((a) => a.isDefault) || (list || [])[0] || null
}
