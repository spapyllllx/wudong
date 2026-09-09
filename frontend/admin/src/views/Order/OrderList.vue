<template>
  <div class="order-list">
    <h2>订单管理</h2>
    <el-table :data="orders" border stripe>
      <el-table-column prop="orderNo" label="订单号" width="200" />
      <el-table-column prop="userPhone" label="用户手机" width="150" />
      <el-table-column prop="orderType" label="类型" width="100">
        <template #default="{ row }">
          {{ orderTypes[row.orderType] }}
        </template>
      </el-table-column>
      <el-table-column prop="payAmount" label="金额" width="100">
        <template #default="{ row }">¥{{ row.payAmount }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      v-model:current-page="page"
      :page-size="10"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orderTypes = { 1: '商品', 2: '餐位', 3: '住宿', 4: '门票', 5: '路线' }
const page = ref(1)
const total = ref(0)

const orders = ref([])

const loadOrders = () => {
  // TODO: 调用API
  orders.value = [
    { orderNo: 'ORD202609080001', userPhone: '138****1234', orderType: 1, payAmount: '299.00', status: 1, createTime: '2026-09-08 10:30' },
    { orderNo: 'ORD202609080002', userPhone: '139****5678', orderType: 3, payAmount: '560.00', status: 3, createTime: '2026-09-08 11:20' }
  ]
  total.value = 2
}

const statusText = (status) => {
  const map = { 0: '待支付', 1: '已支付', 2: '已取消', 3: '已完成', 4: '已退款', 5: '退款中' }
  return map[status] || '-'
}

const statusType = (status) => {
  const map = { 0: 'warning', 1: 'primary', 2: 'info', 3: 'success', 4: 'danger', 5: 'info' }
  return map[status] || ''
}

const viewDetail = (row) => {
  console.log('查看详情:', row)
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.order-list {
  padding: 20px;
}
</style>
