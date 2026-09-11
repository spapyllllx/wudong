<template>
  <div class="home-page">
    <!-- 顶部横幅 -->
    <div class="hero-banner">
      <div class="container">
        <h1 class="hero-title">探索贵州乡村之美</h1>
        <p class="hero-subtitle">品非遗、尝美食、宿民居、游山水</p>
        <div class="hero-search">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品、景点、餐厅、民宿..."
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- 快捷入口 -->
      <div class="quick-nav">
        <div class="nav-item" @click="router.push('/product')">
          <div class="nav-icon">🛍️</div>
          <div class="nav-label">非遗商品</div>
        </div>
        <div class="nav-item" @click="router.push('/restaurant')">
          <div class="nav-icon">🍴</div>
          <div class="nav-label">特色餐饮</div>
        </div>
        <div class="nav-item" @click="router.push('/homestay')">
          <div class="nav-icon">🏠</div>
          <div class="nav-label">特色民宿</div>
        </div>
        <div class="nav-item" @click="router.push('/ticket')">
          <div class="nav-icon">🎫</div>
          <div class="nav-label">景区门票</div>
        </div>
      </div>

      <!-- 四大板块展示 -->
      <div class="section">
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

      <!-- 文化故事区 -->
      <div class="section">
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

      <!-- 底部行动区 -->
      <div class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">开启你的贵州之旅</h2>
          <p class="cta-subtitle">从一件非遗好物,一顿特色美食,一次山水之行开始</p>
          <div class="cta-buttons">
            <el-button type="primary" size="large" @click="router.push('/product')">
              浏览非遗商品
            </el-button>
            <el-button size="large" @click="router.push('/ticket')">
              查看景区门票
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchKeyword = ref('')

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

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value }
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.home-page {
  background: $bg;
}

// 顶部横幅
.hero-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  margin-bottom: $spacing-2xl;

  .hero-title {
    font-size: 48px;
    font-weight: 600;
    text-align: center;
    margin-bottom: $spacing-md;
  }

  .hero-subtitle {
    font-size: 20px;
    text-align: center;
    margin-bottom: $spacing-2xl;
    opacity: 0.9;
  }

  .hero-search {
    max-width: 600px;
    margin: 0 auto;
  }
}

// 快捷导航
.quick-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;

  .nav-item {
    background: white;
    border-radius: $radius-lg;
    padding: $spacing-2xl;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .nav-icon {
      font-size: 48px;
      margin-bottom: $spacing-md;
    }

    .nav-label {
      font-size: $font-size-lg;
      font-weight: 500;
    }
  }
}

// 区块
.section {
  margin-bottom: $spacing-2xl;

  .section-header {
    text-align: center;
    margin-bottom: $spacing-2xl;

    .section-title {
      font-size: 36px;
      font-weight: 600;
      margin-bottom: $spacing-sm;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .section-desc {
      font-size: $font-size-lg;
      color: $text-secondary;
    }
  }
}

// 四大板块
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  .feature-card {
    padding: 40px;
    border-radius: $radius-lg;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
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
      font-size: $font-size-base;
      opacity: 0.85;
      line-height: 1.6;
      margin-bottom: auto;
      position: relative;
      z-index: 1;
    }

    .feature-action {
      margin-top: $spacing-lg;
      font-size: $font-size-base;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      position: relative;
      z-index: 1;

      .arrow {
        transition: transform 0.3s;
      }
    }
  }
}

// 文化故事
.story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;

  .story-card {
    background: white;
    border-radius: $radius-lg;
    overflow: hidden;
    transition: all 0.3s;

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
        font-size: $font-size-base;
        color: $text-secondary;
        line-height: 1.7;
      }
    }
  }
}

// 底部行动区
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $radius-lg;
  padding: 60px 40px;
  margin-bottom: $spacing-2xl;
  text-align: center;
  color: white;

  .cta-title {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: $spacing-md;
  }

  .cta-subtitle {
    font-size: $font-size-lg;
    opacity: 0.95;
    margin-bottom: $spacing-2xl;
  }

  .cta-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;

    .el-button {
      min-width: 160px;
    }
  }
}

@include md {
  .hero-banner {
    padding: 40px 0;

    .hero-title {
      font-size: 32px;
    }

    .hero-subtitle {
      font-size: 16px;
    }
  }

  .quick-nav {
    grid-template-columns: repeat(2, 1fr);
  }

  .section .section-header .section-title {
    font-size: 28px;
  }

  .feature-grid {
    grid-template-columns: 1fr;

    .feature-card {
      padding: $spacing-lg;
      min-height: 220px;

      .feature-icon {
        font-size: 48px;
      }

      .feature-title {
        font-size: 24px;
      }
    }
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .cta-section {
    padding: 40px 20px;

    .cta-title {
      font-size: 26px;
    }
  }
}
</style>
</content>
</invoke>