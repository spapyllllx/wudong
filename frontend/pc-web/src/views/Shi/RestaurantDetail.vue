<template>
  <div class="restaurant-detail">
    <el-card>
      <template #header>餐厅详情</template>
      <el-row>
        <el-col :span="12">
          <img :src="restaurant.coverImage || 'https://via.placeholder.com/400x300'" class="detail-img" />
        </el-col>
        <el-col :span="12">
          <h2>{{ restaurant.name }}</h2>
          <p>地址：{{ restaurant.address }}</p>
          <p>营业时间：{{ restaurant.businessHours }}</p>
          <p>简介：{{ restaurant.description }}</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const restaurant = ref({})

onMounted(() => {
  // TODO: 根据ID获取餐厅详情
  restaurant.value = { id: route.params.id, name: '苗家餐厅' }
})
</script>

<style scoped>
.detail-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
