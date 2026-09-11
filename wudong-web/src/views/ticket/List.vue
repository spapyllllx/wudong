<template>
  <div class="ticket-list-page">
    <div class="container">
      <h1 class="page-title">贵州景点门票</h1>

      <!-- 筛选区 -->
      <div class="filter-section">
        <div class="filter-item">
          <span class="filter-label">排序：</span>
          <el-radio-group v-model="filters.sort" @change="handleFilterChange">
            <el-radio-button label="default">综合</el-radio-button>
            <el-radio-button label="rating">评分</el-radio-button>
            <el-radio-button label="popular">人气</el-radio-button>
            <el-radio-button label="price-asc">价格↑</el-radio-button>
            <el-radio-button label="price-desc">价格↓</el-radio-button>
          </el-radio-group>
        </div>

        <div class="filter-item">
          <span class="filter-label">价格：</span>
          <el-radio-group v-model="filters.priceRange" @change="handleFilterChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0-100">100元以下</el-radio-button>
            <el-radio-button label="100-200">100-200元</el-radio-button>
            <el-radio-button label="200-300">200-300元</el-radio-button>
            <el-radio-button label="300">300元以上</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 景点列表 -->
      <div v-loading="loading" class="attraction-list">
        <div
          v-for="attraction in attractionList"
          :key="attraction.id"
          class="attraction-card"
          @click="goToDetail(attraction.id)"
        >
          <div class="card-cover">
            <el-image :src="attraction.cover" fit="cover" />
            <div class="card-tags">
              <el-tag v-for="tag in getTags(attraction.tags)" :key="tag" size="small">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="card-body">
            <h3 class="attraction-name">{{ attraction.name }}</h3>
            <p class="attraction-desc">{{ attraction.description }}</p>

            <div class="attraction-info">
              <div class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ attraction.district }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>{{ attraction.openTime }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-info">
                <span class="min-price">¥{{ attraction.minPrice }}</span>
                <span class="price-label">起</span>
              </div>
              <div class="rating-info">
                <el-rate v-model="attraction.rating" disabled show-score />
                <span class="order-count">{{ attraction.orderCount }}人购买</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="attractionList.length === 0 && !loading" description="暂无景点" />

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadAttractionList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { LocationFilled, Clock } from '@element-plus/icons-vue'
import { getAttractionList } from '@/api/ticket'
import type { Attraction } from '@/api/ticket'

const router = useRouter()

const loading = ref(false)
const attractionList = ref<Attraction[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const filters = ref({
  sort: 'default',
  priceRange: ''
})

// 获取标签数组
function getTags(tags: string) {
  return tags ? tags.split(',').slice(0, 3) : []
}

// 加载景点列表
async function loadAttractionList() {
  loading.value = true
  try {
    const result = await getAttractionList({
      page: currentPage.value,
      size: pageSize.value,
      ...filters.value
    })
    attractionList.value = result.list
    total.value = result.pagination.total
  } catch (error: any) {
    console.error('加载景点列表失败:', error)
    ElMessage.error(error.message || '加载景点列表失败')
  } finally {
    loading.value = false
  }
}

// 筛选变化
function handleFilterChange() {
  currentPage.value = 1
  loadAttractionList()
}

// 跳转到详情
function goToDetail(id: number) {
  router.push(`/ticket/${id}`)
}

onMounted(() => {
  loadAttractionList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.ticket-list-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

// 筛选区
.filter-section {
  background: white;
  padding: $spacing-lg;
  border-radius: $radius-lg;
  margin-bottom: $spacing-xl;

  .filter-item {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }

    .filter-label {
      font-weight: 500;
      margin-right: $spacing-md;
      min-width: 60px;
    }
  }
}

// 景点列表
.attraction-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-xl;

  .attraction-card {
    background: white;
    border-radius: $radius-lg;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .card-cover {
      position: relative;
      height: 200px;
      overflow: hidden;

      .el-image {
        width: 100%;
        height: 100%;
      }

      .card-tags {
        position: absolute;
        bottom: $spacing-sm;
        left: $spacing-sm;
        display: flex;
        gap: $spacing-xs;
      }
    }

    .card-body {
      padding: $spacing-lg;

      .attraction-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        @include ellipsis(1);
      }

      .attraction-desc {
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-md;
        @include ellipsis(2);
        min-height: 40px;
      }

      .attraction-info {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        margin-bottom: $spacing-md;

        .info-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }

      .card-footer {
        @include flex-between;
        padding-top: $spacing-md;
        border-top: 1px solid $border;

        .price-info {
          .min-price {
            font-size: 24px;
            font-weight: 600;
            color: $danger;
          }

          .price-label {
            color: $text-secondary;
            font-size: $font-size-sm;
            margin-left: $spacing-xs;
          }
        }

        .rating-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: $spacing-xs;

          .order-count {
            color: $text-secondary;
            font-size: $font-size-sm;
          }
        }
      }
    }
  }

  .pagination {
    grid-column: 1 / -1;
    @include flex-center;
    margin-top: $spacing-xl;
  }
}

@include md {
  .attraction-list {
    grid-template-columns: 1fr;
  }

  .filter-section {
    .filter-item {
      flex-direction: column;
      align-items: flex-start;

      .filter-label {
        margin-bottom: $spacing-sm;
      }

      .el-radio-group {
        width: 100%;
      }
    }
  }
}
</style>
