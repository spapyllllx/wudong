<template>
  <div class="dashboard">
    <h2>数据看板</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat">用户数: 1,234</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat">订单数: 567</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat">商家数: 89</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat">公告数: 12</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard { padding: 20px; }
.stat { font-size: 24px; font-weight: bold; color: #c8590d; }
</style>
