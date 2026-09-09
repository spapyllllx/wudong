<template>
  <div class="profile">
    <el-card>
      <template #header>个人中心</template>
      <p>用户名：{{ user.nickname }}</p>
      <p>手机号：{{ user.phone }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({ nickname: '游客', phone: '' })
</script>
