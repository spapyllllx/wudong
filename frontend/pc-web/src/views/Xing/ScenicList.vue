<template>
  <div class="scenic-list">
    <h1>线路订票</h1>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>景区列表</template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in scenics" :key="item.id">
              <el-card class="scenic-item" shadow="hover" @click="$router.push(`/xing/${item.id}`)">
                <img :src="item.coverImage || 'https://via.placeholder.com/200x150'" class="scenic-img" />
                <div class="scenic-name">{{ item.name }}</div>
                <div class="scenic-price">¥{{ item.price }}起</div>
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

const scenics = ref([
  { id: 1, name: '乌东苗寨', price: '50', coverImage: 'https://via.placeholder.com/200x150' }
])
</script>

<style scoped>
.scenic-list { padding: 20px; }
.scenic-item { cursor: pointer; margin-bottom: 20px; }
.scenic-img { width: 100%; height: 150px; object-fit: cover; }
.scenic-name { font-weight: bold; margin: 10px 0 5px; }
.scenic-price { color: #c8590d; font-weight: bold; }
</style>
