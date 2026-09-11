<template>
  <div class="ticket-order-page">
    <div class="container">
      <h1 class="page-title">我的门票</h1>

      <!-- 状态筛选 -->
      <div class="order-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 订单列表 -->
      <div v-loading="loading" class="order-list">
        <div v-for="order in orderList" :key="order.id" class="order-card">
          <div class="card-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="order-status">{{ getStatusText(order.status) }}</span>
          </div>

          <div class="card-body">
            <h3 class="attraction-name">{{ order.attractionName }}</h3>
            <div class="ticket-name">{{ order.ticketTypeName }}</div>

            <div class="order-info">
              <div class="info-item">
                <span class="label">使用日期：</span>
                <span class="value">{{ order.useDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">购买数量：</span>
                <span class="value">{{ order.quantity }}张</span>
              </div>
              <div class="info-item">
                <span class="label">联系人：</span>
                <span class="value">{{ order.contactName }} {{ order.contactPhone }}</span>
              </div>
              <div class="info-item">
                <span class="label">订单金额：</span>
                <span class="value amount">¥{{ order.payAmount }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="create-time">下单时间：{{ order.createTime }}</div>
            <div class="actions">
              <!-- 待付款 -->
              <template v-if="order.status === 0">
                <el-button @click="handleCancel(order)">取消订单</el-button>
                <el-button type="primary" @click="handlePay(order)">去支付</el-button>
              </template>
              <!-- 待使用 -->
              <template v-if="order.status === 1">
                <el-button type="primary" @click="goToDetail(order)">查看电子票</el-button>
              </template>
              <!-- 已使用/已完成 -->
              <template v-if="order.status === 2 || order.status === 3">
                <el-button @click="goToDetail(order)">查看详情</el-button>
              </template>
            </div>
          </div>
        </div>

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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTicketOrderList, cancelTicketOrder, mockPayTicket } from '@/api/ticket'
import type { TicketOrder } from '@/api/ticket'

const router = useRouter()

const loading = ref(false)
const orderList = ref<TicketOrder[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeTab = ref(-1) // -1全部 0待付款 1待使用 2已使用 3已完成 4已取消

const tabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待使用', value: 1 },
  { label: '已使用', value: 2 },
  { label: '已完成', value: 3 }
]

// 获取状态文本
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待付款',
    1: '待使用',
    2: '已使用',
    3: '已完成',
    4: '已取消',
    5: '已退款'
  }
  return map[status] || '未知'
}

// 加载订单列表
async function loadOrderList() {
  loading.value = true
  try {
    const result = await getTicketOrderList({
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

// 切换状态
function handleTabChange(value: number) {
  activeTab.value = value
  currentPage.value = 1
  loadOrderList()
}

// 取消订单
async function handleCancel(order: TicketOrder) {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelTicketOrder(order.orderNo, '不想购买了')
    ElMessage.success('订单已取消')
    await loadOrderList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
}

// 去支付
async function handlePay(order: TicketOrder) {
  try {
    await ElMessageBox.confirm('确认使用模拟支付？', '模拟支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await mockPayTicket(order.orderNo)
    ElMessage.success('支付成功')
    await loadOrderList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  }
}

// 跳转到详情
function goToDetail(order: TicketOrder) {
  router.push({
    path: '/ticket/order/detail',
    query: { orderNo: order.orderNo }
  })
}

onMounted(() => {
  loadOrderList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.ticket-order-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

// 状态筛选
.order-tabs {
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

      .order-status {
        font-weight: 500;
        color: $primary;
      }
    }

    .card-body {
      padding: $spacing-lg;

      .attraction-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-xs;
      }

      .ticket-name {
        color: $text-secondary;
        margin-bottom: $spacing-md;
      }

      .order-info {
        .info-item {
          display: flex;
          padding: $spacing-sm 0;

          .label {
            color: $text-secondary;
            min-width: 80px;
          }

          .value {
            flex: 1;

            &.amount {
              font-size: $font-size-lg;
              font-weight: 600;
              color: $danger;
            }
          }
        }
      }
    }

    .card-footer {
      @include flex-between;
      padding: $spacing-lg;
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
  .order-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .card-footer {
    flex-direction: column;
    gap: $spacing-md;
    align-items: stretch;
  }
}
</style>
