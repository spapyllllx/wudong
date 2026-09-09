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
    component: () => import('@/views/Shi/RestaurantList.vue')
  },
  {
    path: '/shi/:id',
    name: 'ShiDetail',
    component: () => import('@/views/Shi/RestaurantDetail.vue')
  },
  {
    path: '/zhu',
    name: 'Zhu',
    component: () => import('@/views/Zhu/HomestayList.vue')
  },
  {
    path: '/zhu/:id',
    name: 'ZhuDetail',
    component: () => import('@/views/Zhu/HomestayDetail.vue')
  },
  {
    path: '/xing',
    name: 'Xing',
    component: () => import('@/views/Xing/ScenicList.vue')
  },
  {
    path: '/xing/:id',
    name: 'XingDetail',
    component: () => import('@/views/Xing/ScenicDetail.vue')
  },
  {
    path: '/shequ',
    name: 'Shequ',
    component: () => import('@/views/Shequ/LogList.vue')
  },
  {
    path: '/shequ/:id',
    name: 'ShequDetail',
    component: () => import('@/views/Shequ/LogDetail.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
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
