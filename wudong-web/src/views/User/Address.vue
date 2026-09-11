<template>
  <div class="address-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">收货地址管理</h1>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增地址
        </el-button>
      </div>

      <div v-loading="loading" class="address-list">
        <div
          v-for="address in addressList"
          :key="address.id"
          class="address-card"
          :class="{ 'is-default': address.isDefault === 1 }"
        >
          <div class="card-content">
            <div class="card-header">
              <div class="receiver-info">
                <span class="receiver-name">{{ address.receiverName }}</span>
                <span class="receiver-phone">{{ address.receiverPhone }}</span>
                <el-tag v-if="address.isDefault === 1" type="danger" size="small">默认</el-tag>
              </div>
            </div>

            <div class="address-detail">
              <el-icon><LocationFilled /></el-icon>
              <span>{{ address.province }} {{ address.city }} {{ address.district }} {{ address.address }}</span>
            </div>

            <div class="card-actions">
              <el-button
                v-if="address.isDefault !== 1"
                link
                type="primary"
                @click="handleSetDefault(address)"
              >
                设为默认
              </el-button>
              <el-button link type="primary" @click="handleEdit(address)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button link type="danger" @click="handleDelete(address)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="addressList.length === 0 && !loading" description="暂无地址，快来添加吧">
          <el-button type="primary" @click="handleAdd">添加地址</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="showDialog"
      :title="isEdit ? '编辑地址' : '新增地址'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="addressForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="收货人" prop="receiverName">
          <el-input
            v-model="addressForm.receiverName"
            placeholder="请输入收货人姓名"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="手机号" prop="receiverPhone">
          <el-input
            v-model="addressForm.receiverPhone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionOptions"
            placeholder="请选择省市区"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="addressForm.address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址（街道、门牌号等）"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.isDefaultBool">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, LocationFilled, Edit, Delete } from '@element-plus/icons-vue'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/address'
import type { Address } from '@/api/address'

const loading = ref(false)
const submitting = ref(false)
const addressList = ref<Address[]>([])
const showDialog = ref(false)
const isEdit = ref(false)
const currentEditId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const addressForm = reactive({
  receiverName: '',
  receiverPhone: '',
  region: [] as string[],
  address: '',
  isDefaultBool: false
})

// 表单验证规则
const rules: FormRules = {
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
  ],
  receiverPhone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value || value.length !== 3) {
          callback(new Error('请选择完整的省市区'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '地址长度在5-100个字符', trigger: 'blur' }
  ]
}

// 省市区数据
const regionOptions = [
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
          { value: '花溪区', label: '花溪区' },
          { value: '观山湖区', label: '观山湖区' },
          { value: '白云区', label: '白云区' },
          { value: '乌当区', label: '乌当区' }
        ]
      },
      {
        value: '遵义市',
        label: '遵义市',
        children: [
          { value: '红花岗区', label: '红花岗区' },
          { value: '汇川区', label: '汇川区' },
          { value: '播州区', label: '播州区' },
          { value: '仁怀市', label: '仁怀市' }
        ]
      },
      {
        value: '安顺市',
        label: '安顺市',
        children: [
          { value: '西秀区', label: '西秀区' },
          { value: '平坝区', label: '平坝区' },
          { value: '普定县', label: '普定县' },
          { value: '镇宁县', label: '镇宁县' }
        ]
      },
      {
        value: '黔东南州',
        label: '黔东南州',
        children: [
          { value: '凯里市', label: '凯里市' },
          { value: '雷山县', label: '雷山县' },
          { value: '黎平县', label: '黎平县' },
          { value: '从江县', label: '从江县' }
        ]
      },
      {
        value: '毕节市',
        label: '毕节市',
        children: [
          { value: '七星关区', label: '七星关区' },
          { value: '大方县', label: '大方县' },
          { value: '黔西市', label: '黔西市' }
        ]
      },
      {
        value: '铜仁市',
        label: '铜仁市',
        children: [
          { value: '碧江区', label: '碧江区' },
          { value: '万山区', label: '万山区' },
          { value: '江口县', label: '江口县' }
        ]
      }
    ]
  }
]

// 加载地址列表
async function loadAddressList() {
  loading.value = true
  try {
    addressList.value = await getAddressList()
  } catch (error: any) {
    console.error('加载地址失败:', error)
    ElMessage.error(error.message || '加载地址失败')
  } finally {
    loading.value = false
  }
}

// 打开新增对话框
function handleAdd() {
  isEdit.value = false
  currentEditId.value = null
  resetForm()
  showDialog.value = true
}

// 打开编辑对话框
function handleEdit(address: Address) {
  isEdit.value = true
  currentEditId.value = address.id

  addressForm.receiverName = address.receiverName
  addressForm.receiverPhone = address.receiverPhone
  addressForm.region = [address.province, address.city, address.district]
  addressForm.address = address.address
  addressForm.isDefaultBool = address.isDefault === 1

  showDialog.value = true
}

// 重置表单
function resetForm() {
  addressForm.receiverName = ''
  addressForm.receiverPhone = ''
  addressForm.region = []
  addressForm.address = ''
  addressForm.isDefaultBool = false

  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 关闭对话框
function handleDialogClose() {
  resetForm()
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const data = {
        receiverName: addressForm.receiverName,
        receiverPhone: addressForm.receiverPhone,
        province: addressForm.region[0],
        city: addressForm.region[1],
        district: addressForm.region[2],
        address: addressForm.address,
        isDefault: addressForm.isDefaultBool ? 1 : 0
      }

      if (isEdit.value && currentEditId.value) {
        await updateAddress(currentEditId.value, data)
        ElMessage.success('地址修改成功')
      } else {
        await addAddress(data)
        ElMessage.success('地址添加成功')
      }

      showDialog.value = false
      await loadAddressList()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// 设为默认地址
async function handleSetDefault(address: Address) {
  try {
    await setDefaultAddress(address.id)
    ElMessage.success('已设为默认地址')
    await loadAddressList()
  } catch (error: any) {
    ElMessage.error(error.message || '设置失败')
  }
}

// 删除地址
async function handleDelete(address: Address) {
  try {
    await ElMessageBox.confirm(
      `确定要删除这个地址吗？\n${address.receiverName} ${address.receiverPhone}`,
      '删除地址',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteAddress(address.id)
    ElMessage.success('删除成功')
    await loadAddressList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadAddressList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.address-page {
  background: $bg;
  min-height: 100vh;
  padding: $spacing-2xl 0;
}

.page-header {
  @include flex-between;
  margin-bottom: $spacing-xl;

  .page-title {
    font-size: 28px;
    font-weight: 600;
  }
}

.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: $spacing-lg;

  .address-card {
    background: white;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    border: 2px solid transparent;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    &.is-default {
      border-color: $primary;
      background: linear-gradient(135deg, rgba(230, 57, 70, 0.02), rgba(244, 162, 97, 0.02));
    }

    .card-content {
      .card-header {
        margin-bottom: $spacing-md;

        .receiver-info {
          display: flex;
          align-items: center;
          gap: $spacing-md;

          .receiver-name {
            font-size: $font-size-lg;
            font-weight: 600;
          }

          .receiver-phone {
            color: $text-secondary;
          }
        }
      }

      .address-detail {
        display: flex;
        gap: $spacing-sm;
        padding: $spacing-md;
        background: $bg;
        border-radius: $radius;
        margin-bottom: $spacing-md;
        line-height: 1.6;
        color: $text-secondary;

        .el-icon {
          color: $primary;
          flex-shrink: 0;
          margin-top: 2px;
        }
      }

      .card-actions {
        display: flex;
        gap: $spacing-md;
        justify-content: flex-end;
        padding-top: $spacing-sm;
        border-top: 1px solid $border;
      }
    }
  }
}

@include md {
  .address-list {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    gap: $spacing-md;
    align-items: stretch;
  }
}
</style>
