<template>
  <div class="order-list-page">
    <div class="container">
      <h1 class="page-title">我的订单</h1>

      <!-- 订单状态筛选 -->
      <div class="order-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="count-badge">{{ tab.count }}</span>
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-loading="loading" class="order-list">
        <div v-for="order in orderList" :key="order.id" class="order-card">
          <!-- 订单头部 -->
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-time">{{ order.createTime }}</span>
            <span class="order-status">{{ getStatusText(order.status) }}</span>
          </div>

          <!-- 订单商品 -->
          <div class="order-body">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
              @click="goToOrderDetail(order.orderNo)"
            >
              <el-image :src="item.productImage" fit="cover" class="item-image" />
              <div class="item-info">
                <div class="item-title">{{ item.productTitle }}</div>
                <div v-if="item.skuName" class="item-sku">{{ item.skuName }}</div>
                <div class="item-meta">
                  <span class="item-price">¥{{ item.price }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-amount">
              <span>共{{ order.items?.length || 0 }}件商品，</span>
              <span>实付：</span>
              <span class="amount">¥{{ order.payAmount }}</span>
            </div>
            <div class="order-actions">
              <!-- 待付款：取消订单、去支付 -->
              <template v-if="order.status === 0">
                <el-button @click="handleCancel(order)">取消订单</el-button>
                <el-button type="primary" @click="handlePay(order)">去支付</el-button>
              </template>

              <!-- 待发货：提醒发货 -->
              <template v-if="order.status === 1">
                <el-button @click="handleRemindShip(order)">提醒发货</el-button>
              </template>

              <!-- 待收货：查看物流、确认收货 -->
              <template v-if="order.status === 2">
                <el-button @click="handleViewLogistics(order)">查看物流</el-button>
                <el-button type="primary" @click="handleConfirmReceipt(order)">确认收货</el-button>
              </template>

              <!-- 已完成：再次购买、评价 -->
              <template v-if="order.status === 3">
                <el-button @click="handleBuyAgain(order)">再次购买</el-button>
                <el-button type="primary" @click="handleReview(order)">评价</el-button>
                <el-button @click="handleDelete(order)">删除订单</el-button>
              </template>

              <!-- 已取消：删除订单 -->
              <template v-if="order.status === 4">
                <el-button @click="handleDelete(order)">删除订单</el-button>
              </template>

              <el-button @click="goToOrderDetail(order.orderNo)">订单详情</el-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="orderList.length === 0 && !loading" description="暂无订单">
          <el-button type="primary" @click="router.push('/product')">去逛逛</el-button>
        </el-empty>

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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderList, getOrderStats, cancelOrder, confirmReceipt, deleteOrder } from '@/api/order'
import { mockPay } from '@/api/payment'
import type { Order, OrderStats } from '@/api/order'

const router = useRouter()

const loading = ref(false)
const activeTab = ref(-1) // -1全部 0待付款 1待发货 2待收货 3已完成 4已取消
const orderList = ref<Order[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单统计
const stats = ref<OrderStats>({
  waitPayCount: 0,
  waitShipCount: 0,
  waitReceiveCount: 0,
  finishedCount: 0
})

// 标签页配置
const tabs = computed(() => [
  { label: '全部', value: -1, count: 0 },
  { label: '待付款', value: 0, count: stats.value.waitPayCount },
  { label: '待发货', value: 1, count: stats.value.waitShipCount },
  { label: '待收货', value: 2, count: stats.value.waitReceiveCount },
  { label: '已完成', value: 3, count: stats.value.finishedCount }
])

// 订单状态文本
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '已完成',
    4: '已取消',
    5: '已关闭'
  }
  return map[status] || '未知'
}

// 加载订单统计
async function loadOrderStats() {
  try {
    stats.value = await getOrderStats()
  } catch (error: any) {
    console.error('加载订单统计失败:', error)
  }
}

// 加载订单列表
async function loadOrderList() {
  loading.value = true
  try {
    const result = await getOrderList({
      page: currentPage.value,
      size: pageSize.value,
      status: activeTab.value
    })
    orderList.value = result.list
    total.value = result.pagination.total
  } catch (error: any) {
    console.error('加载订单列表失败:', error)
    ElMessage.error(error.message || '加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 切换标签
function handleTabChange(value: number) {
  activeTab.value = value
  currentPage.value = 1
  loadOrderList()
}

// 跳转到订单详情
function goToOrderDetail(orderNo: string) {
  router.push({
    path: '/order/detail',
    query: { orderNo }
  })
}

// 取消订单
async function handleCancel(order: Order) {
  try {
    await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '选填'
    })

    await cancelOrder(order.orderNo, '不想要了')
    ElMessage.success('订单已取消')
    await loadOrderList()
    await loadOrderStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消订单失败')
    }
  }
}

// 去支付
async function handlePay(order: Order) {
  try {
    await ElMessageBox.confirm('确认使用模拟支付？', '模拟支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await mockPay(order.orderNo)
    ElMessage.success('支付成功')
    await loadOrderList()
    await loadOrderStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  }
}

// 提醒发货
function handleRemindShip(order: Order) {
  ElMessage.success('已提醒商家发货')
}

// 查看物流
function handleViewLogistics(order: Order) {
  ElMessage.info('物流查询功能开发中')
}

// 确认收货
async function handleConfirmReceipt(order: Order) {
  try {
    await ElMessageBox.confirm('确认已收到商品吗？', '确认收货', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await confirmReceipt(order.orderNo)
    ElMessage.success('确认收货成功')
    await loadOrderList()
    await loadOrderStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '确认收货失败')
    }
  }
}

// 再次购买
function handleBuyAgain(order: Order) {
  ElMessage.info('再次购买功能开发中')
  // TODO: 将订单商品加入购物车
}

// 评价
function handleReview(order: Order) {
  ElMessage.info('评价功能开发中')
  // TODO: 跳转到评价页面
}

// 删除订单
async function handleDelete(order: Order) {
  try {
    await ElMessageBox.confirm('确定要删除这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteOrder(order.orderNo)
    ElMessage.success('删除成功')
    await loadOrderList()
    await loadOrderStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadOrderStats()
  loadOrderList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-list-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

// 标签页
.order-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  background: white;
  padding: $spacing-lg;
  border-radius: $radius-lg;

  .tab-item {
    position: relative;
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

    .count-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: $danger;
      color: white;
      font-size: $font-size-xs;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
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

    .order-header {
      @include flex-between;
      padding: $spacing-md $spacing-lg;
      background: $bg;
      border-bottom: 1px solid $border;

      .order-no {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .order-time {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .order-status {
        color: $primary;
        font-weight: 500;
      }
    }

    .order-body {
      padding: $spacing-lg;

      .order-item {
        display: flex;
        gap: $spacing-md;
        cursor: pointer;
        padding: $spacing-md;
        border-radius: $radius;
        transition: background 0.3s;

        &:hover {
          background: $bg;
        }

        .item-image {
          width: 100px;
          height: 100px;
          border-radius: $radius;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;

          .item-title {
            font-weight: 500;
            margin-bottom: $spacing-xs;
            @include ellipsis(2);
          }

          .item-sku {
            color: $text-secondary;
            font-size: $font-size-sm;
            margin-bottom: $spacing-xs;
          }

          .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .item-price {
              color: $danger;
              font-weight: 500;
            }

            .item-quantity {
              color: $text-secondary;
            }
          }
        }
      }
    }

    .order-footer {
      @include flex-between;
      padding: $spacing-lg;
      border-top: 1px solid $border;
      background: $bg;

      .order-amount {
        .amount {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }
      }

      .order-actions {
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
  .order-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .order-body {
    .order-item {
      .item-image {
        width: 80px;
        height: 80px;
      }
    }
  }

  .order-footer {
    flex-direction: column;
    gap: $spacing-md;
    align-items: stretch;

    .order-actions {
      flex-wrap: wrap;
    }
  }
}
</style>
