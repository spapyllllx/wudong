import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo as fetchUserInfo, type UserInfo } from '@/api/user'
import {
  setToken,
  setRefreshToken,
  setUserInfo,
  removeToken,
  getToken,
  getUserInfo as getStoredUserInfo
} from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  // 二者都从 localStorage 水合，保证刷新后登录态不丢
  const token = ref<string>(getToken() || '')
  const userInfo = ref<UserInfo | null>(getStoredUserInfo())

  /**
   * 登录态以 token 为准（与路由守卫 utils/auth.isLoggedIn 保持同一判据）。
   * 不再以 userInfo 为准——否则 userInfo 拉取失败时会与守卫判断不一致。
   */
  const isLoggedIn = computed(() => !!token.value)
  const userId = computed(() => userInfo.value?.id)
  const nickname = computed(() => userInfo.value?.nickName || '游客')
  const avatar = computed(() => userInfo.value?.avatarUrl || '')

  /**
   * 登录
   */
  function login(tokenData: { token: string; refreshToken: string; user?: UserInfo }) {
    token.value = tokenData.token
    setToken(tokenData.token)

    if (tokenData.refreshToken) {
      setRefreshToken(tokenData.refreshToken)
    }

    if (tokenData.user) {
      userInfo.value = tokenData.user
      setUserInfo(tokenData.user)
    }
  }

  /**
   * 退出登录
   */
  function logout() {
    token.value = ''
    userInfo.value = null
    removeToken()
  }

  /**
   * 获取用户信息
   */
  async function fetchUser() {
    try {
      const data = await fetchUserInfo()
      userInfo.value = data
      setUserInfo(data)
      return data
    } catch (error) {
      console.error('获取用户信息失败', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   */
  function updateUser(data: Partial<UserInfo>) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...data }
      setUserInfo(userInfo.value)
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userId,
    nickname,
    avatar,
    login,
    logout,
    fetchUser,
    updateUser
  }
})
