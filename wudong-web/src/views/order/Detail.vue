<template>
  <div class="order-detail-page">
    <div class="container">
      <nav class="crumb">
        <router-link to="/order/list">我的订单</router-link>
        <span class="sep">/</span>
        <span>订单详情</span>
      </nav>

      <div v-if="loading" class="skeleton skeleton-block"></div>

      <el-empty v-else-if="!order" description="订单不存在" :image-size="140">
        <el-button type="primary" @click="router.push('/order/list')">
          返回我的订单
        </el-button>
      </el-empty>

      <template v-else>
        <!-- 状态头 -->
        <header class="status-head">
          <div>
            <p class="status-label">{{ statusLabel(order.status) }}</p>
            <p class="status-hint">{{ statusHint(order.status) }}</p>
          </div>
          <div class="status-actions">
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              :loading="acting"
              @click="handlePay"
            >
              立即支付
            </el-button>
            <el-button
              v-if="order.status === 'pending'"
              :loading="acting"
              @click="handleCancel"
            >
              取消订单
            </el-button>
            <el-button
              v-if="order.status === 'shipped'"
              type="primary"
              :loading="acting"
              @click="handleConfirm"
            >
              确认收货
            </el-button>
            <el-button
              v-if="canRefund"
              :loading="acting"
              @click="refundVisible = true"
            >
              申请退款
            </el-button>
            <el-button
              v-if="order.status === 'completed'"
              type="primary"
              plain
              @click="reviewVisible = true"
            >
              评价商品
            </el-button>
          </div>
        </header>

        <!-- 商品 -->
        <section class="block">
          <h2 class="block-title">商品</h2>
          <ul class="item-list">
            <li v-for="(item, idx) in order.items" :key="idx" class="order-item">
              <div class="item-thumb" @click="router.push(`/product/${item.product_id}`)">
                <img :src="resolveImage(item.image)" :alt="item.product_name" />
              </div>
              <div class="item-info">
                <h3
                  class="item-title"
                  @click="router.push(`/product/${item.product_id}`)"
                >
                  {{ item.product_name }}
                </h3>
                <p v-if="item.sku_name" class="item-sku">{{ item.sku_name }}</p>
              </div>
              <div class="item-price">{{ formatPrice(item.price) }}</div>
              <div class="item-qty">× {{ item.quantity }}</div>
              <div class="item-subtotal">{{ formatPrice(item.total_amount) }}</div>
            </li>
          </ul>
        </section>

        <!-- 收货信息 -->
        <section v-if="order.logistics" class="block">
          <h2 class="block-title">收货信息</h2>
          <dl class="info-grid">
            <div class="info-row">
              <dt>收货人</dt>
              <dd>{{ order.logistics.consignee }}</dd>
            </div>
            <div class="info-row">
              <dt>联系电话</dt>
              <dd>{{ order.logistics.phone }}</dd>
            </div>
            <div class="info-row span-2">
              <dt>收货地址</dt>
              <dd>
                {{ order.logistics.province }}{{ order.logistics.city
                }}{{ order.logistics.district }}{{ order.logistics.detail }}
              </dd>
            </div>
            <template v-if="order.logistics.logistics_no">
              <div class="info-row">
                <dt>物流公司</dt>
                <dd>{{ order.logistics.logistics_company }}</dd>
              </div>
              <div class="info-row">
                <dt>物流单号</dt>
                <dd>{{ order.logistics.logistics_no }}</dd>
              </div>
            </template>
          </dl>
        </section>

        <!-- 订单信息 -->
        <section class="block">
          <h2 class="block-title">订单信息</h2>
          <dl class="info-grid">
            <div class="info-row span-2">
              <dt>订单号</dt>
              <dd class="mono">{{ order.id }}</dd>
            </div>
            <div class="info-row">
              <dt>下单时间</dt>
              <dd>{{ order.created_at }}</dd>
            </div>
            <div class="info-row">
              <dt>支付时间</dt>
              <dd>{{ order.paid_at || '—' }}</dd>
            </div>
            <div v-if="order.remark" class="info-row span-2">
              <dt>备注</dt>
              <dd>{{ order.remark }}</dd>
            </div>
          </dl>

          <div class="amount-line">
            <span>实付金额</span>
            <strong>{{ formatPrice(order.total_amount) }}</strong>
          </div>
        </section>
      </template>
    </div>

    <!-- 申请退款 -->
    <el-dialog v-model="refundVisible" title="申请退款" width="460px">
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="当前仅支持全额退款"
        style="margin-bottom: 16px"
      />
      <el-input
        v-model="refundReason"
        type="textarea"
        :rows="4"
        maxlength="500"
        show-word-limit
        placeholder="请填写退款原因"
      />
      <template #footer>
        <el-button @click="refundVisible = false">取消</el-button>
        <el-button type="primary" :loading="acting" @click="handleRefund">
          提交申请
        </el-button>
      </template>
    </el-dialog>

    <!-- 评价 -->
    <el-dialog v-model="reviewVisible" title="评价商品" width="520px">
      <el-form label-width="70px">
        <el-form-item label="商品">
          <el-select v-model="reviewProductId" placeholder="选择要评价的商品" style="width: 100%">
            <el-option
              v-for="item in order?.items || []"
              :key="item.product_id"
              :label="item.product_name"
              :value="item.product_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="reviewRating" :max="5" show-score />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="reviewContent"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            placeholder="说说这件商品怎么样（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" :loading="acting" @click="handleReview">
          提交评价
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderList,
  payOrder,
  cancelOrder,
  confirmOrder,
  applyRefund,
  type Order
} from '@/api/order'
import { submitReview } from '@/api/product'
import { formatPrice } from '@/utils/format'
import { resolveImage } from '@/utils/image'
import { isLoggedIn } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)
const loading = ref(true)
const acting = ref(false)

const refundVisible = ref(false)
const refundReason = ref('')

const reviewVisible = ref(false)
const reviewProductId = ref<number | null>(null)
const reviewRating = ref(5)
const reviewContent = ref('')

const STATUS_LABEL: Record<string, string> = {
  pending: '待支付',
  paid: '待发货',
  shipped: '待收货',
  completed: '已完成',
  cancelled: '已取消',
  refunded: '已退款'
}

const STATUS_HINT: Record<string, string> = {
  pending: '请尽快完成支付',
  paid: '商家正在准备发货',
  shipped: '商品已发出，收到后请确认收货',
  completed: '订单已完成，感谢支持',
  cancelled: '订单已取消',
  refunded: '订单已退款'
}

function statusLabel(s: string) {
  return STATUS_LABEL[s] || s
}

function statusHint(s: string) {
  return STATUS_HINT[s] || ''
}

/** 仅 paid / completed 可申请退款（后端限制） */
const canRefund = computed(
  () => order.value?.status === 'paid' || order.value?.status === 'completed'
)

/**
 * 后端没有 order/detail 接口，只有分页的 order/list。
 * 因此这里翻页查找目标订单。
 */
async function findOrder(id: string): Promise<Order | null> {
  let p = 1
  while (p <= 4) {
    const res = await getOrderList(p, 50)
    const list = res?.list || []
    const hit = list.find((o) => String(o.id) === id)
    if (hit) return hit

    const total = res?.pagination?.total || 0
    if (list.length === 0 || p * 50 >= total) break
    p += 1
  }
  return null
}

async function load() {
  loading.value = true
  try {
    const id = String(route.params.id)
    order.value = await findOrder(id)
    if (order.value && order.value.items.length) {
      reviewProductId.value = order.value.items[0].product_id
    }
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

async function handlePay() {
  if (!order.value) return
  acting.value = true
  try {
    await payOrder(order.value.id)
    ElMessage.success('支付成功')
    await load()
  } catch {
    // 拦截器已提示
  } finally {
    acting.value = false
  }
}

async function handleCancel() {
  if (!order.value) return
  try {
    await ElMessageBox.confirm('确定取消这笔订单？库存将回滚。', '取消订单', {
      type: 'warning'
    })
  } catch {
    return
  }
  acting.value = true
  try {
    await cancelOrder(order.value.id)
    ElMessage.success('订单已取消')
    await load()
  } catch {
    // 拦截器已提示
  } finally {
    acting.value = false
  }
}

async function handleConfirm() {
  if (!order.value) return
  try {
    await ElMessageBox.confirm('确认已收到商品？', '确认收货', { type: 'info' })
  } catch {
    return
  }
  acting.value = true
  try {
    await confirmOrder(order.value.id)
    ElMessage.success('已确认收货')
    await load()
  } catch {
    // 拦截器已提示
  } finally {
    acting.value = false
  }
}

async function handleRefund() {
  if (!order.value) return
  if (!refundReason.value.trim()) {
    ElMessage.warning('请填写退款原因')
    return
  }
  acting.value = true
  try {
    // 不传 amount —— 后端目前只支持全额退款
    await applyRefund(order.value.id, refundReason.value.trim())
    ElMessage.success('退款申请已提交')
    refundVisible.value = false
    refundReason.value = ''
  } catch {
    // 拦截器已提示
  } finally {
    acting.value = false
  }
}

async function handleReview() {
  if (!order.value || !reviewProductId.value) {
    ElMessage.warning('请选择要评价的商品')
    return
  }
  acting.value = true
  try {
    await submitReview({
      orderId: order.value.id,
      productId: reviewProductId.value,
      rating: reviewRating.value,
      content: reviewContent.value.trim()
    })
    ElMessage.success('评价已提交')
    reviewVisible.value = false
    reviewContent.value = ''
    reviewRating.value = 5
    await load()
  } catch {
    // 拦截器已提示（如「该商品已评价,请勿重复提交」）
  } finally {
    acting.value = false
  }
}

onMounted(() => {
  if (!isLoggedIn()) {
    router.replace({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  load()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-detail-page {
  padding: $spacing-xl 0 $spacing-2xl * 1.5;
  min-height: 70vh;
}

.crumb {
  font-size: $font-size-sm;
  color: $text-disabled;
  letter-spacing: $tracking-wide;
  margin-bottom: $spacing-xl;

  a:hover {
    color: $primary;
  }

  .sep {
    margin: 0 $spacing-sm;
    color: $text-placeholder;
  }
}

// ---------------------------------------------------------- 状态头

.status-head {
  @include flex-between;
  gap: $spacing-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-2xl;
  background: linear-gradient(135deg,
    rgba(61, 90, 128, 0.06) 0%,
    rgba(42, 157, 143, 0.05) 100%);
  border: 1px solid $divider;
  border-radius: $radius-sm;

  @include md {
    flex-direction: column;
    align-items: flex-start;
  }
}

.status-label {
  font-family: $font-display;
  font-size: 30px;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
}

.status-hint {
  margin-top: 4px;
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
}

.status-actions {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

// ---------------------------------------------------------- 区块

.block {
  margin-bottom: $spacing-2xl;
}

.block-title {
  font-family: $font-display;
  font-size: $font-size-xl;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid $divider;
  margin-bottom: $spacing-lg;
}

.item-list {
  border-top: 1px solid $divider;
}

.order-item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 100px 70px 110px;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1px solid $divider;

  @include md {
    grid-template-columns: 64px minmax(0, 1fr) 90px;
  }
}

.item-thumb {
  width: 72px;
  height: 72px;
  background: $bg;
  border: 1px solid $border;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @include md {
    width: 64px;
    height: 64px;
  }
}

.item-title {
  font-family: $font-display;
  font-size: $font-size-lg;
  font-weight: 500;
  color: $text-primary;
  cursor: pointer;
  transition: color $transition;
  @include ellipsis(1);

  &:hover {
    color: $primary;
  }
}

.item-sku {
  margin-top: 4px;
  font-size: $font-size-xs;
  color: $text-disabled;
}

.item-price,
.item-qty {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: right;
}

.item-subtotal {
  font-weight: 600;
  color: $primary-dark;
  text-align: right;
}

// ---------------------------------------------------------- 信息表

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: $spacing-md $spacing-2xl;

  @include md {
    grid-template-columns: 1fr;
  }
}

.info-row {
  display: flex;
  gap: $spacing-md;
  font-size: $font-size-sm;

  &.span-2 {
    grid-column: span 2;

    @include md {
      grid-column: span 1;
    }
  }

  dt {
    flex-shrink: 0;
    width: 72px;
    color: $text-disabled;
    letter-spacing: $tracking-wide;
  }

  dd {
    color: $text-primary;
    line-height: $line-height-normal;

    &.mono {
      font-family: monospace;
      word-break: break-all;
    }
  }
}

.amount-line {
  @include flex-between;
  margin-top: $spacing-xl;
  padding-top: $spacing-md;
  border-top: 1px solid $divider;

  span {
    font-size: $font-size-sm;
    color: $text-secondary;
    letter-spacing: $tracking-wide;
  }

  strong {
    font-size: 26px;
    font-weight: 600;
    color: $accent-red;
  }
}

.skeleton-block {
  height: 260px;
  border-radius: $radius-sm;
}
</style>
