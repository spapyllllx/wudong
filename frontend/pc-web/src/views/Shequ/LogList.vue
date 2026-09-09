<template>
  <div class="log-list">
    <h1>社区分享</h1>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>游记列表</template>
          <el-row :gutter="20">
            <el-col :span="8" v-for="item in logs" :key="item.id">
              <el-card class="log-item" shadow="hover" @click="$router.push(`/shequ/${item.id}`)">
                <div class="log-title">{{ item.title }}</div>
                <div class="log-author">{{ item.author }}</div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const logs = ref([
  { id: 1, title: '乌东苗寨游记', author: '游客A' }
])
</script>

<style scoped>
.log-list { padding: 20px; }
.log-item { cursor: pointer; margin-bottom: 20px; }
.log-title { font-weight: bold; }
.log-author { color: #666; font-size: 12px; }
</style>
