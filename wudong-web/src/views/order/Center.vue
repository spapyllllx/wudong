<template>
  <div class="order-center-page">
    <div class="container">
      <h1 class="page-title">订单中心</h1>

      <!-- 订单类型筛选 -->
      <div class="type-tabs">
        <div
          v-for="tab in typeTabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeType === tab.value }"
          @click="handleTypeChange(tab.value)"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          <span>{{ tab.label }}</span>
        </div>
      </div>

      <!-- 状态筛选 -->
      <div class="status-tabs">
        <div
          v-for="tab in currentStatusTabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeStatus === tab.value }"
          @click="handleStatusChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-loading="loading" class="order-list">
        <!-- 商品订单 -->
        <template v-if="activeType === 'product'">
          <div v-for="order in orderList" :key="order.orderNo" class="order-card product-order">
            <div class="card-header">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-type">商品订单</span>
              <span class="order-status">{{ getProductStatusText(order.status) }}</span>
            </div>
            <div class="card-body">
              <div class="order-items">
                <div v-for="item in order.items" :key="item.id" class="order-item">
                  <el-image :src="item.productImage" class="item-image" fit="cover" />
                  <div class="item-info">
                    <div class="item-name">{{ item.productTitle }}</div>
                    <div class="item-spec">{{ item.skuName || '默认规格' }}</div>
                    <div class="item-price">¥{{ item.price }} × {{ item.quantity }}</div>
                  </div>
                </div>
              </div>
              <div class="order-amount">总计：¥{{ order.totalAmount }}</div>
            </div>
            <div class="card-footer">
              <span class="create-time">{{ order.createTime }}</span>
              <div class="actions">
                <el-button size="small" @click="goToProductDetail(order.orderNo)">查看详情</el-button>
              </div>
            </div>
          </div>
        </template>

        <!-- 餐饮预订 -->
        <template v-if="activeType === 'restaurant'">
          <div v-for="order in orderList" :key="order.bookingNo" class="order-card restaurant-order">
            <div class="card-header">
              <span class="order-no">预订号：{{ order.bookingNo }}</span>
              <span class="order-type">餐饮预订</span>
              <span class="order-status">{{ getRestaurantStatusText(order.status) }}</span>
            </div>
            <div class="card-body">
              <h3 class="restaurant-name">{{ order.restaurantName }}</h3>
              <div class="booking-info">
                <div>预订时间：{{ order.bookingDate }} {{ order.bookingTime }}</div>
                <div>就餐人数：{{ order.peopleCount }}人</div>
                <div>联系人：{{ order.contactName }} {{ order.contactPhone }}</div>
              </div>
            </div>
            <div class="card-footer">
              <span class="create-time">{{ order.createTime }}</span>
              <div class="actions">
                <el-button size="small" @click="goToRestaurantBooking">查看预订</el-button>
              </div>
            </div>
          </div>
        </template>

        <!-- 住宿订单 -->
        <template v-if="activeType === 'homestay'">
          <div v-for="order in orderList" :key="order.orderNo" class="order-card homestay-order">
            <div class="card-header">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-type">住宿订单</span>
              <span class="order-status">{{ getHomestayStatusText(order.status) }}</span>
            </div>
            <div class="card-body">
              <h3 class="homestay-name">{{ order.homestayName }}</h3>
              <div class="room-name">{{ order.roomTypeName }}</div>
              <div class="booking-info">
                <div>入住：{{ order.checkInDate }} - {{ order.checkOutDate }}</div>
                <div>{{ order.nights }}晚 / {{ order.roomCount }}间 / {{ order.guestCount }}人</div>
                <div class="amount">¥{{ order.payAmount }}</div>
              </div>
            </div>
            <div class="card-footer">
              <span class="create-time">{{ order.createTime }}</span>
              <div class="actions">
                <el-button size="small" @click="goToHomestayDetail(order.orderNo)">查看详情</el-button>
              </div>
            </div>
          </div>
        </template>

        <!-- 票务订单 -->
        <template v-if="activeType === 'ticket'">
          <div v-for="order in orderList" :key="order.orderNo" class="order-card ticket-order">
            <div class="card-header">
              <span class="order-no">订单号：{{ order.orderNo }}</span>
              <span class="order-type">门票订单</span>
              <span class="order-status">{{ getTicketStatusText(order.status) }}</span>
            </div>
            <div class="card-body">
              <h3 class="attraction-name">{{ order.attractionName }}</h3>
              <div class="ticket-name">{{ order.ticketTypeName }}</div>
              <div class="booking-info">
                <div>使用日期：{{ order.useDate }}</div>
                <div>购买数量：{{ order.quantity }}张</div>
                <div class="amount">¥{{ order.payAmount }}</div>
              </div>
            </div>
            <div class="card-footer">
              <span class="create-time">{{ order.createTime }}</span>
              <div class="actions">
                <el-button v-if="order.status === 1" type="primary" size="small" @click="goToTicketDetail(order.orderNo)">查看电子票</el-button>
                <el-button v-else size="small" @click="goToTicketDetail(order.orderNo)">查看详情</el-button>
              </div>
            </div>
          </div>
        </template>

        <!-- 空状态 -->
        <el-empty v-if="orderList.length === 0 && !loading" description="暂无订单" />

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadOrderList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingBag, Food, House, Ticket } from '@element-plus/icons-vue'
import { getOrderList as getProductOrders } from '@/api/order'
import { getBookingList as getRestaurantBookings } from '@/api/restaurant'
import { getHomestayOrderList } from '@/api/homestay'
import { getTicketOrderList } from '@/api/ticket'

const router = useRouter()

const loading = ref(false)
const orderList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeType = ref('product')
const activeStatus = ref(-1)

const typeTabs = [
  { label: '商品', value: 'product', icon: ShoppingBag },
  { label: '餐饮', value: 'restaurant', icon: Food },
  { label: '住宿', value: 'homestay', icon: House },
  { label: '门票', value: 'ticket', icon: Ticket }
]

// 商品订单状态
const productStatusTabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 }
]

// 餐饮预订状态
const restaurantStatusTabs = [
  { label: '全部', value: -1 },
  { label: '待确认', value: 0 },
  { label: '已确认', value: 1 },
  { label: '已完成', value: 2 }
]

// 住宿订单状态
const homestayStatusTabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待入住', value: 1 },
  { label: '已入住', value: 2 },
  { label: '已完成', value: 3 }
]

// 票务订单状态
const ticketStatusTabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待使用', value: 1 },
  { label: '已使用', value: 2 },
  { label: '已完成', value: 3 }
]

// 当前状态选项卡
const currentStatusTabs = computed(() => {
  switch (activeType.value) {
    case 'product':
      return productStatusTabs
    case 'restaurant':
      return restaurantStatusTabs
    case 'homestay':
      return homestayStatusTabs
    case 'ticket':
      return ticketStatusTabs
    default:
      return []
  }
})

// 状态文本映射
function getProductStatusText(status: number) {
  const map: Record<number, string> = { 0: '待付款', 1: '待发货', 2: '待收货', 3: '已完成', 4: '已取消' }
  return map[status] || '未知'
}

function getRestaurantStatusText(status: number) {
  const map: Record<number, string> = { 0: '待确认', 1: '已确认', 2: '已完成', 3: '已取消' }
  return map[status] || '未知'
}

function getHomestayStatusText(status: number) {
  const map: Record<number, string> = { 0: '待付款', 1: '待入住', 2: '已入住', 3: '已完成', 4: '已取消' }
  return map[status] || '未知'
}

function getTicketStatusText(status: number) {
  const map: Record<number, string> = { 0: '待付款', 1: '待使用', 2: '已使用', 3: '已完成', 4: '已取消', 5: '已退款' }
  return map[status] || '未知'
}

// 加载订单列表
async function loadOrderList() {
  loading.value = true
  try {
    let result: any

    switch (activeType.value) {
      case 'product':
        result = await getProductOrders({
          page: currentPage.value,
          size: pageSize.value,
          status: activeStatus.value
        })
        break
      case 'restaurant':
        result = await getRestaurantBookings({
          page: currentPage.value,
          size: pageSize.value,
          status: activeStatus.value
        })
        break
      case 'homestay':
        result = await getHomestayOrderList({
          page: currentPage.value,
          size: pageSize.value,
          status: activeStatus.value
        })
        break
      case 'ticket':
        result = await getTicketOrderList({
          page: currentPage.value,
          size: pageSize.value,
          status: activeStatus.value
        })
        break
    }

    orderList.value = result.list
    total.value = result.pagination.total
  } catch (error: any) {
    console.error('加载订单列表失败:', error)
    ElMessage.error(error.message || '加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 切换类型
function handleTypeChange(value: string) {
  activeType.value = value
  activeStatus.value = -1
  currentPage.value = 1
  loadOrderList()
}

// 切换状态
function handleStatusChange(value: number) {
  activeStatus.value = value
  currentPage.value = 1
  loadOrderList()
}

// 跳转到详情
function goToProductDetail(orderNo: string) {
  router.push({ path: '/order/detail', query: { orderNo } })
}

function goToRestaurantBooking() {
  router.push('/restaurant/booking')
}

function goToHomestayDetail(orderNo: string) {
  router.push({ path: '/homestay/order/detail', query: { orderNo } })
}

function goToTicketDetail(orderNo: string) {
  router.push({ path: '/ticket/order/detail', query: { orderNo } })
}

onMounted(() => {
  loadOrderList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-center-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

// 类型筛选
.type-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .tab-item {
    @include flex-center;
    flex-direction: column;
    gap: $spacing-xs;
    padding: $spacing-lg;
    background: white;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.active {
      background: $primary;
      color: white;
    }

    .el-icon {
      font-size: 24px;
    }
  }
}

// 状态筛选
.status-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  background: white;
  padding: $spacing-lg;
  border-radius: $radius-lg;

  .tab-item {
    padding: $spacing-sm $spacing-lg;
    cursor: pointer;
    border-radius: $radius;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover {
      background: $bg;
    }

    &.active {
      background: $primary;
      color: white;
    }
  }
}

// 订单列表
.order-list {
  .order-card {
    background: white;
    border-radius: $radius-lg;
    margin-bottom: $spacing-lg;
    overflow: hidden;

    .card-header {
      @include flex-between;
      padding: $spacing-md $spacing-lg;
      background: $bg;
      border-bottom: 1px solid $border;

      .order-no {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .order-type {
        padding: 2px $spacing-sm;
        background: $primary;
        color: white;
        border-radius: $radius;
        font-size: $font-size-sm;
      }

      .order-status {
        font-weight: 500;
        color: $primary;
      }
    }

    .card-body {
      padding: $spacing-lg;

      .order-items {
        .order-item {
          display: flex;
          gap: $spacing-md;
          padding: $spacing-md 0;
          border-bottom: 1px solid $border;

          &:last-child {
            border-bottom: none;
          }

          .item-image {
            width: 80px;
            height: 80px;
            border-radius: $radius;
          }

          .item-info {
            flex: 1;

            .item-name {
              font-weight: 500;
              margin-bottom: $spacing-xs;
            }

            .item-spec {
              color: $text-secondary;
              font-size: $font-size-sm;
              margin-bottom: $spacing-xs;
            }

            .item-price {
              color: $danger;
            }
          }
        }
      }

      .order-amount {
        text-align: right;
        font-size: $font-size-lg;
        font-weight: 600;
        color: $danger;
        margin-top: $spacing-md;
      }

      .restaurant-name,
      .homestay-name,
      .attraction-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-xs;
      }

      .room-name,
      .ticket-name {
        color: $text-secondary;
        margin-bottom: $spacing-md;
      }

      .booking-info {
        div {
          padding: $spacing-xs 0;
          color: $text-secondary;
        }

        .amount {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }
      }
    }

    .card-footer {
      @include flex-between;
      padding: $spacing-md $spacing-lg;
      background: $bg;
      border-top: 1px solid $border;

      .create-time {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .actions {
        display: flex;
        gap: $spacing-sm;
      }
    }
  }

  .pagination {
    @include flex-center;
    margin-top: $spacing-xl;
  }
}

@include md {
  .type-tabs {
    grid-template-columns: repeat(2, 1fr);
  }

  .status-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .card-footer {
    flex-direction: column;
    gap: $spacing-sm;
    align-items: stretch;
  }
}
</style>
