<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-text">乌东文旅</span>
        </router-link>

        <!-- 导航菜单 -->
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/product" class="nav-item">非遗商品</router-link>
          <router-link to="/restaurant" class="nav-item">特色餐饮</router-link>
          <router-link to="/homestay" class="nav-item">民宿</router-link>
          <router-link to="/ticket" class="nav-item">景区票务</router-link>
          <router-link to="/community" class="nav-item">社区</router-link>
        </nav>

        <!-- 搜索框 -->
        <div class="search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品、景点、游记..."
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 用户区域 -->
        <div class="user-area">
          <!-- 购物车 - 暂时只支持商品 -->
          <router-link to="/cart" class="icon-btn cart-icon">
            <el-badge :value="cartCount" :hidden="cartCount === 0">
              <el-icon :size="22"><ShoppingCart /></el-icon>
            </el-badge>
            <span class="icon-label">购物车</span>
          </router-link>

          <!-- 订单中心 - 整合所有订单 -->
          <router-link to="/order/center" class="icon-btn order-icon">
            <el-icon :size="22"><Document /></el-icon>
            <span class="icon-label">订单</span>
          </router-link>

          <template v-if="isLoggedIn">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :src="avatar" :size="32">{{ nickname[0] }}</el-avatar>
                <span class="nickname">{{ nickname }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="orders">订单中心</el-dropdown-item>
                  <el-dropdown-item command="address">地址管理</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="router.push('/login')">登录</el-button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Search, ShoppingCart, Document } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')
const cartCount = ref(0)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const nickname = computed(() => userStore.nickname)
const avatar = computed(() => userStore.avatar)

function handleSearch() {
  if (!searchKeyword.value.trim()) return
  router.push({
    path: '/search',
    query: { keyword: searchKeyword.value }
  })
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/user')
      break
    case 'orders':
      router.push('/order/center')
      break
    case 'address':
      router.push('/user/address')
      break
    case 'logout':
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
      break
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.header {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(61, 90, 128, 0.1);
  box-shadow: 0 2px 12px rgba(61, 90, 128, 0.08);

  // 底部民族风格装饰条
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      $accent-red 0%,
      $accent-orange 25%,
      $accent-yellow 50%,
      $accent-green 75%,
      $primary 100%
    );
  }
}

.header-content {
  @include flex-between;
  height: 70px;
  gap: $spacing-xl;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg,
    $primary 0%,
    $primary-light 50%,
    $accent-green 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  letter-spacing: 1px;
  transition: all $transition;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.nav {
  display: flex;
  gap: $spacing-sm;
  flex: 1;
}

.nav-item {
  position: relative;
  color: $text-primary;
  font-size: $font-size;
  font-weight: 600;
  white-space: nowrap;
  padding: $spacing-sm $spacing-lg;
  transition: all $transition;
  border-radius: $radius-md;

  &:hover {
    color: $primary;
    background: rgba(61, 90, 128, 0.08);
    transform: translateY(-2px);
  }

  &.router-link-active {
    color: $bg-white;
    background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
    box-shadow: 0 4px 12px rgba(61, 90, 128, 0.3);

    &::after {
      content: '';
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid $primary-light;
    }
  }
}

.search {
  width: 300px;

  :deep(.el-input__wrapper) {
    border-radius: $radius-full;
  }
}

.user-area {
  @include flex-end;
  gap: $spacing-md;
}

.icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-md;
  color: $text-primary;
  transition: all $transition;
  position: relative;
  min-width: 60px;

  .icon-label {
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }

  &:hover {
    color: $primary;
    background: rgba(61, 90, 128, 0.08);
    transform: translateY(-2px);
  }

  &.router-link-active {
    color: $primary;
    background: rgba(61, 90, 128, 0.1);
  }
}

.cart-icon {
  &:hover {
    color: $accent-red;
  }

  &.router-link-active {
    color: $accent-red;
    background: rgba(230, 57, 70, 0.1);
  }
}

.order-icon {
  &:hover {
    color: $accent-orange;
  }

  &.router-link-active {
    color: $accent-orange;
    background: rgba(244, 162, 97, 0.1);
  }
}

.user-info {
  @include flex-start;
  gap: $spacing-sm;
  cursor: pointer;
}

.nickname {
  font-size: $font-size-sm;
  color: $text-primary;
  max-width: 100px;
  @include ellipsis;
}

@include lg {
  .search {
    width: 200px;
  }

  .nav {
    gap: $spacing-md;
  }
}

@include md {
  .nav {
    display: none;
  }

  .search {
    flex: 1;
  }
}
</style>
