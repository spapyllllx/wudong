<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="logo">乌东文旅</div>
      <el-menu mode="horizontal" :default-active="activeMenu">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/yi">衣·非遗商品</el-menu-item>
        <el-menu-item index="/shi">食·餐饮美食</el-menu-item>
        <el-menu-item index="/zhu">住·民宿预订</el-menu-item>
        <el-menu-item index="/xing">行·线路订票</el-menu-item>
        <el-menu-item index="/shequ">社区</el-menu-item>
      </el-menu>
      <div class="user-actions">
        <el-button v-if="!userinfo" type="primary" @click="login">登录</el-button>
        <el-dropdown v-else>
          <span class="user-info">
            <el-avatar :size="32" :src="userinfo.avatar" />
            {{ userinfo.nickname }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/profile')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Banner -->
    <el-carousel height="400px" class="banner">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <img :src="banner.imageUrl" :alt="banner.title" class="banner-img" />
      </el-carousel-item>
    </el-carousel>

    <!-- 入口卡片 -->
    <div class="entry-cards">
      <el-card class="entry-card" shadow="hover" @click="$router.push('/yi')">
        <div class="entry-icon">衣</div>
        <div class="entry-title">非遗商品</div>
        <div class="entry-desc">苗族银饰、蜡染、刺绣</div>
      </el-card>
      <el-card class="entry-card" shadow="hover" @click="$router.push('/shi')">
        <div class="entry-icon">食</div>
        <div class="entry-title">餐饮美食</div>
        <div class="entry-desc">苗家特色餐厅、农产品</div>
      </el-card>
      <el-card class="entry-card" shadow="hover" @click="$router.push('/zhu')">
        <div class="entry-icon">住</div>
        <div class="entry-title">住宿预订</div>
        <div class="entry-desc">苗寨特色民宿</div>
      </el-card>
      <el-card class="entry-card" shadow="hover" @click="$router.push('/xing')">
        <div class="entry-icon">行</div>
        <div class="entry-title">线路订票</div>
        <div class="entry-desc">景区门票、路线套餐</div>
      </el-card>
      <el-card class="entry-card" shadow="hover" @click="$router.push('/shequ')">
        <div class="entry-icon">社</div>
        <div class="entry-title">社区分享</div>
        <div class="entry-desc">游记、照片、攻略</div>
      </el-card>
    </div>

    <!-- 推荐内容 -->
    <div class="recommend-section">
      <h2>热门推荐</h2>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in hotProducts" :key="item.id">
          <el-card class="product-card" shadow="hover">
            <img :src="item.image" class="product-img" />
            <div class="product-title">{{ item.title }}</div>
            <div class="product-price">¥{{ item.price }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeMenu = ref('/home')
const banners = ref([])
const hotProducts = ref([])
const userinfo = ref(null)

const login = () => {
  router.push('/admin')
}

const logout = () => {
  localStorage.removeItem('token')
  userinfo.value = null
  ElMessage.success('已退出登录')
}

onMounted(() => {
  // 检查登录状态
  const token = localStorage.getItem('token')
  if (token) {
    // TODO: 获取用户信息
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #c8590d;
  padding: 0 20px;
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
}

.banner {
  width: 100%;
}

.banner-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.entry-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 40px 20px;
  background: #f5f5f5;
}

.entry-card {
  text-align: center;
  width: 160px;
  cursor: pointer;
  transition: transform 0.3s;
}

.entry-card:hover {
  transform: translateY(-5px);
}

.entry-icon {
  width: 60px;
  height: 60px;
  line-height: 60px;
  background: #c8590d;
  color: white;
  border-radius: 50%;
  margin: 0 auto 10px;
  font-size: 24px;
  font-weight: bold;
}

.entry-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.entry-desc {
  font-size: 12px;
  color: #999;
}

.recommend-section {
  padding: 40px 20px;
}

.recommend-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.product-card {
  cursor: pointer;
  margin-bottom: 20px;
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-title {
  margin: 10px 0 5px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #c8590d;
  font-weight: bold;
}
</style>
