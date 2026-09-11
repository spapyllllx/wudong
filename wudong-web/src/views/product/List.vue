<template>
  <div class="product-list">
    <!-- 商城特色横幅 -->
    <div class="product-hero">
      <div class="container">
        <h1 class="hero-title">
          <span class="title-icon">🎁</span>
          贵州特产商城
          <span class="title-badge">正宗好物</span>
        </h1>
        <p class="hero-subtitle">蜡染刺绣 · 民族服饰 · 手工艺品 · 地道美食</p>
      </div>
    </div>

    <div class="container">
      <div class="list-layout">
        <!-- 筛选侧边栏 -->
        <aside class="filter-sidebar">
          <div class="filter-section">
            <h3>分类</h3>
            <el-radio-group v-model="filters.selectedCategory">
              <el-radio label="">全部</el-radio>
              <el-radio label="服饰">服饰</el-radio>
              <el-radio label="饰品">饰品</el-radio>
              <el-radio label="工艺品">工艺品</el-radio>
              <el-radio label="食品">食品</el-radio>
            </el-radio-group>
          </div>

          <div class="filter-section">
            <h3>价格区间</h3>
            <el-radio-group v-model="filters.priceRange">
              <el-radio label="all">全部</el-radio>
              <el-radio label="0-100">0-100元</el-radio>
              <el-radio label="100-500">100-500元</el-radio>
              <el-radio label="500-">500元以上</el-radio>
            </el-radio-group>
          </div>
        </aside>

        <!-- 商品列表 -->
        <main class="product-main">
          <!-- 排序栏 -->
          <div class="sort-bar">
            <div class="sort-left">
              <span class="result-count">共 {{ total }} 件商品</span>
            </div>
            <div class="sort-right">
              <el-select v-model="sortType" placeholder="排序方式">
                <el-option label="综合排序" value="default" />
                <el-option label="价格从低到高" value="price-asc" />
                <el-option label="价格从高到低" value="price-desc" />
                <el-option label="销量优先" value="sales" />
              </el-select>
            </div>
          </div>

          <!-- 商品网格 -->
          <div v-loading="loading" class="product-grid">
            <div
              v-for="product in productList"
              :key="product.id"
              class="product-card"
              @click="router.push(`/product/${product.id}`)"
            >
              <div class="product-img">
                <el-image :src="product.image" fit="cover" lazy />
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-desc">{{ product.desc }}</p>
                <div class="product-footer">
                  <span class="product-price">¥{{ product.price }}</span>
                  <span class="product-sales">已售{{ product.sales }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              layout="prev, pager, next"
              @current-change="handlePageChange"
            />
          </div>

          <!-- 空状态 -->
          <el-empty v-if="!loading && productList.length === 0" description="暂无商品" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductList } from '@/api/product'

const router = useRouter()

const loading = ref(false)
const sortType = ref('default')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const productList = ref<any[]>([])

const filters = reactive({
  categories: [] as string[],
  priceRange: 'all',
  selectedCategoryId: undefined as number | undefined,
  selectedCategory: '' // 单选分类
})

// 分类映射（一级分类ID，根据SQL插入顺序）
const categoryMap: Record<string, number> = {
  '服饰': 1,
  '饰品': 2,
  '工艺品': 3,
  '食品': 4
}

// 添加调试日志
const debugLog = (message: string, data?: any) => {
  console.log(`[商品列表] ${message}`, data)
}

// 加载商品数据
async function loadProducts() {
  loading.value = true
  try {
    // 使用单选的分类
    let categoryId = undefined
    if (filters.selectedCategory) {
      categoryId = categoryMap[filters.selectedCategory]
      debugLog('选中分类', { name: filters.selectedCategory, id: categoryId })
    }

    // 解析价格区间
    let minPrice = undefined
    let maxPrice = undefined
    if (filters.priceRange && filters.priceRange !== 'all') {
      const priceRange = filters.priceRange.split('-')
      minPrice = priceRange[0] ? Number(priceRange[0]) : undefined
      maxPrice = priceRange[1] ? Number(priceRange[1]) : undefined
      debugLog('价格区间', { minPrice, maxPrice })
    }

    debugLog('请求参数', {
      page: currentPage.value,
      size: pageSize.value,
      categoryId,
      minPrice,
      maxPrice,
      sort: sortType.value
    })

    const response = await getProductList({
      page: currentPage.value,
      size: pageSize.value,
      categoryId,
      minPrice,
      maxPrice,
      sort: sortType.value === 'default' ? undefined : sortType.value
    })

    debugLog('接口返回', response)

    productList.value = response.list.map(item => {
      debugLog('商品数据', item)
      return {
        id: item.id,
        name: item.title,
        // 使用本地占位图或直接使用数据
        image: item.mainImage || item.main_image || '/placeholder.png',
        desc: item.subtitle || '暂无描述',
        price: item.price,
        sales: item.sales
      }
    })

    // 确保 total 是数字类型
    total.value = Number(response.pagination.total) || 0
  } catch (error: any) {
    console.error('加载商品失败:', error)
    ElMessage.error(error.message || '加载商品失败')
  } finally {
    loading.value = false
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  loadProducts()
}

// 监听排序变化
watch(sortType, () => {
  currentPage.value = 1
  loadProducts()
})

// 监听分类筛选变化（改为 radio）
watch(() => filters.selectedCategory, () => {
  currentPage.value = 1
  loadProducts()
})

// 监听价格区间变化
watch(() => filters.priceRange, () => {
  currentPage.value = 1
  loadProducts()
})

onMounted(() => {
  loadProducts()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.product-list {
  background: linear-gradient(180deg,
    rgba(244, 162, 97, 0.05) 0%,
    $bg 30%
  );
  min-height: 100vh;
}

// 商城特色横幅
.product-hero {
  background: linear-gradient(135deg,
    rgba(230, 57, 70, 0.9) 0%,
    rgba(231, 111, 81, 0.9) 100%
  );
  padding: $spacing-2xl 0;
  margin-bottom: $spacing-xl;
  position: relative;
  overflow: hidden;

  // 装饰图案
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  .container {
    position: relative;
    z-index: 1;
    text-align: center;
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: $spacing-md;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  .title-icon {
    font-size: 56px;
    animation: bounce 2s ease-in-out infinite;
  }

  .title-badge {
    display: inline-block;
    font-size: $font-size-sm;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-full;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
}

.hero-subtitle {
  font-size: $font-size-xl;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 2px;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.list-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: $spacing-xl;
  padding-bottom: $spacing-2xl;
}

.filter-sidebar {
  position: sticky;
  top: 90px;
  height: fit-content;
  background: $bg-white;
  border-radius: $radius-lg;
  border: 2px solid rgba(230, 57, 70, 0.1);
  padding: $spacing-lg;
  box-shadow: $shadow-sm;
}

.filter-section {
  &:not(:last-child) {
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-xl;
    border-bottom: 2px solid $divider;
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: 700;
    margin-bottom: $spacing-md;
    color: $primary;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    &::before {
      content: '';
      width: 4px;
      height: 18px;
      background: linear-gradient(180deg, $accent-red 0%, $accent-orange 100%);
      border-radius: $radius-sm;
    }
  }

  .el-checkbox,
  .el-radio {
    display: block;
    margin: $spacing-sm 0;
  }
}

.sort-bar {
  @include flex-between;
  padding: $spacing-md 0;
  margin-bottom: $spacing-lg;
}

.result-count {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.product-card {
  background: $bg-white;
  border-radius: $radius-lg;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-slow;
  position: relative;
  box-shadow: $shadow-sm;

  // 顶部特产标识条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      $accent-red 0%,
      $accent-orange 50%,
      $accent-yellow 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 32px rgba(230, 57, 70, 0.2);
    border-color: rgba(230, 57, 70, 0.2);

    &::before {
      opacity: 1;
    }

    .product-img .el-image {
      transform: scale(1.1);
    }

    .product-name {
      color: $accent-red;
    }
  }
}

.product-img {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(244, 162, 97, 0.1) 0%,
    $divider 100%
  );
  position: relative;

  .el-image {
    width: 100%;
    height: 100%;
    transition: transform $transition-slow;
  }

  // 图片遮罩
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }
}

.product-info {
  padding: $spacing-lg;
}

.product-name {
  font-size: $font-size;
  font-weight: 600;
  @include ellipsis;
  margin-bottom: $spacing-xs;
}

.product-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  @include ellipsis;
  margin-bottom: $spacing-md;
}

.product-footer {
  @include flex-between;
}

.product-price {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $danger;
}

.product-sales {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.pagination {
  @include flex-center;
}

@include lg {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@include md {
  .list-layout {
    grid-template-columns: 1fr;
  }

  .filter-sidebar {
    position: static;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
