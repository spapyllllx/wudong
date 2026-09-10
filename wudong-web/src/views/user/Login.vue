<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <h1 class="brand">乌东文旅</h1>
        <p class="slogan">发现美好，从这里开始</p>
      </div>

      <div class="login-right">
        <el-card class="login-card">
          <h2 class="login-title">{{ isRegister ? '注册账号' : '欢迎登录' }}</h2>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            @submit.prevent="handleSubmit"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入用户名"
                size="large"
                @keyup.enter="handleSubmit"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item v-if="isRegister" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号（选填）"
                size="large"
                maxlength="11"
              >
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
                @keyup.enter="handleSubmit"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item v-if="isRegister" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                show-password
                @keyup.enter="handleSubmit"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                style="width: 100%"
                native-type="submit"
              >
                {{ isRegister ? '注册' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="login-footer">
            <el-button type="primary" link @click="toggleMode">
              {{ isRegister ? '已有账号？去登录' : '还没账号？去注册' }}
            </el-button>
          </div>

          <el-alert
            v-if="!isRegister"
            class="demo-tip"
            type="info"
            :closable="false"
            show-icon
            title="演示账号：test / 123456"
          />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Phone } from '@element-plus/icons-vue'
import { loginByPassword, register, type LoginResponse } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const isRegister = ref(false)

const form = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = computed<FormRules>(() => {
  const base: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码至少 6 位', trigger: 'blur' }
    ]
  }

  if (!isRegister.value) return base

  return {
    ...base,
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
  }
})

function toggleMode() {
  isRegister.value = !isRegister.value
  formRef.value?.resetFields()
  form.phone = ''
  form.confirmPassword = ''
}

/**
 * 登录/注册成功后的统一收尾
 *
 * 后端这两个接口都会返回 { token, refreshToken, expire, refreshExpire, user }，
 * 但仍主动拉一次用户信息，保证 userInfo 与后端最新状态一致。
 */
async function afterAuth(result: LoginResponse) {
  if (!result || !result.token) {
    ElMessage.error('响应数据格式错误：缺少 token')
    return
  }

  userStore.login(result)

  try {
    await userStore.fetchUser()
  } catch (error) {
    console.error('登录后获取用户信息失败：', error)
  }

  const redirect = route.query.redirect as string
  router.replace(redirect || '/')
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      if (isRegister.value) {
        const result = await register(
          form.username,
          form.password,
          form.phone || undefined
        )
        ElMessage.success('注册成功')
        await afterAuth(result)
      } else {
        const result = await loginByPassword(form.username, form.password)
        ElMessage.success('登录成功')
        await afterAuth(result)
      }
    } catch (error: any) {
      // 错误提示已由 request 拦截器统一弹出
      console.error('登录/注册失败：', error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.login-page {
  min-height: calc(100vh - 64px);
  @include flex-center;
  background: linear-gradient(135deg,
    $primary 0%,
    $primary-light 50%,
    $accent-green 100%
  );
  position: relative;

  // 民族风格装饰图案
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        rgba(255, 255, 255, 0.03) 35px,
        rgba(255, 255, 255, 0.03) 70px
      );
    pointer-events: none;
  }
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  gap: $spacing-2xl;
  padding: $spacing-xl;
  position: relative;
  z-index: 1;
}

.login-left {
  @include flex-center;
  flex-direction: column;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  .brand {
    font-size: 56px;
    font-weight: 800;
    margin-bottom: $spacing-md;
    letter-spacing: 2px;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(244, 162, 97, 1) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .slogan {
    font-size: $font-size-xl;
    opacity: 0.95;
    font-weight: 500;
  }
}

.login-right {
  @include flex-center;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: $spacing-2xl;
  border-radius: $radius-xl;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(255, 255, 255, 0.3);

  // 顶部民族风格装饰条
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg,
      $accent-red 0%,
      $accent-orange 25%,
      $accent-yellow 50%,
      $accent-green 75%,
      $primary 100%
    );
    border-radius: $radius-xl $radius-xl 0 0;
  }
}

.login-title {
  text-align: center;
  font-size: $font-size-2xl;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.login-footer {
  text-align: center;
  margin-top: $spacing-xs;
}

.demo-tip {
  margin-top: $spacing-sm;
}
</style>
