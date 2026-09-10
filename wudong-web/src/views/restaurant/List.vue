<template>
  <div class="restaurant-list">
    <!-- 餐饮特色横幅 -->
    <div class="restaurant-hero">
      <div class="container">
        <h1 class="hero-title">
          <span class="title-icon">🍜</span>
          贵州美食
          <span class="title-badge">地道风味</span>
        </h1>
        <p class="hero-subtitle">酸汤鱼 · 羊肉粉 · 丝娃娃 · 苗家菜 · 侗族风味</p>
      </div>
    </div>

    <div class="container">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <div
          v-for="cat in categories"
          :key="cat.value"
          class="category-item"
          :class="{ active: activeCategory === cat.value }"
          @click="activeCategory = cat.value"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-name">{{ cat.label }}</span>
        </div>
      </div>

      <!-- 餐厅列表 -->
      <div v-loading="loading" class="restaurant-grid">
        <div
          v-for="restaurant in restaurantList"
          :key="restaurant.id"
          class="restaurant-card"
          @click="router.push(`/restaurant/${restaurant.id}`)"
        >
          <div class="restaurant-cover">
            <el-image :src="restaurant.cover" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="restaurant-badge" v-if="restaurant.featured">
              <span>⭐ 推荐</span>
            </div>
          </div>
          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ restaurant.name }}</h3>
            <p class="restaurant-desc">{{ restaurant.desc }}</p>
            <div class="restaurant-tags">
              <span v-for="tag in restaurant.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <div class="restaurant-meta">
              <div class="rating">
                <el-icon color="#f4a261"><Star /></el-icon>
                <span>{{ restaurant.rating }}</span>
              </div>
              <div class="price">
                <span>¥{{ restaurant.avgPrice }}/人</span>
              </div>
              <div class="distance" v-if="restaurant.distance">
                <el-icon><Location /></el-icon>
                <span>{{ restaurant.distance }}km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && restaurantList.length === 0" description="暂无餐厅" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, Star, Location } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const activeCategory = ref('all')

const categories = [
  { label: '全部', value: 'all', icon: '🍽️' },
  { label: '酸汤鱼', value: 'fish', icon: '🐟' },
  { label: '羊肉粉', value: 'noodle', icon: '🍜' },
  { label: '苗家菜', value: 'miao', icon: '🥘' },
  { label: '侗族风味', value: 'dong', icon: '🍲' },
  { label: '小吃', value: 'snack', icon: '🥟' }
]

// TODO(后端未就绪)：餐饮模块后端尚未实现，这里暂为空列表。
// 待后端补齐后接入 src/api/restaurant.ts，页面即可渲染。
const restaurantList = ref<any[]>([])
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.restaurant-list {
  background: linear-gradient(180deg,
    rgba(42, 157, 143, 0.05) 0%,
    $bg 30%
  );
  min-height: 100vh;
}

// 餐饮特色横幅
.restaurant-hero {
  background: linear-gradient(135deg,
    rgba(42, 157, 143, 0.9) 0%,
    rgba(90, 123, 163, 0.9) 100%
  );
  padding: $spacing-2xl 0;
  margin-bottom: $spacing-xl;
  position: relative;
  overflow: hidden;

  &::before {
    content: '🍜';
    position: absolute;
    top: 20%;
    right: 10%;
    font-size: 200px;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '🥘';
    position: absolute;
    bottom: 10%;
    left: 5%;
    font-size: 150px;
    opacity: 0.08;
    animation: float 8s ease-in-out infinite;
    animation-delay: -2s;
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
    animation: rotate 3s ease-in-out infinite;
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

@keyframes rotate {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -30px);
  }
}

// 分类标签
.category-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-2xl;
  padding: $spacing-md;
  background: $bg-white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  overflow-x: auto;
  border: 2px solid rgba(42, 157, 143, 0.1);

  &::-webkit-scrollbar {
    height: 4px;
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md $spacing-lg;
  cursor: pointer;
  transition: all $transition;
  border-radius: $radius-md;
  white-space: nowrap;
  flex-shrink: 0;

  .category-icon {
    font-size: 32px;
    transition: transform $transition;
  }

  .category-name {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-secondary;
    transition: color $transition;
  }

  &:hover {
    background: rgba(42, 157, 143, 0.05);

    .category-icon {
      transform: scale(1.2);
    }

    .category-name {
      color: $accent-green;
    }
  }

  &.active {
    background: linear-gradient(135deg,
      $accent-green 0%,
      rgba(90, 123, 163, 0.9) 100%
    );
    box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);

    .category-icon {
      transform: scale(1.2);
    }

    .category-name {
      color: white;
      font-weight: 600;
    }
  }
}

// 餐厅列表
.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;
  padding-bottom: $spacing-2xl;
}

.restaurant-card {
  background: $bg-white;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-slow;
  border: 2px solid transparent;
  box-shadow: $shadow-sm;
  position: relative;

  // 顶部美食标识条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      $accent-green 0%,
      $primary-light 50%,
      $accent-yellow 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 32px rgba(42, 157, 143, 0.25);
    border-color: rgba(42, 157, 143, 0.2);

    &::before {
      opacity: 1;
    }

    .restaurant-cover .el-image {
      transform: scale(1.1);
    }
  }
}

.restaurant-cover {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(42, 157, 143, 0.1) 0%,
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
    background: linear-gradient(135deg,
      rgba(42, 157, 143, 0.1) 0%,
      $divider 100%
    );
  }

  // 推荐标签
  .restaurant-badge {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
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
}

.restaurant-info {
  padding: $spacing-lg;
}

.restaurant-name {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  transition: color $transition;

  .restaurant-card:hover & {
    color: $accent-green;
  }
}

.restaurant-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
  line-height: $line-height-relaxed;
}

.restaurant-tags {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;

  .tag {
    font-size: $font-size-xs;
    color: $accent-green;
    background: rgba(42, 157, 143, 0.1);
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    font-weight: 500;
  }
}

.restaurant-meta {
  @include flex-between;
  font-size: $font-size-sm;
  padding-top: $spacing-md;
  border-top: 1px solid $divider;

  .rating,
  .price,
  .distance {
    @include flex-start;
    gap: 4px;
    color: $text-secondary;
  }

  .rating {
    color: $accent-yellow;
    font-weight: 600;
  }

  .price {
    color: $accent-red;
    font-weight: 600;
  }
}

@include md {
  .restaurant-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include sm {
  .restaurant-grid {
    grid-template-columns: 1fr;
  }
}
</style>
