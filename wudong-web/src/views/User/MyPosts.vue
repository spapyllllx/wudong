<template>
  <div class="my-posts-page">
    <div class="container">
      <h2>我的帖子</h2>
      <div v-if="postList.length === 0">
        <el-empty description="还没有发布帖子" />
      </div>
      <el-card v-for="post in postList" :key="post.id" class="post-item">
        <div class="post-content">
          <el-tag :type="post.status === 1 ? 'success' : 'warning'">
            {{ post.status === 0 ? '待审核' : post.status === 1 ? '已发布' : '已下架' }}
          </el-tag>
          <div class="content-text">{{ post.content }}</div>
          <div class="post-footer">
            <span>❤️ {{ post.likeCount }}</span>
            <span>💬 {{ post.commentCount }}</span>
            <el-button type="danger" size="small" @click="handleDelete(post)">删除</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import communityApi from '@/api/community'

const postList = ref<any[]>([])

const loadMyPosts = async () => {
  try {
    const res: any = await communityApi.getMyPostList({ page: 1, size: 20 })
    postList.value = res.list
  } catch (error) {
    console.error('加载失败', error)
  }
}

const handleDelete = (post: any) => {
  ElMessageBox.confirm('确定要删除这条帖子吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await communityApi.deleteMyPost(post.id)
      ElMessage.success('删除成功')
      loadMyPosts()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  loadMyPosts()
})
</script>

<style lang="scss" scoped>
.my-posts-page {
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
