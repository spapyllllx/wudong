<template>
  <div class="user-list">
    <h2>用户管理</h2>
    <el-table :data="users" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="phone" label="手机号" width="150" />
      <el-table-column prop="nickname" label="昵称" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="toggleStatus(row)">
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      v-model:current-page="page"
      :page-size="10"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const users = ref([])
const page = ref(1)
const total = ref(0)

const loadUsers = () => {
  // TODO: 调用API获取用户列表
  users.value = [
    { id: 1, phone: '138****1234', nickname: '张三', status: 1, createTime: '2026-09-01' },
    { id: 2, phone: '139****5678', nickname: '李四', status: 1, createTime: '2026-09-02' }
  ]
  total.value = 2
}

const toggleStatus = (row) => {
  // TODO: 调用API修改状态
  ElMessage.success('操作成功')
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-list {
  padding: 20px;
}
</style>
