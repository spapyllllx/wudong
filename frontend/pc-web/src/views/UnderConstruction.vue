<template>
  <div class="under-construction">
    <el-empty :description="`「${title}」功能开发中,敬请期待`">
      <el-button type="primary" @click="router.push('/home')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const MODULES = [
  { prefix: '/profile', name: '个人中心' },
  { prefix: '/shequ', name: '社区分享' },
  { prefix: '/xing', name: '门票与路线' },
  { prefix: '/zhu', name: '民宿预订' },
  { prefix: '/shi', name: '餐饮美食' }
]

const title = computed(() => {
  const match = MODULES.find((m) => route.path.startsWith(m.prefix))
  return match ? match.name : '该模块'
})
</script>

<style scoped>
.under-construction {
  padding: 80px 20px;
}
</style>
