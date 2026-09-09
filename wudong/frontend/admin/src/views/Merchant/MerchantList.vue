<template>
  <div class="merchant-list">
    <h2>商家管理</h2>
    <el-table :data="merchants" border stripe>
      <el-table-column prop="shopName" label="店铺名称" width="200" />
      <el-table-column prop="contactName" label="联系人" width="120" />
      <el-table-column prop="contactPhone" label="联系电话" width="150" />
      <el-table-column prop="moduleName" label="所属模块" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'">
            {{ row.status === 1 ? '正常' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="audit(row)" v-if="row.status === 0">审核</el-button>
          <el-button size="small" @click="viewDetail(row)">详情</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const moduleTypes = { 1: '衣', 2: '食', 3: '住', 4: '行' }
const merchants = ref([])
const page = ref(1)
const total = ref(0)

const loadMerchants = () => {
  // TODO: 调用API
  merchants.value = [
    { id: 1, shopName: '苗银坊', contactName: '张师傅', contactPhone: '138****1234', moduleType: 1, status: 1 },
    { id: 2, shopName: '苗家餐厅', contactName: '李老板', contactPhone: '139****5678', moduleType: 2, status: 0 }
  ]
  total.value = 2
}

const audit = (row) => {
  ElMessageBox.confirm('确认通过该商家入驻申请？', '审核确认', {
    confirmButtonText: '通过',
    cancelButtonText: '驳回',
    type: 'warning'
  }).then(() => {
    // TODO: 调用API通过审核
    ElMessage.success('审核通过')
    loadMerchants()
  }).catch(() => {})
}

const viewDetail = (row) => {
  console.log('查看详情:', row)
}

onMounted(() => {
  loadMerchants()
})
</script>

<style scoped>
.merchant-list {
  padding: 20px;
}
</style>
