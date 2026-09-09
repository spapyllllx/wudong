import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo as fetchUserInfo, type UserInfo } from '@/api/user'
import { setToken, setRefreshToken, setUserInfo, removeToken, getUserInfo as getStoredUserInfo } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(getStoredUserInfo())
  const token = ref<string>('')

  const isLoggedIn = computed(() => !!userInfo.value)
  const userId = computed(() => userInfo.value?.id)
  const nickname = computed(() => userInfo.value?.nickName || '游客')
  const avatar = computed(() => userInfo.value?.avatarUrl || '')

  /**
   * 登录
   */
  function login(tokenData: { token: string; refreshToken: string; user: UserInfo }) {
    token.value = tokenData.token
    userInfo.value = tokenData.user

    setToken(tokenData.token)
    setRefreshToken(tokenData.refreshToken)
    setUserInfo(tokenData.user)
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
    userInfo,
    token,
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
