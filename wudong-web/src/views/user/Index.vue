<template>
  <div class="user-center">
    <div class="container">
      <div class="user-layout">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <div class="user-card">
            <el-avatar :src="userStore.avatar" :size="80">
              {{ userStore.nickname[0] }}
            </el-avatar>
            <h3 class="user-name">{{ userStore.nickname }}</h3>
            <p class="user-phone">{{ maskPhone(userInfo?.phone || '') }}</p>
          </div>

          <nav class="user-nav">
            <router-link to="/user" class="nav-item">
              <el-icon><User /></el-icon>
              个人资料
            </router-link>
            <router-link to="/order/list" class="nav-item">
              <el-icon><Document /></el-icon>
              我的订单
            </router-link>
            <router-link to="/user/address" class="nav-item">
              <el-icon><Location /></el-icon>
              地址管理
            </router-link>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <main class="user-main">
          <el-card>
            <h2 class="section-title">我的动态</h2>

            <el-tabs v-model="activeTab">
              <el-tab-pane label="我的帖子" name="posts">
                <div v-loading="loading" class="post-list">
                  <div
                    v-for="post in myPosts"
                    :key="post.id"
                    class="post-item"
                    @click="router.push(`/community/post/${post.id}`)"
                  >
                    <el-image
                      :src="post.images[0]"
                      fit="cover"
                      class="post-img"
                    />
                    <div class="post-info">
                      <p class="post-content">{{ post.content }}</p>
                      <div class="post-meta">
                        <span>{{ formatRelativeTime(post.createTime) }}</span>
                        <span>{{ post.likeCount }} 赞 · {{ post.commentCount }} 评论</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-if="!loading && myPosts.length === 0" description="暂无帖子" />
              </el-tab-pane>

              <el-tab-pane label="我的收藏" name="favorites">
                <el-empty description="暂无收藏" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Document, Location } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/user'
import { getMyPostList, type Post } from '@/api/community'
import { maskPhone, formatRelativeTime } from '@/utils/format'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('posts')
const loading = ref(false)
const userInfo = ref<any>(null)
const myPosts = ref<Post[]>([])

async function fetchUserInfo() {
  userInfo.value = await getUserInfo()
}

async function fetchMyPosts() {
  loading.value = true
  try {
    const res = await getMyPostList(1, 20)
    myPosts.value = res.list
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchMyPosts()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.user-center {
  padding: $spacing-xl 0;
}

.user-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: $spacing-xl;
}

.user-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.user-card {
  @include flex-center;
  flex-direction: column;
  padding: $spacing-xl;
  background: $bg-white;
  border-radius: $radius-md;
  border: 1px solid $border;
  margin-bottom: $spacing-md;

  .user-name {
    margin-top: $spacing-md;
    font-size: $font-size-lg;
    font-weight: 600;
  }

  .user-phone {
    color: $text-secondary;
    font-size: $font-size-sm;
    margin-top: $spacing-xs;
  }
}

.user-nav {
  background: $bg-white;
  border-radius: $radius-md;
  border: 1px solid $border;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  color: $text-primary;
  transition: all $transition;
  border-bottom: 1px solid $divider;

  &:last-child {
    border-bottom: none;
  }

  &:hover,
  &.router-link-active {
    background: $primary-lighter;
    color: $primary;
  }
}

.section-title {
  font-size: $font-size-xl;
  font-weight: 600;
  margin-bottom: $spacing-lg;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.post-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $bg;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition;

  &:hover {
    background: $divider;
  }
}

.post-img {
  width: 120px;
  height: 120px;
  border-radius: $radius;
  flex-shrink: 0;
}

.post-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-content {
  @include ellipsis(2);
  color: $text-primary;
  line-height: $line-height-relaxed;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: $font-size-sm;
  color: $text-secondary;
}

@include md {
  .user-layout {
    grid-template-columns: 1fr;
  }

  .user-sidebar {
    position: static;
  }
}
</style>
