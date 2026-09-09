<template>
  <div class="dashboard">
    <h2>数据看板</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.dau }}</div>
          <div class="stat-label">今日DAU</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.orders }}</div>
          <div class="stat-label">今日订单</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">¥{{ stats.gmv }}</div>
          <div class="stat-label">今日GMV</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-value">{{ stats.merchants }}</div>
          <div class="stat-label">商家数量</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  dau: 0,
  orders: 0,
  gmv: '0.00',
  merchants: 0
})

onMounted(() => {
  // TODO: 加载数据看板数据
  stats.value = { dau: 156, orders: 23, gmv: '5680.00', merchants: 45 }
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #c8590d;
}

.stat-label {
  color: #666;
  margin-top: 10px;
}
</style>
