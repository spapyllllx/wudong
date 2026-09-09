<template>
  <div class="log-list">
    <h2>游记管理</h2>
    <el-table :data="logs" border stripe>
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="userName" label="作者" width="120" />
      <el-table-column prop="viewCount" label="浏览" width="80" />
      <el-table-column prop="likeCount" label="点赞" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'">
            {{ row.status === 1 ? '正常' : '审核中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="deleteLog(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const logs = ref([])

const loadLogs = () => {
  // TODO: 调用API
  logs.value = [
    { id: 1, title: '乌东苗寨游记', userName: '游客张三', viewCount: 156, likeCount: 23, status: 1 },
    { id: 2, title: '苗家美食探店', userName: '游客李四', viewCount: 89, likeCount: 12, status: 0 }
  ]
}

const deleteLog = (row) => {
  ElMessageBox.confirm('确认删除该游记？', '删除确认', { type: 'warning' })
    .then(() => {
      // TODO: 调用API
      ElMessage.success('删除成功')
      loadLogs()
    })
    .catch(() => {})
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.log-list {
  padding: 20px;
}
</style>
