<template>
  <div class="scenic-detail">
    <el-card>
      <template #header>景区详情</template>
      <h2>{{ scenic.name }}</h2>
      <p>{{ scenic.description }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scenic = ref({ id: route.params.id, name: '乌东苗寨' })
</script>
