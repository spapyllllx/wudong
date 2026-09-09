<template>
  <div class="user-list">
    <h2>用户管理</h2>
    <el-table :data="users" stripe>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, nickname: '用户A', phone: '138****1234', status: '正常' }
])
</script>

<style scoped>
.user-list { padding: 20px; }
</style>
