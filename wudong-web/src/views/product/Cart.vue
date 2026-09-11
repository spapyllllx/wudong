<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>

      <div v-loading="loading" class="cart-content">
        <!-- 购物车列表 -->
        <div v-if="cartList.length > 0" class="cart-main">
          <!-- 表头 -->
          <div class="cart-header">
            <el-checkbox v-model="allSelected" @change="handleSelectAll">全选</el-checkbox>
            <span class="header-product">商品信息</span>
            <span class="header-price">单价</span>
            <span class="header-quantity">数量</span>
            <span class="header-total">小计</span>
            <span class="header-action">操作</span>
          </div>

          <!-- 购物车项 -->
          <div class="cart-list">
            <div
              v-for="item in cartList"
              :key="item.id"
              class="cart-item"
              :class="{ unavailable: !item.isAvailable || !item.isInStock }"
            >
              <div class="item-select">
                <el-checkbox
                  :model-value="item.selected === 1"
                  :disabled="!item.isAvailable || !item.isInStock"
                  @change="handleSelectItem(item)"
                />
              </div>

              <div class="item-product" @click="goToDetail(item.productId)">
                <el-image :src="item.currentImage" fit="cover" class="product-image" />
                <div class="product-info">
                  <div class="product-title">{{ item.productTitle }}</div>
                  <div v-if="item.skuName" class="product-sku">规格：{{ item.skuName }}</div>
                  <div v-if="!item.isAvailable" class="product-status error">商品已下架</div>
                  <div v-else-if="!item.isInStock" class="product-status error">库存不足</div>
                </div>
              </div>

              <div class="item-price">
                <span class="current-price">¥{{ item.currentPrice }}</span>
              </div>

              <div class="item-quantity">
                <el-input-number
                  :model-value="item.quantity"
                  :min="1"
                  :max="item.currentStock"
                  :disabled="!item.isAvailable || !item.isInStock"
                  @change="(val) => handleQuantityChange(item, val)"
                />
              </div>

              <div class="item-total">
                <span class="total-price">¥{{ (item.currentPrice * item.quantity).toFixed(2) }}</span>
              </div>

              <div class="item-action">
                <el-button link type="danger" @click="handleRemove(item.id)">删除</el-button>
              </div>
            </div>
          </div>

          <!-- 底部结算栏 -->
          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox v-model="allSelected" @change="handleSelectAll">全选</el-checkbox>
              <el-button link @click="handleBatchDelete">删除选中商品</el-button>
              <el-button link @click="handleClearCart">清空购物车</el-button>
            </div>

            <div class="footer-right">
              <div class="summary">
                <span class="summary-label">已选商品</span>
                <span class="summary-count">{{ selectedCount }}</span>
                <span class="summary-label">件，总计：</span>
                <span class="summary-total">¥{{ totalPrice.toFixed(2) }}</span>
              </div>
              <el-button type="primary" size="large" :disabled="selectedCount === 0" @click="handleCheckout">
                去结算
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="购物车是空的">
          <el-button type="primary" @click="router.push('/product')">去逛逛</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCartList,
  updateCartQuantity,
  updateCartSelected,
  selectAllCart,
  removeFromCart,
  batchRemoveCart,
  clearCart,
  type CartItem
} from '@/api/cart'

const router = useRouter()

const loading = ref(false)
const cartList = ref<CartItem[]>([])

// 全选状态
const allSelected = computed({
  get: () => {
    const availableItems = cartList.value.filter(item => item.isAvailable && item.isInStock)
    return availableItems.length > 0 && availableItems.every(item => item.selected === 1)
  },
  set: () => {}
})

// 已选商品数量
const selectedCount = computed(() => {
  return cartList.value.filter(item => item.selected === 1).length
})

// 总价
const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected === 1)
    .reduce((total, item) => total + item.currentPrice * item.quantity, 0)
})

// 加载购物车列表
async function loadCartList() {
  loading.value = true
  try {
    cartList.value = await getCartList()
  } catch (error: any) {
    console.error('加载购物车失败:', error)
    ElMessage.error(error.message || '加载购物车失败')
  } finally {
    loading.value = false
  }
}

// 全选/取消全选
async function handleSelectAll() {
  const selected = allSelected.value ? 0 : 1
  try {
    await selectAllCart(selected)
    await loadCartList()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 选中/取消选中单个商品
async function handleSelectItem(item: CartItem) {
  const selected = item.selected === 1 ? 0 : 1
  try {
    await updateCartSelected(item.id, selected)
    item.selected = selected
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 修改数量
async function handleQuantityChange(item: CartItem, quantity: number | undefined) {
  if (!quantity) return

  try {
    await updateCartQuantity(item.id, quantity)
    item.quantity = quantity
    ElMessage.success('数量已更新')
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
    await loadCartList()
  }
}

// 删除单个商品
async function handleRemove(id: number) {
  try {
    await ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await removeFromCart(id)
    ElMessage.success('删除成功')
    await loadCartList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 批量删除
async function handleBatchDelete() {
  const selectedItems = cartList.value.filter(item => item.selected === 1)
  if (selectedItems.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedItems.length} 件商品吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const ids = selectedItems.map(item => item.id)
    await batchRemoveCart(ids)
    ElMessage.success('删除成功')
    await loadCartList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 清空购物车
async function handleClearCart() {
  if (cartList.value.length === 0) {
    return
  }

  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await clearCart()
    ElMessage.success('购物车已清空')
    cartList.value = []
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '清空失败')
    }
  }
}

// 去结算
function handleCheckout() {
  const selectedItems = cartList.value.filter(item => item.selected === 1)

  if (selectedItems.length === 0) {
    ElMessage.warning('请先选择要结算的商品')
    return
  }

  // 检查是否有不可用的商品
  const unavailableItems = selectedItems.filter(item => !item.isAvailable || !item.isInStock)
  if (unavailableItems.length > 0) {
    ElMessage.warning('选中的商品中有已下架或库存不足的商品，请重新选择')
    return
  }

  // 跳转到订单确认页，传递选中的商品
  router.push({
    path: '/order/confirm',
    query: {
      from: 'cart'
    }
  })
}

// 跳转到商品详情
function goToDetail(productId: number) {
  router.push(`/product/${productId}`)
}

onMounted(() => {
  loadCartList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.cart-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

.cart-content {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.cart-main {
  .cart-header {
    display: grid;
    grid-template-columns: 50px 1fr 120px 150px 120px 80px;
    align-items: center;
    padding: $spacing-md;
    background: $bg;
    border-radius: $radius;
    margin-bottom: $spacing-md;
    font-weight: 500;

    .header-product {
      padding-left: $spacing-md;
    }
  }

  .cart-list {
    .cart-item {
      display: grid;
      grid-template-columns: 50px 1fr 120px 150px 120px 80px;
      align-items: center;
      padding: $spacing-lg 0;
      border-bottom: 1px solid $border;

      &:last-child {
        border-bottom: none;
      }

      &.unavailable {
        opacity: 0.6;
      }

      .item-select {
        @include flex-center;
      }

      .item-product {
        display: flex;
        gap: $spacing-md;
        padding: 0 $spacing-md;
        cursor: pointer;

        &:hover {
          .product-title {
            color: $primary;
          }
        }

        .product-image {
          width: 100px;
          height: 100px;
          border-radius: $radius;
          flex-shrink: 0;
        }

        .product-info {
          flex: 1;

          .product-title {
            font-size: $font-size;
            font-weight: 500;
            margin-bottom: $spacing-xs;
            @include ellipsis(2);
            transition: color 0.3s;
          }

          .product-sku {
            color: $text-secondary;
            font-size: $font-size-sm;
            margin-bottom: $spacing-xs;
          }

          .product-status {
            font-size: $font-size-sm;

            &.error {
              color: $danger;
            }
          }
        }
      }

      .item-price {
        text-align: center;

        .current-price {
          font-size: $font-size-lg;
          color: $danger;
          font-weight: 500;
        }
      }

      .item-quantity {
        @include flex-center;
      }

      .item-total {
        text-align: center;

        .total-price {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }
      }

      .item-action {
        @include flex-center;
      }
    }
  }

  .cart-footer {
    @include flex-between;
    padding: $spacing-lg;
    background: $bg;
    border-radius: $radius;
    margin-top: $spacing-lg;

    .footer-left {
      display: flex;
      align-items: center;
      gap: $spacing-lg;
    }

    .footer-right {
      display: flex;
      align-items: center;
      gap: $spacing-xl;

      .summary {
        font-size: $font-size;

        .summary-label {
          color: $text-secondary;
        }

        .summary-count {
          color: $danger;
          font-weight: 600;
          margin: 0 $spacing-xs;
        }

        .summary-total {
          font-size: 24px;
          font-weight: 600;
          color: $danger;
          margin-left: $spacing-sm;
        }
      }
    }
  }
}

@include md {
  .cart-header,
  .cart-item {
    grid-template-columns: 40px 1fr 100px 120px 100px 60px;
    font-size: $font-size-sm;

    .item-product {
      .product-image {
        width: 80px;
        height: 80px;
      }
    }
  }

  .cart-footer {
    flex-direction: column;
    gap: $spacing-md;
    align-items: stretch;

    .footer-left,
    .footer-right {
      justify-content: center;
    }
  }
}
</style>
