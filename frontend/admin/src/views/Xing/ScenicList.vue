<template>
  <div class="scenic-list">
    <h2>景区管理</h2>
    <el-table :data="scenics" border stripe>
      <el-table-column prop="name" label="景区名称" width="200" />
      <el-table-column prop="address" label="地址" width="250" />
      <el-table-column prop="openTime" label="开放时间" width="150" />
      <el-table-column prop="rating" label="评分" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '开放' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="toggleStatus(row)">
            {{ row.status === 1 ? '关闭' : '开放' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const scenics = ref([])

const loadScenics = () => {
  // TODO: 调用API
  scenics.value = [
    { id: 1, name: '乌东苗寨', address: '贵州省黔东南州', openTime: '08:00-18:00', rating: '4.8', status: 1 },
    { id: 2, name: '梯田景区', address: '乌东村北部', openTime: '06:00-20:00', rating: '4.6', status: 1 }
  ]
}

const toggleStatus = (row) => {
  ElMessage.success('操作成功')
  loadScenics()
}

onMounted(() => {
  loadScenics()
})
</script>

<style scoped>
.scenic-list {
  padding: 20px;
}
</style>
