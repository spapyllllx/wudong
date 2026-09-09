<template>
  <div class="login">
    <el-card style="width: 400px; margin: 100px auto;">
      <template #header>管理后台登录</template>
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin123') {
    localStorage.setItem('token', 'mock-token')
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
