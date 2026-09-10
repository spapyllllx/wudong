<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- 面包屑 -->
      <nav class="crumb">
        <router-link to="/">首页</router-link>
        <span class="sep">/</span>
        <router-link to="/product">非遗好物</router-link>
        <template v-if="product?.category_name">
          <span class="sep">/</span>
          <router-link :to="`/product?category=${product.category_id}`">
            {{ product.category_name }}
          </router-link>
        </template>
      </nav>

      <div v-if="loading" class="detail-skeleton">
        <div class="skeleton skeleton-gallery"></div>
        <div class="skeleton-info">
          <div class="skeleton skeleton-line" style="width: 60%; height: 28px"></div>
          <div class="skeleton skeleton-line" style="width: 35%"></div>
          <div class="skeleton skeleton-line" style="width: 45%; height: 32px"></div>
          <div class="skeleton skeleton-line" style="width: 100%; height: 80px"></div>
        </div>
      </div>

      <el-empty v-else-if="!product" description="商品不存在或已下架" :image-size="140" />

      <template v-else>
        <div class="detail-main">
          <!-- 左：图集 -->
          <div class="gallery">
            <div class="gallery-main">
              <img :src="activeImage" :alt="product.title" @error="onImgError" />
            </div>
            <div v-if="gallery.length > 1" class="gallery-thumbs">
              <button
                v-for="(img, i) in gallery"
                :key="i"
                class="thumb"
                :class="{ active: i === activeIndex }"
                @click="activeIndex = i"
              >
                <img :src="resolveImage(img)" :alt="`${product.title} 图 ${i + 1}`" />
              </button>
            </div>
          </div>

          <!-- 右：信息 -->
          <div class="info">
            <span class="hairline"></span>
            <p class="eyebrow">{{ product.category_name || '非遗好物' }}</p>
            <h1 class="title">{{ product.title }}</h1>
            <p v-if="product.subtitle" class="subtitle">{{ product.subtitle }}</p>

            <div class="price-block">
              <span class="price">{{ formatPrice(currentPrice) }}</span>
              <span v-if="showMarket" class="market">{{ formatPrice(product.market_price!) }}</span>
            </div>

            <dl class="stats">
              <div class="stat">
                <dt>已售</dt>
                <dd>{{ formatCount(product.sales) }}</dd>
              </div>
              <div class="stat">
                <dt>评价</dt>
                <dd>{{ product.review_count }}</dd>
              </div>
              <div class="stat">
                <dt>评分</dt>
                <dd>{{ product.rating ? product.rating.toFixed(1) : '—' }}</dd>
              </div>
              <div class="stat">
                <dt>库存</dt>
                <dd>{{ currentStock }}</dd>
              </div>
            </dl>

            <!-- 规格 -->
            <section v-if="product.skus.length" class="spec">
              <h3 class="spec-label">选择规格</h3>
              <div class="sku-list">
                <button
                  v-for="sku in product.skus"
                  :key="sku.id"
                  class="sku-item"
                  :class="{ active: selectedSkuId === sku.id, disabled: sku.stock <= 0 }"
                  :disabled="sku.stock <= 0"
                  @click="selectedSkuId = sku.id"
                >
                  <span class="sku-name">{{ sku.sku_name }}</span>
                  <span class="sku-price">{{ formatPrice(sku.price) }}</span>
                  <span v-if="sku.stock <= 0" class="sku-out">缺货</span>
                </button>
              </div>
            </section>

            <!-- 数量 -->
            <section class="qty-row">
              <h3 class="spec-label">数量</h3>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="Math.max(currentStock, 1)"
                :disabled="currentStock <= 0"
              />
            </section>

            <!-- 操作 -->
            <div class="actions">
              <el-button
                type="primary"
                size="large"
                :disabled="currentStock <= 0 || !selectedSkuId"
                :loading="addingToCart"
                @click="handleAddToCart"
              >
                加入购物车
              </el-button>
              <el-button
                size="large"
                :disabled="currentStock <= 0 || !selectedSkuId"
                @click="handleBuyNow"
              >
                立即购买
              </el-button>
              <button
                class="fav-btn"
                :class="{ active: favorited }"
                :title="favorited ? '取消收藏' : '收藏'"
                @click="handleToggleFavorite"
              >
                <el-icon><StarFilled v-if="favorited" /><Star v-else /></el-icon>
                <span>{{ favorited ? '已收藏' : '收藏' }}</span>
              </button>
            </div>

            <p v-if="currentStock <= 0" class="stock-hint">该规格暂时缺货</p>
          </div>
        </div>

        <!-- 下方：工艺 / 详情 / 评价 -->
        <div class="detail-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="工艺介绍" name="craft">
              <div v-if="product.craft_intro" class="prose">
                <p>{{ product.craft_intro }}</p>
              </div>
              <el-empty v-else description="暂无工艺介绍" :image-size="100" />
            </el-tab-pane>

            <el-tab-pane label="商品详情" name="detail">
              <!-- 后端返回富文本 HTML -->
              <div v-if="product.detail" class="prose" v-html="product.detail"></div>
              <el-empty v-else description="暂无详情" :image-size="100" />
            </el-tab-pane>

            <el-tab-pane :label="`评价 (${product.review_count})`" name="reviews">
              <div v-if="reviews.length === 0" class="empty-reviews">
                <el-empty description="还没有评价" :image-size="100" />
              </div>
              <ul v-else class="review-list">
                <li v-for="r in reviews" :key="r.id" class="review">
                  <div class="review-head">
                    <span class="review-user">{{ r.user?.nickname || '匿名用户' }}</span>
                    <span class="review-rating">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
                    <time class="review-time">{{ r.created_at }}</time>
                  </div>
                  <p v-if="r.content" class="review-content">{{ r.content }}</p>
                  <p v-if="r.reply_content" class="review-reply">
                    商家回复：{{ r.reply_content }}
                  </p>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, StarFilled } from '@element-plus/icons-vue'
import {
  getProductDetail,
  getProductReviews,
  toggleFavorite,
  getMyFavorites,
  type ProductDetail,
  type ProductReview
} from '@/api/product'
import { addToCart } from '@/api/cart'
import { formatPrice, formatCount } from '@/utils/format'
import { resolveImage, FALLBACK_IMAGE } from '@/utils/image'
import { isLoggedIn } from '@/utils/auth'
import { setCheckoutItems } from '@/utils/checkout'

const route = useRoute()
const router = useRouter()

const product = ref<ProductDetail | null>(null)
const reviews = ref<ProductReview[]>([])
const loading = ref(true)

const activeIndex = ref(0)
const selectedSkuId = ref<number | null>(null)
const quantity = ref(1)
const addingToCart = ref(false)
const favorited = ref(false)
const activeTab = ref('craft')

/**
 * 图集：**主图永远排第一**，images 只作为补充图跟在后面。
 *
 * 不要把 images 直接当成图集——后端 images 里可能有与主图不一致的旧图，
 * 那样详情页首屏会显示成另一张图（甚至占位图），跟列表页对不上。
 */
const gallery = computed(() => {
  if (!product.value) return []
  const main = product.value.main_image
  const rest = (product.value.images || []).filter((i) => i && i !== main)
  return [main, ...Array.from(new Set(rest))].filter(Boolean) as string[]
})

const activeImage = computed(() => resolveImage(gallery.value[activeIndex.value]))

/** 选中 SKU 的价格 / 库存；无 SKU 时用商品本身 */
const selectedSku = computed(
  () => product.value?.skus.find((s) => s.id === selectedSkuId.value) || null
)

const currentPrice = computed(
  () => selectedSku.value?.price ?? product.value?.price ?? 0
)

const currentStock = computed(() => {
  if (!product.value) return 0
  return selectedSku.value ? selectedSku.value.stock : product.value.stock
})

const showMarket = computed(
  () => !!product.value?.market_price && product.value.market_price > currentPrice.value
)

/** 图片加载失败时换成占位图，而不是留一块空白 */
function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  if (img.src.startsWith('data:')) return // 占位图本身也失败，避免死循环
  img.src = FALLBACK_IMAGE
}

async function loadProduct(id: string) {
  loading.value = true
  activeIndex.value = 0
  quantity.value = 1
  try {
    const data = await getProductDetail(id)
    product.value = data
    // 默认选中第一个有货的规格；都缺货则选第一个
    const skus = data.skus || []
    const available = skus.find((s) => s.stock > 0)
    selectedSkuId.value = available?.id ?? skus[0]?.id ?? null

    if (data.review_count > 0) {
      loadReviews(data.id)
    } else {
      reviews.value = []
    }
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

async function loadReviews(productId: number) {
  try {
    const res = await getProductReviews(productId, { page: 1, size: 5 })
    reviews.value = res?.list || []
  } catch {
    reviews.value = []
  }
}

/**
 * 判断是否已收藏。
 * 后端没有「查询单个商品收藏状态」的接口，因此拉一次我的收藏做匹配。
 */
async function loadFavoriteState(productId: number) {
  if (!isLoggedIn()) {
    favorited.value = false
    return
  }
  try {
    const res = await getMyFavorites(1, 50)
    favorited.value = (res?.list || []).some((p) => p.id === productId)
  } catch {
    favorited.value = false
  }
}

async function handleToggleFavorite() {
  if (!product.value) return
  if (!isLoggedIn()) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  try {
    const nowFavorited = await toggleFavorite(product.value.id)
    favorited.value = nowFavorited
    ElMessage.success(nowFavorited ? '已加入收藏' : '已取消收藏')
  } catch {
    // 拦截器已提示
  }
}

async function handleAddToCart() {
  if (!selectedSkuId.value) {
    ElMessage.warning('请先选择规格')
    return
  }
  if (!isLoggedIn()) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  addingToCart.value = true
  try {
    const res = await addToCart(selectedSkuId.value, quantity.value)
    ElMessage.success(`已加入购物车，当前共 ${res?.quantity ?? quantity.value} 件`)
  } catch {
    // 拦截器已提示（如「库存不足,仅剩 N」）
  } finally {
    addingToCart.value = false
  }
}

function handleBuyNow() {
  if (!selectedSkuId.value) {
    ElMessage.warning('请先选择规格')
    return
  }
  if (!isLoggedIn()) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  // 把展示所需信息一起带到确认页（下单时只提交 skuId + quantity）
  setCheckoutItems([
    {
      skuId: selectedSkuId.value,
      quantity: quantity.value,
      productId: product.value!.id,
      title: product.value!.title,
      image: selectedSku.value?.image || product.value!.main_image,
      skuName: selectedSku.value?.sku_name ?? null,
      price: currentPrice.value
    }
  ])

  router.push({ path: '/order/confirm' })
}

watch(
  () => route.params.id,
  (id) => {
    if (id) loadProduct(String(id))
  }
)

onMounted(() => {
  const id = String(route.params.id)
  // 先看收藏态（依赖登录态），与详情并行
  loadFavoriteState(Number(id))
  loadProduct(id)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.product-detail-page {
  padding: $spacing-xl 0 $spacing-2xl * 1.5;
  min-height: 70vh;
}

// ---------------------------------------------------------- 面包屑

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

// ---------------------------------------------------------- 主体

.detail-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: $spacing-2xl * 1.25;

  @include lg {
    gap: $spacing-xl;
  }

  @include md {
    grid-template-columns: 1fr;
  }
}

.gallery {
  position: sticky;
  top: 88px;
  align-self: start;

  @include md {
    position: static;
  }
}

// 主图做成"装裱"效果：外层细框 + 一圈留白 + 内层压线，
// 像展馆里挂画的卡纸裱边，比直接贴边更有陈列感
.gallery-main {
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 14px;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: 2px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid $divider;
  }
}

.gallery-thumbs {
  display: flex;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.thumb {
  width: 72px;
  height: 72px;
  padding: 0;
  border: 1px solid $border;
  border-radius: 2px;
  overflow: hidden;
  background: $bg;
  opacity: 0.6;
  transition: all $transition;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    border-color: $primary;
  }
}

// ---------------------------------------------------------- 信息区

.info {
  padding-top: $spacing-xs;
}

// 与列表页一致的苗族五色细线
.hairline {
  display: block;
  width: 48px;
  height: 3px;
  margin-bottom: $spacing-lg;
  border-radius: 2px;
  background: linear-gradient(90deg,
    $accent-red 0%,
    $accent-orange 25%,
    $accent-yellow 50%,
    $accent-green 75%,
    $primary 100%
  );
}

.eyebrow {
  font-size: 11px;
  letter-spacing: $tracking-widest;
  color: $primary-lighter;
  margin-bottom: $spacing-sm;
}

.title {
  font-family: $font-display;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.3;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
}

.subtitle {
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: $spacing-md;
  margin: $spacing-xl 0;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $divider;

  .price {
    font-size: 32px;
    font-weight: 600;
    color: $accent-red;
    letter-spacing: $tracking-tight;
  }

  .market {
    font-size: $font-size-sm;
    color: $text-placeholder;
    text-decoration: line-through;
  }
}

.stats {
  display: flex;
  margin-bottom: $spacing-xl;

  .stat {
    flex: 1;
    padding-right: $spacing-lg;

    & + .stat {
      padding-left: $spacing-lg;
      border-left: 1px solid $divider;
    }

    dt {
      font-size: $font-size-xs;
      color: $text-disabled;
      letter-spacing: $tracking-wide;
      margin-bottom: 3px;
    }

    dd {
      font-size: $font-size-xl;
      font-weight: 600;
      color: $primary-dark;
      font-variant-numeric: tabular-nums;
      letter-spacing: $tracking-tight;
    }
  }
}

.spec-label {
  font-size: $font-size-xs;
  font-weight: 400;
  color: $text-disabled;
  letter-spacing: $tracking-wider;
  margin-bottom: $spacing-sm;
}

.spec {
  margin-bottom: $spacing-lg;
}

.sku-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.sku-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border;
  border-radius: 2px;
  background: $bg-white;
  font-size: $font-size-sm;
  color: $text-primary;
  transition: all $transition;

  .sku-price {
    color: $text-secondary;
    font-size: $font-size-xs;
  }

  .sku-out {
    color: $text-placeholder;
    font-size: $font-size-xs;
  }

  &:hover:not(.disabled) {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary;
    background: rgba(61, 90, 128, 0.06);
    color: $primary-dark;
    font-weight: 600;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
}

.qty-row {
  margin-bottom: $spacing-xl;
}

.actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $divider;

  @include sm {
    flex-wrap: wrap;
  }
}

.fav-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: $spacing-sm $spacing-md;
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
  border-radius: 2px;
  transition: color $transition;

  &:hover {
    color: $accent-yellow;
  }

  &.active {
    color: $accent-yellow;
  }
}

.stock-hint {
  margin-top: $spacing-sm;
  font-size: $font-size-xs;
  color: $danger;
}

// ---------------------------------------------------------- 下方 Tabs

.detail-tabs {
  margin-top: $spacing-2xl * 1.5;
  border-top: 1px solid $divider;
  padding-top: $spacing-xl;

  :deep(.el-tabs__header) {
    margin-bottom: $spacing-xl;
  }

  :deep(.el-tabs__item) {
    font-family: $font-display;
    font-size: $font-size-lg;
    letter-spacing: $tracking-wide;
  }

  :deep(.el-tabs__active-bar) {
    background: $primary;
  }
}

.prose {
  max-width: 760px;
  font-size: $font-size;
  line-height: $line-height-relaxed;
  color: $text-primary;
  letter-spacing: 0.02em;

  :deep(p) {
    margin-bottom: $spacing-md;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: $radius-sm;
    margin: $spacing-md 0;
  }
}

.review-list {
  max-width: 760px;
}

.review {
  padding: $spacing-lg 0;
  border-bottom: 1px solid $divider;

  &:last-child {
    border-bottom: none;
  }
}

.review-head {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
}

.review-user {
  font-weight: 600;
  color: $text-primary;
}

.review-rating {
  color: $accent-yellow;
  letter-spacing: 2px;
  font-size: $font-size-sm;
}

.review-time {
  margin-left: auto;
  font-size: $font-size-xs;
  color: $text-disabled;
}

.review-content {
  color: $text-secondary;
  line-height: $line-height-relaxed;
}

.review-reply {
  margin-top: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $bg;
  border-radius: 2px;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.empty-reviews {
  padding: $spacing-xl 0;
}

// ---------------------------------------------------------- 骨架

.detail-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-2xl;

  @include md {
    grid-template-columns: 1fr;
  }
}

.skeleton-gallery {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: $radius-sm;
}

.skeleton-info {
  .skeleton-line {
    height: 16px;
    margin-bottom: $spacing-md;
    border-radius: 2px;
  }
}
</style>
