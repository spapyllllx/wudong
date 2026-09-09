<template>
  <div class="product-detail">
    <el-page-header @back="$router.back()" title="返回" />
    <el-row :gutter="40" style="margin-top: 20px;">
      <el-col :span="10">
        <el-carousel height="500px">
          <el-carousel-item v-for="(img, idx) in images" :key="idx">
            <img :src="img" class="carousel-img" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="14">
        <h1>{{ product.title }}</h1>
        <p class="subtitle">{{ product.subtitle }}</p>
        <div class="price">¥{{ product.price }}</div>
        <div class="info">
          <span>销量: {{ product.sales }}</span>
          <span>评分: {{ product.rating }}</span>
          <span>库存: {{ product.stock }}</span>
        </div>
        <div class="specs">
          <h3>规格选择</h3>
          <el-button v-for="sku in skus" :key="sku.id" @click="selectSku(sku)">
            {{ sku.specName }} - ¥{{ sku.price }}
          </el-button>
        </div>
        <div class="actions">
          <el-button type="primary" size="large" @click="addToCart">加入购物车</el-button>
          <el-button type="danger" size="large" @click="buyNow">立即购买</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const productId = ref(route.params.id)

const product = ref({
  id: 1,
  title: '苗族银饰手镯',
  subtitle: '纯手工打造，传承百年工艺',
  price: '299.00',
  sales: 156,
  rating: '4.8',
  stock: 50,
  craftIntroduction: '采用传统苗银锻造工艺...',
  description: '详情内容...'
})

const images = ref(['https://via.placeholder.com/400x400'])
const skus = ref([
  { id: 1, specName: '中号', price: '299' },
  { id: 2, specName: '大号', price: '359' }
])

const selectSku = (sku) => {
  console.log('Selected:', sku)
}

const addToCart = () => {
  ElMessage.success('已加入购物车')
}

const buyNow = () => {
  ElMessage.info('立即购买功能开发中')
}

onMounted(() => {
  // TODO: 根据ID加载商品详情
})
</script>

<style scoped>
.product-detail {
  padding: 20px;
}

.carousel-img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.subtitle {
  color: #666;
  margin: 10px 0;
}

.price {
  font-size: 32px;
  color: #c8590d;
  font-weight: bold;
  margin: 20px 0;
}

.info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.specs {
  margin: 20px 0;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 20px;
}
</style>
