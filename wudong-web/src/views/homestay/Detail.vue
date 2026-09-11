<template>
  <div class="homestay-detail-page">
    <div class="container" v-loading="loading">
      <div class="back-btn">
        <el-button @click="router.back()" icon="ArrowLeft">返回</el-button>
      </div>

      <div v-if="homestay" class="homestay-detail">
        <!-- 民宿头部 -->
        <div class="homestay-header">
          <div class="header-images">
            <el-carousel height="400px" :interval="5000">
              <el-carousel-item v-for="(image, index) in getImages()" :key="index">
                <el-image :src="image" fit="cover" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="header-info">
            <h1 class="homestay-name">{{ homestay.name }}</h1>

            <div class="rating-section">
              <el-rate v-model="homestay.rating" disabled show-score />
              <span class="view-count">{{ homestay.viewCount }}人浏览</span>
              <span class="order-count">{{ homestay.orderCount }}人预订</span>
            </div>

            <div class="tags-section">
              <el-tag v-for="tag in getTags()" :key="tag" size="large">{{ tag }}</el-tag>
            </div>

            <div class="info-section">
              <div class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ homestay.address }}</span>
              </div>
              <div class="info-item">
                <el-icon><Phone /></el-icon>
                <span>{{ homestay.phone }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>入住：{{ homestay.checkInTime }} | 退房：{{ homestay.checkOutTime }}</span>
              </div>
              <div class="info-item">
                <el-icon><Money /></el-icon>
                <span>最低：<span class="price">¥{{ homestay.minPrice }}</span>/晚</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 民宿内容 -->
        <div class="homestay-content">
          <!-- 民宿介绍 -->
          <div class="content-section">
            <h2 class="section-title">民宿介绍</h2>
            <p class="description">{{ homestay.description }}</p>
          </div>

          <!-- 设施服务 -->
          <div v-if="homestay.facilities" class="content-section">
            <h2 class="section-title">设施服务</h2>
            <div class="facilities-list">
              <el-tag
                v-for="facility in getFacilities()"
                :key="facility"
                size="large"
                type="info"
              >
                {{ facility }}
              </el-tag>
            </div>
          </div>

          <!-- 房型列表 -->
          <div class="content-section">
            <h2 class="section-title">房型选择</h2>

            <div class="room-list">
              <div v-for="room in homestay.roomTypes" :key="room.id" class="room-card">
                <el-image :src="room.image" fit="cover" class="room-image" />

                <div class="room-info">
                  <h3 class="room-name">{{ room.name }}</h3>
                  <p class="room-desc">{{ room.description }}</p>

                  <div class="room-details">
                    <span class="detail-item">面积：{{ room.area }}㎡</span>
                    <span class="detail-item">床型：{{ room.bedType }}</span>
                    <span class="detail-item">最多：{{ room.maxGuests }}人</span>
                  </div>

                  <div v-if="room.facilities" class="room-facilities">
                    <el-tag
                      v-for="facility in room.facilities.split(',')"
                      :key="facility"
                      size="small"
                    >
                      {{ facility }}
                    </el-tag>
                  </div>

                  <div class="room-footer">
                    <div class="room-price">
                      <span class="price">¥{{ room.price }}</span>
                      <span class="unit">/晚</span>
                      <span v-if="room.weekendPrice" class="weekend-price">
                        周末¥{{ room.weekendPrice }}
                      </span>
                    </div>
                    <el-button type="primary" @click="handleBooking(room)">立即预订</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!homestay && !loading" description="民宿不存在" />
    </div>

    <!-- 预订对话框 -->
    <el-dialog v-model="showBookingDialog" title="预订房间" width="600px">
      <div v-if="selectedRoom" class="booking-info">
        <div class="room-summary">
          <el-image :src="selectedRoom.image" class="summary-image" />
          <div class="summary-info">
            <h3>{{ selectedRoom.name }}</h3>
            <p>{{ selectedRoom.description }}</p>
            <div class="summary-price">¥{{ selectedRoom.price }}/晚</div>
          </div>
        </div>

        <el-form :model="bookingForm" label-width="100px">
          <el-form-item label="入住日期">
            <el-date-picker
              v-model="bookingForm.checkInDate"
              type="date"
              placeholder="选择入住日期"
              :disabled-date="disabledDate"
              @change="calculatePrice"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="退房日期">
            <el-date-picker
              v-model="bookingForm.checkOutDate"
              type="date"
              placeholder="选择退房日期"
              :disabled-date="disabledCheckOutDate"
              @change="calculatePrice"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="房间数">
            <el-input-number
              v-model="bookingForm.roomCount"
              :min="1"
              :max="selectedRoom.totalRooms"
              @change="calculatePrice"
            />
            <span class="tip">（剩余{{ selectedRoom.totalRooms }}间）</span>
          </el-form-item>
          <el-form-item label="入住人数">
            <el-input-number
              v-model="bookingForm.guestCount"
              :min="1"
              :max="selectedRoom.maxGuests * bookingForm.roomCount"
            />
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

          <div v-if="priceDetail.nights > 0" class="price-detail">
            <div class="detail-row">
              <span>入住天数：</span>
              <span>{{ priceDetail.nights }}晚</span>
            </div>
            <div class="detail-row">
              <span>房间数量：</span>
              <span>{{ bookingForm.roomCount }}间</span>
            </div>
            <div class="detail-row total">
              <span>总计：</span>
              <span class="total-price">¥{{ priceDetail.totalAmount }}</span>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="showBookingDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitBooking">
          确认预订
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { LocationFilled, Phone, Clock, Money } from '@element-plus/icons-vue'
import { getHomestayDetail, createHomestayOrder } from '@/api/homestay'
import type { Homestay, RoomType } from '@/api/homestay'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const homestay = ref<Homestay | null>(null)
const selectedRoom = ref<RoomType | null>(null)
const showBookingDialog = ref(false)

const bookingForm = ref({
  checkInDate: '',
  checkOutDate: '',
  roomCount: 1,
  guestCount: 2,
  contactName: '',
  contactPhone: '',
  remark: ''
})

const priceDetail = ref({
  nights: 0,
  totalAmount: 0
})

// 获取图片列表
function getImages() {
  if (!homestay.value) return []
  const images = [homestay.value.cover]
  if (homestay.value.images && homestay.value.images.length > 0) {
    images.push(...homestay.value.images)
  }
  return images
}

// 获取标签
function getTags() {
  if (!homestay.value || !homestay.value.tags) return []
  return homestay.value.tags.split(',')
}

// 获取设施
function getFacilities() {
  if (!homestay.value || !homestay.value.facilities) return []
  return homestay.value.facilities.split(',')
}

// 禁用过去的日期
function disabledDate(date: Date) {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

// 禁用退房日期（必须在入住日期之后）
function disabledCheckOutDate(date: Date) {
  if (!bookingForm.value.checkInDate) {
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }
  const checkIn = new Date(bookingForm.value.checkInDate)
  checkIn.setDate(checkIn.getDate() + 1)
  return date < checkIn
}

// 计算价格
function calculatePrice() {
  if (!bookingForm.value.checkInDate || !bookingForm.value.checkOutDate || !selectedRoom.value) {
    priceDetail.value = { nights: 0, totalAmount: 0 }
    return
  }

  const checkIn = new Date(bookingForm.value.checkInDate).getTime()
  const checkOut = new Date(bookingForm.value.checkOutDate).getTime()
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

  if (nights <= 0) {
    priceDetail.value = { nights: 0, totalAmount: 0 }
    return
  }

  const totalAmount = selectedRoom.value.price * nights * bookingForm.value.roomCount

  priceDetail.value = {
    nights,
    totalAmount
  }
}

// 加载民宿详情
async function loadHomestayDetail() {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('民宿ID无效')
    router.back()
    return
  }

  loading.value = true
  try {
    homestay.value = await getHomestayDetail(id)
  } catch (error: any) {
    console.error('加载民宿详情失败:', error)
    ElMessage.error(error.message || '加载民宿详情失败')
  } finally {
    loading.value = false
  }
}

// 打开预订对话框
function handleBooking(room: RoomType) {
  selectedRoom.value = room
  bookingForm.value.guestCount = room.maxGuests
  showBookingDialog.value = true
}

// 提交预订
async function handleSubmitBooking() {
  if (!homestay.value || !selectedRoom.value) return

  // 验证表单
  if (!bookingForm.value.checkInDate) {
    ElMessage.warning('请选择入住日期')
    return
  }

  if (!bookingForm.value.checkOutDate) {
    ElMessage.warning('请选择退房日期')
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
    const checkInDate = new Date(bookingForm.value.checkInDate).toISOString().split('T')[0]
    const checkOutDate = new Date(bookingForm.value.checkOutDate).toISOString().split('T')[0]

    const order = await createHomestayOrder({
      homestayId: homestay.value.id,
      roomTypeId: selectedRoom.value.id,
      checkInDate,
      checkOutDate,
      roomCount: bookingForm.value.roomCount,
      guestCount: bookingForm.value.guestCount,
      contactName: bookingForm.value.contactName,
      contactPhone: bookingForm.value.contactPhone,
      remark: bookingForm.value.remark
    })

    ElMessage.success('预订成功')
    showBookingDialog.value = false

    // 跳转到订单列表
    router.push('/homestay/order')
  } catch (error: any) {
    ElMessage.error(error.message || '预订失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadHomestayDetail()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.homestay-detail-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.homestay-detail {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
}

// 民宿头部
.homestay-header {
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
    .homestay-name {
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
  }
}

// 民宿内容
.homestay-content {
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

    .facilities-list {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-md;
    }
  }
}

// 房型列表
.room-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  .room-card {
    display: flex;
    border: 1px solid $border;
    border-radius: $radius;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .room-image {
      width: 250px;
      height: 200px;
      flex-shrink: 0;
    }

    .room-info {
      flex: 1;
      padding: $spacing-lg;
      display: flex;
      flex-direction: column;

      .room-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-sm;
      }

      .room-desc {
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-md;
      }

      .room-details {
        display: flex;
        gap: $spacing-lg;
        margin-bottom: $spacing-md;

        .detail-item {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }

      .room-facilities {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-xs;
        margin-bottom: $spacing-md;
      }

      .room-footer {
        margin-top: auto;
        @include flex-between;
        padding-top: $spacing-md;
        border-top: 1px solid $border;

        .room-price {
          .price {
            font-size: 24px;
            font-weight: 600;
            color: $danger;
          }

          .unit {
            color: $text-secondary;
            font-size: $font-size-sm;
          }

          .weekend-price {
            color: $text-secondary;
            font-size: $font-size-sm;
            margin-left: $spacing-md;
          }
        }
      }
    }
  }
}

// 预订对话框
.booking-info {
  .room-summary {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $bg;
    border-radius: $radius;
    margin-bottom: $spacing-lg;

    .summary-image {
      width: 120px;
      height: 100px;
      border-radius: $radius;
    }

    .summary-info {
      flex: 1;

      h3 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-xs;
      }

      p {
        color: $text-secondary;
        font-size: $font-size-sm;
        margin-bottom: $spacing-sm;
      }

      .summary-price {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $danger;
      }
    }
  }

  .tip {
    color: $text-secondary;
    font-size: $font-size-sm;
    margin-left: $spacing-sm;
  }

  .price-detail {
    background: $bg;
    padding: $spacing-lg;
    border-radius: $radius;
    margin-top: $spacing-lg;

    .detail-row {
      @include flex-between;
      padding: $spacing-sm 0;

      &.total {
        padding-top: $spacing-md;
        border-top: 1px solid $border;
        font-size: $font-size-lg;
        font-weight: 600;

        .total-price {
          font-size: 24px;
          color: $danger;
        }
      }
    }
  }
}

@include md {
  .homestay-header {
    grid-template-columns: 1fr;

    .header-images {
      height: 300px;
    }
  }

  .room-card {
    flex-direction: column;

    .room-image {
      width: 100%;
      height: 180px;
    }
  }
}
</style>
