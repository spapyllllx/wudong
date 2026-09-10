<template>
  <div class="not-found">
    <div class="container">
      <div class="code">404</div>
      <h1 class="title">页面走丢了</h1>
      <p class="desc">
        你访问的地址不存在，或者已经被移动到别处。
      </p>
      <p class="path">请求路径：{{ route.fullPath }}</p>

      <div class="actions">
        <el-button type="primary" size="large" @click="router.replace('/')">
          返回首页
        </el-button>
        <el-button size="large" @click="router.back()">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.not-found {
  padding: $spacing-2xl 0;
  min-height: 60vh;
  @include flex-center;
}

.container {
  text-align: center;
  max-width: 560px;
}

.code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 4px;
  background: linear-gradient(135deg, $primary 0%, $accent-green 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: $spacing-md;
}

.title {
  font-size: $font-size-2xl;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.desc {
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.path {
  font-family: monospace;
  font-size: $font-size-sm;
  color: $text-disabled;
  background: $bg;
  border: 1px solid $border;
  border-radius: $radius-sm;
  padding: $spacing-xs $spacing-sm;
  display: inline-block;
  margin-bottom: $spacing-lg;
  word-break: break-all;
}

.actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
}
</style>
