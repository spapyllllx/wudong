<template>
  <div class="booking-list-page">
    <div class="container">
      <h1 class="page-title">我的预订</h1>

      <!-- 状态筛选 -->
      <div class="booking-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 预订列表 -->
      <div v-loading="loading" class="booking-list">
        <div v-for="booking in bookingList" :key="booking.id" class="booking-card">
          <div class="card-header">
            <span class="booking-no">预订号：{{ booking.bookingNo }}</span>
            <span class="booking-status">{{ getStatusText(booking.status) }}</span>
          </div>

          <div class="card-body">
            <h3 class="restaurant-name">{{ booking.restaurantName }}</h3>

            <div class="booking-info">
              <div class="info-item">
                <span class="label">预订时间：</span>
                <span class="value">{{ booking.bookingDate }} {{ booking.bookingTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">就餐人数：</span>
                <span class="value">{{ booking.peopleCount }}人</span>
              </div>
              <div class="info-item">
                <span class="label">联系人：</span>
                <span class="value">{{ booking.contactName }} {{ booking.contactPhone }}</span>
              </div>
              <div v-if="booking.remark" class="info-item">
                <span class="label">备注：</span>
                <span class="value">{{ booking.remark }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="create-time">预订时间：{{ booking.createTime }}</div>
            <div class="actions">
              <el-button v-if="booking.status === 0" @click="handleCancel(booking)">
                取消预订
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="bookingList.length === 0 && !loading" description="暂无预订" />

        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadBookingList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBookingList, cancelBooking } from '@/api/restaurant'
import type { RestaurantBooking } from '@/api/restaurant'

const loading = ref(false)
const bookingList = ref<RestaurantBooking[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const activeTab = ref(-1) // -1全部 0待确认 1已确认 2已完成 3已取消

const tabs = [
  { label: '全部', value: -1 },
  { label: '待确认', value: 0 },
  { label: '已确认', value: 1 },
  { label: '已完成', value: 2 },
  { label: '已取消', value: 3 }
]

// 获取状态文本
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待确认',
    1: '已确认',
    2: '已完成',
    3: '已取消'
  }
  return map[status] || '未知'
}

// 加载预订列表
async function loadBookingList() {
  loading.value = true
  try {
    const result = await getBookingList({
      page: currentPage.value,
      size: pageSize.value,
      status: activeTab.value
    })
    bookingList.value = result.list
    total.value = result.pagination.total
  } catch (error: any) {
    console.error('加载预订列表失败:', error)
    ElMessage.error(error.message || '加载预订列表失败')
  } finally {
    loading.value = false
  }
}

// 切换状态
function handleTabChange(value: number) {
  activeTab.value = value
  currentPage.value = 1
  loadBookingList()
}

// 取消预订
async function handleCancel(booking: RestaurantBooking) {
  try {
    await ElMessageBox.confirm('确定要取消这个预订吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelBooking(booking.bookingNo, '不想预订了')
    ElMessage.success('预订已取消')
    await loadBookingList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
}

onMounted(() => {
  loadBookingList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.booking-list-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

// 状态筛选
.booking-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  background: white;
  padding: $spacing-lg;
  border-radius: $radius-lg;

  .tab-item {
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
  }
}

// 预订列表
.booking-list {
  .booking-card {
    background: white;
    border-radius: $radius-lg;
    margin-bottom: $spacing-lg;
    overflow: hidden;

    .card-header {
      @include flex-between;
      padding: $spacing-md $spacing-lg;
      background: $bg;
      border-bottom: 1px solid $border;

      .booking-no {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .booking-status {
        font-weight: 500;
        color: $primary;
      }
    }

    .card-body {
      padding: $spacing-lg;

      .restaurant-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-md;
      }

      .booking-info {
        .info-item {
          display: flex;
          padding: $spacing-sm 0;

          .label {
            color: $text-secondary;
            min-width: 80px;
          }

          .value {
            flex: 1;
          }
        }
      }
    }

    .card-footer {
      @include flex-between;
      padding: $spacing-lg;
      background: $bg;
      border-top: 1px solid $border;

      .create-time {
        color: $text-secondary;
        font-size: $font-size-sm;
      }

      .actions {
        display: flex;
        gap: $spacing-sm;
      }
    }
  }

  .pagination {
    @include flex-center;
    margin-top: $spacing-xl;
  }
}

@include md {
  .booking-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .card-footer {
    flex-direction: column;
    gap: $spacing-md;
    align-items: stretch;
  }
}
</style>
