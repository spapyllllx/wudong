<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🏞️ 乌东文旅平台</h1>
          <p>欢迎登录</p>
        </div>

        <el-tabs v-model="loginType" class="login-tabs">
          <!-- 账号密码登录 -->
          <el-tab-pane label="账号密码登录" name="account">
            <el-form :model="loginForm" :rules="rules" ref="formRef">
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名（默认：admin）"
                  size="large"
                  prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码（默认：123456）"
                  size="large"
                  prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  style="width: 100%;"
                  :loading="logging"
                  @click="handleLogin"
                >
                  登录
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="large"
                  style="width: 100%;"
                  @click="handleTestLogin"
                >
                  使用默认账号登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="login-tips">
          <p>测试账号：admin / 123456</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import authApi from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginType = ref('account')
const logging = ref(false)
const formRef = ref()

const loginForm = ref({
  username: 'admin',
  password: '123456'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 账号密码登录
const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      logging.value = true

      try {
        const res: any = await authApi.login(loginForm.value)

        userStore.login(res.token, res.userInfo)
        ElMessage.success('登录成功')

        // 跳转
        const redirect = route.query.redirect as string
        router.push(redirect || '/')
      } catch (error) {
        console.error('登录失败', error)
      } finally {
        logging.value = false
      }
    }
  })
}

// 快速登录（使用默认账号）
const handleTestLogin = () => {
  loginForm.value.username = 'admin'
  loginForm.value.password = '123456'
  handleLogin()
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    margin: 0 0 8px;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.login-tabs {
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.test-login {
  padding: 20px 0;
}

.login-tips {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: #999;

  p {
    margin: 0;
  }
}
</style>
