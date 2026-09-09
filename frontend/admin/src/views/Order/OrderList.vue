<template>
  <div class="order-list">
    <h2>订单管理</h2>
    <el-table :data="orders" stripe>
      <el-table-column prop="id" label="订单号" />
      <el-table-column prop="user" label="用户" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  { id: 'ORD001', user: '用户A', amount: '299.00', status: '已完成' }
])
</script>

<style scoped>
.order-list { padding: 20px; }
</style>
