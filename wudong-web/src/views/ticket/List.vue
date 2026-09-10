<template>
  <div class="ticket-list">
    <!-- 景区特色横幅 -->
    <div class="ticket-hero">
      <div class="container">
        <h1 class="hero-title">
          <span class="title-icon">🎫</span>
          贵州景区门票
          <span class="title-badge">山水胜景</span>
        </h1>
        <p class="hero-subtitle">黄果树 · 梵净山 · 西江苗寨 · 荔波小七孔</p>
      </div>
    </div>

    <div class="container">
      <!-- 景区分类 -->
      <div class="category-section">
        <div
          v-for="cat in categories"
          :key="cat.value"
          class="category-card"
          :class="{ active: activeCategory === cat.value }"
          @click="activeCategory = cat.value"
        >
          <div class="category-icon">{{ cat.icon }}</div>
          <div class="category-name">{{ cat.label }}</div>
        </div>
      </div>

      <!-- 景区列表 -->
      <div v-loading="loading" class="ticket-grid">
        <div
          v-for="ticket in ticketList"
          :key="ticket.id"
          class="ticket-card"
          @click="router.push(`/ticket/${ticket.id}`)"
        >
          <div class="ticket-cover">
            <el-image :src="ticket.cover" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="ticket-level" v-if="ticket.level">
              <span>{{ ticket.level }}</span>
            </div>
            <div class="ticket-hot" v-if="ticket.hot">
              <span>🔥 热门</span>
            </div>
          </div>
          <div class="ticket-info">
            <h3 class="ticket-name">{{ ticket.name }}</h3>
            <p class="ticket-location">
              <el-icon><Location /></el-icon>
              <span>{{ ticket.location }}</span>
            </p>
            <div class="ticket-highlights">
              <span v-for="highlight in ticket.highlights" :key="highlight" class="highlight">
                ✨ {{ highlight }}
              </span>
            </div>
            <div class="ticket-footer">
              <div class="price-section">
                <div class="price-main">
                  <span class="price-label">¥</span>
                  <span class="price-value">{{ ticket.price }}</span>
                  <span class="price-original" v-if="ticket.originalPrice">
                    ¥{{ ticket.originalPrice }}
                  </span>
                </div>
                <div class="price-tip">含景区交通</div>
              </div>
              <el-button type="primary" size="large" round>
                立即预订
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && ticketList.length === 0" description="暂无景区" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, Location } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const activeCategory = ref('all')

const categories = [
  { label: '全部景区', value: 'all', icon: '🏞️' },
  { label: '山岳景观', value: 'mountain', icon: '⛰️' },
  { label: '瀑布溶洞', value: 'waterfall', icon: '💧' },
  { label: '民族村寨', value: 'village', icon: '🏘️' },
  { label: '自然保护区', value: 'nature', icon: '🌲' }
]

// 模拟数据
// TODO(后端未就绪)：票务模块后端尚未实现，这里暂为空列表。
const ticketList = ref<any[]>([])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.ticket-list {
  background: linear-gradient(180deg,
    rgba(152, 193, 217, 0.08) 0%,
    $bg 30%
  );
  min-height: 100vh;
}

// 景区特色横幅
.ticket-hero {
  background: linear-gradient(135deg,
    rgba(152, 193, 217, 0.95) 0%,
    rgba(61, 90, 128, 0.95) 100%
  );
  padding: $spacing-2xl 0;
  margin-bottom: $spacing-xl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '🏔️';
    position: absolute;
    top: 0%;
    right: 8%;
    font-size: 220px;
    opacity: 0.12;
    animation: drift 15s ease-in-out infinite;
  }

  &::after {
    content: '🌊';
    position: absolute;
    bottom: -5%;
    left: 5%;
    font-size: 160px;
    opacity: 0.1;
    animation: drift 12s ease-in-out infinite;
    animation-delay: -5s;
  }

  .container {
    position: relative;
    z-index: 1;
    text-align: center;
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: $spacing-md;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  .title-icon {
    font-size: 56px;
    animation: swing 3s ease-in-out infinite;
  }

  .title-badge {
    display: inline-block;
    font-size: $font-size-sm;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-full;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
}

.hero-subtitle {
  font-size: $font-size-xl;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 2px;
}

@keyframes drift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-30px, 30px) rotate(-10deg);
  }
}

@keyframes swing {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

// 景区分类
.category-section {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.category-card {
  background: $bg-white;
  padding: $spacing-xl $spacing-lg;
  border-radius: $radius-xl;
  text-align: center;
  cursor: pointer;
  transition: all $transition;
  border: 2px solid transparent;
  box-shadow: $shadow-sm;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      $primary-light 0%,
      $accent-green 100%
    );
    opacity: 0;
    transition: opacity $transition;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(61, 90, 128, 0.2);
    border-color: rgba(61, 90, 128, 0.15);

    &::before {
      opacity: 1;
    }

    .category-icon {
      transform: scale(1.2);
    }
  }

  &.active {
    background: linear-gradient(135deg,
      rgba(152, 193, 217, 0.15) 0%,
      rgba(61, 90, 128, 0.08) 100%
    );
    border-color: $primary-light;

    &::before {
      opacity: 1;
    }

    .category-icon {
      transform: scale(1.2);
    }

    .category-name {
      color: $primary;
      font-weight: 700;
    }
  }
}

.category-icon {
  font-size: 48px;
  margin-bottom: $spacing-sm;
  transition: transform $transition;
}

.category-name {
  font-size: $font-size;
  font-weight: 600;
  color: $text-primary;
  transition: color $transition;
}

// 景区列表
.ticket-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-2xl;
  padding-bottom: $spacing-2xl;
}

.ticket-card {
  background: $bg-white;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-slow;
  border: 2px solid transparent;
  box-shadow: $shadow-sm;
  position: relative;

  // 顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg,
      $primary-light 0%,
      $accent-green 50%,
      $accent-yellow 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(61, 90, 128, 0.25);
    border-color: rgba(61, 90, 128, 0.2);

    &::before {
      opacity: 1;
    }

    .ticket-cover .el-image {
      transform: scale(1.1);
    }
  }
}

.ticket-cover {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(152, 193, 217, 0.2) 0%,
    $divider 100%
  );
  position: relative;

  .el-image {
    width: 100%;
    height: 100%;
    transition: transform $transition-slow;
  }

  .image-slot {
    @include flex-center;
    width: 100%;
    height: 100%;
    font-size: 56px;
    color: $text-disabled;
  }

  .ticket-level {
    position: absolute;
    top: $spacing-md;
    left: $spacing-md;
    background: linear-gradient(135deg,
      rgba(244, 162, 97, 0.95) 0%,
      rgba(230, 57, 70, 0.95) 100%
    );
    color: white;
    padding: $spacing-xs $spacing-md;
    border-radius: $radius;
    font-size: $font-size-sm;
    font-weight: 700;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
  }

  .ticket-hot {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    background: rgba(230, 57, 70, 0.95);
    backdrop-filter: blur(10px);
    color: white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  // 渐变遮罩
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
}

.ticket-info {
  padding: $spacing-xl;
}

.ticket-name {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  transition: color $transition;

  .ticket-card:hover & {
    color: $primary;
  }
}

.ticket-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
}

.ticket-highlights {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;

  .highlight {
    font-size: $font-size-sm;
    color: $text-secondary;
    line-height: $line-height-relaxed;
  }
}

.ticket-footer {
  @include flex-between;
  align-items: flex-end;
  padding-top: $spacing-lg;
  border-top: 2px solid $divider;
}

.price-section {
  flex: 1;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;

  .price-label {
    font-size: $font-size-lg;
    color: $accent-red;
    font-weight: 700;
  }

  .price-value {
    font-size: 36px;
    color: $accent-red;
    font-weight: 800;
    line-height: 1;
  }

  .price-original {
    font-size: $font-size-sm;
    color: $text-disabled;
    text-decoration: line-through;
  }
}

.price-tip {
  font-size: $font-size-xs;
  color: $text-secondary;
}

@include lg {
  .category-section {
    grid-template-columns: repeat(3, 1fr);
  }
}

@include md {
  .ticket-grid {
    grid-template-columns: 1fr;
  }

  .category-section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
