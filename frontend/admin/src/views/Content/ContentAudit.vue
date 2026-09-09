<template>
  <div class="content-audit">
    <h2>内容审核</h2>
    <el-table :data="contents" stripe>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="status" label="状态" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const contents = ref([
  { id: 1, title: '游记标题', status: '待审核' }
])
</script>

<style scoped>
.content-audit { padding: 20px; }
</style>
