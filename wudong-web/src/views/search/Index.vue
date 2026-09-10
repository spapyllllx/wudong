<template>
  <div class="search-page">
    <div class="container">
      <div class="search-bar">
        <el-input
          v-model="keyword"
          size="large"
          placeholder="搜索商品名称，如「银饰」「蜡染」"
          clearable
          @keyup.enter="doSearch"
          @clear="doSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button type="primary" :loading="loading" @click="doSearch">
              搜索
            </el-button>
          </template>
        </el-input>
      </div>

      <div v-if="searched" class="result-head">
        <span>
          关键词「<strong>{{ activeKeyword }}</strong>」共找到
          <strong>{{ total }}</strong> 件商品
        </span>
        <el-button type="text" @click="router.push('/product')">
          浏览全部商品
        </el-button>
      </div>

      <div v-loading="loading" class="result-body">
        <el-empty
          v-if="searched && !loading && list.length === 0"
          description="没有找到相关商品，换个关键词试试"
        />

        <div v-else-if="list.length" class="product-grid">
          <ProductCard v-for="item in list" :key="item.id" :product="item" />
        </div>

        <el-pagination
          v-if="total > size"
          class="pager"
          layout="prev, pager, next"
          :current-page="page"
          :page-size="size"
          :total="total"
          background
          @current-change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import ProductCard from '@/components/ProductCard.vue'
import { searchProducts, type Product } from '@/api/product'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const activeKeyword = ref('')
const list = ref<Product[]>([])
const total = ref(0)
const page = ref(1)
const size = ref(12)
const loading = ref(false)
const searched = ref(false)

/**
 * 关键词搜索
 */
async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) {
    return
  }

  // 同步到地址栏，方便刷新/分享
  if (route.query.keyword !== kw) {
    router.replace({ path: '/search', query: { keyword: kw } })
  }

  activeKeyword.value = kw
  loading.value = true
  try {
    const res = await searchProducts({ keyword: kw, page: page.value, size: size.value })
    list.value = res?.list || []
    total.value = res?.pagination?.total || 0
    searched.value = true
  } catch {
    list.value = []
    total.value = 0
    searched.value = true
  } finally {
    loading.value = false
  }
}

function onPageChange(p: number) {
  page.value = p
  doSearch()
}

/**
 * 从地址栏同步关键词（Header 搜索框跳转过来时生效）
 */
function syncFromRoute() {
  const kw = (route.query.keyword as string) || ''
  keyword.value = kw
  if (kw) {
    page.value = 1
    doSearch()
  }
}

watch(() => route.query.keyword, syncFromRoute)

syncFromRoute()
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.search-page {
  padding: $spacing-xl 0;
  min-height: 60vh;
}

.search-bar {
  max-width: 720px;
  margin: 0 auto $spacing-xl;
}

.result-head {
  @include flex-between;
  margin-bottom: $spacing-lg;
  color: $text-secondary;
  font-size: $font-size-sm;

  strong {
    color: $primary;
  }
}

.result-body {
  min-height: 200px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;

  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
}

.pager {
  margin-top: $spacing-xl;
  justify-content: center;
}
</style>
