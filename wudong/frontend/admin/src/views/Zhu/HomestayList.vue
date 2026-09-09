<template>
  <div class="homestay-list">
    <h2>民宿管理</h2>
    <el-table :data="homestays" border stripe>
      <el-table-column prop="name" label="民宿名称" width="200" />
      <el-table-column prop="address" label="地址" width="250" />
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

const homestays = ref([])

const loadHomestays = () => {
  // TODO: 调用API
  homestays.value = [
    { id: 1, name: '苗寨吊脚楼', address: '乌东村高山片区', rating: '4.9', status: 1 },
    { id: 2, name: '木屋民宿', address: '乌东村山脚', rating: '4.7', status: 1 }
  ]
}

const toggleStatus = (row) => {
  ElMessage.success('操作成功')
  loadHomestays()
}

onMounted(() => {
  loadHomestays()
})
</script>

<style scoped>
.homestay-list {
  padding: 20px;
}
</style>
