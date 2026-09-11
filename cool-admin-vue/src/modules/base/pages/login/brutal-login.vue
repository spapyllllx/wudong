<template>
  <div class="brutal-login">
    <!-- 动态背景 -->
    <div class="brutal-login__bg">
      <div class="grid-pattern"></div>
      <div class="glow-orb glow-orb--1"></div>
      <div class="glow-orb glow-orb--2"></div>
      <div class="glow-orb glow-orb--3"></div>
      <div class="particles">
        <div class="particle" v-for="i in 20" :key="i" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="brutal-login__container">
      <div class="login-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <!-- Logo区域 -->
        <div class="login-card__header">
          <div class="logo-badge">
            <div class="logo-badge__icon">
              <img src="/logo.png" alt="Logo" />
              <div class="logo-badge__glitch"></div>
            </div>
          </div>
          <h1 class="brand-title">
            <span class="brand-title__text" data-text="WUDONG">WUDONG</span>
            <span class="brand-title__sub">ADMIN SYSTEM</span>
          </h1>
          <p class="tagline">
            <span class="tagline__icon">⚡</span>
            贵州文旅管理平台
            <span class="tagline__icon">⚡</span>
          </p>
        </div>

        <!-- 表单区域 -->
        <div class="login-card__body">
          <el-form :model="form" class="brutal-form" :disabled="loading">
            <!-- 用户名 -->
            <div class="form-group">
              <label class="form-label">
                <span class="form-label__icon">👤</span>
                <span class="form-label__text">USERNAME</span>
              </label>
              <div class="form-input-wrapper">
                <input
                  v-model="form.username"
                  type="text"
                  class="form-input"
                  placeholder="输入你的用户名"
                  @focus="activeField = 'username'"
                  @blur="activeField = ''"
                  :class="{ 'is-active': activeField === 'username' }"
                />
                <div class="form-input__border"></div>
              </div>
            </div>

            <!-- 密码 -->
            <div class="form-group">
              <label class="form-label">
                <span class="form-label__icon">🔐</span>
                <span class="form-label__text">PASSWORD</span>
              </label>
              <div class="form-input-wrapper">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="输入你的密码"
                  @focus="activeField = 'password'"
                  @blur="activeField = ''"
                  @keyup.enter="handleLogin"
                  :class="{ 'is-active': activeField === 'password' }"
                />
                <button
                  type="button"
                  class="form-input__toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '🔒' }}
                </button>
                <div class="form-input__border"></div>
              </div>
            </div>

            <!-- 验证码 -->
            <div class="form-group">
              <label class="form-label">
                <span class="form-label__icon">🎯</span>
                <span class="form-label__text">CAPTCHA</span>
              </label>
              <div class="form-input-wrapper form-input-wrapper--captcha">
                <input
                  v-model="form.captcha"
                  type="text"
                  class="form-input"
                  placeholder="输入验证码"
                  maxlength="4"
                  @focus="activeField = 'captcha'"
                  @blur="activeField = ''"
                  @keyup.enter="handleLogin"
                  :class="{ 'is-active': activeField === 'captcha' }"
                />
                <div class="captcha-display" @click="refreshCaptcha">
                  <span class="captcha-text">{{ captchaText }}</span>
                  <span class="captcha-refresh">🔄</span>
                </div>
                <div class="form-input__border"></div>
              </div>
            </div>

            <!-- 登录按钮 -->
            <button
              type="button"
              class="brutal-button brutal-button--primary"
              :class="{ 'is-loading': loading }"
              @click="handleLogin"
              :disabled="loading"
            >
              <span class="brutal-button__bg"></span>
              <span class="brutal-button__content">
                <span v-if="!loading">ENTER THE SYSTEM</span>
                <span v-else class="loading-dots">
                  <span></span><span></span><span></span>
                </span>
              </span>
              <span class="brutal-button__border brutal-button__border--top"></span>
              <span class="brutal-button__border brutal-button__border--right"></span>
              <span class="brutal-button__border brutal-button__border--bottom"></span>
              <span class="brutal-button__border brutal-button__border--left"></span>
            </button>

            <!-- 额外信息 -->
            <div class="login-extras">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">记住我</span>
              </label>
              <a href="#" class="link-text">忘记密码?</a>
            </div>
          </el-form>
        </div>

        <!-- 装饰元素 -->
        <div class="card-decoration card-decoration--1"></div>
        <div class="card-decoration card-decoration--2"></div>
        <div class="card-decoration card-decoration--3"></div>
      </div>

      <!-- 状态指示器 -->
      <div class="status-bar">
        <div class="status-item">
          <div class="status-dot" :class="{ 'is-active': isOnline }"></div>
          <span class="status-text">SYSTEM ONLINE</span>
        </div>
        <div class="status-item">
          <span class="status-text">{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="brutal-login__footer">
      <p class="copyright-text">
        <span class="copyright-icon">©</span>
        2026 WUDONG CULTURAL TOURISM
        <span class="copyright-badge">v2.0</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

// 状态
const form = ref({
  username: '',
  password: '',
  captcha: ''
})
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const activeField = ref('')
const isHovered = ref(false)
const isOnline = ref(true)
const currentTime = ref('')
const captchaText = ref('')

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = result
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha()
}

// 登录处理
const handleLogin = () => {
  if (!form.value.username || !form.value.password || !form.value.captcha) {
    ElMessage.warning('请填写完整信息')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('登录成功！')
    // TODO: 实际登录逻辑
  }, 2000)
}

// 粒子样式
const getParticleStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 10}s`
  }
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false })
}

let timeInterval
onMounted(() => {
  generateCaptcha()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style lang="scss" scoped>
.brutal-login {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A0E27;
  overflow: hidden;

  // ============================================
  // 背景效果
  // ============================================
  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(108, 92, 231, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(108, 92, 231, 0.05) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: grid-move 20s linear infinite;
    }

    @keyframes grid-move {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 15s ease-in-out infinite;

      &--1 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, #6C5CE7 0%, transparent 70%);
        top: -200px;
        left: -200px;
      }

      &--2 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, #00D4FF 0%, transparent 70%);
        bottom: -150px;
        right: -150px;
        animation-delay: -5s;
      }

      &--3 {
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, #FD79A8 0%, transparent 70%);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -10s;
      }
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-30px, 30px) scale(0.9); }
    }

    .particles {
      position: absolute;
      inset: 0;

      .particle {
        position: absolute;
        width: 3px;
        height: 3px;
        background: white;
        border-radius: 50%;
        opacity: 0.6;
        animation: particle-float linear infinite;
      }

      @keyframes particle-float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
      }
    }
  }

  // ============================================
  // 主容器
  // ============================================
  &__container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px;
    padding: 0 20px;
  }

  // ============================================
  // 登录卡片
  // ============================================
  .login-card {
    position: relative;
    background: rgba(26, 31, 58, 0.95);
    border: 3px solid #000;
    border-radius: 20px;
    padding: 50px 40px;
    box-shadow:
      12px 12px 0 rgba(0, 0, 0, 0.9),
      0 0 60px rgba(108, 92, 231, 0.3);
    backdrop-filter: blur(20px);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    &:hover {
      transform: translate(-6px, -6px);
      box-shadow:
        18px 18px 0 rgba(0, 0, 0, 0.9),
        0 0 80px rgba(108, 92, 231, 0.5);
    }

    // 装饰元素
    .card-decoration {
      position: absolute;
      border: 2px solid rgba(108, 92, 231, 0.3);
      pointer-events: none;

      &--1 {
        width: 80px;
        height: 80px;
        top: -20px;
        right: -20px;
        border-radius: 50%;
        animation: rotate 10s linear infinite;
      }

      &--2 {
        width: 60px;
        height: 60px;
        bottom: 30px;
        left: -15px;
        border-radius: 8px;
        animation: rotate 8s linear infinite reverse;
      }

      &--3 {
        width: 40px;
        height: 40px;
        top: 50%;
        right: -10px;
        border-radius: 50%;
        animation: rotate 6s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    }

    // Logo区域
    &__header {
      text-align: center;
      margin-bottom: 40px;

      .logo-badge {
        display: inline-block;
        margin-bottom: 20px;
        position: relative;

        &__icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%);
          border: 3px solid #000;
          border-radius: 16px;
          padding: 12px;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.9);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;

          &:hover {
            animation: shake 0.5s ease;
          }

          @keyframes shake {
            0%, 100% { transform: rotate(0); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
            position: relative;
            z-index: 2;
          }

          // 故障效果
          .logo-badge__glitch {
            position: absolute;
            inset: 0;
            background: inherit;
            opacity: 0;
            animation: glitch 5s infinite;
          }

          @keyframes glitch {
            0%, 90%, 100% { opacity: 0; }
            91%, 93% { opacity: 0.7; transform: translate(2px, 2px); }
            92%, 94% { opacity: 0.7; transform: translate(-2px, -2px); }
          }
        }
      }

      .brand-title {
        margin: 0 0 12px 0;
        position: relative;

        &__text {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.1em;
          position: relative;
          display: inline-block;

          &::before {
            content: attr(data-text);
            position: absolute;
            left: 2px;
            top: 2px;
            z-index: -1;
            color: #000;
            -webkit-text-fill-color: #000;
          }
        }

        &__sub {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #9CA3B8;
          margin-top: 8px;
        }
      }

      .tagline {
        font-size: 14px;
        font-weight: 600;
        color: #6B738E;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        &__icon {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      }
    }

    // 表单主体
    &__body {
      .brutal-form {
        .form-group {
          margin-bottom: 24px;

          .form-label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.15em;
            color: #F8F9FA;

            &__icon {
              font-size: 16px;
            }
          }

          .form-input-wrapper {
            position: relative;

            .form-input {
              width: 100%;
              background: rgba(37, 43, 72, 0.8);
              border: 2px solid #313856;
              border-radius: 8px;
              padding: 14px 16px;
              font-size: 15px;
              font-weight: 500;
              color: #F8F9FA;
              transition: all 0.3s ease;
              outline: none;

              &::placeholder {
                color: #6B738E;
              }

              &:focus, &.is-active {
                border-color: #6C5CE7;
                background: rgba(37, 43, 72, 1);
                transform: translateY(-2px);
              }
            }

            // 底部动态边框
            .form-input__border {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 3px;
              background: linear-gradient(90deg, #6C5CE7, #00D4FF);
              transition: width 0.3s ease;
              border-radius: 0 0 8px 8px;
            }

            .form-input:focus ~ .form-input__border,
            .form-input.is-active ~ .form-input__border {
              width: 100%;
            }

            // 密码切换按钮
            .form-input__toggle {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              font-size: 18px;
              cursor: pointer;
              padding: 4px;
              opacity: 0.6;
              transition: opacity 0.3s ease;

              &:hover {
                opacity: 1;
              }
            }

            // 验证码样式
            &--captcha {
              display: flex;
              gap: 12px;

              .form-input {
                flex: 1;
              }

              .captcha-display {
                width: 120px;
                height: 48px;
                background: linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%);
                border: 2px solid #000;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: 900;
                color: #fff;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.9);
                transition: all 0.3s ease;

                &:hover {
                  transform: translate(-2px, -2px);
                  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.9);
                }

                .captcha-text {
                  letter-spacing: 0.2em;
                  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                }

                .captcha-refresh {
                  position: absolute;
                  top: 4px;
                  right: 4px;
                  font-size: 14px;
                  opacity: 0.7;
                }
              }
            }
          }
        }

        // 主按钮
        .brutal-button {
          width: 100%;
          background: linear-gradient(135deg, #6C5CE7 0%, #00D4FF 100%);
          border: 3px solid #000;
          border-radius: 8px;
          padding: 16px 32px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.15em;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.9);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          margin-top: 32px;

          &:hover:not(:disabled) {
            transform: translate(-3px, -3px);
            box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.9);
          }

          &:active:not(:disabled) {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.9);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          &__content {
            position: relative;
            z-index: 2;
            display: block;
          }

          // 动态背景
          &__bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
          }

          &:hover:not(:disabled) .brutal-button__bg {
            transform: translateX(100%);
          }

          // 加载动画
          .loading-dots {
            display: inline-flex;
            gap: 6px;

            span {
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
              animation: bounce 1.4s infinite ease-in-out both;

              &:nth-child(1) { animation-delay: -0.32s; }
              &:nth-child(2) { animation-delay: -0.16s; }
            }

            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1); }
            }
          }

          // 边框动画
          &__border {
            position: absolute;
            background: #00D4FF;

            &--top {
              top: 0;
              left: 0;
              width: 100%;
              height: 2px;
              transform: scaleX(0);
              transform-origin: left;
            }

            &--right {
              top: 0;
              right: 0;
              width: 2px;
              height: 100%;
              transform: scaleY(0);
              transform-origin: top;
            }

            &--bottom {
              bottom: 0;
              right: 0;
              width: 100%;
              height: 2px;
              transform: scaleX(0);
              transform-origin: right;
            }

            &--left {
              bottom: 0;
              left: 0;
              width: 2px;
              height: 100%;
              transform: scaleY(0);
              transform-origin: bottom;
            }
          }

          &:hover:not(:disabled) {
            .brutal-button__border--top { animation: border-anim 1.5s ease infinite; }
            .brutal-button__border--right { animation: border-anim 1.5s 0.375s ease infinite; }
            .brutal-button__border--bottom { animation: border-anim 1.5s 0.75s ease infinite; }
            .brutal-button__border--left { animation: border-anim 1.5s 1.125s ease infinite; }
          }

          @keyframes border-anim {
            0%, 100% { transform: scale(0); }
            50% { transform: scale(1); }
          }
        }

        // 额外选项
        .login-extras {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          font-size: 13px;

          .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;

            input[type="checkbox"] {
              display: none;
            }

            .checkbox-custom {
              width: 20px;
              height: 20px;
              border: 2px solid #6C5CE7;
              border-radius: 4px;
              position: relative;
              transition: all 0.3s ease;

              &::after {
                content: '✓';
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 900;
                font-size: 14px;
                opacity: 0;
                transform: scale(0);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
              }
            }

            input[type="checkbox"]:checked ~ .checkbox-custom {
              background: linear-gradient(135deg, #6C5CE7, #00D4FF);
              border-color: #000;

              &::after {
                opacity: 1;
                transform: scale(1);
              }
            }

            .checkbox-label {
              color: #9CA3B8;
              font-weight: 500;
            }
          }

          .link-text {
            color: #6C5CE7;
            text-decoration: none;
            font-weight: 600;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background: linear-gradient(90deg, #6C5CE7, #00D4FF);
              transition: width 0.3s ease;
            }

            &:hover::after {
              width: 100%;
            }
          }
        }
      }
    }
  }

  // ============================================
  // 状态栏
  // ============================================
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    padding: 12px 16px;
    background: rgba(26, 31, 58, 0.6);
    border: 2px solid rgba(108, 92, 231, 0.3);
    border-radius: 8px;
    backdrop-filter: blur(10px);

    .status-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .status-dot {
        width: 8px;
        height: 8px;
        background: #6B738E;
        border-radius: 50%;
        transition: all 0.3s ease;

        &.is-active {
          background: #55EFC4;
          box-shadow: 0 0 12px #55EFC4;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      }

      .status-text {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #9CA3B8;
      }
    }
  }

  // ============================================
  // 底部版权
  // ============================================
  &__footer {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;

    .copyright-text {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #6B738E;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(26, 31, 58, 0.6);
      border: 1px solid rgba(108, 92, 231, 0.2);
      border-radius: 20px;
      backdrop-filter: blur(10px);

      .copyright-icon {
        font-size: 14px;
      }

      .copyright-badge {
        background: linear-gradient(135deg, #6C5CE7, #00D4FF);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 900;
        color: white;
      }
    }
  }

  // ============================================
  // 响应式
  // ============================================
  @media (max-width: 640px) {
    .login-card {
      padding: 40px 24px;

      &__header {
        .brand-title__text {
          font-size: 36px;
        }
      }
    }
  }
}
</style>
