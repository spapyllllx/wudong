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
            <el-icon v-else-if="order.status === 1" :size="60" color="#F4A261"><Box /></el-icon>
            <el-icon v-else-if="order.status === 2" :size="60" color="#2A9D8F"><Van /></el-icon>
            <el-icon v-else-if="order.status === 3" :size="60" color="#06D6A0"><CircleCheck /></el-icon>
            <el-icon v-else :size="60" color="#999"><CircleClose /></el-icon>
          </div>
          <div class="status-text">
            <h2>{{ getStatusText(order.status) }}</h2>
            <p v-if="order.status === 0">请尽快完成支付</p>
            <p v-else-if="order.status === 1">商家正在准备发货</p>
            <p v-else-if="order.status === 2">商品正在配送中</p>
            <p v-else-if="order.status === 3">交易成功</p>
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
              <span class="label">下单时间：</span>
              <span class="value">{{ order.createTime }}</span>
            </div>
            <div class="info-item" v-if="order.payTime">
              <span class="label">支付时间：</span>
              <span class="value">{{ order.payTime }}</span>
            </div>
            <div class="info-item" v-if="order.shipTime">
              <span class="label">发货时间：</span>
              <span class="value">{{ order.shipTime }}</span>
            </div>
            <div class="info-item" v-if="order.finishTime">
              <span class="label">完成时间：</span>
              <span class="value">{{ order.finishTime }}</span>
            </div>
          </div>
        </div>

        <!-- 收货地址 -->
        <div class="address-section">
          <h3 class="section-title">收货信息</h3>
          <div class="address-content">
            <div class="receiver-info">
              <span class="receiver-name">{{ order.receiverName }}</span>
              <span class="receiver-phone">{{ order.receiverPhone }}</span>
            </div>
            <div class="address-detail">
              {{ order.receiverProvince }}
              {{ order.receiverCity }}
              {{ order.receiverDistrict }}
              {{ order.receiverAddress }}
            </div>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="goods-section">
          <h3 class="section-title">商品清单</h3>
          <div class="goods-list">
            <div v-for="item in order.items" :key="item.id" class="goods-item">
              <el-image :src="item.productImage" fit="cover" class="goods-image" />
              <div class="goods-info">
                <div class="goods-title">{{ item.productTitle }}</div>
                <div v-if="item.skuName" class="goods-sku">{{ item.skuName }}</div>
              </div>
              <div class="goods-price">¥{{ item.price }}</div>
              <div class="goods-quantity">x{{ item.quantity }}</div>
              <div class="goods-total">¥{{ item.totalAmount }}</div>
            </div>
          </div>
        </div>

        <!-- 价格明细 -->
        <div class="amount-section">
          <div class="amount-item">
            <span>商品总价：</span>
            <span>¥{{ order.totalAmount }}</span>
          </div>
          <div class="amount-item">
            <span>运费：</span>
            <span>¥{{ order.freight }}</span>
          </div>
          <div class="amount-item" v-if="order.discountAmount > 0">
            <span>优惠金额：</span>
            <span>-¥{{ order.discountAmount }}</span>
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

        <!-- 订单日志 -->
        <div v-if="order.logs && order.logs.length > 0" class="log-section">
          <h3 class="section-title">订单记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="log in order.logs"
              :key="log.id"
              :timestamp="log.createTime"
              placement="top"
            >
              <div class="log-content">
                <div class="log-type">{{ log.operateType }}</div>
                <div class="log-detail">{{ log.operateContent }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <template v-if="order.status === 0">
            <el-button @click="handleCancel">取消订单</el-button>
            <el-button type="primary" @click="handlePay">去支付</el-button>
          </template>
          <template v-if="order.status === 2">
            <el-button type="primary" @click="handleConfirmReceipt">确认收货</el-button>
          </template>
          <template v-if="order.status === 3">
            <el-button type="primary" @click="handleReview">评价</el-button>
          </template>
          <template v-if="[3, 4].includes(order.status)">
            <el-button @click="handleDelete">删除订单</el-button>
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
import { Clock, Box, Van, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { getOrderDetail, cancelOrder as apiCancelOrder, confirmReceipt, deleteOrder as apiDeleteOrder } from '@/api/order'
import { mockPay } from '@/api/payment'
import type { Order } from '@/api/order'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const order = ref<Order | null>(null)

// 订单状态文本
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '等待买家付款',
    1: '等待卖家发货',
    2: '等待买家收货',
    3: '交易成功',
    4: '交易关闭',
    5: '交易关闭'
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
    order.value = await getOrderDetail(orderNo)
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
    await ElMessageBox.prompt('请输入取消原因', '取消订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '选填'
    })

    await apiCancelOrder(order.value.orderNo, '不想要了')
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

    await mockPay(order.value.orderNo)
    ElMessage.success('支付成功')
    await loadOrderDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '支付失败')
    }
  }
}

// 确认收货
async function handleConfirmReceipt() {
  if (!order.value) return

  try {
    await ElMessageBox.confirm('确认已收到商品吗？', '确认收货', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await confirmReceipt(order.value.orderNo)
    ElMessage.success('确认收货成功')
    await loadOrderDetail()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '确认收货失败')
    }
  }
}

// 评价
function handleReview() {
  ElMessage.info('评价功能开发中')
}

// 删除订单
async function handleDelete() {
  if (!order.value) return

  try {
    await ElMessageBox.confirm('确定要删除这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await apiDeleteOrder(order.value.orderNo)
    ElMessage.success('删除成功')
    router.push('/order/list')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
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
.address-section,
.goods-section,
.amount-section,
.remark-section,
.log-section {
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

// 收货地址
.address-content {
  background: $bg;
  padding: $spacing-lg;
  border-radius: $radius;

  .receiver-info {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-sm;

    .receiver-name {
      font-weight: 600;
    }
  }

  .address-detail {
    color: $text-secondary;
    line-height: 1.6;
  }
}

// 商品列表
.goods-list {
  .goods-item {
    display: grid;
    grid-template-columns: 100px 1fr 120px 80px 120px;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md 0;
    border-bottom: 1px solid $border;

    &:last-child {
      border-bottom: none;
    }

    .goods-image {
      width: 100px;
      height: 100px;
      border-radius: $radius;
    }

    .goods-info {
      .goods-title {
        font-weight: 500;
        margin-bottom: $spacing-xs;
        @include ellipsis(2);
      }

      .goods-sku {
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }

    .goods-price,
    .goods-quantity,
    .goods-total {
      text-align: center;
    }

    .goods-price,
    .goods-total {
      color: $danger;
      font-weight: 500;
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

// 订单日志
.log-section {
  .log-content {
    .log-type {
      font-weight: 500;
      margin-bottom: $spacing-xs;
    }

    .log-detail {
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }
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

  .goods-item {
    grid-template-columns: 80px 1fr 100px 60px 100px;
    font-size: $font-size-sm;

    .goods-image {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
