<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4 class="section-title">关于我们</h4>
          <p class="section-desc">乌东文旅致力于推广当地文化与旅游，提供衣食住行一站式服务。</p>
        </div>

        <div class="footer-section">
          <h4 class="section-title">快速链接</h4>
          <ul class="link-list">
            <li><router-link to="/product">非遗商品</router-link></li>
            <li><router-link to="/restaurant">特色餐饮</router-link></li>
            <li><router-link to="/homestay">民宿</router-link></li>
            <li><router-link to="/ticket">景区票务</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="section-title">帮助中心</h4>
          <ul class="link-list">
            <li><a href="#">常见问题</a></li>
            <li><a href="#">购物指南</a></li>
            <li><a href="#">退换货政策</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="section-title">联系方式</h4>
          <ul class="contact-list">
            <li>客服电话：400-xxx-xxxx</li>
            <li>工作时间：9:00-18:00</li>
            <li>邮箱：service@wudong.com</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">© 2024 乌东文旅平台 版权所有</p>
        <div class="footer-links">
          <a href="#">隐私政策</a>
          <span class="divider">|</span>
          <a href="#">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.footer {
  background: $text-primary;
  color: rgba(255, 255, 255, 0.8);
  padding: $spacing-2xl 0 $spacing-lg;
  margin-top: $spacing-2xl;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xl;
  padding-bottom: $spacing-xl;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section {
  .section-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: #fff;
    margin-bottom: $spacing-md;
  }

  .section-desc {
    font-size: $font-size-sm;
    line-height: $line-height-relaxed;
  }
}

.link-list,
.contact-list {
  li {
    margin-bottom: $spacing-sm;
    font-size: $font-size-sm;

    a {
      transition: color $transition;

      &:hover {
        color: #fff;
      }
    }
  }
}

.footer-bottom {
  @include flex-between;
  padding-top: $spacing-lg;
  font-size: $font-size-sm;
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
}

.footer-links {
  display: flex;
  gap: $spacing-sm;

  a {
    transition: color $transition;

    &:hover {
      color: #fff;
    }
  }

  .divider {
    color: rgba(255, 255, 255, 0.3);
  }
}

@include lg {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include md {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: $spacing-sm;
    text-align: center;
  }
}
</style>
