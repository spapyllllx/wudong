<template>
  <div class="skeleton-page">
    <div class="container">
      <h1>{{ title }}</h1>
      <el-alert
        title="页面开发中"
        type="info"
        description="此页面正在开发中，敬请期待"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title || '页面')
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.skeleton-page {
  padding: $spacing-2xl 0;

  h1 {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-lg;
  }
}
</style>
