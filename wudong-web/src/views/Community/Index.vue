<template>
  <div class="community-page">
    <!-- 社区特色横幅 -->
    <div class="community-hero">
      <div class="container">
        <h1 class="hero-title">
          <span class="title-icon">📸</span>
          旅行分享社区
          <span class="title-badge">记录美好</span>
        </h1>
        <p class="hero-subtitle">分享你的旅行故事 · 发现他人的精彩瞬间</p>
      </div>
    </div>

    <div class="container">
      <!-- 顶部操作栏 -->
      <div class="community-header">
        <h1 class="page-title">热门分享</h1>
        <el-button
          type="primary"
          size="large"
          class="publish-btn"
          :icon="Edit"
          @click="router.push('/community/publish')"
        >
          <span class="btn-text">✨ 发布游记</span>
        </el-button>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: activeTab === tab.value }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 瀑布流布局 -->
      <div v-loading="loading" class="post-waterfall">
        <div
          v-for="post in postList"
          :key="post.id"
          class="post-card"
          @click="router.push(`/community/post/${post.id}`)"
        >
          <!-- 封面图 -->
          <div class="post-cover">
            <el-image
              :src="post.images[0]"
              fit="cover"
              lazy
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <!-- 内容 -->
          <div class="post-content">
            <p class="post-text">{{ post.content }}</p>

            <!-- 用户信息 -->
            <div class="post-footer">
              <div class="user-info">
                <el-avatar :src="post.userAvatar" :size="24">
                  {{ post.userNickName?.[0] || '?' }}
                </el-avatar>
                <span class="username">{{ post.userNickName }}</span>
              </div>

              <div class="post-stats">
                <span class="stat-item">
                  <el-icon><View /></el-icon>
                  {{ formatCount(post.viewCount) }}
                </span>
                <span class="stat-item">
                  <el-icon :class="{ liked: post.isLiked }">
                    <component :is="post.isLiked ? 'Star' : 'StarFilled'" />
                  </el-icon>
                  {{ formatCount(post.likeCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more">
        <el-button @click="loadMore" :loading="loadingMore">
          加载更多
        </el-button>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="!loading && postList.length === 0" description="暂无内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Edit, Picture, View, Star, StarFilled } from '@element-plus/icons-vue'
import { getPostList, type Post } from '@/api/community'
import { formatCount } from '@/utils/format'

const router = useRouter()

const tabs = [
  { label: '最新', value: 'latest' },
  { label: '热门', value: 'hot' },
  { label: '精华', value: 'essence' }
]

const activeTab = ref('latest')
const loading = ref(false)
const loadingMore = ref(false)
const postList = ref<Post[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const hasMore = computed(() => postList.value.length < total.value)

// 切换标签
function handleTabChange(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
  postList.value = []
  fetchPostList()
}

// 获取帖子列表
async function fetchPostList() {
  loading.value = true
  try {
    const res = await getPostList(currentPage.value, pageSize.value, activeTab.value)
    postList.value = currentPage.value === 1 ? res.list : [...postList.value, ...res.list]
    total.value = res.pagination.total
  } catch (error) {
    console.error('获取帖子列表失败', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
async function loadMore() {
  if (loadingMore.value) return
  loadingMore.value = true
  currentPage.value++
  try {
    await fetchPostList()
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchPostList()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.community-page {
  background: linear-gradient(180deg,
    rgba(152, 193, 217, 0.08) 0%,
    rgba(248, 249, 250, 1) 20%,
    $bg 50%
  );
  min-height: 100vh;
}

// 社区特色横幅
.community-hero {
  background: linear-gradient(135deg,
    rgba(152, 193, 217, 0.95) 0%,
    rgba(61, 90, 128, 0.95) 50%,
    rgba(42, 157, 143, 0.95) 100%
  );
  padding: $spacing-2xl 0;
  margin-bottom: $spacing-xl;
  position: relative;
  overflow: hidden;

  // 装饰图案 - 相机和照片
  &::before {
    content: '📷';
    position: absolute;
    top: 15%;
    right: 8%;
    font-size: 180px;
    opacity: 0.12;
    animation: camera-shake 4s ease-in-out infinite;
  }

  &::after {
    content: '🖼️';
    position: absolute;
    bottom: 15%;
    left: 5%;
    font-size: 140px;
    opacity: 0.1;
    animation: photo-float 6s ease-in-out infinite;
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
    animation: camera-click 3s ease-in-out infinite;
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
  letter-spacing: 1px;
}

@keyframes camera-shake {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes photo-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg);
  }
}

@keyframes camera-click {
  0%, 90%, 100% {
    transform: scale(1);
  }
  95% {
    transform: scale(0.9);
  }
}

.community-header {
  @include flex-between;
  margin-bottom: $spacing-xl;
  padding-top: $spacing-xl;
  align-items: center;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  position: relative;
  display: inline-block;

  background: linear-gradient(135deg,
    $primary 0%,
    $primary-light 50%,
    $accent-green 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  // 底部装饰线
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg,
      $primary 0%,
      $accent-green 100%
    );
    border-radius: $radius-full;
  }
}

// 发布按钮特殊样式
.publish-btn {
  background: linear-gradient(135deg,
    $accent-red 0%,
    $accent-orange 100%
  );
  border: none;
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-lg;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(230, 57, 70, 0.4);
  transition: all $transition;

  &:hover {
    background: linear-gradient(135deg,
      $accent-orange 0%,
      $accent-red 100%
    );
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(230, 57, 70, 0.5);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  .btn-text {
    letter-spacing: 1px;
  }
}

.filter-tabs {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-2xl;
  padding: $spacing-md;
  background: $bg-white;
  border-radius: $radius-xl;
  box-shadow: 0 4px 16px rgba(61, 90, 128, 0.12);
  border: 2px solid rgba(61, 90, 128, 0.08);
  position: relative;

  // 顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
      $primary 0%,
      $primary-light 33%,
      $accent-green 66%,
      $accent-yellow 100%
    );
    border-radius: $radius-xl $radius-xl 0 0;
  }
}

.tab-item {
  padding: $spacing-sm $spacing-lg;
  font-size: $font-size;
  color: #1a1a1a;
  cursor: pointer;
  transition: all $transition;
  position: relative;
  border-radius: $radius-md;
  font-weight: 600;
  border: 2px solid $border;
  background: $bg;

  &:hover {
    color: $accent-red;
    background: rgba(230, 57, 70, 0.1);
    border-color: $accent-red;
    transform: translateY(-2px);
  }

  &.active {
    color: $accent-red;
    font-weight: 800;
    background: rgba(230, 57, 70, 0.15);
    border-color: $accent-red;
    box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);
  }
}

.post-waterfall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: $spacing-lg;
}

.post-waterfall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $spacing-xl;
  padding-bottom: $spacing-2xl;
}

.post-card {
  background: $bg-white;
  border-radius: $radius-xl;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-slow;
  border: 2px solid transparent;
  position: relative;
  box-shadow: 0 2px 12px rgba(61, 90, 128, 0.08);

  // 多彩顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg,
      $accent-red 0%,
      $accent-orange 20%,
      $accent-yellow 40%,
      $accent-green 60%,
      $primary-light 80%,
      $primary 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: 2;
  }

  // 发光边框效果
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: $radius-xl;
    background: linear-gradient(135deg,
      rgba(152, 193, 217, 0.5) 0%,
      rgba(42, 157, 143, 0.5) 50%,
      rgba(244, 162, 97, 0.5) 100%
    );
    opacity: 0;
    transition: opacity $transition;
    z-index: -1;
    filter: blur(8px);
  }

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 20px 40px rgba(61, 90, 128, 0.25);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 0.6;
    }

    .post-cover .el-image {
      transform: scale(1.1) rotate(1deg);
    }

    .user-info {
      .el-avatar {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(61, 90, 128, 0.3);
      }
    }
  }
}

.post-cover {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: linear-gradient(135deg,
    rgba(152, 193, 217, 0.2) 0%,
    rgba(248, 249, 250, 1) 100%
  );
  position: relative;

  .el-image {
    width: 100%;
    height: 100%;
    transition: transform $transition-slow;
  }

  // 图片顶部渐变
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  // 图片底部渐变
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.15) 100%
    );
    pointer-events: none;
  }

  .image-slot {
    @include flex-center;
    width: 100%;
    height: 100%;
    font-size: 48px;
    color: $text-disabled;
    background: linear-gradient(135deg,
      rgba(152, 193, 217, 0.15) 0%,
      $divider 100%
    );
  }
}

.post-content {
  padding: $spacing-lg;
  background: $bg-white;
}

.post-text {
  font-size: $font-size-sm;
  color: $text-primary;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-md;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
}

.post-footer {
  @include flex-between;
  align-items: center;
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 2px solid $divider;
}

.user-info {
  @include flex-start;
  gap: $spacing-sm;
  flex: 1;
  min-width: 0;

  .el-avatar {
    flex-shrink: 0;
    transition: all $transition;
    border: 2px solid rgba(61, 90, 128, 0.1);
  }

  .username {
    font-size: $font-size-xs;
    color: $text-secondary;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.post-stats {
  @include flex-start;
  gap: $spacing-md;
  font-size: $font-size-xs;
  color: $text-secondary;

  .stat-item {
    @include flex-start;
    gap: 4px;
    white-space: nowrap;
    transition: all $transition;

    .el-icon {
      font-size: 14px;
      transition: transform $transition;
    }

    &:hover {
      color: $primary;

      .el-icon {
        transform: scale(1.2);
      }
    }
  }
}

.post-content {
  padding: $spacing-md;
}

.post-text {
  font-size: $font-size-sm;
  color: $text-primary;
  line-height: $line-height-relaxed;
  @include ellipsis(2);
  margin-bottom: $spacing-md;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm;
}

.user-info {
  @include flex-start;
  gap: $spacing-xs;
  flex: 1;
  min-width: 0;
}

.username {
  font-size: $font-size-xs;
  color: $text-secondary;
  @include ellipsis;
}

.post-stats {
  display: flex;
  gap: $spacing-md;
  flex-shrink: 0;
}

.stat-item {
  @include flex-center;
  gap: 2px;
  font-size: $font-size-xs;
  color: $text-secondary;

  .el-icon {
    font-size: 14px;

    &.liked {
      color: $danger;
    }
  }
}

.load-more {
  @include flex-center;
  margin-top: $spacing-xl;
}

@include lg {
  .post-waterfall {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@include md {
  .post-waterfall {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include sm {
  .post-waterfall {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-sm;
  }
}
</style>
