<template>
  <div class="order-detail-page">
    <div class="container" v-loading="loading">
      <div class="back-btn">
        <el-button @click="router.back()" icon="ArrowLeft">返回</el-button>
      </div>

      <div v-if="order" class="order-detail">
        <!-- 订单状态 -->
        <div class="status-section">
          <div class="status-icon">
            <el-icon v-if="order.status === 0" :size="60" color="#E63946"><Clock /></el-icon>
            <el-icon v-else-if="order.status === 1" :size="60" color="#F4A261"><House /></el-icon>
            <el-icon v-else-if="order.status === 2" :size="60" color="#2A9D8F"><User /></el-icon>
            <el-icon v-else-if="order.status === 3" :size="60" color="#06D6A0"><CircleCheck /></el-icon>
            <el-icon v-else :size="60" color="#999"><CircleClose /></el-icon>
          </div>
          <div class="status-text">
            <h2>{{ getStatusText(order.status) }}</h2>
            <p v-if="order.status === 0">请尽快完成支付</p>
            <p v-else-if="order.status === 1">请按时入住</p>
            <p v-else-if="order.status === 2">祝您入住愉快</p>
            <p v-else-if="order.status === 3">感谢您的入住</p>
            <p v-else-if="order.status === 4">{{ order.cancelReason }}</p>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="info-section">
          <h3 class="section-title">订单信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">订单号：</span>
              <span class="value">{{ order.orderNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">民宿名称：</span>
              <span class="value">{{ order.homestayName }}</span>
            </div>
            <div class="info-item">
              <span class="label">房型：</span>
              <span class="value">{{ order.roomTypeName }}</span>
            </div>
            <div class="info-item">
              <span class="label">入住日期：</span>
              <span class="value">{{ order.checkInDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">退房日期：</span>
              <span class="value">{{ order.checkOutDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">入住天数：</span>
              <span class="value">{{ order.nights }}晚</span>
            </div>
            <div class="info-item">
              <span class="label">房间数量：</span>
              <span class="value">{{ order.roomCount }}间</span>
            </div>
            <div class="info-item">
              <span class="label">入住人数：</span>
              <span class="value">{{ order.guestCount }}人</span>
            </div>
            <div class="info-item">
              <span class="label">下单时间：</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="info-item" v-if="order.payTime">
              <span class="label">支付时间：</span>
              <span class="value">{{ order.payTime }}</span>
            </div>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="contact-section">
          <h3 class="section-title">联系信息</h3>
          <div class="contact-content">
            <div class="contact-item">
              <span class="label">联系人：</span>
              <span class="value">{{ order.contactName }}</span>
            </div>
            <div class="contact-item">
              <span class="label">联系电话：</span>
              <span class="value">{{ order.contactPhone }}</span>
            </div>
          </div>
        </div>

        <!-- 价格明细 -->
        <div class="amount-section">
          <div class="amount-item">
            <span>订单总额：</span>
            <span>¥{{ order.totalAmount }}</span>
          </div>
          <div class="amount-item total">
            <span>实付金额：</span>
            <span class="total-amount">¥{{ order.payAmount }}</span>
          </div>
        </div>

        <!-- 订单备注 -->
        <div v-if="order.remark" class="remark-section">
          <h3 class="section-title">订单备注</h3>
          <div class="remark-content">{{ order.remark }}</div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <template v-if="order.status === 0">
            <el-button @click="handleCancel">取消订单</el-button>
            <el-button type="primary" @click="handlePay">去支付</el-button>
          </template>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!order && !loading" description="订单不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, House, User, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { getHomestayOrderDetail, cancelHomestayOrder, mockPayHomestay } from '@/api/homestay'
import type { HomestayOrder } from '@/api/homestay'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const order = ref<HomestayOrder | null>(null)

// 订单状态文本
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '等待支付',
    1: '等待入住',
    2: '已入住',
    3: '交易完成',
    4: '已取消'
  }
  return map[status] || '未知状态'
}

// 加载订单详情
async function loadOrderDetail() {
  const orderNo = route.query.orderNo as string
  if (!orderNo) {
    ElMessage.error('订单号无效')
    router.back()
    return
  }

  loading.value = true
  try {
    order.value = await getHomestayOrderDetail(orderNo)
  } catch (error: any) {
    console.error('加载订单详情失败:', error)
    ElMessage.error(error.message || '加载订单详情失败')
  } finally {
    loading.value = false
  }
}

// 取消订单
async function handleCancel() {
  if (!order.value) return

  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelHomestayOrder(order.value.orderNo, '不想入住了')
    ElMessage.success('订单已取消')
    await loadOrderDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消订单失败')
    }
  }
}

// 去支付
async function handlePay() {
  if (!order.value) return

  try {
    await ElMessageBox.confirm('确认使用模拟支付？', '模拟支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await mockPayHomestay(order.value.orderNo)
    ElMessage.success('支付成功')
    await loadOrderDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  }
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-detail-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.order-detail {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-2xl;
}

// 订单状态
.status-section {
  text-align: center;
  padding: $spacing-2xl 0;
  border-bottom: 1px solid $border;
  margin-bottom: $spacing-2xl;

  .status-icon {
    margin-bottom: $spacing-md;
  }

  .status-text {
    h2 {
      font-size: 24px;
      margin-bottom: $spacing-sm;
    }

    p {
      color: $text-secondary;
    }
  }
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid $primary;
}

// 订单信息
.info-section,
.contact-section,
.amount-section,
.remark-section {
  margin-bottom: $spacing-2xl;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;

  .info-item {
    .label {
      color: $text-secondary;
    }

    .value {
      margin-left: $spacing-sm;
    }
  }
}

// 联系信息
.contact-content {
  background: $bg;
  padding: $spacing-lg;
  border-radius: $radius;

  .contact-item {
    display: flex;
    padding: $spacing-sm 0;

    .label {
      color: $text-secondary;
      min-width: 80px;
    }

    .value {
      flex: 1;
    }
  }
}

// 价格明细
.amount-section {
  background: $bg;
  padding: $spacing-lg;
  border-radius: $radius;

  .amount-item {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm 0;

    &.total {
      padding-top: $spacing-md;
      border-top: 1px solid $border;
      font-size: $font-size-lg;
      font-weight: 600;

      .total-amount {
        font-size: 24px;
        color: $danger;
      }
    }
  }
}

// 订单备注
.remark-content {
  background: $bg;
  padding: $spacing-lg;
  border-radius: $radius;
  color: $text-secondary;
  line-height: 1.6;
}

// 操作按钮
.action-section {
  @include flex-center;
  gap: $spacing-md;
  padding-top: $spacing-2xl;
  border-top: 1px solid $border;
}

@include md {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
