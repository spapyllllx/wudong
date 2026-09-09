<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="logo" @click="router.push('/')">
          <h1>🏞️ 乌东文旅</h1>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/community" class="nav-item">社区</router-link>
          <router-link to="/user" class="nav-item" v-if="userStore.isLogin()">我的</router-link>
        </nav>
        <div class="actions">
          <el-button type="primary" @click="handlePublish" v-if="userStore.isLogin()">
            <el-icon><Edit /></el-icon>
            发布帖子
          </el-button>

          <!-- 未登录 -->
          <el-button @click="router.push('/login')" v-if="!userStore.isLogin()">
            登录
          </el-button>

          <!-- 已登录 -->
          <el-dropdown v-else @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :src="userStore.userInfo?.avatar" :size="32" />
              <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="user">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 乌东文旅平台. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handlePublish = () => {
  if (!userStore.isLogin()) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push('/community/publish')
}

const handleCommand = (command: string) => {
  if (command === 'user') {
    router.push('/user')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning'
    }).then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
      router.push('/')
    })
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    cursor: pointer;

    h1 {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
  }

  .nav {
    display: flex;
    gap: 32px;

    .nav-item {
      color: #666;
      text-decoration: none;
      font-size: 16px;
      transition: color 0.3s;

      &:hover,
      &.router-link-active {
        color: #409eff;
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-dropdown {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .username {
        font-size: 14px;
        color: #333;
      }

      &:hover .username {
        color: #409eff;
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.footer {
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 20px 0;
  text-align: center;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  p {
    margin: 0;
    color: #999;
    font-size: 14px;
  }
}
</style>
