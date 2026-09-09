<template>
  <div class="product-list">
    <h1>非遗商品</h1>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>分类筛选</template>
          <el-tree :data="categories" :props="{ label: 'name', children: 'children' }" node-key="id" default-expand-all />
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in products" :key="item.id">
            <el-card class="product-item" shadow="hover">
              <img :src="item.mainImage" class="product-img" />
              <div class="product-name">{{ item.title }}</div>
              <div class="product-price">¥{{ item.price }}</div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination
          v-model:current-page="page"
          :page-size="12"
          :total="total"
          layout="prev, pager, next"
          @current-change="loadProducts"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const categories = ref([])
const products = ref([])
const page = ref(1)
const total = ref(0)

const loadProducts = () => {
  // TODO: 调用API获取商品列表
  products.value = [
    { id: 1, title: '苗族银饰手镯', price: '299', mainImage: 'https://via.placeholder.com/200x200' },
    { id: 2, title: '苗族蜡染布艺', price: '158', mainImage: 'https://via.placeholder.com/200x200' }
  ]
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.product-item {
  cursor: pointer;
  margin-bottom: 20px;
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-name {
  margin: 10px 0 5px;
  font-size: 14px;
}

.product-price {
  color: #c8590d;
  font-weight: bold;
}
</style>
