import request from '@/utils/request'

export default {
  // 登录
  login(data: { username: string; password: string }) {
    return request.post('/app/auth/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return request.post('/app/auth/userInfo', {})
  }
}
