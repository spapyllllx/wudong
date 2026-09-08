<template>
  <div class="content-audit">
    <h2>内容审核</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="待审核" name="pending">
        <el-table :data="pendingLogs" border stripe>
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="userName" label="用户" width="120" />
          <el-table-column prop="createTime" label="发布时间" width="180" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button size="small" type="success" @click="approve(row)">通过</el-button>
              <el-button size="small" type="danger" @click="reject(row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="全部" name="all">
        <el-table :data="allLogs" border stripe>
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="userName" label="用户" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '正常' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="180" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('pending')

const pendingLogs = ref([
  { id: 1, title: '乌东苗寨游记', userName: '游客张三', createTime: '2026-09-08 10:00' },
  { id: 2, title: '苗家美食探店', userName: '游客李四', createTime: '2026-09-08 11:30' }
])

const allLogs = ref([
  { id: 1, title: '乌东苗寨游记', userName: '游客张三', status: 1, createTime: '2026-09-08 10:00' },
  { id: 2, title: '苗家美食探店', userName: '游客李四', status: 0, createTime: '2026-09-08 11:30' }
])

const approve = (row) => {
  // TODO: 调用API
  ElMessage.success('已通过')
  pendingLogs.value = pendingLogs.value.filter(item => item.id !== row.id)
}

const reject = (row) => {
  // TODO: 调用API
  ElMessage.success('已拒绝')
  pendingLogs.value = pendingLogs.value.filter(item => item.id !== row.id)
}
</script>

<style scoped>
.content-audit {
  padding: 20px;
}
</style>
