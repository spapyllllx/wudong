<template>
  <div class="cart-page">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">SHOPPING CART</p>
        <h1 class="page-title">购物车</h1>
      </header>

      <div v-if="loading" class="cart-skeleton">
        <div v-for="i in 3" :key="i" class="skeleton skeleton-row"></div>
      </div>

      <el-empty
        v-else-if="items.length === 0"
        description="购物车还是空的"
        :image-size="140"
      >
        <el-button type="primary" @click="router.push('/product')">
          去看看非遗好物
        </el-button>
      </el-empty>

      <div v-else class="cart-layout">
        <!-- 列表 -->
        <div class="cart-main">
          <div class="list-head">
            <el-checkbox
              :model-value="allSelectableSelected"
              :indeterminate="someSelected"
              @change="toggleAll"
            >
              全选
            </el-checkbox>
            <span class="head-hint">共 {{ items.length }} 件</span>
          </div>

          <ul class="cart-list">
            <li
              v-for="item in items"
              :key="item.id"
              class="cart-item"
              :class="{ disabled: !isSelectable(item) }"
            >
              <el-checkbox
                :model-value="selectedIds.has(item.id)"
                :disabled="!isSelectable(item)"
                @change="(v: any) => toggleOne(item.id, v)"
              />

              <div class="item-thumb" @click="goProduct(item)">
                <img :src="resolveImage(item.main_image)" :alt="item.title" />
              </div>

              <div class="item-info">
                <h3 class="item-title" @click="goProduct(item)">
                  {{ item.title }}
                </h3>
                <p v-if="item.sku_name" class="item-sku">{{ item.sku_name }}</p>
                <p v-if="statusText(item)" class="item-status">{{ statusText(item) }}</p>
              </div>

              <div class="item-price">{{ formatPrice(item.price ?? 0) }}</div>

              <div class="item-qty">
                <el-input-number
                  :model-value="item.quantity"
                  :min="1"
                  :max="Math.max(item.sku_stock ?? 1, 1)"
                  :disabled="!isSelectable(item) || updatingId === item.id"
                  size="small"
                  @change="(v: any) => changeQuantity(item, v)"
                />
              </div>

              <div class="item-subtotal">
                {{ formatPrice(subtotal(item)) }}
              </div>

              <button class="item-remove" title="移除" @click="removeOne(item)">
                <el-icon><Delete /></el-icon>
              </button>
            </li>
          </ul>
        </div>

        <!-- 结算 -->
        <aside class="cart-aside">
          <div class="summary">
            <h2 class="summary-title">结算</h2>

            <dl class="summary-rows">
              <div class="row">
                <dt>已选</dt>
                <dd>{{ selectedItems.length }} 件</dd>
              </div>
              <div class="row">
                <dt>商品金额</dt>
                <dd>{{ formatPrice(selectedTotal) }}</dd>
              </div>
              <div class="row">
                <dt>运费</dt>
                <dd class="muted">免运费</dd>
              </div>
            </dl>

            <div class="summary-total">
              <span>合计</span>
              <strong>{{ formatPrice(selectedTotal) }}</strong>
            </div>

            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :disabled="selectedItems.length === 0"
              @click="handleCheckout"
            >
              去结算
            </el-button>

            <button class="clear-btn" @click="removeSelected">删除选中</button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type CheckboxValueType } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import {
  getCartList,
  updateCartQuantity,
  removeCartItems,
  type CartItem
} from '@/api/cart'
import { formatPrice } from '@/utils/format'
import { resolveImage } from '@/utils/image'
import { setCheckoutItems } from '@/utils/checkout'

const router = useRouter()

const items = ref<CartItem[]>([])
const loading = ref(true)
const updatingId = ref<number | null>(null)
/** 勾选是本地状态：后端有 selected 字段但没有更新它的接口 */
const selectedIds = ref<Set<number>>(new Set())

/** 下架或售罄的项不可结算 */
function isSelectable(item: CartItem) {
  return !item.invalid && !item.sold_out && item.sku_id !== null
}

const selectableItems = computed(() => items.value.filter(isSelectable))

const selectedItems = computed(() =>
  items.value.filter((i) => selectedIds.value.has(i.id) && isSelectable(i))
)

const allSelectableSelected = computed(
  () =>
    selectableItems.value.length > 0 &&
    selectableItems.value.every((i) => selectedIds.value.has(i.id))
)

const someSelected = computed(
  () =>
    selectableItems.value.some((i) => selectedIds.value.has(i.id)) &&
    !allSelectableSelected.value
)

const selectedTotal = computed(() =>
  selectedItems.value.reduce((sum, i) => sum + subtotal(i), 0)
)

function subtotal(item: CartItem) {
  return (item.price || 0) * item.quantity
}

function statusText(item: CartItem) {
  if (item.invalid) return '商品已下架'
  if (item.sold_out) return '已售罄'
  return ''
}

async function load() {
  loading.value = true
  try {
    const list = await getCartList()
    items.value = list || []
    // 默认勾选后端标记为 selected 且可结算的项
    const next = new Set<number>()
    for (const i of items.value) {
      if (i.selected && isSelectable(i)) next.add(i.id)
    }
    // 若一条都没勾上，则默认全选可结算项，避免进来就是"未选"的空状态
    if (next.size === 0) {
      for (const i of selectableItems.value) next.add(i.id)
    }
    selectedIds.value = next
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function toggleOne(id: number, checked: boolean) {
  const next = new Set(selectedIds.value)
  if (checked) next.add(id)
  else next.delete(id)
  selectedIds.value = next
}

// el-checkbox 的 change 回调参数类型是 CheckboxValueType（boolean | string | number）
function toggleAll(checked: CheckboxValueType) {
  const next = new Set(selectedIds.value)
  for (const i of selectableItems.value) {
    if (checked === true) next.add(i.id)
    else next.delete(i.id)
  }
  selectedIds.value = next
}

async function changeQuantity(item: CartItem, value: number | undefined) {
  if (!value || value === item.quantity) return
  updatingId.value = item.id
  try {
    await updateCartQuantity(item.id, value)
    item.quantity = value
  } catch {
    // 拦截器已提示（如「库存不足,仅剩 N」），重新拉取以恢复真实数量
    await load()
  } finally {
    updatingId.value = null
  }
}

async function removeOne(item: CartItem) {
  try {
    await ElMessageBox.confirm(`确定从购物车移除「${item.title}」？`, '提示', {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await removeCartItems([item.id])
    ElMessage.success('已移除')
    await load()
  } catch {
    // 拦截器已提示
  }
}

async function removeSelected() {
  const ids = selectedItems.value.map((i) => i.id)
  if (ids.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${ids.length} 件商品？`, '提示', {
      type: 'warning'
    })
  } catch {
    return
  }
  try {
    await removeCartItems(ids)
    ElMessage.success('已删除')
    await load()
  } catch {
    // 拦截器已提示
  }
}

function goProduct(item: CartItem) {
  router.push(`/product/${item.product_id}`)
}

/**
 * 去结算：把选中项带到确认订单页。
 * 购物车结算不是独立接口，后端统一走 order/create 的 items 数组。
 */
function handleCheckout() {
  const chosen = selectedItems.value
  if (chosen.length === 0) return

  setCheckoutItems(
    chosen.map((i) => ({
      skuId: i.sku_id as number,
      quantity: i.quantity,
      productId: i.product_id,
      title: i.title,
      image: i.main_image,
      skuName: i.sku_name,
      price: i.price || 0
    })),
    chosen.map((i) => i.id)
  )

  router.push({ path: '/order/confirm' })
}

onMounted(load)
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.cart-page {
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

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: $spacing-2xl;
  align-items: start;

  @include lg {
    grid-template-columns: 1fr;
  }
}

// ---------------------------------------------------------- 列表

.list-head {
  @include flex-between;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $border;
  margin-bottom: $spacing-sm;

  .head-hint {
    font-size: $font-size-sm;
    color: $text-disabled;
    letter-spacing: $tracking-wide;
  }
}

.cart-list {
  border-top: 1px solid $divider;
}

.cart-item {
  display: grid;
  grid-template-columns: 32px 88px minmax(0, 1fr) 90px 120px 100px 40px;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg 0;
  border-bottom: 1px solid $divider;

  &.disabled {
    opacity: 0.55;
  }

  @include lg {
    grid-template-columns: 32px 72px minmax(0, 1fr) 100px 40px;
  }

  @include md {
    grid-template-columns: 28px 64px minmax(0, 1fr) 32px;
    row-gap: $spacing-sm;
  }
}

.item-thumb {
  width: 88px;
  height: 88px;
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

  @include lg {
    width: 72px;
    height: 72px;
  }

  @include md {
    width: 64px;
    height: 64px;
  }
}

.item-info {
  min-width: 0;
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
  letter-spacing: $tracking-wide;
}

.item-status {
  margin-top: 4px;
  font-size: $font-size-xs;
  color: $danger;
}

.item-price,
.item-subtotal {
  font-size: $font-size;
  color: $text-secondary;
  text-align: right;
}

.item-subtotal {
  font-weight: 600;
  color: $primary-dark;
}

.item-remove {
  color: $text-disabled;
  font-size: 16px;
  transition: color $transition;
  justify-self: end;

  &:hover {
    color: $danger;
  }
}

// ---------------------------------------------------------- 结算侧栏

.cart-aside {
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

.summary-rows {
  .row {
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

.clear-btn {
  display: block;
  width: 100%;
  margin-top: $spacing; // 12px
  font-size: $font-size-xs;
  color: $text-disabled;
  letter-spacing: $tracking-wide;
  transition: color $transition;

  &:hover {
    color: $danger;
  }
}

// ---------------------------------------------------------- 骨架

.cart-skeleton {
  .skeleton-row {
    height: 120px;
    margin-bottom: $spacing-md;
    border-radius: $radius-sm;
  }
}
</style>
