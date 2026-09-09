<template>
  <div class="skeleton-page">
    <div class="container">
      <h1>{{ route.meta.title }}</h1>
      <el-alert title="页面开发中" type="info" :closable="false" show-icon />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
.skeleton-page { padding: $spacing-2xl 0; }
</style>
