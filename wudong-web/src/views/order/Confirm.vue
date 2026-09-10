<template>
  <div class="confirm-page">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">CHECKOUT</p>
        <h1 class="page-title">确认订单</h1>
      </header>

      <el-empty
        v-if="items.length === 0"
        description="没有待结算的商品"
        :image-size="140"
      >
        <el-button type="primary" @click="router.push('/product')">
          去挑选商品
        </el-button>
      </el-empty>

      <div v-else class="confirm-layout">
        <div class="confirm-main">
          <!-- 收货地址 -->
          <section class="block">
            <h2 class="block-title">收货地址</h2>

            <div v-if="addresses.length && !useNewAddress" class="address-list">
              <button
                v-for="addr in addresses"
                :key="addr.id"
                class="address-card"
                :class="{ active: selectedAddressId === addr.id }"
                @click="selectedAddressId = addr.id!"
              >
                <div class="addr-head">
                  <span class="addr-contact">{{ addr.contact }}</span>
                  <span class="addr-phone">{{ maskPhone(addr.phone) }}</span>
                  <span v-if="addr.isDefault" class="addr-tag">默认</span>
                </div>
                <p class="addr-detail">
                  {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.address }}
                </p>
              </button>

              <button class="address-card new-addr" @click="useNewAddress = true">
                + 使用新地址
              </button>
            </div>

            <!-- 手动填写（无地址簿时自动展开） -->
            <el-form
              v-if="useNewAddress || addresses.length === 0"
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="80px"
              class="address-form"
            >
              <el-form-item label="收货人" prop="consignee">
                <el-input v-model="form.consignee" placeholder="请输入收货人姓名" maxlength="50" />
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" placeholder="11 位手机号" maxlength="11" />
              </el-form-item>
              <el-form-item label="所在地区" prop="region">
                <div class="region-row">
                  <el-input v-model="form.province" placeholder="省" />
                  <el-input v-model="form.city" placeholder="市" />
                  <el-input v-model="form.district" placeholder="区/县" />
                </div>
              </el-form-item>
              <el-form-item label="详细地址" prop="detail">
                <el-input
                  v-model="form.detail"
                  type="textarea"
                  :rows="2"
                  placeholder="街道、门牌号等"
                  maxlength="255"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item v-if="addresses.length">
                <el-button link type="primary" @click="useNewAddress = false">
                  返回选择已有地址
                </el-button>
              </el-form-item>
            </el-form>
          </section>

          <!-- 商品清单 -->
          <section class="block">
            <h2 class="block-title">商品清单</h2>
            <ul class="item-list">
              <li v-for="item in items" :key="item.skuId" class="order-item">
                <div class="item-thumb">
                  <img :src="resolveImage(item.image)" :alt="item.title" />
                </div>
                <div class="item-info">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p v-if="item.skuName" class="item-sku">{{ item.skuName }}</p>
                </div>
                <div class="item-price">{{ formatPrice(item.price) }}</div>
                <div class="item-qty">× {{ item.quantity }}</div>
                <div class="item-subtotal">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </li>
            </ul>
          </section>

          <!-- 备注 -->
          <section class="block">
            <h2 class="block-title">订单备注</h2>
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              maxlength="255"
              placeholder="选填，如对包装、发货时间的要求"
            />
          </section>
        </div>

        <!-- 汇总 -->
        <aside class="confirm-aside">
          <div class="summary">
            <h2 class="summary-title">订单汇总</h2>
            <dl class="summary-rows">
              <div class="row">
                <dt>商品件数</dt>
                <dd>{{ totalQuantity }} 件</dd>
              </div>
              <div class="row">
                <dt>商品金额</dt>
                <dd>{{ formatPrice(totalAmount) }}</dd>
              </div>
              <div class="row">
                <dt>运费</dt>
                <dd class="muted">免运费</dd>
              </div>
            </dl>
            <div class="summary-total">
              <span>应付</span>
              <strong>{{ formatPrice(totalAmount) }}</strong>
            </div>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="submitting"
              @click="handleSubmit"
            >
              提交订单
            </el-button>
            <p class="pay-hint">提交后可立即使用模拟支付完成付款</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { createOrder, payOrder } from '@/api/order'
import { getAddressList, type Address } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { formatPrice, maskPhone } from '@/utils/format'
import { resolveImage } from '@/utils/image'
import {
  getCheckoutItems,
  getCheckoutCartIds,
  clearCheckout,
  type CheckoutItem
} from '@/utils/checkout'
import { removeCartItems } from '@/api/cart'
import { isLoggedIn } from '@/utils/auth'

const router = useRouter()
const userStore = useUserStore()

const items = ref<CheckoutItem[]>([])
const addresses = ref<Address[]>([])
const selectedAddressId = ref<number | null>(null)
const useNewAddress = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  remark: ''
})

const rules: FormRules = {
  consignee: [
    { required: true, message: '请填写收货人', trigger: 'blur' },
    { max: 50, message: '收货人不能超过 50 字', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请填写手机号', trigger: 'blur' },
    // 后端校验是 /^1\d{10}$/
    { pattern: /^1\d{10}$/, message: '手机号需为 11 位数字', trigger: 'blur' }
  ],
  detail: [
    { required: true, message: '请填写详细地址', trigger: 'blur' },
    { max: 255, message: '详细地址不能超过 255 字', trigger: 'blur' }
  ]
}

const totalQuantity = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
const totalAmount = computed(() =>
  items.value.reduce((s, i) => s + i.price * i.quantity, 0)
)

const selectedAddress = computed(
  () => addresses.value.find((a) => a.id === selectedAddressId.value) || null
)

async function loadAddresses() {
  try {
    const list = await getAddressList()
    addresses.value = list || []
    const def = addresses.value.find((a) => a.isDefault) || addresses.value[0]
    selectedAddressId.value = def?.id ?? null
    // 地址簿为空时直接展开手动填写
    useNewAddress.value = addresses.value.length === 0
  } catch {
    addresses.value = []
    useNewAddress.value = true
  }
}

async function handleSubmit() {
  if (items.value.length === 0) return

  // 组装收货信息：优先用选中的地址簿条目，否则用表单
  let payload: {
    consignee: string
    phone: string
    province?: string
    city?: string
    district?: string
    detail: string
  }

  if (!useNewAddress.value && selectedAddress.value) {
    const a = selectedAddress.value
    payload = {
      // 地址簿字段名与下单字段名不同，这里做映射
      consignee: a.contact,
      phone: a.phone,
      province: a.province,
      city: a.city,
      district: a.district,
      detail: a.address
    }
  } else {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    payload = {
      consignee: form.consignee.trim(),
      phone: form.phone.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      detail: form.detail.trim()
    }
  }

  submitting.value = true
  try {
    const orderId = await createOrder({
      ...payload,
      remark: form.remark.trim(),
      items: items.value.map((i) => ({ skuId: i.skuId, quantity: i.quantity }))
    })

    // 购物车下单成功后，清掉已结算的行
    const cartIds = getCheckoutCartIds()
    if (cartIds.length) {
      removeCartItems(cartIds).catch(() => {
        /* 清理失败不影响下单结果 */
      })
    }
    clearCheckout()

    // 询问是否立即支付
    try {
      await ElMessageBox.confirm('订单已创建，是否立即支付？', '提交成功', {
        confirmButtonText: '立即支付',
        cancelButtonText: '稍后支付',
        type: 'success'
      })
    } catch {
      ElMessage.success('订单已创建，可在「我的订单」中继续支付')
      router.replace(`/order/${orderId}`)
      return
    }

    try {
      await payOrder(orderId)
      ElMessage.success('支付成功')
    } catch {
      // 支付失败也已创建订单，跳详情页让用户重试
    }
    router.replace(`/order/${orderId}`)
  } catch {
    // 拦截器已提示（如库存不足、手机号格式）
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (!isLoggedIn()) {
    router.replace({ path: '/login', query: { redirect: '/order/confirm' } })
    return
  }
  // 确保有用户信息（页头昵称等）
  if (!userStore.userInfo) userStore.fetchUser().catch(() => {})

  items.value = getCheckoutItems()
  if (items.value.length) loadAddresses()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.confirm-page {
  padding: $spacing-2xl 0 $spacing-2xl * 1.5;
  min-height: 70vh;
}

.page-head {
  margin-bottom: $spacing-2xl;
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

.confirm-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: $spacing-2xl;
  align-items: start;

  @include lg {
    grid-template-columns: 1fr;
  }
}

.block {
  margin-bottom: $spacing-2xl;

  &:last-child {
    margin-bottom: 0;
  }
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

// ---------------------------------------------------------- 地址

.address-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;

  @include md {
    grid-template-columns: 1fr;
  }
}

.address-card {
  text-align: left;
  padding: $spacing-md;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: 2px;
  transition: all $transition;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary;
    background: rgba(61, 90, 128, 0.05);
  }

  &.new-addr {
    @include flex-center;
    color: $primary;
    font-size: $font-size-sm;
    letter-spacing: $tracking-wide;
    border-style: dashed;
    min-height: 84px;
  }
}

.addr-head {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;

  .addr-contact {
    font-weight: 600;
    color: $text-primary;
  }

  .addr-phone {
    font-size: $font-size-sm;
    color: $text-secondary;
  }

  .addr-tag {
    font-size: 11px;
    padding: 1px 6px;
    color: $primary;
    border: 1px solid $primary-lighter;
    border-radius: 2px;
  }
}

.addr-detail {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: $line-height-normal;
}

.address-form {
  max-width: 620px;
}

.region-row {
  display: flex;
  gap: $spacing-sm;
  width: 100%;
}

// ---------------------------------------------------------- 商品清单

.item-list {
  border-top: 1px solid $divider;
}

.order-item {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 90px 70px 100px;
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
  font-size: $font-size;
  font-weight: 500;
  color: $text-primary;
  @include ellipsis(1);
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

// ---------------------------------------------------------- 汇总

.confirm-aside {
  position: sticky;
  top: 88px;

  @include lg {
    position: static;
  }
}

.summary {
  padding: $spacing-xl;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: $radius-sm;
}

.summary-title {
  font-family: $font-display;
  font-size: $font-size-xl;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $divider;
  margin-bottom: $spacing-md;
}

.summary-rows .row {
  @include flex-between;
  padding: $spacing-sm 0;
  font-size: $font-size-sm;

  dt {
    color: $text-secondary;
  }

  dd {
    color: $text-primary;

    &.muted {
      color: $text-disabled;
    }
  }
}

.summary-total {
  @include flex-between;
  margin-top: $spacing-md;
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

.summary :deep(.el-button) {
  margin-top: $spacing-lg;
}

.pay-hint {
  margin-top: $spacing-sm;
  font-size: $font-size-xs;
  color: $text-disabled;
  text-align: center;
}
</style>
