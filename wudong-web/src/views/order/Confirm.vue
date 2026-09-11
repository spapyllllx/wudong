<template>
  <div class="order-confirm-page">
    <div class="container" v-loading="loading">
      <h1 class="page-title">确认订单</h1>

      <div class="order-content">
        <!-- 收货地址 -->
        <div class="address-section">
          <h3 class="section-title">收货地址</h3>

          <!-- 地址列表为空时 -->
          <el-button v-if="addressList.length === 0" type="primary" @click="showAddressDialog = true">
            添加收货地址
          </el-button>

          <!-- 地址列表不为空时，显示下拉选择 -->
          <div v-else>
            <div class="address-selector">
              <el-select
                v-model="selectedAddressId"
                placeholder="请选择收货地址"
                style="width: 100%; margin-bottom: 16px"
                @change="handleAddressChange"
              >
                <el-option
                  v-for="addr in addressList"
                  :key="addr.id"
                  :label="`${addr.receiverName} ${addr.receiverPhone} - ${addr.province}${addr.city}${addr.district}${addr.address}`"
                  :value="addr.id"
                >
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <span>{{ addr.receiverName }} {{ addr.receiverPhone }}</span>
                    <el-tag v-if="addr.isDefault" type="primary" size="small">默认</el-tag>
                  </div>
                </el-option>
              </el-select>
              <el-button type="primary" link @click="showAddressDialog = true">
                新增地址
              </el-button>
            </div>

            <!-- 显示当前选中的地址详情 -->
            <div class="address-card" v-if="selectedAddress">
              <div class="address-header">
                <span class="receiver-name">{{ selectedAddress.receiverName }}</span>
                <span class="receiver-phone">{{ selectedAddress.receiverPhone }}</span>
                <el-tag v-if="selectedAddress.isDefault" type="primary" size="small">默认</el-tag>
              </div>
              <div class="address-detail">
                {{ selectedAddress.province }}
                {{ selectedAddress.city }}
                {{ selectedAddress.district }}
                {{ selectedAddress.address }}
              </div>
            </div>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="goods-section">
          <h3 class="section-title">商品清单</h3>
          <div class="goods-list">
            <div v-for="item in orderItems" :key="item.id" class="goods-item">
              <el-image :src="item.currentImage" fit="cover" class="goods-image" />
              <div class="goods-info">
                <div class="goods-title">{{ item.productTitle }}</div>
                <div v-if="item.skuName" class="goods-sku">{{ item.skuName }}</div>
              </div>
              <div class="goods-price">¥{{ item.currentPrice }}</div>
              <div class="goods-quantity">x{{ item.quantity }}</div>
              <div class="goods-total">¥{{ (item.currentPrice * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- 订单备注 -->
        <div class="remark-section">
          <h3 class="section-title">订单备注</h3>
          <el-input
            v-model="remark"
            type="textarea"
            :rows="3"
            placeholder="选填，可以告诉卖家您的特殊需求"
            maxlength="200"
            show-word-limit
          />
        </div>

        <!-- 价格明细 -->
        <div class="summary-section">
          <div class="summary-item">
            <span>商品总价：</span>
            <span>¥{{ totalAmount.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span>运费：</span>
            <span>¥{{ freight.toFixed(2) }}</span>
          </div>
          <div class="summary-item total">
            <span>实付金额：</span>
            <span class="total-price">¥{{ payAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            提交订单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 地址选择/编辑对话框 -->
    <el-dialog v-model="showAddressDialog" title="收货地址" width="500px">
      <el-form :model="addressForm" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="addressForm.receiverName" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addressForm.receiverPhone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="所在地区">
          <el-cascader
            v-model="addressForm.region"
            :options="regionOptions"
            placeholder="请选择省市区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input
            v-model="addressForm.receiverAddress"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSelectedItems } from '@/api/cart'
import { createOrder } from '@/api/order'
import { getAddressList, addAddress, getDefaultAddress } from '@/api/address'
import type { CartItem } from '@/api/cart'
import type { Address } from '@/api/address'

const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const orderItems = ref<CartItem[]>([])
const remark = ref('')
const showAddressDialog = ref(false)
const addressList = ref<Address[]>([])
const selectedAddressId = ref<number | null>(null)

// 地址相关
const selectedAddress = ref<Address | null>(null)
const addressForm = ref({
  receiverName: '',
  receiverPhone: '',
  region: [] as string[],
  receiverAddress: ''
})

// 简化的地区选项（实际项目中应该从接口获取）
const regionOptions = ref([
  {
    value: '贵州省',
    label: '贵州省',
    children: [
      {
        value: '贵阳市',
        label: '贵阳市',
        children: [
          { value: '云岩区', label: '云岩区' },
          { value: '南明区', label: '南明区' },
          { value: '花溪区', label: '花溪区' }
        ]
      },
      {
        value: '遵义市',
        label: '遵义市',
        children: [
          { value: '红花岗区', label: '红花岗区' },
          { value: '汇川区', label: '汇川区' }
        ]
      }
    ]
  }
])

// 计算价格
const totalAmount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0)
})

const freight = computed(() => {
  return 0 // 免运费
})

const payAmount = computed(() => {
  return totalAmount.value + freight.value
})

// 加载订单商品
async function loadOrderItems() {
  loading.value = true
  try {
    orderItems.value = await getSelectedItems()

    if (orderItems.value.length === 0) {
      ElMessage.warning('请先选择要购买的商品')
      router.push('/cart')
      return
    }

    // 加载地址列表
    await loadAddressList()
  } catch (error: any) {
    console.error('加载商品失败:', error)
    ElMessage.error(error.message || '加载商品失败')
  } finally {
    loading.value = false
  }
}

// 加载地址列表
async function loadAddressList() {
  try {
    addressList.value = await getAddressList()

    // 如果有地址，自动选中默认地址或第一个
    if (addressList.value.length > 0) {
      const defaultAddr = addressList.value.find(addr => addr.isDefault === 1)
      selectedAddress.value = defaultAddr || addressList.value[0]
      selectedAddressId.value = selectedAddress.value.id

      // 预填表单
      if (selectedAddress.value) {
        addressForm.value = {
          receiverName: selectedAddress.value.receiverName,
          receiverPhone: selectedAddress.value.receiverPhone,
          region: [selectedAddress.value.province, selectedAddress.value.city, selectedAddress.value.district],
          receiverAddress: selectedAddress.value.address
        }
      }
    }
  } catch (error: any) {
    console.error('加载地址失败:', error)
  }
}

// 切换选中的地址
function handleAddressChange(addressId: number) {
  selectedAddress.value = addressList.value.find(addr => addr.id === addressId) || null
}

// 保存地址
async function handleSaveAddress() {
  const form = addressForm.value

  if (!form.receiverName) {
    ElMessage.warning('请输入收货人姓名')
    return
  }

  if (!form.receiverPhone) {
    ElMessage.warning('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(form.receiverPhone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  if (form.region.length !== 3) {
    ElMessage.warning('请选择省市区')
    return
  }

  if (!form.receiverAddress) {
    ElMessage.warning('请输入详细地址')
    return
  }

  try {
    // 保存到数据库
    const newAddress = await addAddress({
      receiverName: form.receiverName,
      receiverPhone: form.receiverPhone,
      province: form.region[0],
      city: form.region[1],
      district: form.region[2],
      address: form.receiverAddress,
      isDefault: addressList.value.length === 0 ? 1 : 0 // 第一个地址自动设为默认
    })

    selectedAddress.value = newAddress
    selectedAddressId.value = newAddress.id
    showAddressDialog.value = false
    ElMessage.success('地址已保存')

    // 重新加载地址列表
    await loadAddressList()
  } catch (error: any) {
    ElMessage.error(error.message || '保存地址失败')
  }
}

// 提交订单
async function handleSubmit() {
  if (!selectedAddress.value) {
    ElMessage.warning('请先选择收货地址')
    showAddressDialog.value = true
    return
  }

  submitting.value = true
  try {
    const order = await createOrder({
      items: orderItems.value,
      address: {
        receiverName: selectedAddress.value.receiverName,
        receiverPhone: selectedAddress.value.receiverPhone,
        receiverProvince: selectedAddress.value.province,
        receiverCity: selectedAddress.value.city,
        receiverDistrict: selectedAddress.value.district,
        receiverAddress: selectedAddress.value.address
      },
      remark: remark.value
    })

    ElMessage.success('订单创建成功')

    // 跳转到订单详情或订单列表
    router.push({
      path: '/order/detail',
      query: { orderNo: order.orderNo }
    })
  } catch (error: any) {
    console.error('创建订单失败:', error)
    ElMessage.error(error.message || '创建订单失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadOrderItems()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.order-confirm-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

.order-content {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-xl;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid $primary;
}

// 收货地址
.address-section {
  margin-bottom: $spacing-2xl;

  .address-selector {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }

  .address-card {
    background: $bg;
    padding: $spacing-lg;
    border-radius: $radius;
    border: 2px solid $primary;

    .address-header {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-sm;

      .receiver-name {
        font-size: $font-size-lg;
        font-weight: 600;
      }

      .receiver-phone {
        color: $text-secondary;
      }
    }

    .address-detail {
      color: $text-secondary;
      margin-bottom: $spacing-sm;
      line-height: 1.6;
    }
  }
}

// 商品列表
.goods-section {
  margin-bottom: $spacing-2xl;

  .goods-list {
    .goods-item {
      display: grid;
      grid-template-columns: 100px 1fr 120px 80px 120px;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border;

      &:last-child {
        border-bottom: none;
      }

      .goods-image {
        width: 100px;
        height: 100px;
        border-radius: $radius;
      }

      .goods-info {
        .goods-title {
          font-weight: 500;
          margin-bottom: $spacing-xs;
          @include ellipsis(2);
        }

        .goods-sku {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }

      .goods-price,
      .goods-quantity,
      .goods-total {
        text-align: center;
      }

      .goods-price,
      .goods-total {
        color: $danger;
        font-weight: 500;
      }

      .goods-total {
        font-size: $font-size-lg;
      }
    }
  }
}

// 订单备注
.remark-section {
  margin-bottom: $spacing-2xl;
}

// 价格明细
.summary-section {
  background: $bg;
  padding: $spacing-lg;
  border-radius: $radius;
  margin-bottom: $spacing-2xl;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

// 提交按钮
.submit-section {
  @include flex-center;

  .el-button {
    min-width: 200px;
  }
}

@include md {
  .goods-item {
    grid-template-columns: 80px 1fr 100px 60px 100px;
    font-size: $font-size-sm;

    .goods-image {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
