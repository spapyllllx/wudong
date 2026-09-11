<template>
  <div class="homestay-list-page">
    <div class="container">
      <h1 class="page-title">贵州特色民宿</h1>

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
            <el-radio-button label="0-200">200元以下</el-radio-button>
            <el-radio-button label="200-400">200-400元</el-radio-button>
            <el-radio-button label="400-600">400-600元</el-radio-button>
            <el-radio-button label="600">600元以上</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 民宿列表 -->
      <div v-loading="loading" class="homestay-list">
        <div
          v-for="homestay in homestayList"
          :key="homestay.id"
          class="homestay-card"
          @click="goToDetail(homestay.id)"
        >
          <div class="card-cover">
            <el-image :src="homestay.cover" fit="cover" />
            <div class="card-tags">
              <el-tag v-for="tag in getTags(homestay.tags)" :key="tag" size="small">
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="card-body">
            <h3 class="homestay-name">{{ homestay.name }}</h3>
            <p class="homestay-desc">{{ homestay.description }}</p>

            <div class="homestay-info">
              <div class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ homestay.district }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>{{ homestay.checkInTime }} 入住</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-info">
                <span class="min-price">¥{{ homestay.minPrice }}</span>
                <span class="price-label">起/晚</span>
              </div>
              <div class="rating-info">
                <el-rate v-model="homestay.rating" disabled show-score />
                <span class="order-count">{{ homestay.orderCount }}人预订</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="homestayList.length === 0 && !loading" description="暂无民宿" />

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadHomestayList"
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
import { getHomestayList } from '@/api/homestay'
import type { Homestay } from '@/api/homestay'

const router = useRouter()

const loading = ref(false)
const homestayList = ref<Homestay[]>([])
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

// 加载民宿列表
async function loadHomestayList() {
  loading.value = true
  try {
    const result = await getHomestayList({
      page: currentPage.value,
      size: pageSize.value,
      ...filters.value
    })
    homestayList.value = result.list
    total.value = result.pagination.total
  } catch (error: any) {
    console.error('加载民宿列表失败:', error)
    ElMessage.error(error.message || '加载民宿列表失败')
  } finally {
    loading.value = false
  }
}

// 筛选变化
function handleFilterChange() {
  currentPage.value = 1
  loadHomestayList()
}

// 跳转到详情
function goToDetail(id: number) {
  router.push(`/homestay/${id}`)
}

onMounted(() => {
  loadHomestayList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.homestay-list-page {
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

// 民宿列表
.homestay-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $spacing-xl;

  .homestay-card {
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

      .homestay-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-sm;
        @include ellipsis(1);
      }

      .homestay-desc {
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-md;
        @include ellipsis(2);
        min-height: 40px;
      }

      .homestay-info {
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
  .homestay-list {
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
