<template>
  <div class="product-list-page">
    <div class="container">
      <!-- 展签式页头 -->
      <header class="page-head">
        <span class="hairline"></span>
        <p class="eyebrow">INTANGIBLE CULTURAL HERITAGE</p>
        <h1 class="page-title">非遗好物</h1>
        <p class="page-desc">
          银饰 · 蜡染 · 刺绣 · 苗族服饰 —— 每一件都由手工完成，带着制作者的指纹
        </p>
      </header>
    </div>

    <!-- 分类：吸顶展签条 -->
    <div class="category-sticky">
      <div class="container">
        <nav class="category-bar">
          <button
            class="category-item"
            :class="{ active: activeCategory === 0 }"
            @click="selectCategory(0)"
          >
            全部<em v-if="total">{{ total }}</em>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            :class="{ active: activeCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}<em v-if="categoryCounts[cat.id]">{{ categoryCounts[cat.id] }}</em>
          </button>
        </nav>
      </div>
    </div>

    <div class="container">
      <!-- 排序 -->
      <div class="toolbar">
        <span class="count-line">
          <em>{{ total }}</em> 件作品
        </span>
        <div class="sort-group">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            class="sort-item"
            :class="{ active: sort === opt.value }"
            @click="selectSort(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 列表 -->
      <div v-if="loading" class="grid">
        <div v-for="i in pageSize" :key="i" class="card-skeleton">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton skeleton-line" style="width: 62%"></div>
          <div class="skeleton skeleton-line" style="width: 34%"></div>
        </div>
      </div>

      <template v-else>
        <el-empty
          v-if="products.length === 0"
          description="这个分类下暂时没有商品"
          :image-size="120"
        />

        <div v-else class="grid">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
            :category-name="categoryNameOf(item.category_id)"
          />
        </div>

        <div v-if="total > pageSize" class="pager">
          <el-pagination
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
            :total="total"
            background
            hide-on-single-page
            @current-change="onPageChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import {
  getProductList,
  getCategoryList,
  type Product,
  type Category
} from '@/api/product'

const route = useRoute()
const router = useRouter()

const categories = ref<Category[]>([])
/** 每个分类的商品数，用于在展签上显示 */
const categoryCounts = ref<Record<number, number>>({})
const products = ref<Product[]>([])
const total = ref(0)
const loading = ref(true)

const activeCategory = ref(0)
const sort = ref<'time' | 'sales' | 'price'>('time')
const page = ref(1)
const pageSize = 12

// 后端只支持这三种排序，且 price 只有升序
const sortOptions = [
  { label: '最新', value: 'time' as const },
  { label: '销量', value: 'sales' as const },
  { label: '价格从低到高', value: 'price' as const }
]

function categoryNameOf(id: number) {
  return categories.value.find((c) => c.id === id)?.name || ''
}

/**
 * 加载分类，并**过滤掉没有商品的分类**。
 *
 * 后端 category/list 不返回商品数，所以这里用 size=1 的分页请求
 * 只取 pagination.total 来探数量——响应体极小。
 * 不这么做的话，会显示出点进去是空页面的"死分类"。
 */
async function loadCategories() {
  try {
    const list = await getCategoryList()
    const roots = (list || []).filter((c) => c.parentId === 0)

    const counts = await Promise.all(
      roots.map((c) =>
        getProductList({ page: 1, size: 1, category_id: c.id })
          .then((res) => res?.pagination?.total ?? 0)
          .catch(() => 0)
      )
    )

    const map: Record<number, number> = {}
    roots.forEach((c, i) => {
      map[c.id] = counts[i]
    })
    categoryCounts.value = map

    categories.value = roots.filter((c) => map[c.id] > 0)

    // 若当前选中的分类被隐藏了（例如商品下架），回退到"全部"
    if (
      activeCategory.value !== 0 &&
      !categories.value.some((c) => c.id === activeCategory.value)
    ) {
      activeCategory.value = 0
    }
  } catch {
    categories.value = []
    categoryCounts.value = {}
  }
}

async function loadProducts() {
  loading.value = true
  try {
    const res = await getProductList({
      page: page.value,
      size: pageSize,
      category_id: activeCategory.value,
      sort: sort.value
    })
    products.value = res?.list || []
    total.value = res?.pagination?.total || 0
  } catch {
    products.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 把当前筛选同步到地址栏，刷新后可复原 */
function syncQuery() {
  const query: Record<string, string> = {}
  if (activeCategory.value) query.category = String(activeCategory.value)
  if (sort.value !== 'time') query.sort = sort.value
  if (page.value > 1) query.page = String(page.value)
  router.replace({ path: '/product', query })
}

function selectCategory(id: number) {
  if (activeCategory.value === id) return
  activeCategory.value = id
  page.value = 1
  syncQuery()
  loadProducts()
}

function selectSort(value: 'time' | 'sales' | 'price') {
  if (sort.value === value) return
  sort.value = value
  page.value = 1
  syncQuery()
  loadProducts()
}

function onPageChange(p: number) {
  page.value = p
  syncQuery()
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 从地址栏恢复筛选状态 */
function restoreFromQuery() {
  const c = Number(route.query.category)
  const s = route.query.sort as string
  const p = Number(route.query.page)

  activeCategory.value = Number.isInteger(c) && c > 0 ? c : 0
  sort.value = s === 'sales' || s === 'price' ? s : 'time'
  page.value = Number.isInteger(p) && p > 0 ? p : 1
}

watch(
  () => route.query,
  () => {
    if (route.path !== '/product') return
    const before = `${activeCategory.value}|${sort.value}|${page.value}`
    restoreFromQuery()
    if (`${activeCategory.value}|${sort.value}|${page.value}` !== before) {
      loadProducts()
    }
  }
)

onMounted(() => {
  restoreFromQuery()
  loadCategories()
  loadProducts()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.product-list-page {
  padding: $spacing-2xl 0 $spacing-2xl * 1.5;
  min-height: 70vh;
}

// ---------------------------------------------------------- 页头（展签式）

.page-head {
  max-width: 680px;
  margin-bottom: $spacing-xl;
}

// 苗族刺绣五色的细线，像展签上的色标
.hairline {
  display: block;
  width: 56px;
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

.page-title {
  font-family: $font-display;
  font-size: 46px;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wider;
  line-height: 1.2;
  margin-bottom: $spacing-md;
}

.page-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: $line-height-relaxed;
  letter-spacing: 0.04em;
}

// ---------------------------------------------------------- 分类（吸顶）

.category-sticky {
  position: sticky;
  top: 70px; // 与 Header.vue 的 height 保持一致，避免吸顶时被导航遮挡
  z-index: $z-sticky;
  margin-bottom: $spacing-xl;
  border-bottom: 1px solid $divider;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.category-bar {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xl;
  padding: $spacing-md 0 0;
}

.category-item {
  position: relative;
  padding: 0 0 $spacing-md;
  font-family: $font-display;
  font-size: $font-size-lg;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
  transition: color $transition;

  em {
    font-family: $font-family;
    font-style: normal;
    font-size: 11px;
    margin-left: 5px;
    color: $text-placeholder;
    vertical-align: super;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 0;
    height: 2px;
    background: $primary;
    transition: width $transition;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    color: $primary-dark;
    font-weight: 600;

    em {
      color: $primary-light;
    }

    &::after {
      width: 100%;
    }
  }
}

// ---------------------------------------------------------- 工具栏

.toolbar {
  @include flex-between;
  margin-bottom: $spacing-lg;
}

.count-line {
  font-size: $font-size-sm;
  color: $text-disabled;
  letter-spacing: $tracking-wide;

  em {
    font-style: normal;
    font-weight: 600;
    color: $primary-dark;
    font-variant-numeric: tabular-nums;
  }
}

.sort-group {
  display: flex;
  gap: $spacing-lg;
}

.sort-item {
  position: relative;
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
  padding-bottom: 2px;
  transition: color $transition;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: $primary;
    transform: scaleX(0);
    transition: transform $transition;
  }

  &:hover {
    color: $primary;
  }

  &.active {
    color: $primary-dark;
    font-weight: 600;

    &::after {
      transform: scaleX(1);
    }
  }
}

// ---------------------------------------------------------- 网格

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xl $spacing-lg;

  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }

  @include md {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg $spacing-md;
  }

  @include sm {
    grid-template-columns: 1fr;
  }
}

.card-skeleton {
  .skeleton-img {
    width: 100%;
    aspect-ratio: 4 / 5;
    border-radius: 2px;
  }

  .skeleton-line {
    height: 13px;
    margin-top: $spacing;
    border-radius: 2px;
  }
}

.pager {
  margin-top: $spacing-2xl;
  display: flex;
  justify-content: center;

  :deep(.el-pagination.is-background .el-pager li) {
    border-radius: 2px;
    background: transparent;
    border: 1px solid $border;

    &.is-active {
      background: $primary;
      border-color: $primary;
    }
  }
}
</style>
