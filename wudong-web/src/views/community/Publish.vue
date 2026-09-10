<template>
  <div class="publish-page">
    <div class="container">
      <el-card class="publish-card">
        <template #header>
          <div class="card-header">
            <h2>发布帖子</h2>
            <el-button @click="router.back()">取消</el-button>
          </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
          <!-- 图片上传 -->
          <el-form-item label="上传图片（最多9张）">
            <div class="image-upload-container">
              <el-upload
                v-model:file-list="fileList"
                :action="uploadAction"
                :headers="uploadHeaders"
                list-type="picture-card"
                :limit="9"
                :on-success="handleUploadSuccess"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                accept="image/*"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">支持 JPG、PNG、GIF 格式，单张最大 5MB</div>
            </div>
          </el-form-item>

          <!-- 帖子内容 -->
          <el-form-item label="帖子内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="8"
              placeholder="分享你的想法..."
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>

          <!-- 位置信息 -->
          <el-form-item label="位置信息（选填）">
            <el-input
              v-model="form.location"
              placeholder="添加位置"
              clearable
            >
              <template #prefix>
                <el-icon><Location /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 景点名称 -->
          <el-form-item label="景点名称（选填）">
            <el-input
              v-model="form.scenicName"
              placeholder="景点或地标名称"
              clearable
            >
              <template #prefix>
                <el-icon><LocationInformation /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 标签选择 -->
          <el-form-item label="选择标签（选填）">
            <div class="tag-selector">
              <el-check-tag
                v-for="tag in availableTags"
                :key="tag"
                :checked="selectedTags.includes(tag)"
                @change="toggleTag(tag)"
              >
                {{ tag }}
              </el-check-tag>
            </div>
          </el-form-item>

          <!-- 提交按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="publishing"
              @click="handlePublish"
              style="width: 100%"
            >
              {{ publishing ? '发布中...' : '发布' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules, type UploadUserFile } from 'element-plus'
import { Plus, Location, LocationInformation } from '@element-plus/icons-vue'
import { publishPost } from '@/api/community'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const publishing = ref(false)
const fileList = ref<UploadUserFile[]>([])
const uploadedImages = ref<string[]>([])
const selectedTags = ref<string[]>([])

const form = reactive({
  content: '',
  location: '',
  scenicName: ''
})

const rules: FormRules = {
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 5, message: '内容至少5个字', trigger: 'blur' }
  ]
}

// 上传配置
const uploadAction = computed(() => {
  return import.meta.env.VITE_API_BASE_URL + '/app/base/comm/upload'
})

const uploadHeaders = computed(() => {
  return {
    Authorization: `Bearer ${getToken()}`
  }
})

// 可选标签
const availableTags = [
  '旅行', '美食', '摄影', '生活',
  '风景', '人文', '攻略', '推荐'
]

// 切换标签
function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    if (selectedTags.value.length < 3) {
      selectedTags.value.push(tag)
    } else {
      ElMessage.warning('最多选择3个标签')
    }
  }
}

// 上传成功
function handleUploadSuccess(response: any, file: UploadUserFile) {
  console.log('上传成功:', response)
  if (response.code === 1000 && response.data) {
    uploadedImages.value.push(response.data)
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
    // 移除失败的文件
    const index = fileList.value.findIndex(f => f.uid === file.uid)
    if (index > -1) {
      fileList.value.splice(index, 1)
    }
  }
}

// 移除图片
function handleRemove(file: UploadUserFile) {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1 && uploadedImages.value[index]) {
    uploadedImages.value.splice(index, 1)
  }
}

// 超出限制
function handleExceed() {
  ElMessage.warning('最多只能上传9张图片')
}

// 发布帖子
async function handlePublish() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (uploadedImages.value.length === 0) {
      ElMessage.warning('请至少上传一张图片')
      return
    }

    publishing.value = true
    try {
      await publishPost({
        content: form.content,
        images: uploadedImages.value,
        location: form.location || undefined,
        scenicName: form.scenicName || undefined
      })

      ElMessage.success('发布成功')

      // 跳转到社区首页
      router.push('/community')
    } catch (error: any) {
      console.error('发布失败:', error)
      ElMessage.error(error.message || '发布失败')
    } finally {
      publishing.value = false
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.publish-page {
  padding: $spacing-xl 0;
  background: $bg;
  min-height: calc(100vh - 64px);
}

.publish-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  @include flex-between;

  h2 {
    font-size: $font-size-xl;
    font-weight: 600;
  }
}

.image-upload-container {
  :deep(.el-upload-list) {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  :deep(.el-upload--picture-card) {
    width: 148px;
    height: 148px;
    border-radius: $radius;
  }

  :deep(.el-upload-list__item) {
    width: 148px;
    height: 148px;
    border-radius: $radius;
  }

  .upload-tip {
    margin-top: $spacing-sm;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .el-check-tag {
    cursor: pointer;
  }
}

@include md {
  .publish-card {
    margin: 0 $spacing-md;
  }
}
</style>
