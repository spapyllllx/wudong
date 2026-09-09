<template>
  <div class="log-detail">
    <el-card>
      <template #header>游记详情</template>
      <h2>{{ log.title }}</h2>
      <p>{{ log.content }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const log = ref({ id: route.params.id, title: '游记标题' })
</script>
