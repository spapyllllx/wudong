<template>
  <div class="order-list-page">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">MY ORDERS</p>
        <h1 class="page-title">我的订单</h1>
      </header>

      <nav class="tab-bar">
        <button
          v-for="t in tabs"
          :key="t.value"
          class="tab-item"
          :class="{ active: activeTab === t.value }"
          @click="activeTab = t.value"
        >
          {{ t.label }}
          <em v-if="t.value === 'all'">{{ orders.length }}</em>
        </button>
      </nav>

      <div v-if="loading" class="order-skeleton">
        <div v-for="i in 3" :key="i" class="skeleton skeleton-card"></div>
      </div>

      <el-empty
        v-else-if="filtered.length === 0"
        :description="orders.length === 0 ? '还没有订单' : '这个状态下没有订单'"
        :image-size="140"
      >
        <el-button v-if="orders.length === 0" type="primary" @click="router.push('/product')">
          去挑选商品
        </el-button>
      </el-empty>

      <template v-else>
        <ul class="order-list">
          <li
            v-for="order in pagedOrders"
            :key="order.id"
            class="order-card"
            @click="router.push(`/order/${order.id}`)"
          >
            <div class="order-head">
              <span class="order-no">订单号 {{ order.id }}</span>
              <time class="order-time">{{ order.created_at }}</time>
              <span class="order-status" :class="statusClass(order.status)">
                {{ statusLabel(order.status) }}
              </span>
            </div>

            <ul class="order-items">
              <li v-for="(item, idx) in order.items" :key="idx" class="order-item">
                <div class="item-thumb">
                  <img :src="resolveImage(item.image)" :alt="item.product_name" />
                </div>
                <div class="item-info">
                  <span class="item-name">{{ item.product_name }}</span>
                  <span v-if="item.sku_name" class="item-sku">{{ item.sku_name }}</span>
                </div>
                <span class="item-qty">× {{ item.quantity }}</span>
                <span class="item-amount">{{ formatPrice(item.total_amount) }}</span>
              </li>
            </ul>

            <div class="order-foot">
              <span class="order-count">共 {{ totalQuantity(order) }} 件</span>
              <span class="order-total">
                实付 <strong>{{ formatPrice(order.total_amount) }}</strong>
              </span>
            </div>
          </li>
        </ul>

        <div v-if="filtered.length > pageSize" class="pager">
          <el-pagination
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
            :total="filtered.length"
            background
            hide-on-single-page
            @current-change="(p: number) => (page = p)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderList, type Order, type OrderStatus } from '@/api/order'
import { formatPrice } from '@/utils/format'
import { resolveImage } from '@/utils/image'
import { isLoggedIn } from '@/utils/auth'

const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(true)
const activeTab = ref<'all' | OrderStatus>('all')
const page = ref(1)
const pageSize = 5

const tabs: Array<{ label: string; value: 'all' | OrderStatus }> = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '待收货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

const STATUS_LABEL: Record<string, string> = {
  pending: '待支付',
  paid: '待发货',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

function statusLabel(s: string) {
  return STATUS_LABEL[s] || s
}

function statusClass(s: string) {
  if (s === 'pending') return 'is-pending'
  if (s === 'completed') return 'is-done'
  if (s === 'cancelled' || s === 'refunded') return 'is-muted'
  return 'is-active'
}

function totalQuantity(order: Order) {
  return (order.items || []).reduce((s, i) => s + i.quantity, 0)
}

/**
 * 后端 order/list 不支持按状态筛选，因此拉全量后在本地筛选，
 * 保证 tab 显示的是真实结果而不是"当前页里碰巧匹配的"。
 */
const filtered = computed(() =>
  activeTab.value === 'all'
    ? orders.value
    : orders.value.filter((o) => o.status === activeTab.value)
)

const pagedOrders = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

watch(activeTab, () => {
  page.value = 1
})

async function loadAll() {
  loading.value = true
  try {
    const all: Order[] = []
    let p = 1
    // 分页拉全量，最多 4 页（200 单），避免极端情况下无限循环
    while (p <= 4) {
      const res = await getOrderList(p, 50)
      const list = res?.list || []
      all.push(...list)
      const total = res?.pagination?.total || 0
      if (all.length >= total || list.length === 0) break
      p += 1
    }
    orders.value = all
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isLoggedIn()) {
    router.replace({ path: '/login', query: { redirect: '/order/list' } })
    return
  }
  loadAll()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-list-page {
  padding: $spacing-2xl 0 $spacing-2xl * 1.5;
  min-height: 70vh;
}

.page-head {
  margin-bottom: $spacing-xl;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: $tracking-widest;
  color: $primary-lighter;
  margin-bottom: $spacing-sm;
}

.page-title {
  font-family: $font-display;
  font-size: 40px;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
}

// ---------------------------------------------------------- 状态标签

.tab-bar {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $divider;
  margin-bottom: $spacing-xl;
}

.tab-item {
  position: relative;
  padding-bottom: $spacing-sm;
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
  transition: color $transition;

  em {
    font-style: normal;
    margin-left: 4px;
    color: $text-disabled;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 0;
    height: 2px;
    background: $primary;
    transition: width $transition;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    color: $primary-dark;
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }
}

// ---------------------------------------------------------- 订单卡

.order-card {
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: border-color $transition, box-shadow $transition;

  &:hover {
    border-color: rgba(61, 90, 128, 0.35);
    box-shadow: $shadow-md;
  }
}

.order-head {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $divider;
  font-size: $font-size-xs;
  color: $text-disabled;
  letter-spacing: $tracking-wide;

  .order-time {
    color: $text-placeholder;
  }

  .order-status {
    margin-left: auto;
    font-size: $font-size-sm;
    font-weight: 600;

    &.is-pending {
      color: $accent-orange;
    }

    &.is-active {
      color: $primary;
    }

    &.is-done {
      color: $success;
    }

    &.is-muted {
      color: $text-disabled;
    }
  }
}

.order-items {
  padding: $spacing-md 0;
}

.order-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 60px 100px;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm 0;

  & + & {
    border-top: 1px solid $divider;
  }
}

.item-thumb {
  width: 56px;
  height: 56px;
  background: $bg;
  border: 1px solid $border;
  border-radius: 2px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.item-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-family: $font-display;
  font-size: $font-size;
  color: $text-primary;
  @include ellipsis(1);
}

.item-sku {
  font-size: $font-size-xs;
  color: $text-disabled;
  @include ellipsis(1);
}

.item-qty {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: right;
}

.item-amount {
  font-size: $font-size-sm;
  color: $text-primary;
  text-align: right;
}

.order-foot {
  @include flex-between;
  padding-top: $spacing-md;
  border-top: 1px solid $divider;
  font-size: $font-size-sm;
  color: $text-secondary;

  .order-total strong {
    font-size: $font-size-xl;
    color: $accent-red;
    margin-left: 4px;
  }
}

.pager {
  margin-top: $spacing-xl;
  display: flex;
  justify-content: center;

  :deep(.el-pagination.is-background .el-pager li) {
    border-radius: 2px;
    background: transparent;
    border: 1px solid $border;

    &.is-active {
      background: $primary;
      border-color: $primary;
    }
  }
}

.order-skeleton .skeleton-card {
  height: 180px;
  margin-bottom: $spacing-lg;
  border-radius: $radius-sm;
}
</style>
