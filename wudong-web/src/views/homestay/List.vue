<template>
  <div class="homestay-list">
    <!-- 住宿特色横幅 -->
    <div class="homestay-hero">
      <div class="container">
        <h1 class="hero-title">
          <span class="title-icon">🏡</span>
          贵州民宿
          <span class="title-badge">特色住宿</span>
        </h1>
        <p class="hero-subtitle">吊脚楼 · 侗寨客栈 · 苗寨民居 · 山水田园</p>
      </div>
    </div>

    <div class="container">
      <!-- 筛选标签 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">类型：</span>
          <div class="filter-tags">
            <span
              v-for="type in types"
              :key="type.value"
              class="filter-tag"
              :class="{ active: activeType === type.value }"
              @click="activeType = type.value"
            >
              {{ type.label }}
            </span>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">价格：</span>
          <div class="filter-tags">
            <span
              v-for="price in priceRanges"
              :key="price.value"
              class="filter-tag"
              :class="{ active: activePrice === price.value }"
              @click="activePrice = price.value"
            >
              {{ price.label }}
            </span>
          </div>
        </div>
      </div>

      <!-- 民宿列表 -->
      <div v-loading="loading" class="homestay-grid">
        <div
          v-for="homestay in homestayList"
          :key="homestay.id"
          class="homestay-card"
          @click="router.push(`/homestay/${homestay.id}`)"
        >
          <div class="homestay-images">
            <el-image :src="homestay.cover" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="image-badge" v-if="homestay.featured">
              <span>🏆 精选</span>
            </div>
            <div class="image-count">
              <el-icon><Picture /></el-icon>
              <span>{{ homestay.imageCount }}</span>
            </div>
          </div>
          <div class="homestay-info">
            <div class="homestay-header">
              <h3 class="homestay-name">{{ homestay.name }}</h3>
              <div class="homestay-rating">
                <el-icon color="#f4a261"><Star /></el-icon>
                <span>{{ homestay.rating }}</span>
              </div>
            </div>
            <p class="homestay-location">
              <el-icon><LocationInformation /></el-icon>
              <span>{{ homestay.location }}</span>
            </p>
            <p class="homestay-desc">{{ homestay.desc }}</p>
            <div class="homestay-tags">
              <span v-for="tag in homestay.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <div class="homestay-footer">
              <div class="price">
                <span class="price-label">¥</span>
                <span class="price-value">{{ homestay.price }}</span>
                <span class="price-unit">/晚起</span>
              </div>
              <el-button type="primary" size="small" round>
                预订
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && homestayList.length === 0" description="暂无民宿" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, Star, LocationInformation } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const activeType = ref('all')
const activePrice = ref('all')

const types = [
  { label: '全部', value: 'all' },
  { label: '吊脚楼', value: 'diaojiaolou' },
  { label: '侗寨客栈', value: 'dongzhai' },
  { label: '苗寨民居', value: 'miaozhai' },
  { label: '田园民宿', value: 'tianyuan' }
]

const priceRanges = [
  { label: '全部', value: 'all' },
  { label: '¥0-200', value: '0-200' },
  { label: '¥200-500', value: '200-500' },
  { label: '¥500-1000', value: '500-1000' },
  { label: '¥1000+', value: '1000+' }
]

// 模拟数据
const homestayList = ref([])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.homestay-list {
  background: linear-gradient(180deg,
    rgba(90, 123, 163, 0.05) 0%,
    $bg 30%
  );
  min-height: 100vh;
}

// 住宿特色横幅
.homestay-hero {
  background: linear-gradient(135deg,
    rgba(61, 90, 128, 0.9) 0%,
    rgba(90, 123, 163, 0.9) 100%
  );
  padding: $spacing-2xl 0;
  margin-bottom: $spacing-xl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '🏡';
    position: absolute;
    top: 10%;
    right: 5%;
    font-size: 180px;
    opacity: 0.1;
    animation: sway 8s ease-in-out infinite;
  }

  &::after {
    content: '🌄';
    position: absolute;
    bottom: 10%;
    left: 10%;
    font-size: 120px;
    opacity: 0.08;
    animation: sway 10s ease-in-out infinite;
    animation-delay: -3s;
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
    animation: pulse 2s ease-in-out infinite;
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

@keyframes sway {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(20px, -20px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// 筛选栏
.filter-bar {
  background: $bg-white;
  padding: $spacing-lg;
  border-radius: $radius-xl;
  margin-bottom: $spacing-xl;
  box-shadow: $shadow-md;
  border: 2px solid rgba(61, 90, 128, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  &:not(:last-child) {
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid $divider;
  }
}

.filter-label {
  font-size: $font-size;
  font-weight: 600;
  color: $text-primary;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.filter-tag {
  padding: $spacing-xs $spacing-md;
  background: $bg;
  border: 2px solid transparent;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: 500;
  color: $text-secondary;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    background: rgba(61, 90, 128, 0.08);
    color: $primary;
  }

  &.active {
    background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
    color: white;
    border-color: $primary;
    box-shadow: 0 2px 8px rgba(61, 90, 128, 0.3);
  }
}

// 民宿列表
.homestay-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-2xl;
  padding-bottom: $spacing-2xl;
}

.homestay-card {
  background: $bg-white;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-slow;
  border: 2px solid transparent;
  box-shadow: $shadow-sm;
  display: grid;
  grid-template-columns: 320px 1fr;
  position: relative;

  // 顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      $primary 0%,
      $primary-light 50%,
      $accent-yellow 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(61, 90, 128, 0.25);
    border-color: rgba(61, 90, 128, 0.2);

    &::before {
      opacity: 1;
    }

    .homestay-images .el-image {
      transform: scale(1.1);
    }
  }
}

.homestay-images {
  width: 320px;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(61, 90, 128, 0.1) 0%,
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
    font-size: 48px;
    color: $text-disabled;
  }

  .image-badge {
    position: absolute;
    top: $spacing-md;
    left: $spacing-md;
    background: linear-gradient(135deg,
      rgba(244, 162, 97, 0.95) 0%,
      rgba(230, 57, 70, 0.95) 100%
    );
    color: white;
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-full;
    font-size: $font-size-xs;
    font-weight: 600;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .image-count {
    position: absolute;
    bottom: $spacing-md;
    right: $spacing-md;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    color: white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius;
    font-size: $font-size-xs;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.homestay-info {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
}

.homestay-header {
  @include flex-between;
  margin-bottom: $spacing-sm;
}

.homestay-name {
  font-size: $font-size-xl;
  font-weight: 700;
  color: $text-primary;
  transition: color $transition;

  .homestay-card:hover & {
    color: $primary;
  }
}

.homestay-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size;
  font-weight: 600;
  color: $accent-yellow;
}

.homestay-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-sm;
}

.homestay-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
  line-height: $line-height-relaxed;
}

.homestay-tags {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;

  .tag {
    font-size: $font-size-xs;
    color: $primary;
    background: rgba(61, 90, 128, 0.1);
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    font-weight: 500;
  }
}

.homestay-footer {
  @include flex-between;
  align-items: center;
  margin-top: auto;
  padding-top: $spacing-md;
  border-top: 1px solid $divider;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 2px;

  .price-label {
    font-size: $font-size;
    color: $accent-red;
    font-weight: 600;
  }

  .price-value {
    font-size: 28px;
    color: $accent-red;
    font-weight: 800;
  }

  .price-unit {
    font-size: $font-size-xs;
    color: $text-secondary;
    font-weight: 500;
  }
}

@include lg {
  .homestay-grid {
    grid-template-columns: 1fr;
  }
}

@include md {
  .homestay-card {
    grid-template-columns: 1fr;
  }

  .homestay-images {
    width: 100%;
    height: 280px;
  }
}
</style>
