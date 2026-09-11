<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索栏 -->
      <div class="search-header">
        <el-input
          v-model="keyword"
          placeholder="搜索商品、景点、餐厅、民宿..."
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 类型筛选 -->
      <div class="type-tabs">
        <div
          v-for="tab in typeTabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeType === tab.value }"
          @click="handleTypeChange(tab.value)"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          <span>{{ tab.label }}</span>
          <span v-if="getCategoryCount(tab.value) > 0" class="count">({{ getCategoryCount(tab.value) }})</span>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-loading="loading" class="search-results">
        <!-- 商品结果 -->
        <div v-if="shouldShowCategory('product') && results.products.length > 0" class="result-section">
          <h2 class="section-title">商品</h2>
          <div class="product-grid">
            <div
              v-for="item in results.products"
              :key="item.id"
              class="product-card"
              @click="goToProduct(item.id)"
            >
              <el-image :src="item.cover" fit="cover" class="product-image" />
              <div class="product-info">
                <div class="product-title">{{ item.title }}</div>
                <div class="product-footer">
                  <span class="price">¥{{ item.price }}</span>
                  <span class="sales">销量{{ item.sales }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 餐厅结果 -->
        <div v-if="shouldShowCategory('restaurant') && results.restaurants.length > 0" class="result-section">
          <h2 class="section-title">餐厅</h2>
          <div class="list-grid">
            <div
              v-for="item in results.restaurants"
              :key="item.id"
              class="list-card"
              @click="goToRestaurant(item.id)"
            >
              <el-image :src="item.cover" fit="cover" class="list-image" />
              <div class="list-info">
                <h3 class="list-title">{{ item.name }}</h3>
                <div class="list-tags">
                  <el-tag v-for="tag in getTags(item.tags)" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
                <div class="list-footer">
                  <span class="price">¥{{ item.avgPrice }}/人</span>
                  <el-rate v-model="item.rating" disabled show-score />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 民宿结果 -->
        <div v-if="shouldShowCategory('homestay') && results.homestays.length > 0" class="result-section">
          <h2 class="section-title">民宿</h2>
          <div class="list-grid">
            <div
              v-for="item in results.homestays"
              :key="item.id"
              class="list-card"
              @click="goToHomestay(item.id)"
            >
              <el-image :src="item.cover" fit="cover" class="list-image" />
              <div class="list-info">
                <h3 class="list-title">{{ item.name }}</h3>
                <div class="list-tags">
                  <el-tag v-for="tag in getTags(item.tags)" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
                <div class="list-footer">
                  <span class="price">¥{{ item.minPrice }}起/晚</span>
                  <el-rate v-model="item.rating" disabled show-score />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 景点结果 -->
        <div v-if="shouldShowCategory('attraction') && results.attractions.length > 0" class="result-section">
          <h2 class="section-title">景点</h2>
          <div class="list-grid">
            <div
              v-for="item in results.attractions"
              :key="item.id"
              class="list-card"
              @click="goToAttraction(item.id)"
            >
              <el-image :src="item.cover" fit="cover" class="list-image" />
              <div class="list-info">
                <h3 class="list-title">{{ item.name }}</h3>
                <div class="list-tags">
                  <el-tag v-for="tag in getTags(item.tags)" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
                <div class="list-footer">
                  <span class="price">¥{{ item.minPrice }}起</span>
                  <el-rate v-model="item.rating" disabled show-score />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-if="!loading && !hasResults"
          description="没有找到相关内容"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, ShoppingBag, Food, House, Ticket } from '@element-plus/icons-vue'
import { globalSearch } from '@/api/search'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const keyword = ref('')
const activeType = ref('')
const results = ref<any>({
  products: [],
  restaurants: [],
  homestays: [],
  attractions: []
})

const typeTabs = [
  { label: '全部', value: '', icon: Search },
  { label: '商品', value: 'product', icon: ShoppingBag },
  { label: '餐厅', value: 'restaurant', icon: Food },
  { label: '民宿', value: 'homestay', icon: House },
  { label: '景点', value: 'attraction', icon: Ticket }
]

// 是否有结果
const hasResults = computed(() => {
  return (
    results.value.products.length > 0 ||
    results.value.restaurants.length > 0 ||
    results.value.homestays.length > 0 ||
    results.value.attractions.length > 0
  )
})

// 获取分类数量
function getCategoryCount(type: string) {
  if (!type) {
    return (
      results.value.products.length +
      results.value.restaurants.length +
      results.value.homestays.length +
      results.value.attractions.length
    )
  }
  const key = type + 's'
  return results.value[key]?.length || 0
}

// 是否显示该分类
function shouldShowCategory(type: string) {
  return !activeType.value || activeType.value === type
}

// 获取标签
function getTags(tags: string) {
  return tags ? tags.split(',').slice(0, 3) : []
}

// 执行搜索
async function handleSearch() {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  try {
    const result = await globalSearch(keyword.value, activeType.value)
    results.value = result

    // 更新URL
    router.push({
      path: '/search',
      query: { keyword: keyword.value, type: activeType.value || undefined }
    })
  } catch (error: any) {
    console.error('搜索失败:', error)
    ElMessage.error(error.message || '搜索失败')
  } finally {
    loading.value = false
  }
}

// 切换类型
function handleTypeChange(type: string) {
  activeType.value = type
  if (keyword.value) {
    handleSearch()
  }
}

// 跳转到详情
function goToProduct(id: number) {
  router.push(`/product/${id}`)
}

function goToRestaurant(id: number) {
  router.push(`/restaurant/${id}`)
}

function goToHomestay(id: number) {
  router.push(`/homestay/${id}`)
}

function goToAttraction(id: number) {
  router.push(`/ticket/${id}`)
}

onMounted(() => {
  // 从URL获取搜索关键词
  const queryKeyword = route.query.keyword as string
  const queryType = route.query.type as string

  if (queryKeyword) {
    keyword.value = queryKeyword
    activeType.value = queryType || ''
    handleSearch()
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.search-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

// 搜索栏
.search-header {
  margin-bottom: $spacing-xl;

  .el-input {
    max-width: 800px;
    margin: 0 auto;
  }
}

// 类型筛选
.type-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  background: white;
  padding: $spacing-lg;
  border-radius: $radius-lg;

  .tab-item {
    @include flex-center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-lg;
    cursor: pointer;
    border-radius: $radius;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover {
      background: $bg;
    }

    &.active {
      background: $primary;
      color: white;
    }

    .count {
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }
}

// 搜索结果
.search-results {
  .result-section {
    margin-bottom: $spacing-2xl;

    .section-title {
      font-size: $font-size-xl;
      font-weight: 600;
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-sm;
      border-bottom: 2px solid $primary;
    }
  }
}

// 商品网格
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-lg;

  .product-card {
    background: white;
    border-radius: $radius-lg;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-image {
      width: 100%;
      height: 200px;
    }

    .product-info {
      padding: $spacing-md;

      .product-title {
        font-weight: 500;
        margin-bottom: $spacing-sm;
        @include ellipsis(2);
        min-height: 40px;
      }

      .product-footer {
        @include flex-between;

        .price {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }

        .sales {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }
    }
  }
}

// 列表网格
.list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-lg;

  .list-card {
    background: white;
    border-radius: $radius-lg;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .list-image {
      width: 100%;
      height: 180px;
    }

    .list-info {
      padding: $spacing-lg;

      .list-title {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        @include ellipsis(1);
      }

      .list-tags {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-xs;
        margin-bottom: $spacing-md;
      }

      .list-footer {
        @include flex-between;
        align-items: center;

        .price {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }
      }
    }
  }
}

@include md {
  .type-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .product-grid,
  .list-grid {
    grid-template-columns: 1fr;
  }
}
</style>
