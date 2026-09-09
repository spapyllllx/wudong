<template>
  <div class="merchant-list">
    <h2>商家管理</h2>
    <el-table :data="merchants" stripe>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="shopName" label="店铺名称" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const merchants = ref([
  { id: 1, shopName: '苗家餐厅', status: '审核中' }
])
</script>

<style scoped>
.merchant-list { padding: 20px; }
</style>
