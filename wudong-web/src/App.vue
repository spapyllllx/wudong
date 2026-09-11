<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { useUserStore } from '@/stores/user'
import { isLoggedIn } from '@/utils/auth'

const userStore = useUserStore()

onMounted(() => {
  // 如果已登录，获取用户信息
  if (isLoggedIn()) {
    userStore.fetchUser().catch(() => {
      // 获取失败，清除登录状态
      userStore.logout()
    })
  }
})
</script>

<style lang="scss">
@import '@/styles/wudong-theme.scss';
@import '@/styles/global.scss';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 24px;
}
</style>
