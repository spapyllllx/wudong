<template>
  <div class="homestay-detail">
    <el-card>
      <template #header>民宿详情</template>
      <h2>{{ homestay.name }}</h2>
      <p>{{ homestay.description }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const homestay = ref({ id: route.params.id, name: '苗寨民宿' })
</script>
