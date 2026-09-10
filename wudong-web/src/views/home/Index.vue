<template>
  <div class="home-page">
    <!-- 轮播 -->
    <section class="hero">
      <el-carousel
        v-if="banners.length"
        height="460px"
        :interval="5000"
        arrow="hover"
        indicator-position="none"
      >
        <el-carousel-item v-for="b in banners" :key="b.id">
          <div class="slide" @click="goBanner(b)">
            <img class="slide-bg" :src="resolveImage(b.image)" :alt="b.title" />
            <div class="slide-mask"></div>
            <div class="container slide-content">
              <p class="slide-eyebrow">WUDONG · GUIZHOU</p>
              <h2 class="slide-title">{{ b.title }}</h2>
              <span class="slide-cta">了解详情 →</span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 无轮播时的静默 hero，避免留白 -->
      <div v-else class="hero-fallback">
        <div class="container">
          <p class="slide-eyebrow">WUDONG · GUIZHOU</p>
          <h2 class="slide-title">乌东文旅</h2>
          <p class="hero-sub">山水人文 · 民族风情 · 非遗好物</p>
        </div>
      </div>
    </section>

    <!-- 板块入口 -->
    <section class="entries">
      <div class="container">
        <div class="entry-grid">
          <router-link
            v-for="e in entries"
            :key="e.path"
            :to="e.path"
            class="entry"
          >
            <el-icon :size="26"><component :is="e.icon" /></el-icon>
            <h3>{{ e.title }}</h3>
            <p>{{ e.desc }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 非遗好物 -->
    <section class="section">
      <div class="container">
        <header class="section-head">
          <div>
            <p class="eyebrow">INTANGIBLE CULTURAL HERITAGE</p>
            <h2 class="section-title">非遗好物</h2>
          </div>
          <router-link to="/product" class="more">查看全部 →</router-link>
        </header>

        <div v-if="loadingProducts" class="grid">
          <div v-for="i in 4" :key="i" class="card-skeleton">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line" style="width: 70%"></div>
            <div class="skeleton skeleton-line" style="width: 40%"></div>
          </div>
        </div>

        <el-empty
          v-else-if="products.length === 0"
          description="暂无商品"
          :image-size="120"
        />

        <div v-else class="grid">
          <ProductCard v-for="p in products" :key="p.id" :product="p" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Food, House, Ticket } from '@element-plus/icons-vue'
import ProductCard from '@/components/ProductCard.vue'
import { getBannerList, getProductList, type Banner, type Product } from '@/api/product'
import { resolveImage } from '@/utils/image'

const router = useRouter()

const banners = ref<Banner[]>([])
const products = ref<Product[]>([])
const loadingProducts = ref(true)

const entries = [
  { path: '/product', icon: ShoppingBag, title: '非遗商品', desc: '银饰 · 蜡染 · 刺绣' },
  { path: '/restaurant', icon: Food, title: '特色餐饮', desc: '酸汤鱼 · 苗家菜' },
  { path: '/homestay', icon: House, title: '特色民宿', desc: '苗寨 · 吊脚楼' },
  { path: '/ticket', icon: Ticket, title: '景区票务', desc: '景点 · 路线套餐' }
]

/** 轮播跳转：link_type 为 product 时跳到商品详情 */
function goBanner(b: Banner) {
  if (b.link_type === 'product' && b.link_value) {
    router.push(`/product/${b.link_value}`)
  } else if (b.link_type === 'url' && b.link_value) {
    window.open(b.link_value, '_blank')
  }
}

async function loadBanners() {
  try {
    banners.value = (await getBannerList('home')) || []
  } catch {
    banners.value = []
  }
}

async function loadProducts() {
  loadingProducts.value = true
  try {
    // 取销量最高的 8 件作为推荐
    const res = await getProductList({ page: 1, size: 8, sort: 'sales' })
    products.value = res?.list || []
  } catch {
    products.value = []
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => {
  loadBanners()
  loadProducts()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.home-page {
  padding-bottom: $spacing-2xl * 1.5;
}

// ---------------------------------------------------------- 轮播

.hero {
  margin-bottom: $spacing-2xl;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}

.slide-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  // 商品图多为竖构图，放进超宽横幅时默认取正中会裁掉主体上半部
  // （例如苗族盛装的银冠和面部）。整体上移取景，让主体完整入画。
  object-position: center 28%;
  transform: scale(1.02);
  transition: transform 6s ease-out;
}

.el-carousel__item.is-active .slide-bg {
  transform: scale(1.08);
}

.slide-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(41, 50, 65, 0.82) 0%,
    rgba(41, 50, 65, 0.45) 45%,
    rgba(41, 50, 65, 0.1) 100%
  );
}

.slide-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.slide-eyebrow {
  font-size: 11px;
  letter-spacing: $tracking-widest;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: $spacing-md;
}

.slide-title {
  font-family: $font-display;
  font-size: 46px;
  font-weight: 500;
  letter-spacing: $tracking-wide;
  line-height: 1.3;
  max-width: 620px;
  margin-bottom: $spacing-lg;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);

  @include md {
    font-size: 32px;
  }
}

.slide-cta {
  font-size: $font-size-sm;
  letter-spacing: $tracking-wider;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 2px;
  align-self: flex-start;
  transition: border-color $transition;

  .slide:hover & {
    border-color: #fff;
  }
}

.hero-fallback {
  height: 300px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, $primary-dark 0%, $primary 60%, $primary-light 100%);
  color: #fff;

  .slide-eyebrow {
    margin-bottom: $spacing-sm;
  }

  .slide-title {
    margin-bottom: $spacing-sm;
  }
}

.hero-sub {
  font-size: $font-size-lg;
  letter-spacing: $tracking-wider;
  opacity: 0.85;
}

// ---------------------------------------------------------- 板块入口

.entries {
  margin-bottom: $spacing-2xl * 1.25;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
}

.entry {
  padding: $spacing-xl $spacing-lg;
  text-align: center;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: $radius-sm;
  transition: all $transition;

  :deep(.el-icon) {
    color: $primary;
    margin-bottom: $spacing-md;
  }

  h3 {
    font-family: $font-display;
    font-size: $font-size-xl;
    font-weight: 500;
    color: $primary-dark;
    letter-spacing: $tracking-wide;
    margin-bottom: 4px;
  }

  p {
    font-size: $font-size-xs;
    color: $text-disabled;
    letter-spacing: $tracking-wide;
  }

  &:hover {
    border-color: rgba(61, 90, 128, 0.35);
    box-shadow: $shadow-md;
    transform: translateY(-3px);
  }
}

// ---------------------------------------------------------- 商品区

.section {
  .container {
    position: relative;
  }
}

.section-head {
  @include flex-between;
  align-items: flex-end;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $divider;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: $tracking-widest;
  color: $primary-lighter;
  margin-bottom: $spacing-xs;
}

.section-title {
  font-family: $font-display;
  font-size: 32px;
  font-weight: 500;
  color: $primary-dark;
  letter-spacing: $tracking-wide;
}

.more {
  font-size: $font-size-sm;
  color: $text-secondary;
  letter-spacing: $tracking-wide;
  transition: color $transition;

  &:hover {
    color: $primary;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;

  @include lg {
    grid-template-columns: repeat(3, 1fr);
  }

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }

  @include sm {
    grid-template-columns: 1fr;
  }
}

.card-skeleton {
  .skeleton-img {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: $radius-sm;
  }

  .skeleton-line {
    height: 14px;
    margin-top: $spacing;
    border-radius: 2px;
  }
}
</style>
