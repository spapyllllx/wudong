<template>
  <div class="restaurant-list">
    <h1>餐饮美食</h1>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>餐厅列表</template>
          <el-row :gutter="20">
            <el-col :span="6" v-for="item in restaurants" :key="item.id">
              <el-card class="restaurant-item" shadow="hover" @click="$router.push(`/shi/${item.id}`)">
                <img :src="item.coverImage || 'https://via.placeholder.com/200x150'" class="restaurant-img" />
                <div class="restaurant-name">{{ item.name }}</div>
                <div class="restaurant-desc">{{ item.description }}</div>
                <div class="restaurant-rating">评分: {{ item.rating }}</div>
              </el-card>
            </el-col>
          </el-row>
          <el-pagination
            v-model:current-page="page"
            :page-size="12"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadRestaurants"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const restaurants = ref([])
const page = ref(1)
const total = ref(0)

const loadRestaurants = () => {
  // TODO: 调用API获取餐厅列表
  restaurants.value = [
    { id: 1, name: '苗家餐厅', description: '正宗苗家美食', rating: 4.5, coverImage: 'https://via.placeholder.com/200x150' }
  ]
}

onMounted(() => {
  loadRestaurants()
})
</script>

<style scoped>
.restaurant-list {
  padding: 20px;
}

.restaurant-item {
  cursor: pointer;
  margin-bottom: 20px;
}

.restaurant-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.restaurant-name {
  font-weight: bold;
  margin: 10px 0 5px;
}

.restaurant-desc {
  font-size: 12px;
  color: #666;
}

.restaurant-rating {
  color: #c8590d;
  font-weight: bold;
}
</style>
