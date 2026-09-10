<template>
  <div class="post-detail-page">
    <div class="container">
      <!-- 返回按钮 -->
      <div class="page-header">
        <el-button :icon="ArrowLeft" @click="router.back()">
          返回
        </el-button>
      </div>

      <div class="detail-layout">
        <!-- 左侧：帖子内容 -->
        <main class="post-main">
          <el-card v-loading="loading">
            <!-- 用户信息 -->
            <div class="post-header">
              <div class="user-info">
                <el-avatar :src="post.userAvatar" :size="48">
                  {{ post.userNickName?.[0] || '?' }}
                </el-avatar>
                <div class="user-text">
                  <h3 class="username">{{ post.userNickName }}</h3>
                  <p class="post-time">{{ formatRelativeTime(post.createTime) }}</p>
                </div>
              </div>
            </div>

            <!-- 图片轮播 -->
            <div v-if="post.images && post.images.length > 0" class="image-gallery">
              <el-carousel v-if="post.images.length > 1" :interval="5000" height="500px">
                <el-carousel-item v-for="(img, index) in post.images" :key="index">
                  <el-image
                    :src="img"
                    fit="contain"
                    :preview-src-list="post.images"
                    :initial-index="index"
                  />
                </el-carousel-item>
              </el-carousel>
              <el-image
                v-else
                :src="post.images[0]"
                fit="contain"
                :preview-src-list="post.images"
                style="width: 100%; max-height: 500px;"
              />
            </div>

            <!-- 帖子内容 -->
            <div class="post-content">
              <p class="content-text">{{ post.content }}</p>
            </div>

            <!-- 位置信息 -->
            <div v-if="post.location" class="location-info">
              <el-icon><Location /></el-icon>
              <span>{{ post.location }}</span>
              <span v-if="post.scenicName" class="scenic-tag">{{ post.scenicName }}</span>
            </div>

            <!-- 互动数据 -->
            <div class="post-stats">
              <span class="stat-item">
                <el-icon><View /></el-icon>
                {{ formatCount(post.viewCount) }} 浏览
              </span>
              <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ formatCount(post.commentCount) }} 评论
              </span>
              <span class="stat-item">
                <el-icon><Share /></el-icon>
                {{ formatCount(post.shareCount) }} 分享
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="post-actions">
              <el-button
                :type="post.isLiked ? 'danger' : 'default'"
                :icon="post.isLiked ? StarFilled : Star"
                @click="handleLike"
              >
                {{ post.isLiked ? '已赞' : '点赞' }} {{ formatCount(post.likeCount) }}
              </el-button>
              <el-button :icon="ChatDotRound" @click="focusCommentInput">
                评论
              </el-button>
              <el-button :icon="Share">
                分享
              </el-button>
            </div>
          </el-card>

          <!-- 评论区 -->
          <el-card class="comment-section">
            <template #header>
              <h3>评论 {{ post.commentCount || 0 }}</h3>
            </template>

            <!-- 发表评论 -->
            <div class="comment-input-box">
              <el-input
                ref="commentInputRef"
                v-model="commentText"
                :rows="3"
                type="textarea"
                placeholder="写下你的评论..."
                maxlength="500"
                show-word-limit
              />
              <el-button
                type="primary"
                :loading="publishingComment"
                :disabled="!commentText.trim()"
                @click="handlePublishComment"
              >
                发表评论
              </el-button>
            </div>

            <!-- 评论列表 -->
            <div v-loading="loadingComments" class="comment-list">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <el-avatar :src="comment.userAvatar" :size="40">
                  {{ comment.userNickName?.[0] || '?' }}
                </el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.userNickName }}</span>
                    <span class="comment-time">{{ formatRelativeTime(comment.createTime) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                  <div class="comment-actions">
                    <el-button
                      text
                      :type="comment.isLiked ? 'danger' : 'default'"
                      size="small"
                      @click="handleLikeComment(comment)"
                    >
                      <el-icon>
                        <component :is="comment.isLiked ? 'StarFilled' : 'Star'" />
                      </el-icon>
                      {{ comment.likeCount || '' }}
                    </el-button>
                    <el-button text size="small" @click="handleReply(comment)">
                      回复
                    </el-button>
                  </div>

                  <!-- 回复列表 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      class="reply-item"
                    >
                      <span class="reply-user">{{ reply.userNickName }}</span>
                      <span v-if="reply.replyUserNickName" class="reply-to">
                        回复 {{ reply.replyUserNickName }}
                      </span>
                      <span class="reply-text">: {{ reply.content }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <el-empty v-if="!loadingComments && comments.length === 0" description="暂无评论，快来抢沙发吧~" />
            </div>
          </el-card>
        </main>

        <!-- 右侧：推荐帖子 -->
        <aside class="post-sidebar">
          <el-card>
            <template #header>
              <h4>相关推荐</h4>
            </template>
            <div class="recommend-list">
              <div class="recommend-item" v-for="i in 5" :key="i">
                <div class="skeleton" style="width: 100%; height: 80px;"></div>
              </div>
            </div>
          </el-card>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Location,
  View,
  ChatDotRound,
  Share,
  Star,
  StarFilled,
  ArrowLeft
} from '@element-plus/icons-vue'
import {
  getPostDetail,
  likePost,
  unlikePost,
  getCommentList,
  publishComment,
  likeComment,
  unlikeComment,
  type Post,
  type Comment
} from '@/api/community'
import { formatRelativeTime, formatCount } from '@/utils/format'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loadingComments = ref(false)
const publishingComment = ref(false)
const post = ref<Post>({} as Post)
const comments = ref<Comment[]>([])
const commentText = ref('')
const commentInputRef = ref()

// 获取帖子详情
async function fetchPostDetail() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    post.value = await getPostDetail(id)
  } catch (error: any) {
    ElMessage.error(error.message || '获取帖子详情失败')
    router.back()
  } finally {
    loading.value = false
  }
}

// 获取评论列表
async function fetchComments() {
  loadingComments.value = true
  try {
    const id = Number(route.params.id)
    comments.value = await getCommentList(id)
  } catch (error: any) {
    ElMessage.error(error.message || '获取评论失败')
  } finally {
    loadingComments.value = false
  }
}

// 点赞帖子
async function handleLike() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    if (post.value.isLiked) {
      await unlikePost(post.value.id)
      post.value.isLiked = false
      post.value.likeCount--
      ElMessage.success('取消点赞')
    } else {
      await likePost(post.value.id)
      post.value.isLiked = true
      post.value.likeCount++
      ElMessage.success('点赞成功')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 发表评论
async function handlePublishComment() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  publishingComment.value = true
  try {
    await publishComment({
      postId: post.value.id,
      content: commentText.value.trim()
    })
    ElMessage.success('评论成功')
    commentText.value = ''
    post.value.commentCount++
    // 重新获取评论列表
    await fetchComments()
  } catch (error: any) {
    ElMessage.error(error.message || '评论失败')
  } finally {
    publishingComment.value = false
  }
}

// 点赞评论
async function handleLikeComment(comment: Comment) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    if (comment.isLiked) {
      await unlikeComment(comment.id)
      comment.isLiked = false
      comment.likeCount--
    } else {
      await likeComment(comment.id)
      comment.isLiked = true
      comment.likeCount++
    }
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 回复评论
function handleReply(comment: Comment) {
  commentInputRef.value?.focus()
  commentText.value = `@${comment.userNickName} `
}

// 聚焦评论输入框
function focusCommentInput() {
  commentInputRef.value?.focus()
}

onMounted(() => {
  fetchPostDetail()
  fetchComments()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.post-detail-page {
  padding: $spacing-xl 0;
  background: $bg;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: $spacing-lg;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: $spacing-xl;
}

.post-main {
  .el-card {
    margin-bottom: $spacing-lg;
  }
}

.post-header {
  margin-bottom: $spacing-lg;
}

.user-info {
  @include flex-start;
  gap: $spacing-md;
}

.user-text {
  flex: 1;

  .username {
    font-size: $font-size-lg;
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  .post-time {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.image-gallery {
  margin: $spacing-lg 0;
  border-radius: $radius-md;
  overflow: hidden;
  background: $divider;

  .el-carousel {
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
}

.post-content {
  margin: $spacing-lg 0;

  .content-text {
    font-size: $font-size;
    line-height: $line-height-relaxed;
    color: $text-primary;
    white-space: pre-wrap;
  }
}

.location-info {
  @include flex-start;
  gap: $spacing-xs;
  padding: $spacing-md;
  background: $bg;
  border-radius: $radius;
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-lg;

  .scenic-tag {
    margin-left: $spacing-sm;
    padding: 2px $spacing-sm;
    background: $primary-lighter;
    color: $primary;
    border-radius: $radius-sm;
  }
}

.post-stats {
  @include flex-start;
  gap: $spacing-xl;
  padding: $spacing-lg 0;
  border-top: 1px solid $divider;
  border-bottom: 1px solid $divider;
  margin-bottom: $spacing-lg;

  .stat-item {
    @include flex-start;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.post-actions {
  @include flex-center;
  gap: $spacing-md;

  .el-button {
    flex: 1;
  }
}

.comment-section {
  h3 {
    font-size: $font-size-lg;
    font-weight: 600;
  }
}

.comment-input-box {
  margin-bottom: $spacing-xl;

  .el-input {
    margin-bottom: $spacing-md;
  }

  .el-button {
    width: 100%;
  }
}

.comment-list {
  .comment-item {
    @include flex-start;
    gap: $spacing-md;
    padding: $spacing-lg 0;
    border-bottom: 1px solid $divider;

    &:last-child {
      border-bottom: none;
    }
  }
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  @include flex-between;
  margin-bottom: $spacing-xs;

  .comment-user {
    font-weight: 600;
    font-size: $font-size;
  }

  .comment-time {
    font-size: $font-size-xs;
    color: $text-secondary;
  }
}

.comment-text {
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.comment-actions {
  @include flex-start;
  gap: $spacing-md;
}

.reply-list {
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $bg;
  border-radius: $radius;
}

.reply-item {
  font-size: $font-size-sm;
  line-height: 1.8;
  color: $text-primary;

  .reply-user {
    font-weight: 600;
    color: $primary;
  }

  .reply-to {
    color: $text-secondary;
  }

  .reply-text {
    color: $text-primary;
  }
}

.post-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;

  h4 {
    font-size: $font-size;
    font-weight: 600;
  }
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.recommend-item {
  cursor: pointer;
  transition: transform $transition;

  &:hover {
    transform: translateX(4px);
  }
}

@include md {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .post-sidebar {
    display: none;
  }
}
</style>
