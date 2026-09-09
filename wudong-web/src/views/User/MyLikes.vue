<template>
  <div class="my-likes-page">
    <div class="container">
      <h2>我的点赞</h2>
      <div v-if="postList.length === 0">
        <el-empty description="还没有点赞" />
      </div>
      <el-card v-for="post in postList" :key="post.id" class="post-item">
        <div class="post-header">
          <el-avatar :src="post.userAvatar" :size="40" />
          <div class="user-info">
            <div class="nickname">{{ post.userNickName }}</div>
            <div class="time">{{ post.createTime }}</div>
          </div>
        </div>
        <div class="post-content">
          <div class="content-text">{{ post.content }}</div>
          <div class="post-footer">
            <span>❤️ {{ post.likeCount }}</span>
            <span>💬 {{ post.commentCount }}</span>
            <el-button size="small" @click="handleUnlike(post)">取消点赞</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import communityApi from '@/api/community'

const postList = ref<any[]>([])

const loadMyLikes = async () => {
  try {
    const res: any = await communityApi.getMyLikeList({ page: 1, size: 20 })
    postList.value = res.list
  } catch (error) {
    console.error('加载失败', error)
  }
}

const handleUnlike = async (post: any) => {
  try {
    await communityApi.unlikePost(post.id)
    ElMessage.success('已取消点赞')
    loadMyLikes()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadMyLikes()
})
</script>

<style lang="scss" scoped>
.my-likes-page {
  background: #f5f5f5;
  min-height: calc(100vh - 144px);
  padding: 20px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  h2 {
    margin-bottom: 20px;
  }
}

.post-item {
  margin-bottom: 16px;

  .post-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .user-info {
      margin-left: 12px;

      .nickname {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .post-content {
    .content-text {
      margin: 12px 0;
      font-size: 15px;
      line-height: 1.6;
    }

    .post-footer {
      display: flex;
      gap: 16px;
      align-items: center;
      color: #999;
      font-size: 14px;

      span {
        margin-right: auto;
      }
    }
  }
}
</style>
