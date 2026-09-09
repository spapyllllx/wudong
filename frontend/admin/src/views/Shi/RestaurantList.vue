<template>
  <div class="restaurant-list">
    <h2>餐厅管理</h2>
    <el-table :data="restaurants" border stripe>
      <el-table-column prop="name" label="餐厅名称" width="200" />
      <el-table-column prop="address" label="地址" width="250" />
      <el-table-column prop="businessHours" label="营业时间" width="150" />
      <el-table-column prop="rating" label="评分" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '营业中' : '已歇业' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="toggleStatus(row)">
            {{ row.status === 1 ? '歇业' : '营业' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const restaurants = ref([])

const loadRestaurants = () => {
  // TODO: 调用API
  restaurants.value = [
    { id: 1, name: '苗家长桌宴', address: '乌东村中心广场', businessHours: '11:00-21:00', rating: '4.8', status: 1 },
    { id: 2, name: '苗家腊肉馆', address: '乌东村老街', businessHours: '10:00-20:00', rating: '4.6', status: 1 }
  ]
}

const toggleStatus = (row) => {
  // TODO: 调用API
  ElMessage.success('操作成功')
  loadRestaurants()
}

onMounted(() => {
  loadRestaurants()
})
</script>

<style scoped>
.restaurant-list {
  padding: 20px;
}
</style>
