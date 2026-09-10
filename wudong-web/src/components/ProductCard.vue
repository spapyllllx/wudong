<template>
  <article class="product-card" @click="goDetail">
    <div class="thumb">
      <img
        :src="resolvedImage"
        :alt="product.title"
        loading="lazy"
        :class="{ loaded: imgLoaded }"
        @load="imgLoaded = true"
        @error="onImgError"
      />

      <!-- 门类标签：像展签上的分类小字 -->
      <span v-if="categoryName" class="tag">{{ categoryName }}</span>

      <!-- 悬停时压暗并浮出操作提示 -->
      <div class="veil"></div>
      <span class="cta">查看详情</span>

      <span v-if="soldOut" class="sold-out">已售罄</span>
    </div>

    <div class="info">
      <h3 class="title">{{ product.title }}</h3>
      <p v-if="product.subtitle" class="subtitle">{{ product.subtitle }}</p>

      <div class="rule"></div>

      <div class="meta">
        <span class="price"><i>¥</i>{{ priceMain }}<em v-if="priceDecimals">.{{ priceDecimals }}</em></span>
        <span v-if="showMarket" class="market">¥{{ product.market_price }}</span>

        <span class="tail">
          <template v-if="product.rating">
            <span class="rating">{{ Number(product.rating).toFixed(1) }}</span>
          </template>
          <template v-else>已售 {{ formatCount(product.sales || 0) }}</template>
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/api/product'
import { formatCount } from '@/utils/format'
import { resolveImage } from '@/utils/image'

const props = withDefaults(
  defineProps<{
    product: Product
    /** 分类名（由父级传入，接口不返回） */
    categoryName?: string
    showMarket?: boolean
  }>(),
  { showMarket: true, categoryName: '' }
)

const router = useRouter()
const imgLoaded = ref(false)

const resolvedImage = computed(() => resolveImage(props.product.main_image))
const soldOut = computed(() => (props.product.stock ?? 0) <= 0)

/** 整数部分与小数部分拆开，便于让 ¥ 变小、尾数变淡 */
const priceMain = computed(() => Math.floor(props.product.price))
const priceDecimals = computed(() => {
  const cents = Math.round((props.product.price - Math.floor(props.product.price)) * 100)
  return cents ? String(cents).padStart(2, '0') : ''
})

function goDetail() {
  router.push(`/product/${props.product.id}`)
}

function onImgError(e: Event) {
  ;(e.target as HTMLImageElement).style.visibility = 'hidden'
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.product-card {
  cursor: pointer;
  background: $bg-white;
  border: 1px solid $border;
  border-radius: 2px;
  overflow: hidden;
  transition: border-color $transition, box-shadow $transition, transform $transition;

  &:hover {
    border-color: rgba(61, 90, 128, 0.4);
    box-shadow: 0 12px 32px -8px rgba(61, 90, 128, 0.22);
    transform: translateY(-4px);

    img {
      transform: scale(1.05);
    }

    .veil {
      opacity: 1;
    }

    .cta {
      opacity: 1;
      transform: translate(-50%, -50%);
    }

    .title {
      color: $primary;
    }

    .rule {
      width: 28px;
      background: $primary;
    }
  }
}

// ---------------------------------------------------------------- 图

.thumb {
  position: relative;
  width: 100%;
  // 4:5 竖构图，比 1:1 更有 editorial 的展陈感
  aspect-ratio: 4 / 5;
  background: $bg;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 600ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1);

    &.loaded {
      opacity: 1;
    }
  }
}

.tag {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  z-index: 2;
  padding: 3px 9px;
  font-size: 11px;
  letter-spacing: $tracking-wider;
  color: $primary-dark;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(6px);
  border-radius: 2px;
}

.veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  background: linear-gradient(180deg, rgba(41, 50, 65, 0) 40%, rgba(41, 50, 65, 0.42) 100%);
  transition: opacity $transition-slow;
}

.cta {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -42%);
  opacity: 0;
  padding: 7px 18px;
  font-size: $font-size-xs;
  letter-spacing: $tracking-wider;
  color: $primary-dark;
  background: rgba(255, 255, 255, 0.94);
  border-radius: 2px;
  white-space: nowrap;
  transition: opacity $transition, transform $transition;
}

.sold-out {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  letter-spacing: $tracking-wider;
  color: $bg-white;
  background: rgba(41, 50, 65, 0.52);
}

// ---------------------------------------------------------------- 文字

.info {
  padding: $spacing-md $spacing-md $spacing-lg;
}

.title {
  font-family: $font-display;
  font-size: $font-size-lg;
  font-weight: 500;
  line-height: 1.45;
  color: $text-primary;
  letter-spacing: $tracking-tight;
  transition: color $transition;
  @include ellipsis(1);
}

.subtitle {
  margin-top: 3px;
  font-size: $font-size-xs;
  color: $text-disabled;
  letter-spacing: $tracking-wide;
  @include ellipsis(1);
}

// 悬停时会拉长的短横线，给卡片一个呼吸点
.rule {
  width: 16px;
  height: 1px;
  margin: $spacing 0;
  background: $divider;
  transition: width $transition, background $transition;
}

.meta {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price {
  font-size: 22px;
  font-weight: 600;
  color: $primary-dark;
  letter-spacing: $tracking-tight;
  font-variant-numeric: tabular-nums;

  i {
    font-style: normal;
    font-size: 13px;
    font-weight: 500;
    margin-right: 1px;
  }

  em {
    font-style: normal;
    font-size: 14px;
  }
}

.market {
  font-size: $font-size-xs;
  color: $text-placeholder;
  text-decoration: line-through;
}

.tail {
  margin-left: auto;
  font-size: $font-size-xs;
  color: $text-disabled;
  letter-spacing: $tracking-wide;

  .rating {
    color: $accent-yellow;
    font-weight: 600;
  }
}
</style>
