<template>
  <div class="home-page">
    <div class="container">
      <!-- 欢迎横幅 -->
      <div class="banner">
        <div class="banner-content">
          <h1 class="title">欢迎来到乌东文旅平台</h1>
          <p class="subtitle">发现美好，分享旅程</p>
          <el-button type="primary" size="large" @click="router.push('/community')">
            探索社区
          </el-button>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="quick-access">
        <div class="section-title">快捷入口</div>
        <div class="access-grid">
          <div class="access-item" @click="router.push('/community')">
            <div class="icon">🏞️</div>
            <div class="label">社区广场</div>
          </div>
          <div class="access-item">
            <div class="icon">🍜</div>
            <div class="label">美食推荐</div>
          </div>
          <div class="access-item">
            <div class="icon">🏨</div>
            <div class="label">住宿预订</div>
          </div>
          <div class="access-item">
            <div class="icon">🚗</div>
            <div class="label">交通出行</div>
          </div>
        </div>
      </div>

      <!-- 热门帖子 -->
      <div class="hot-posts">
        <div class="section-title">热门帖子</div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="post in hotPosts" :key="post.id">
            <el-card class="post-card" shadow="hover" @click="goToDetail(post.id)">
              <img :src="post.cover" class="post-cover" />
              <div class="post-info">
                <h3 class="post-title">{{ post.content }}</h3>
                <div class="post-meta">
                  <span class="author">
                    <el-icon><User /></el-icon>
                    {{ post.userNickName }}
                  </span>
                  <span class="stats">
                    <el-icon><Star /></el-icon>
                    {{ post.likeCount }}
                    <el-icon style="margin-left: 8px;"><ChatDotRound /></el-icon>
                    {{ post.commentCount }}
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hotPosts = ref<any[]>([])

onMounted(() => {
  // 模拟热门帖子数据
  hotPosts.value = [
    {
      id: 1,
      content: '乌东的秋天真的太美了！',
      cover: 'https://picsum.photos/400/250?random=1',
      userNickName: '旅行达人',
      likeCount: 128,
      commentCount: 45
    },
    {
      id: 2,
      content: '推荐一家超好吃的本地餐厅',
      cover: 'https://picsum.photos/400/250?random=2',
      userNickName: '美食家',
      likeCount: 96,
      commentCount: 32
    },
    {
      id: 3,
      content: '周末自驾游攻略分享',
      cover: 'https://picsum.photos/400/250?random=3',
      userNickName: '自驾游玩家',
      likeCount: 78,
      commentCount: 21
    }
  ]
})

const goToDetail = (id: number) => {
  router.push(`/community/detail/${id}`)
}
</script>

<style lang="scss" scoped>
.home-page {
  background: #f5f5f5;
  min-height: calc(100vh - 144px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 80px 60px;
  margin-bottom: 40px;
  color: #fff;

  .banner-content {
    text-align: center;

    .title {
      font-size: 48px;
      font-weight: bold;
      margin: 0 0 20px;
    }

    .subtitle {
      font-size: 24px;
      margin: 0 0 40px;
      opacity: 0.9;
    }
  }
}

.quick-access {
  margin-bottom: 40px;

  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .access-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .access-item {
      background: #fff;
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      .label {
        font-size: 16px;
        color: #666;
      }
    }
  }
}

.hot-posts {
  margin-bottom: 40px;

  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .post-card {
    cursor: pointer;
    transition: transform 0.3s;
    margin-bottom: 20px;

    &:hover {
      transform: translateY(-5px);
    }

    .post-cover {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .post-info {
      .post-title {
        font-size: 16px;
        color: #333;
        margin: 0 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #999;

        .author,
        .stats {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}
</style>
