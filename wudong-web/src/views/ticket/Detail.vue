<template>
  <div class="ticket-detail-page">
    <div class="container" v-loading="loading">
      <div class="back-btn">
        <el-button @click="router.back()" icon="ArrowLeft">返回</el-button>
      </div>

      <div v-if="attraction" class="attraction-detail">
        <!-- 景点头部 -->
        <div class="attraction-header">
          <div class="header-images">
            <el-carousel height="400px" :interval="5000">
              <el-carousel-item v-for="(image, index) in getImages()" :key="index">
                <el-image :src="image" fit="cover" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="header-info">
            <h1 class="attraction-name">{{ attraction.name }}</h1>

            <div class="rating-section">
              <el-rate v-model="attraction.rating" disabled show-score />
              <span class="view-count">{{ attraction.viewCount }}人浏览</span>
              <span class="order-count">{{ attraction.orderCount }}人购买</span>
            </div>

            <div class="tags-section">
              <el-tag v-for="tag in getTags()" :key="tag" size="large">{{ tag }}</el-tag>
            </div>

            <div class="info-section">
              <div class="info-item">
                <el-icon><LocationFilled /></el-icon>
                <span>{{ attraction.address }}</span>
              </div>
              <div class="info-item">
                <el-icon><Phone /></el-icon>
                <span>{{ attraction.phone }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>开放时间：{{ attraction.openTime }}</span>
              </div>
              <div class="info-item">
                <el-icon><Money /></el-icon>
                <span>最低：<span class="price">¥{{ attraction.minPrice }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 景点内容 -->
        <div class="attraction-content">
          <!-- 景点介绍 -->
          <div class="content-section">
            <h2 class="section-title">景点介绍</h2>
            <p class="description">{{ attraction.detailContent || attraction.description }}</p>
          </div>

          <!-- 游玩贴士 -->
          <div v-if="attraction.tips" class="content-section">
            <h2 class="section-title">游玩贴士</h2>
            <div class="tips-content">{{ attraction.tips }}</div>
          </div>

          <!-- 交通指南 -->
          <div v-if="attraction.traffic" class="content-section">
            <h2 class="section-title">交通指南</h2>
            <div class="traffic-content">{{ attraction.traffic }}</div>
          </div>

          <!-- 票型列表 -->
          <div class="content-section">
            <h2 class="section-title">门票选择</h2>

            <div class="ticket-list">
              <div v-for="ticket in attraction.ticketTypes" :key="ticket.id" class="ticket-card">
                <div class="ticket-info">
                  <h3 class="ticket-name">{{ ticket.name }}</h3>
                  <p class="ticket-desc">{{ ticket.description }}</p>

                  <div class="ticket-details">
                    <div class="detail-item">
                      <span class="label">有效期：</span>
                      <span>{{ ticket.validDays }}天</span>
                    </div>
                    <div class="detail-item">
                      <span class="label">库存：</span>
                      <span>{{ ticket.stock }}张</span>
                    </div>
                  </div>

                  <div class="ticket-rules">
                    <el-collapse>
                      <el-collapse-item title="退改规则" name="refund">
                        {{ ticket.refundRule }}
                      </el-collapse-item>
                      <el-collapse-item title="使用规则" name="use">
                        {{ ticket.useRule }}
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </div>

                <div class="ticket-action">
                  <div class="ticket-price">
                    <span class="current-price">¥{{ ticket.price }}</span>
                    <span v-if="ticket.originalPrice" class="original-price">
                      ¥{{ ticket.originalPrice }}
                    </span>
                  </div>
                  <el-button type="primary" size="large" @click="handleBuyTicket(ticket)">
                    立即购买
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!attraction && !loading" description="景点不存在" />
    </div>

    <!-- 购票对话框 -->
    <el-dialog v-model="showBuyDialog" title="购买门票" width="600px">
      <div v-if="selectedTicket" class="buy-info">
        <div class="ticket-summary">
          <h3>{{ selectedTicket.name }}</h3>
          <p>{{ selectedTicket.description }}</p>
          <div class="summary-price">¥{{ selectedTicket.price }}/张</div>
        </div>

        <el-form :model="buyForm" label-width="100px">
          <el-form-item label="使用日期">
            <el-date-picker
              v-model="buyForm.useDate"
              type="date"
              placeholder="选择使用日期"
              :disabled-date="disabledDate"
              @change="calculatePrice"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="购买数量">
            <el-input-number
              v-model="buyForm.quantity"
              :min="1"
              :max="Math.min(selectedTicket.stock, 10)"
              @change="calculatePrice"
            />
            <span class="tip">（最多购买10张）</span>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="buyForm.contactName" placeholder="请输入联系人姓名" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="buyForm.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="buyForm.contactIdCard" placeholder="请输入身份证号" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="buyForm.remark"
              type="textarea"
              :rows="3"
              placeholder="如有特殊要求请备注"
            />
          </el-form-item>

          <div class="price-detail">
            <div class="detail-row total">
              <span>总计：</span>
              <span class="total-price">¥{{ totalPrice }}</span>
            </div>
          </div>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="showBuyDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmitOrder">
          确认购买
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
import { getAttractionDetail, createTicketOrder } from '@/api/ticket'
import type { Attraction, TicketType } from '@/api/ticket'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const attraction = ref<Attraction | null>(null)
const selectedTicket = ref<TicketType | null>(null)
const showBuyDialog = ref(false)

const buyForm = ref({
  useDate: '',
  quantity: 1,
  contactName: '',
  contactPhone: '',
  contactIdCard: '',
  remark: ''
})

// 计算总价
const totalPrice = computed(() => {
  if (!selectedTicket.value) return 0
  return selectedTicket.value.price * buyForm.value.quantity
})

// 获取图片列表
function getImages() {
  if (!attraction.value) return []
  const images = [attraction.value.cover]
  if (attraction.value.images && attraction.value.images.length > 0) {
    images.push(...attraction.value.images)
  }
  return images
}

// 获取标签
function getTags() {
  if (!attraction.value || !attraction.value.tags) return []
  return attraction.value.tags.split(',')
}

// 禁用过去的日期
function disabledDate(date: Date) {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

// 计算价格
function calculatePrice() {
  // 这里可以根据日期、数量等计算价格
}

// 加载景点详情
async function loadAttractionDetail() {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('景点ID无效')
    router.back()
    return
  }

  loading.value = true
  try {
    attraction.value = await getAttractionDetail(id)
  } catch (error: any) {
    console.error('加载景点详情失败:', error)
    ElMessage.error(error.message || '加载景点详情失败')
  } finally {
    loading.value = false
  }
}

// 打开购票对话框
function handleBuyTicket(ticket: TicketType) {
  selectedTicket.value = ticket
  showBuyDialog.value = true
}

// 提交订单
async function handleSubmitOrder() {
  if (!attraction.value || !selectedTicket.value) return

  // 验证表单
  if (!buyForm.value.useDate) {
    ElMessage.warning('请选择使用日期')
    return
  }

  if (!buyForm.value.contactName) {
    ElMessage.warning('请输入联系人')
    return
  }

  if (!buyForm.value.contactPhone) {
    ElMessage.warning('请输入联系电话')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(buyForm.value.contactPhone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  if (!buyForm.value.contactIdCard) {
    ElMessage.warning('请输入身份证号')
    return
  }

  if (!/^\d{17}[\dXx]$/.test(buyForm.value.contactIdCard)) {
    ElMessage.warning('请输入正确的身份证号')
    return
  }

  submitting.value = true
  try {
    // 格式化日期
    const useDate = new Date(buyForm.value.useDate).toISOString().split('T')[0]

    await createTicketOrder({
      attractionId: attraction.value.id,
      ticketTypeId: selectedTicket.value.id,
      quantity: buyForm.value.quantity,
      useDate,
      contactName: buyForm.value.contactName,
      contactPhone: buyForm.value.contactPhone,
      contactIdCard: buyForm.value.contactIdCard,
      remark: buyForm.value.remark
    })

    ElMessage.success('购票成功')
    showBuyDialog.value = false

    // 跳转到订单列表
    router.push('/ticket/order')
  } catch (error: any) {
    ElMessage.error(error.message || '购票失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadAttractionDetail()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.ticket-detail-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.back-btn {
  margin-bottom: $spacing-lg;
}

.attraction-detail {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
}

// 景点头部
.attraction-header {
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
    .attraction-name {
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

// 景点内容
.attraction-content {
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

    .description,
    .tips-content,
    .traffic-content {
      line-height: 1.8;
      color: $text-secondary;
      white-space: pre-line;
    }
  }
}

// 票型列表
.ticket-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  .ticket-card {
    display: flex;
    justify-content: space-between;
    border: 1px solid $border;
    border-radius: $radius;
    padding: $spacing-lg;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .ticket-info {
      flex: 1;

      .ticket-name {
        font-size: $font-size-lg;
        font-weight: 600;
        margin-bottom: $spacing-sm;
      }

      .ticket-desc {
        color: $text-secondary;
        margin-bottom: $spacing-md;
      }

      .ticket-details {
        display: flex;
        gap: $spacing-lg;
        margin-bottom: $spacing-md;

        .detail-item {
          .label {
            color: $text-secondary;
            font-size: $font-size-sm;
          }
        }
      }

      .ticket-rules {
        margin-top: $spacing-md;
      }
    }

    .ticket-action {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      min-width: 180px;

      .ticket-price {
        .current-price {
          font-size: 28px;
          font-weight: 600;
          color: $danger;
        }

        .original-price {
          color: $text-secondary;
          font-size: $font-size-sm;
          text-decoration: line-through;
          margin-left: $spacing-sm;
        }
      }
    }
  }
}

// 购票对话框
.buy-info {
  .ticket-summary {
    background: $bg;
    padding: $spacing-lg;
    border-radius: $radius;
    margin-bottom: $spacing-lg;

    h3 {
      font-size: $font-size-lg;
      margin-bottom: $spacing-xs;
    }

    p {
      color: $text-secondary;
      margin-bottom: $spacing-sm;
    }

    .summary-price {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $danger;
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

    .detail-row.total {
      @include flex-between;
      font-size: $font-size-lg;
      font-weight: 600;

      .total-price {
        font-size: 24px;
        color: $danger;
      }
    }
  }
}

@include md {
  .attraction-header {
    grid-template-columns: 1fr;

    .header-images {
      height: 300px;
    }
  }

  .ticket-card {
    flex-direction: column;
    align-items: stretch !important;

    .ticket-action {
      align-items: flex-start !important;
      margin-top: $spacing-md;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
