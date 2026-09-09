<template>
	<div v-if="detail" class="page">
		<!-- 顶部条 -->
		<div class="topbar">
			<span class="back" @click="router.push('/')">← 返回商城</span>
			<span class="crumb">{{ detail.category_name }} / {{ detail.title }}</span>
			<span class="go-order" v-if="token" @click="router.push('/')">我的订单(首页)</span>
		</div>

		<div class="main">
			<div class="detail-top">
				<!-- 图集 -->
				<div class="gallery">
					<el-image class="main-img" :src="activeImg" fit="cover" :preview-src-list="detail.images?.length ? detail.images : [detail.main_image]" preview-teleported />
					<div class="thumbs">
						<img v-for="(img, i) in detail.images?.length ? detail.images : [detail.main_image]" :key="i" :src="img" :class="{ on: activeImg === img }" @click="activeImg = img" />
					</div>
				</div>

				<!-- 信息 -->
				<div class="info">
					<div class="cat">{{ detail.category_name }} · 非遗匠心</div>
					<h1 class="title">{{ detail.title }}</h1>
					<div class="sub">{{ detail.subtitle }}</div>
					<div class="price-row">
						<span class="price">¥{{ detail.price }}</span>
						<span class="market" v-if="detail.market_price">¥{{ detail.market_price }}</span>
						<span class="sales">⭐ {{ detail.rating }} 分 · {{ detail.review_count }} 条评价 · 已售 {{ detail.sales }}</span>
					</div>
					<div class="craft" v-if="detail.craft_intro">🪡 工艺介绍:{{ detail.craft_intro }}</div>

					<!-- 规格 -->
					<div v-if="detail.skus?.length" class="sku-box">
						<div class="label">选择规格</div>
						<div class="skus">
							<div v-for="s in detail.skus" :key="s.id" class="sku" :class="{ on: buy.skuId === s.id }" @click="buy.skuId = s.id">
								{{ s.sku_name }}
								<div class="sku-meta">¥{{ s.price }} · 库存{{ s.stock }}</div>
							</div>
						</div>
					</div>

					<div class="qty-row">
						<span class="label">数量</span>
						<el-input-number v-model="buy.quantity" :min="1" />
					</div>

					<!-- 收货 -->
					<div class="addr">
						<div class="label">收货信息</div>
						<div class="addr-line">
							<el-input v-model="buy.consignee" placeholder="收货人" style="width: 120px" />
							<el-input v-model="buy.phone" placeholder="手机号" style="width: 170px; margin: 0 10px" />
						</div>
						<el-input v-model="buy.detail" placeholder="详细地址(省市区+街道门牌)" style="margin-top: 8px" />
					</div>

					<div class="op-row">
						<el-button size="large" type="danger" style="width: 200px" :disabled="!token" @click="doBuy">立即购买</el-button>
						<el-button size="large" :type="favorited ? 'warning' : 'default'" @click="doFav" :disabled="!token">
							{{ favorited ? '♥ 已收藏' : '♡ 收藏' }}
						</el-button>
					</div>
					<div v-if="!token" class="login-tip">演示环境已自动登录,可直接购买(账号 138****0000)</div>
				</div>
			</div>

			<!-- 详情 -->
			<div class="block">
				<div class="block-title">商品详情</div>
				<div class="detail-html" v-html="detail.detail || '暂无详情'" />
			</div>

			<!-- 评价 -->
			<div class="block">
				<div class="block-title">用户评价({{ reviews.length }})</div>
				<div v-if="reviews.length" class="reviews">
					<div v-for="r in reviews" :key="r.id" class="review">
						<div class="rv-head">
							<el-avatar :size="28">{{ (r.user?.nickname || '客')[0] }}</el-avatar>
							<span class="rv-user">{{ r.user?.nickname || '游客' }}</span>
							<span class="rv-stars">⭐{{ r.rating }}</span>
							<span class="rv-time">{{ r.created_at }}</span>
						</div>
						<div class="rv-content">{{ r.content }}</div>
						<div class="rv-imgs" v-if="r.images?.length">
							<el-image v-for="(img, i) in r.images" :key="i" :src="img" style="width: 64px; height: 64px; margin-right: 8px; border-radius: 6px" fit="cover" :preview-src-list="r.images" preview-teleported />
						</div>
						<div class="rv-reply" v-if="r.reply_content">商家回复:{{ r.reply_content }}</div>
					</div>
				</div>
				<el-empty v-else description="暂无评价,购买后来分享一下吧" :image-size="80" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { api } from '../api';
import { ElMessage } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const detail = ref(null);
const reviews = ref([]);
const activeImg = ref('');
const token = ref(localStorage.getItem('app_token'));
const favorited = ref(false);
const buy = reactive({ skuId: null, quantity: 1, consignee: '', phone: '', detail: '' });

const currentUser = computed(() => (token.value ? '演示用户' : ''));

onMounted(async () => {
	detail.value = await api.productDetail(id);
	activeImg.value = detail.value.main_image;
	if (detail.value.skus?.length) buy.skuId = detail.value.skus[0].id;
	const rs = await api.productReviews({ product_id: id, size: 20 });
	reviews.value = rs.list || [];
	if (token.value) {
		// 收藏态查询走我的收藏列表对比
		try {
			const fav = await api.myFavorites({ page: 1, size: 200 });
			favorited.value = fav.list.some((p) => Number(p.id) === id);
		} catch (e) {}
	}
});

async function doBuy() {
	if (!buy.skuId) return ElMessage.warning('请先选择规格');
	if (!buy.consignee || !buy.phone || !buy.detail) return ElMessage.warning('请填写收货人/手机号/详细地址');
	try {
		const orderId = await api.orderCreate({
			skuId: buy.skuId,
			quantity: buy.quantity,
			consignee: buy.consignee,
			phone: buy.phone,
			province: '',
			city: '',
			district: '',
			detail: buy.detail
		});
		ElMessage.success(`下单成功!订单号 ${orderId},可在「我的订单」模拟支付`);
	} catch (e) {
		ElMessage.error(e.message);
	}
}

async function doFav() {
	try {
		const fav = await api.favorite(id);
		favorited.value = fav;
		ElMessage.success(fav ? '收藏成功' : '已取消收藏');
	} catch (e) {
		ElMessage.error(e.message);
	}
}
</script>

<style scoped>
.topbar {
	background: #8e2f2f;
	color: #fff;
	padding: 12px 40px;
	display: flex;
	gap: 24px;
	align-items: center;
}
.back {
	cursor: pointer;
}
.crumb {
	opacity: 0.85;
	font-size: 14px;
}
.go-order {
	margin-left: auto;
	cursor: pointer;
	font-size: 14px;
}
.main {
	max-width: 1200px;
	margin: 20px auto;
	padding: 0 20px;
}
.detail-top {
	display: flex;
	gap: 40px;
	background: #fff;
	border-radius: 12px;
	padding: 24px;
}
.gallery {
	flex: 0 0 400px;
}
.main-img {
	width: 400px;
	height: 400px;
	border-radius: 8px;
}
.thumbs {
	display: flex;
	gap: 8px;
	margin-top: 10px;
}
.thumbs img {
	width: 64px;
	height: 64px;
	border-radius: 6px;
	object-fit: cover;
	cursor: pointer;
	border: 2px solid transparent;
}
.thumbs img.on {
	border-color: #e54d42;
}
.info {
	flex: 1;
}
.cat {
	color: #e54d42;
	font-size: 13px;
	margin-bottom: 6px;
}
.title {
	font-size: 24px;
	font-weight: 700;
}
.sub {
	color: #999;
	margin: 6px 0 12px;
}
.price-row {
	display: flex;
	align-items: baseline;
	gap: 12px;
	padding: 14px 0;
	border-bottom: 1px solid #f0f0f0;
}
.price {
	color: #e54d42;
	font-size: 30px;
	font-weight: 800;
}
.market {
	color: #bbb;
	text-decoration: line-through;
}
.sales {
	margin-left: auto;
	color: #999;
	font-size: 13px;
}
.craft {
	background: #fdf6ec;
	color: #b88230;
	border-radius: 8px;
	padding: 10px 12px;
	margin: 14px 0;
	font-size: 14px;
}
.label {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
}
.sku-box {
	margin: 16px 0;
}
.skus {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}
.sku {
	border: 1px solid #dcdfe6;
	border-radius: 8px;
	padding: 8px 14px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.15s;
}
.sku.on {
	border-color: #e54d42;
	color: #e54d42;
	background: #fff5f4;
}
.sku-meta {
	font-size: 12px;
	color: #999;
	margin-top: 2px;
}
.qty-row {
	display: flex;
	align-items: center;
	gap: 12px;
	margin: 14px 0;
}
.addr {
	margin: 14px 0;
	padding: 12px;
	background: #fafafa;
	border-radius: 8px;
}
.addr-line {
	display: flex;
}
.op-row {
	display: flex;
	gap: 12px;
	margin-top: 18px;
}
.login-tip {
	color: #e6a23c;
	font-size: 13px;
	margin-top: 10px;
}
.block {
	background: #fff;
	border-radius: 12px;
	padding: 24px;
	margin-top: 20px;
}
.block-title {
	font-size: 17px;
	font-weight: 700;
	padding-bottom: 12px;
	border-bottom: 2px solid #8e2f2f;
	display: inline-block;
	margin-bottom: 16px;
}
.detail-html {
	line-height: 1.9;
	color: #444;
}
.review {
	border-bottom: 1px dashed #eee;
	padding: 14px 0;
}
.rv-head {
	display: flex;
	align-items: center;
	gap: 10px;
}
.rv-user {
	font-weight: 600;
}
.rv-stars {
	color: #e6a23c;
	font-size: 13px;
}
.rv-time {
	margin-left: auto;
	color: #bbb;
	font-size: 12px;
}
.rv-content {
	margin: 8px 0 4px;
	line-height: 1.6;
}
.rv-reply {
	background: #f4f4f5;
	border-radius: 6px;
	padding: 8px;
	margin-top: 8px;
	font-size: 13px;
	color: #666;
}
</style>
