// router/index.js - PC端路由配置
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/yi',
    name: 'Yi',
    component: () => import('@/views/Yi/ProductList.vue')
  },
  {
    path: '/yi/:id',
    name: 'YiDetail',
    component: () => import('@/views/Yi/ProductDetail.vue')
  },
  {
    path: '/shi',
    name: 'Shi',
    // TODO: 待实现 - 替换为真实页面 @/views/Shi/RestaurantList.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/shi/:id',
    name: 'ShiDetail',
    // TODO: 待实现 - 替换为真实页面 @/views/Shi/RestaurantDetail.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/zhu',
    name: 'Zhu',
    // TODO: 待实现 - 替换为真实页面 @/views/Zhu/HomestayList.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/zhu/:id',
    name: 'ZhuDetail',
    // TODO: 待实现 - 替换为真实页面 @/views/Zhu/HomestayDetail.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/xing',
    name: 'Xing',
    // TODO: 待实现 - 替换为真实页面 @/views/Xing/ScenicList.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/xing/:id',
    name: 'XingDetail',
    // TODO: 待实现 - 替换为真实页面 @/views/Xing/ScenicDetail.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/shequ',
    name: 'Shequ',
    // TODO: 待实现 - 替换为真实页面 @/views/Shequ/LogList.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/shequ/:id',
    name: 'ShequDetail',
    // TODO: 待实现 - 替换为真实页面 @/views/Shequ/LogDetail.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    // TODO: 待实现 - 替换为真实页面 @/views/Profile.vue
    component: () => import('@/views/UnderConstruction.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin/Login.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/admin')
  } else {
    next()
  }
})

export default router
