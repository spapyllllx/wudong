import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { isLoggedIn } from '@/utils/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Index.vue'),
    meta: { title: '首页' }
  },
  // 用户模块
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/user/Index.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: '个人资料', requiresAuth: true }
  },
  {
    path: '/user/address',
    name: 'UserAddress',
    component: () => import('@/views/user/Address.vue'),
    meta: { title: '地址管理', requiresAuth: true }
  },
  // 社区模块
  {
    path: '/community',
    name: 'Community',
    component: () => import('@/views/community/Index.vue'),
    meta: { title: '社区' }
  },
  {
    path: '/community/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/community/Detail.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/community/publish',
    name: 'PublishPost',
    component: () => import('@/views/community/Publish.vue'),
    meta: { title: '发布帖子', requiresAuth: true }
  },
  // 商品模块
  {
    path: '/product',
    name: 'ProductList',
    component: () => import('@/views/product/List.vue'),
    meta: { title: '商品列表' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/product/Detail.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/product/Cart.vue'),
    meta: { title: '购物车', requiresAuth: true }
  },
  // 订单模块（骨架）
  {
    path: '/order/confirm',
    name: 'OrderConfirm',
    component: () => import('@/views/order/Confirm.vue'),
    meta: { title: '确认订单', requiresAuth: true }
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/views/order/List.vue'),
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order/Detail.vue'),
    meta: { title: '订单详情', requiresAuth: true }
  },
  // 餐饮模块（骨架）
  {
    path: '/restaurant',
    name: 'RestaurantList',
    component: () => import('@/views/restaurant/List.vue'),
    meta: { title: '餐饮' }
  },
  {
    path: '/restaurant/:id',
    name: 'RestaurantDetail',
    component: () => import('@/views/restaurant/Detail.vue'),
    meta: { title: '餐厅详情' }
  },
  // 住宿模块（骨架）
  {
    path: '/homestay',
    name: 'HomestayList',
    component: () => import('@/views/homestay/List.vue'),
    meta: { title: '住宿' }
  },
  {
    path: '/homestay/:id',
    name: 'HomestayDetail',
    component: () => import('@/views/homestay/Detail.vue'),
    meta: { title: '民宿详情' }
  },
  // 票务模块（骨架）
  {
    path: '/ticket',
    name: 'TicketList',
    component: () => import('@/views/ticket/List.vue'),
    meta: { title: '票务' }
  },
  {
    path: '/ticket/:id',
    name: 'TicketDetail',
    component: () => import('@/views/ticket/Detail.vue'),
    meta: { title: '景点详情' }
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 乌东文旅`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
