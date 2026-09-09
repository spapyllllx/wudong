<template>
  <div class="layout">
    <el-aside width="200px">
      <el-menu :default-active="activeMenu" router>
        <el-menu-item index="/dashboard">数据看板</el-menu-item>
        <el-menu-item index="/users">用户管理</el-menu-item>
        <el-menu-item index="/merchants">商家管理</el-menu-item>
        <el-menu-item index="/orders">订单管理</el-menu-item>
        <el-menu-item index="/content">内容审核</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref(route.path)
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}
.el-aside {
  background: #304156;
}
.el-main {
  background: #f0f2f5;
}
</style>
