<template>
  <div class="homestay-list">
    <h1>住宿预订</h1>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>民宿列表</template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in homestays" :key="item.id">
              <el-card class="homestay-item" shadow="hover" @click="$router.push(`/zhu/${item.id}`)">
                <img :src="item.coverImage || 'https://via.placeholder.com/200x150'" class="homestay-img" />
                <div class="homestay-name">{{ item.name }}</div>
                <div class="homestay-price">¥{{ item.price }}/晚</div>
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

const homestays = ref([
  { id: 1, name: '苗寨民宿', price: '299', coverImage: 'https://via.placeholder.com/200x150' }
])
</script>

<style scoped>
.homestay-list { padding: 20px; }
.homestay-item { cursor: pointer; margin-bottom: 20px; }
.homestay-img { width: 100%; height: 150px; object-fit: cover; }
.homestay-name { font-weight: bold; margin: 10px 0 5px; }
.homestay-price { color: #c8590d; font-weight: bold; }
</style>
