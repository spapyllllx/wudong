<template>
  <div class="product-detail">
    <div class="container" v-loading="loading">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <el-button @click="router.back()" icon="ArrowLeft">返回</el-button>
      </div>

      <div v-if="product" class="detail-content">
        <!-- 商品主要信息 -->
        <div class="product-main">
          <!-- 左侧：图片展示 -->
          <div class="product-images">
            <div class="main-image">
              <el-image :src="currentImage" fit="cover" :preview-src-list="imageList" />
            </div>
            <div class="image-list" v-if="imageList.length > 1">
              <div
                v-for="(img, index) in imageList"
                :key="index"
                class="image-item"
                :class="{ active: currentImage === img }"
                @click="currentImage = img"
              >
                <el-image :src="img" fit="cover" />
              </div>
            </div>
          </div>

          <!-- 右侧：商品信息 -->
          <div class="product-info">
            <h1 class="product-title">{{ product.title }}</h1>
            <p class="product-subtitle" v-if="product.subtitle">{{ product.subtitle }}</p>

            <!-- 价格区域 -->
            <div class="price-section">
              <div class="price-main">
                <span class="label">价格：</span>
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-meta">
                <span>销量：{{ product.sales }}</span>
                <span>库存：{{ product.stock }}</span>
                <span>评分：{{ product.rating }}分</span>
              </div>
            </div>

            <!-- SKU选择 -->
            <div class="sku-section" v-if="product.skus && product.skus.length > 0">
              <div class="sku-label">规格：</div>
              <div class="sku-options">
                <div
                  v-for="sku in product.skus"
                  :key="sku.id"
                  class="sku-item"
                  :class="{ active: selectedSku?.id === sku.id, disabled: sku.stock <= 0 }"
                  @click="selectSku(sku)"
                >
                  {{ sku.specName }}
                  <span v-if="sku.stock <= 0" class="out-of-stock">缺货</span>
                </div>
              </div>
            </div>

            <!-- 数量选择 -->
            <div class="quantity-section">
              <span class="label">数量：</span>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="maxQuantity"
                size="large"
              />
              <span class="stock-hint">库存{{ maxQuantity }}件</span>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="handleAddToCart">
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </el-button>
              <el-button size="large" @click="handleBuyNow">
                立即购买
              </el-button>
              <el-button
                :icon="product.isFavorited ? 'StarFilled' : 'Star'"
                size="large"
                @click="handleToggleFavorite"
              >
                {{ product.isFavorited ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 详情Tabs -->
        <div class="product-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="商品详情" name="detail">
              <div class="detail-content" v-html="product.detail || '暂无详情'"></div>
            </el-tab-pane>
            <el-tab-pane label="商品评价" name="review">
              <div class="review-section">
                <div class="review-summary">
                  <div class="summary-score">
                    <div class="score-number">{{ product.rating }}</div>
                    <el-rate v-model="product.rating" disabled show-score />
                    <div class="review-count">{{ product.reviewCount }} 条评价</div>
                  </div>
                </div>

                <!-- 评价列表 -->
                <div class="review-list" v-loading="reviewLoading">
                  <div v-for="review in reviews" :key="review.id" class="review-item">
                    <div class="review-header">
                      <el-avatar :src="review.userAvatar">{{ review.userNickName?.[0] }}</el-avatar>
                      <div class="review-user">
                        <div class="user-name">{{ review.userNickName }}</div>
                        <el-rate v-model="review.rating" disabled size="small" />
                      </div>
                      <div class="review-time">{{ review.createTime }}</div>
                    </div>
                    <div class="review-content">{{ review.content }}</div>
                    <div class="review-images" v-if="review.images && review.images.length > 0">
                      <el-image
                        v-for="(img, index) in review.images"
                        :key="index"
                        :src="img"
                        :preview-src-list="review.images"
                        fit="cover"
                      />
                    </div>
                  </div>

                  <el-empty v-if="reviews.length === 0 && !reviewLoading" description="暂无评价" />

                  <div class="pagination" v-if="reviewTotal > 0">
                    <el-pagination
                      v-model:current-page="reviewPage"
                      :page-size="reviewPageSize"
                      :total="reviewTotal"
                      layout="prev, pager, next"
                      @current-change="loadReviews"
                    />
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!product && !loading" description="商品不存在" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductDetail, favoriteProduct, unfavoriteProduct, getProductReviews } from '@/api/product'
import { addToCart } from '@/api/cart'
import type { Product, ProductSku, ProductReview } from '@/api/product'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const product = ref<Product | null>(null)
const currentImage = ref('')
const selectedSku = ref<ProductSku | null>(null)
const quantity = ref(1)
const activeTab = ref('detail')

// 评价相关
const reviewLoading = ref(false)
const reviews = ref<ProductReview[]>([])
const reviewPage = ref(1)
const reviewPageSize = ref(10)
const reviewTotal = ref(0)

// 图片列表
const imageList = computed(() => {
  if (!product.value) return []
  return product.value.images || [product.value.mainImage]
})

// 最大可购买数量
const maxQuantity = computed(() => {
  if (selectedSku.value) {
    return selectedSku.value.stock
  }
  return product.value?.stock || 0
})

// 加载商品详情
async function loadProductDetail() {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('商品ID无效')
    return
  }

  loading.value = true
  try {
    product.value = await getProductDetail(id)
    currentImage.value = product.value.mainImage

    // 如果有SKU，默认选中第一个有库存的
    if (product.value.skus && product.value.skus.length > 0) {
      const availableSku = product.value.skus.find(sku => sku.stock > 0)
      if (availableSku) {
        selectedSku.value = availableSku
      }
    }
  } catch (error: any) {
    console.error('加载商品详情失败:', error)
    ElMessage.error(error.message || '加载商品详情失败')
  } finally {
    loading.value = false
  }
}

// 加载评价列表
async function loadReviews() {
  if (!product.value) return

  reviewLoading.value = true
  try {
    const result = await getProductReviews(product.value.id, {
      page: reviewPage.value,
      size: reviewPageSize.value
    })
    reviews.value = result.list
    reviewTotal.value = result.pagination.total
  } catch (error: any) {
    console.error('加载评价失败:', error)
  } finally {
    reviewLoading.value = false
  }
}

// 选择SKU
function selectSku(sku: ProductSku) {
  if (sku.stock <= 0) {
    ElMessage.warning('该规格已售罄')
    return
  }
  selectedSku.value = sku
}

// 加入购物车
async function handleAddToCart() {
  if (!product.value) return

  if (product.value.stock <= 0) {
    ElMessage.warning('商品已售罄')
    return
  }

  if (selectedSku.value && selectedSku.value.stock <= 0) {
    ElMessage.warning('所选规格已售罄')
    return
  }

  try {
    await addToCart({
      productId: product.value.id,
      skuId: selectedSku.value?.id,
      quantity: quantity.value
    })
    ElMessage.success('已加入购物车')
  } catch (error: any) {
    ElMessage.error(error.message || '加入购物车失败')
  }
}

// 立即购买
function handleBuyNow() {
  if (!product.value) return

  if (product.value.stock <= 0) {
    ElMessage.warning('商品已售罄')
    return
  }

  if (selectedSku.value && selectedSku.value.stock <= 0) {
    ElMessage.warning('所选规格已售罄')
    return
  }

  // 构造购买参数并跳转到订单确认页
  const buyData = {
    items: [{
      productId: product.value.id,
      productTitle: product.value.title,
      productImage: product.value.mainImage,
      skuId: selectedSku.value?.id || null,
      skuName: selectedSku.value?.specName || null,
      currentPrice: selectedSku.value?.price || product.value.price,
      currentImage: product.value.mainImage,
      quantity: quantity.value
    }]
  }

  // 将数据存储到 sessionStorage，跳转到订单确认页
  sessionStorage.setItem('buyNowData', JSON.stringify(buyData))
  router.push('/order/confirm')
}

// 切换收藏
async function handleToggleFavorite() {
  if (!product.value) return

  try {
    if (product.value.isFavorited) {
      await unfavoriteProduct(product.value.id)
      product.value.isFavorited = false
      ElMessage.success('取消收藏')
    } else {
      await favoriteProduct(product.value.id)
      product.value.isFavorited = true
      ElMessage.success('收藏成功')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

onMounted(() => {
  loadProductDetail()
  // 切换到评价Tab时再加载
  // loadReviews()
})

// 监听Tab切换
function handleTabChange() {
  if (activeTab.value === 'review' && reviews.value.length === 0) {
    loadReviews()
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.product-detail {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-xl 0;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.detail-content {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-2xl;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-2xl;
  margin-bottom: $spacing-2xl;
}

// 图片展示
.product-images {
  .main-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: $radius-lg;
    overflow: hidden;
    margin-bottom: $spacing-md;

    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .image-list {
    display: flex;
    gap: $spacing-sm;

    .image-item {
      width: 80px;
      height: 80px;
      border-radius: $radius;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s;

      &:hover {
        border-color: $primary;
      }

      &.active {
        border-color: $primary;
      }

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

// 商品信息
.product-info {
  .product-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: $spacing-sm;
  }

  .product-subtitle {
    color: $text-secondary;
    margin-bottom: $spacing-lg;
  }

  .price-section {
    background: linear-gradient(135deg, rgba(230, 57, 70, 0.05), rgba(244, 162, 97, 0.05));
    padding: $spacing-lg;
    border-radius: $radius-lg;
    margin-bottom: $spacing-lg;

    .price-main {
      margin-bottom: $spacing-sm;

      .label {
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .current-price {
        font-size: 32px;
        font-weight: 600;
        color: $danger;
        margin: 0 $spacing-sm;
      }

      .original-price {
        font-size: $font-size;
        color: $text-secondary;
        text-decoration: line-through;
      }
    }

    .product-meta {
      display: flex;
      gap: $spacing-lg;
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }

  .sku-section,
  .quantity-section {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-lg;

    .label,
    .sku-label {
      min-width: 80px;
      color: $text-secondary;
    }

    .sku-options {
      display: flex;
      gap: $spacing-sm;
      flex-wrap: wrap;

      .sku-item {
        padding: $spacing-sm $spacing-md;
        border: 1px solid $border;
        border-radius: $radius;
        cursor: pointer;
        transition: all 0.3s;

        &:hover:not(.disabled) {
          border-color: $primary;
          color: $primary;
        }

        &.active {
          border-color: $primary;
          background: rgba($primary, 0.1);
          color: $primary;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;

          .out-of-stock {
            color: $danger;
            margin-left: $spacing-xs;
            font-size: $font-size-xs;
          }
        }
      }
    }

    .stock-hint {
      margin-left: $spacing-md;
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }

  .action-buttons {
    display: flex;
    gap: $spacing-md;
    margin-top: $spacing-2xl;
  }
}

// 详情Tabs
.product-tabs {
  margin-top: $spacing-2xl;

  .detail-content {
    padding: $spacing-lg;
    line-height: 1.8;
  }
}

// 评价区域
.review-section {
  .review-summary {
    padding: $spacing-lg;
    background: $bg;
    border-radius: $radius-lg;
    margin-bottom: $spacing-lg;

    .summary-score {
      text-align: center;

      .score-number {
        font-size: 48px;
        font-weight: 600;
        color: $warning;
        margin-bottom: $spacing-sm;
      }

      .review-count {
        color: $text-secondary;
        margin-top: $spacing-sm;
      }
    }
  }

  .review-list {
    .review-item {
      padding: $spacing-lg;
      border-bottom: 1px solid $border;

      &:last-child {
        border-bottom: none;
      }

      .review-header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        margin-bottom: $spacing-md;

        .review-user {
          flex: 1;

          .user-name {
            font-weight: 500;
            margin-bottom: $spacing-xs;
          }
        }

        .review-time {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }

      .review-content {
        margin-bottom: $spacing-md;
        line-height: 1.6;
      }

      .review-images {
        display: flex;
        gap: $spacing-sm;

        .el-image {
          width: 100px;
          height: 100px;
          border-radius: $radius;
        }
      }
    }
  }

  .pagination {
    @include flex-center;
    margin-top: $spacing-lg;
  }
}

@include md {
  .product-main {
    grid-template-columns: 1fr;
  }
}
</style>
