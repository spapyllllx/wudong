<template>
  <div class="home-page">
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="banner-bg"></div>
      <div class="banner-overlay"></div>
      <div class="container banner-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-main">探索乌东</span>
            <span class="title-sub">发现贵州之美</span>
          </h1>
          <p class="hero-subtitle">山水人文 · 民族风情 · 美食美景</p>
          <div class="hero-actions">
            <el-button type="primary" size="large" round>
              开始探索
            </el-button>
            <el-button size="large" round plain>
              了解更多
            </el-button>
          </div>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
      </div>
    </section>

    <!-- 分类入口 -->
    <section class="categories">
      <div class="container">
        <div class="category-grid">
          <router-link
            v-for="cat in categories"
            :key="cat.path"
            :to="cat.path"
            class="category-card"
          >
            <el-icon :size="48"><component :is="cat.icon" /></el-icon>
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.desc }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="hot-section">
      <div class="container">
        <h2 class="section-title">热门推荐</h2>
        <div class="product-grid">
          <div v-for="i in 8" :key="i" class="skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag, Food, House, Ticket } from '@element-plus/icons-vue'

const categories = [
  { path: '/product', icon: 'ShoppingBag', title: '非遗商品', desc: '精选手工艺品' },
  { path: '/restaurant', icon: 'Food', title: '特色餐饮', desc: '地道美食体验' },
  { path: '/homestay', icon: 'House', title: '特色民宿', desc: '舒适住宿环境' },
  { path: '/ticket', icon: 'Ticket', title: '景区票务', desc: '畅游美景' }
]
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.home-page {
  overflow-x: hidden;
}

.hero-banner {
  position: relative;
  height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    $primary 0%,
    $primary-light 50%,
    $accent-green 100%
  );

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(230, 57, 70, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(244, 162, 97, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, rgba(42, 157, 143, 0.15) 0%, transparent 50%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 50px,
        rgba(255, 255, 255, 0.03) 50px,
        rgba(255, 255, 255, 0.03) 100px
      );
  }
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-2xl;
}

.hero-text {
  flex: 1;
  color: white;
  max-width: 600px;
}

.hero-title {
  margin-bottom: $spacing-xl;

  .title-main {
    display: block;
    font-size: 64px;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: $spacing-sm;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
  }

  .title-sub {
    display: block;
    font-size: 36px;
    font-weight: 600;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(244, 162, 97, 1) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  font-size: $font-size-xl;
  margin-bottom: $spacing-2xl;
  opacity: 0.95;
  font-weight: 500;
  letter-spacing: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-actions {
  display: flex;
  gap: $spacing-lg;

  .el-button {
    padding: $spacing-md $spacing-2xl;
    font-size: $font-size-lg;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
  }
}

.hero-decoration {
  position: relative;
  width: 400px;
  height: 400px;
  flex-shrink: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;

  &.circle-1 {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  &.circle-2 {
    width: 200px;
    height: 200px;
    top: 30%;
    left: 40%;
    background: radial-gradient(circle,
      rgba(244, 162, 97, 0.3) 0%,
      transparent 70%
    );
    animation-delay: -2s;
  }

  &.circle-3 {
    width: 150px;
    height: 150px;
    top: 60%;
    left: 70%;
    background: radial-gradient(circle,
      rgba(42, 157, 143, 0.3) 0%,
      transparent 70%
    );
    animation-delay: -4s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -20px);
  }
}

.categories {
  padding: $spacing-2xl 0;
  background: $bg;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xl;
}

.category-card {
  position: relative;
  @include flex-center;
  flex-direction: column;
  padding: $spacing-2xl $spacing-xl;
  background: $bg-white;
  border-radius: $radius-xl;
  border: 2px solid transparent;
  transition: all $transition;
  overflow: hidden;

  // 顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg,
      $accent-red 0%,
      $accent-orange 33%,
      $accent-yellow 66%,
      $accent-green 100%
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform $transition-slow;
  }

  // 背景装饰
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle,
      rgba(61, 90, 128, 0.05) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity $transition;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 28px rgba(61, 90, 128, 0.2);
    border-color: $primary-light;

    &::before {
      transform: scaleX(1);
    }

    &::after {
      opacity: 1;
    }

    .el-icon {
      transform: scale(1.1) rotate(5deg);
      color: $primary;
    }

    h3 {
      color: $primary;
    }
  }

  .el-icon {
    margin-bottom: $spacing-md;
    color: $primary;
    transition: all $transition;
  }

  h3 {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-sm;
    transition: color $transition;
  }

  p {
    font-size: $font-size-sm;
    color: $text-secondary;
    text-align: center;
  }
}

.hot-section {
  padding: $spacing-2xl 0;
  background: $bg;
}

.section-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  margin-bottom: $spacing-xl;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.skeleton {
  background: $bg-white;
  border-radius: $radius-md;
  overflow: hidden;

  .skeleton-img {
    width: 100%;
    aspect-ratio: 1;
    @extend .skeleton;
  }

  .skeleton-text {
    height: 60px;
    margin: $spacing-md;
    @extend .skeleton;
  }
}

@include lg {
  .category-grid,
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
