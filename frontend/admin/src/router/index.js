import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Dashboard from '@/views/Dashboard.vue'
import UserList from '@/views/User/UserList.vue'
import MerchantList from '@/views/Merchant/MerchantList.vue'
import OrderList from '@/views/Order/OrderList.vue'
import ContentAudit from '@/views/Content/ContentAudit.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '数据看板' }
      },
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: { title: '用户管理' }
      },
      {
        path: 'merchants',
        name: 'MerchantList',
        component: MerchantList,
        meta: { title: '商家管理' }
      },
      {
        path: 'orders',
        name: 'OrderList',
        component: OrderList,
        meta: { title: '订单管理' }
      },
      {
        path: 'content',
        name: 'ContentAudit',
        component: ContentAudit,
        meta: { title: '内容审核' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
