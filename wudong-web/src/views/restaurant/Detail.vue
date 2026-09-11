<template>
  <div class="restaurant-detail-page">
    <div class="container" v-loading="loading">
      <div class="back-btn">
        <el-button @click="router.back()" icon="ArrowLeft">返回</el-button>
      </div>

      <div v-if="restaurant" class="restaurant-detail">
        <!-- 餐厅头部 -->
        <div class="restaurant-header">
          <div class="header-images">
            <el-carousel height="400px" :interval="5000">
              <el-carousel-item v-for="(image, index) in getImages()" :key="index">
                <el-image :src="image" fit="cover" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="header-info">
            <h1 class="restaurant-name">{{ restaurant.name }}</h1>

            <div class="rating-section">
              <el-rate v-model="restaurant.rating" disabled show-score />
              <span class="view-count">{{ restaurant.viewCount }}人浏览</span>
              <span class="order-count">{{ restaurant.orderCount }}人预订</span>
            </div>

            <div class="tags-section">
              <el-tag v-for="tag in getTags()" :key="tag" size="large">{{ tag }}</el-tag>
            </div>

            <div class="info-section">
              <div class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ restaurant.address }}</span>
              </div>
              <div class="info-item">
                <el-icon><Phone /></el-icon>
                <span>{{ restaurant.phone }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>营业时间：{{ restaurant.businessHours }}</span>
              </div>
              <div class="info-item">
                <el-icon><Money /></el-icon>
                <span>人均消费：<span class="price">¥{{ restaurant.avgPrice }}</span></span>
              </div>
            </div>

            <div class="action-section">
              <el-button type="primary" size="large" @click="showBookingDialog = true">
                立即预订
              </el-button>
            </div>
          </div>
        </div>

        <!-- 餐厅详情内容 -->
        <div class="restaurant-content">
          <!-- 餐厅介绍 -->
          <div class="content-section">
            <h2 class="section-title">餐厅介绍</h2>
            <p class="description">{{ restaurant.description }}</p>
          </div>

          <!-- 菜品列表 -->
          <div class="content-section">
            <h2 class="section-title">特色菜品</h2>

            <el-tabs v-model="activeCategory">
              <el-tab-pane
                v-for="category in restaurant.categories"
                :key="category.id"
                :label="category.name"
                :name="category.id.toString()"
              >
                <div class="dish-list">
                  <div
                    v-for="dish in getDishesByCategory(category.id)"
                    :key="dish.id"
                    class="dish-item"
                  >
                    <el-image :src="dish.image" fit="cover" class="dish-image" />
                    <div class="dish-info">
                      <div class="dish-header">
                        <h4 class="dish-name">{{ dish.name }}</h4>
                        <el-tag v-if="dish.isRecommend" type="danger" size="small">推荐</el-tag>
                      </div>
                      <p class="dish-desc">{{ dish.description }}</p>
                      <div class="dish-tags" v-if="dish.tags">
                        <el-tag v-for="tag in dish.tags.split(',')" :key="tag" size="small">
                          {{ tag }}
                        </el-tag>
                      </div>
                      <div class="dish-footer">
                        <div class="dish-price">
                          <span class="current-price">¥{{ dish.price }}</span>
                          <span v-if="dish.originalPrice" class="original-price">
                            ¥{{ dish.originalPrice }}
                          </span>
                          <span class="unit">/{{ dish.unit }}</span>
                        </div>
                        <div class="dish-sales">已售{{ dish.sales }}份</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!restaurant && !loading" description="餐厅不存在" />
    </div>

    <!-- 预订对话框 -->
    <el-dialog v-model="showBookingDialog" title="预订餐位" width="500px">
      <el-form :model="bookingForm" label-width="100px">
        <el-form-item label="预订日期">
          <el-date-picker
            v-model="bookingForm.bookingDate"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="预订时间">
          <el-select v-model="bookingForm.bookingTime" placeholder="选择时间" style="width: 100%">
            <el-option label="11:00" value="11:00" />
            <el-option label="11:30" value="11:30" />
            <el-option label="12:00" value="12:00" />
            <el-option label="12:30" value="12:30" />
            <el-option label="17:00" value="17:00" />
            <el-option label="17:30" value="17:30" />
            <el-option label="18:00" value="18:00" />
            <el-option label="18:30" value="18:30" />
          </el-select>
        </el-form-item>
        <el-form-item label="就餐人数">
          <el-input-number v-model="bookingForm.peopleCount" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="bookingForm.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="bookingForm.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="bookingForm.remark"
            type="textarea"
            :rows="3"
            placeholder="如有特殊要求请备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBookingDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleBooking">确认预订</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { LocationFilled, Phone, Clock, Money } from '@element-plus/icons-vue'
import { getRestaurantDetail, createBooking } from '@/api/restaurant'
import type { Restaurant, Dish } from '@/api/restaurant'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const restaurant = ref<Restaurant | null>(null)
const activeCategory = ref('')
const showBookingDialog = ref(false)

const bookingForm = ref({
  bookingDate: '',
  bookingTime: '',
  peopleCount: 2,
  contactName: '',
  contactPhone: '',
  remark: ''
})

// 获取图片列表
function getImages() {
  if (!restaurant.value) return []
  const images = [restaurant.value.cover]
  if (restaurant.value.images && restaurant.value.images.length > 0) {
    images.push(...restaurant.value.images)
  }
  return images
}

// 获取标签
function getTags() {
  if (!restaurant.value || !restaurant.value.tags) return []
  return restaurant.value.tags.split(',')
}

// 根据分类获取菜品
function getDishesByCategory(categoryId: number) {
  if (!restaurant.value || !restaurant.value.dishes) return []
  return restaurant.value.dishes.filter(dish => dish.categoryId === categoryId)
}

// 禁用过去的日期
function disabledDate(date: Date) {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

// 加载餐厅详情
async function loadRestaurantDetail() {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('餐厅ID无效')
    router.back()
    return
  }

  loading.value = true
  try {
    restaurant.value = await getRestaurantDetail(id)

    // 设置默认分类
    if (restaurant.value.categories && restaurant.value.categories.length > 0) {
      activeCategory.value = restaurant.value.categories[0].id.toString()
    }
  } catch (error: any) {
    console.error('加载餐厅详情失败:', error)
    ElMessage.error(error.message || '加载餐厅详情失败')
  } finally {
    loading.value = false
  }
}

// 提交预订
async function handleBooking() {
  if (!restaurant.value) return

  // 验证表单
  if (!bookingForm.value.bookingDate) {
    ElMessage.warning('请选择预订日期')
    return
  }

  if (!bookingForm.value.bookingTime) {
    ElMessage.warning('请选择预订时间')
    return
  }

  if (!bookingForm.value.contactName) {
    ElMessage.warning('请输入联系人')
    return
  }

  if (!bookingForm.value.contactPhone) {
    ElMessage.warning('请输入联系电话')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(bookingForm.value.contactPhone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  submitting.value = true
  try {
    // 格式化日期
    const date = new Date(bookingForm.value.bookingDate)
    const formattedDate = date.toISOString().split('T')[0]

    await createBooking({
      restaurantId: restaurant.value.id,
      bookingDate: formattedDate,
      bookingTime: bookingForm.value.bookingTime,
      peopleCount: bookingForm.value.peopleCount,
      contactName: bookingForm.value.contactName,
      contactPhone: bookingForm.value.contactPhone,
      remark: bookingForm.value.remark
    })

    ElMessage.success('预订成功，请等待餐厅确认')
    showBookingDialog.value = false

    // 跳转到预订列表
    router.push('/restaurant/booking')
  } catch (error: any) {
    ElMessage.error(error.message || '预订失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadRestaurantDetail()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.restaurant-detail-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.restaurant-detail {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
}

// 餐厅头部
.restaurant-header {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: $spacing-2xl;
  padding: $spacing-2xl;
  border-bottom: 1px solid $border;

  .header-images {
    border-radius: $radius-lg;
    overflow: hidden;
  }

  .header-info {
    .restaurant-name {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: $spacing-md;
    }

    .rating-section {
      display: flex;
      align-items: center;
      gap: $spacing-lg;
      margin-bottom: $spacing-lg;

      .view-count,
      .order-count {
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }

    .tags-section {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-bottom: $spacing-lg;
    }

    .info-section {
      .info-item {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-md 0;
        border-bottom: 1px solid $border;

        &:last-child {
          border-bottom: none;
        }

        .price {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $danger;
        }
      }
    }

    .action-section {
      margin-top: $spacing-xl;

      .el-button {
        width: 100%;
      }
    }
  }
}

// 餐厅内容
.restaurant-content {
  padding: $spacing-2xl;

  .content-section {
    margin-bottom: $spacing-2xl;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: $font-size-xl;
      font-weight: 600;
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-sm;
      border-bottom: 2px solid $primary;
    }

    .description {
      line-height: 1.8;
      color: $text-secondary;
    }
  }
}

// 菜品列表
.dish-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-lg;

  .dish-item {
    border: 1px solid $border;
    border-radius: $radius;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .dish-image {
      width: 100%;
      height: 180px;
    }

    .dish-info {
      padding: $spacing-md;

      .dish-header {
        @include flex-between;
        margin-bottom: $spacing-sm;

        .dish-name {
          font-size: $font-size-lg;
          font-weight: 600;
        }
      }

      .dish-desc {
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-sm;
        @include ellipsis(2);
        min-height: 36px;
      }

      .dish-tags {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-xs;
        margin-bottom: $spacing-sm;
      }

      .dish-footer {
        @include flex-between;
        padding-top: $spacing-sm;
        border-top: 1px solid $border;

        .dish-price {
          .current-price {
            font-size: 20px;
            font-weight: 600;
            color: $danger;
          }

          .original-price {
            color: $text-secondary;
            font-size: $font-size-sm;
            text-decoration: line-through;
            margin-left: $spacing-xs;
          }

          .unit {
            color: $text-secondary;
            font-size: $font-size-sm;
          }
        }

        .dish-sales {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }
    }
  }
}

@include md {
  .restaurant-header {
    grid-template-columns: 1fr;

    .header-images {
      height: 300px;
    }
  }

  .dish-list {
    grid-template-columns: 1fr;
  }
}
</style>
