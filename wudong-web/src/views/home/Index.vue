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
            <el-button type="primary" size="large" round @click="router.push('/product')">
              开始探索
            </el-button>
            <el-button size="large" round plain @click="router.push('/ticket')">
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

    <!-- 走进贵州 - 四大板块 -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">走进贵州</h2>
          <p class="section-desc">衣食住行,感受多彩黔地</p>
        </div>
        <div class="feature-grid">
          <div
            v-for="feature in features"
            :key="feature.path"
            class="feature-card"
            :style="{ background: feature.bg }"
            @click="router.push(feature.path)"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-slogan">{{ feature.slogan }}</p>
            <p class="feature-desc">{{ feature.desc }}</p>
            <div class="feature-action">
              立即探索 <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 黔地文化 - 文化故事 -->
    <section class="stories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">黔地文化</h2>
          <p class="section-desc">千年传承,匠心之美</p>
        </div>
        <div class="story-grid">
          <div
            v-for="story in stories"
            :key="story.title"
            class="story-card"
          >
            <div class="story-image-wrap">
              <div class="story-image" :style="{ background: story.color }">
                <span class="story-emoji">{{ story.emoji }}</span>
              </div>
              <div class="story-tag">{{ story.tag }}</div>
            </div>
            <div class="story-content">
              <h3 class="story-title">{{ story.title }}</h3>
              <p class="story-text">{{ story.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部行动区 -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-wrap">
          <h2 class="cta-title">开启你的贵州之旅</h2>
          <p class="cta-subtitle">从一件非遗好物,一顿特色美食,一次山水之行开始</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" round @click="router.push('/product')">
              浏览非遗商品
            </el-button>
            <el-button size="large" round plain @click="router.push('/ticket')">
              查看景区门票
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ShoppingBag, Food, House, Ticket } from '@element-plus/icons-vue'

const router = useRouter()

const categories = [
  { path: '/product', icon: 'ShoppingBag', title: '非遗商品', desc: '精选手工艺品' },
  { path: '/restaurant', icon: 'Food', title: '特色餐饮', desc: '地道美食体验' },
  { path: '/homestay', icon: 'House', title: '特色民宿', desc: '舒适住宿环境' },
  { path: '/ticket', icon: 'Ticket', title: '景区票务', desc: '畅游美景' }
]

const features = [
  {
    icon: '🛍️',
    title: '非遗商品',
    slogan: '指尖上的贵州',
    desc: '苗银、蜡染、刺绣,一针一线皆是传承',
    path: '/product',
    bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
  },
  {
    icon: '🍴',
    title: '特色美食',
    slogan: '舌尖上的贵州',
    desc: '酸汤鱼、丝娃娃、糟辣椒,唤醒味蕾记忆',
    path: '/restaurant',
    bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    icon: '🏠',
    title: '特色民宿',
    slogan: '梦里的贵州',
    desc: '吊脚楼、鼓楼旁,枕着山水入眠',
    path: '/homestay',
    bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
  },
  {
    icon: '🎫',
    title: '景区门票',
    slogan: '山水间的贵州',
    desc: '黄果树、荔波、梵净山,遇见自然之美',
    path: '/ticket',
    bg: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  }
]

const stories = [
  {
    emoji: '🌸',
    tag: '苗族银饰',
    title: '一副银饰的千年记忆',
    text: '苗族银饰锻制技艺是国家级非物质文化遗产。錾刻、镶嵌、编结,每一道工序都凝聚着苗家匠人的心血,承载着这个民族对美的极致追求。',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    emoji: '🎵',
    tag: '侗族大歌',
    title: '大山深处的天籁之音',
    text: '侗族大歌以其多声部、无指挥、无伴奏的独特形式,被誉为"清泉般闪光的音乐"。这来自大山深处的和声,唱出了侗家人对生活的热爱。',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    emoji: '🎨',
    tag: '蜡染工艺',
    title: '蓝白之间的诗意画卷',
    text: '蜡染是苗族、布依族等民族的传统印染工艺。以蜡为笔,以布为纸,在蓝白之间勾勒出山水花鸟、日月星辰,每一幅都是独一无二的艺术品。',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
]
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.home-page {
  overflow-x: hidden;
}

// Hero Banner
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

// 分类入口
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

// 通用区块头部
.section-header {
  text-align: center;
  margin-bottom: $spacing-2xl;

  .section-title {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    background: linear-gradient(135deg, $primary 0%, $accent-green 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-desc {
    font-size: $font-size-lg;
    color: $text-secondary;
  }
}

// 走进贵州 - 四大板块
.features-section {
  padding: $spacing-2xl 0;
  background: $bg;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;
}

.feature-card {
  padding: 40px;
  border-radius: $radius-xl;
  color: white;
  cursor: pointer;
  transition: all $transition;
  position: relative;
  overflow: hidden;
  min-height: 260px;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

    .feature-action .arrow {
      transform: translateX(8px);
    }
  }

  .feature-icon {
    font-size: 56px;
    margin-bottom: $spacing-md;
    position: relative;
    z-index: 1;
  }

  .feature-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: $spacing-sm;
    position: relative;
    z-index: 1;
  }

  .feature-slogan {
    font-size: $font-size-lg;
    margin-bottom: $spacing-md;
    opacity: 0.95;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  .feature-desc {
    font-size: $font-size;
    opacity: 0.85;
    line-height: 1.6;
    margin-bottom: auto;
    position: relative;
    z-index: 1;
  }

  .feature-action {
    margin-top: $spacing-lg;
    font-size: $font-size;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    position: relative;
    z-index: 1;

    .arrow {
      transition: transform $transition;
    }
  }
}

// 黔地文化
.stories-section {
  padding: $spacing-2xl 0;
  background: $bg-white;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.story-card {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all $transition;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .story-image-wrap {
    position: relative;
    height: 200px;
  }

  .story-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .story-emoji {
      font-size: 80px;
    }
  }

  .story-tag {
    position: absolute;
    top: $spacing-md;
    left: $spacing-md;
    background: rgba(255, 255, 255, 0.95);
    color: $text-primary;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: $font-size-sm;
    font-weight: 500;
  }

  .story-content {
    padding: $spacing-lg;

    .story-title {
      font-size: $font-size-xl;
      font-weight: 600;
      margin-bottom: $spacing-md;
      color: $text-primary;
    }

    .story-text {
      font-size: $font-size;
      color: $text-secondary;
      line-height: 1.7;
    }
  }
}

// 底部行动区
.cta-section {
  padding: $spacing-2xl 0;
  background: $bg;
}

.cta-wrap {
  background: linear-gradient(135deg, $primary 0%, $accent-green 100%);
  border-radius: $radius-xl;
  padding: 60px 40px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(244, 162, 97, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(230, 57, 70, 0.2) 0%, transparent 50%);
  }

  .cta-title {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: $spacing-md;
    position: relative;
    z-index: 1;
  }

  .cta-subtitle {
    font-size: $font-size-lg;
    opacity: 0.95;
    margin-bottom: $spacing-2xl;
    position: relative;
    z-index: 1;
  }

  .cta-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;

    .el-button {
      min-width: 180px;
      font-weight: 600;
    }
  }
}

@include lg {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .hero-title .title-main {
    font-size: 48px;
  }

  .hero-title .title-sub {
    font-size: 28px;
  }

  .section-header .section-title,
  .cta-wrap .cta-title {
    font-size: 28px;
  }
}
</style>