<template>
	<div class="mall-page">
		<!-- 头部 -->
		<div class="mall-header">
			<div class="mall-title">乌东非遗商城 · 商品预览(游客视角)</div>
			<div class="mall-search">
				<el-input v-model="query.keyword" placeholder="搜索商品名称/工艺" clearable style="width: 260px" @keyup.enter="search" @clear="search">
					<template #append>
						<el-button @click="search">搜索</el-button>
					</template>
				</el-input>
				<el-select v-model="query.sort" style="width: 120px; margin-left: 10px" @change="load">
					<el-option label="最新" value="time" />
					<el-option label="销量优先" value="sales" />
					<el-option label="价格升序" value="price" />
				</el-select>
			</div>
		</div>

		<!-- 分类 -->
		<div class="mall-cats">
			<el-radio-group v-model="query.category_id" @change="load">
				<el-radio-button :value="0">全部</el-radio-button>
				<el-radio-button v-for="c in categories" :key="c.id" :value="c.id">
					{{ c.name }}
				</el-radio-button>
			</el-radio-group>
		</div>

		<!-- 商品卡片 -->
		<div v-loading="loading" class="mall-grid">
			<div v-for="p in list" :key="p.id" class="mall-card" @click="openDetail(p)">
				<el-image
					v-if="p.main_image"
					:src="p.main_image"
					fit="cover"
					class="mall-card-img"
				/>
				<div v-else class="mall-card-img no-img">无图</div>
				<div class="mall-card-body">
					<div class="mall-card-title">{{ p.title }}</div>
					<div class="mall-card-sub">{{ p.subtitle || '非遗手工 · 匠心之作' }}</div>
					<div class="mall-card-foot">
						<span class="mall-price">¥{{ p.price }}</span>
						<span v-if="p.market_price" class="mall-market">¥{{ p.market_price }}</span>
						<span class="mall-rate" v-if="p.rating">⭐ {{ p.rating }}({{ p.review_count }})</span>
						<span class="mall-sales">已售 {{ p.sales }}</span>
					</div>
				</div>
			</div>
			<el-empty v-if="!loading && !list.length" description="暂无在售商品" />
		</div>

		<!-- 分页 -->
		<div class="mall-pager">
			<el-pagination
				v-model:current-page="query.page"
				:page-size="query.size"
				:total="total"
				layout="prev, pager, next"
				background
				@current-change="load"
			/>
		</div>

		<!-- 详情 -->
		<el-dialog v-model="detailVisible" :title="detail?.title || ''" width="760px" top="6vh">
			<div v-if="detail" class="detail-wrap">
				<div class="detail-imgs">
					<el-image
						v-for="(img, i) in detail.images?.length ? detail.images : [detail.main_image]"
						:key="i"
						:src="img"
						fit="cover"
						class="detail-img"
						:preview-src-list="detail.images?.length ? detail.images : [detail.main_image]"
						preview-teleported
					/>
				</div>
				<div class="detail-info">
					<div class="detail-cat">{{ detail.category_name }}</div>
					<div class="detail-title">{{ detail.title }}</div>
					<div class="detail-price-row">
						<span class="detail-price">¥{{ detail.price }}</span>
						<span v-if="detail.market_price" class="detail-market">¥{{ detail.market_price }}</span>
						<span class="detail-rate">
							⭐ {{ detail.rating }} 分 · {{ detail.review_count }} 条评价 · 已售
							{{ detail.sales }}
						</span>
					</div>
					<div v-if="detail.craft_intro" class="detail-craft">工艺介绍:{{ detail.craft_intro }}</div>
					<div v-if="detail.skus?.length" class="detail-skus">
						<div class="skus-label">规格:</div>
						<div class="skus-list">
							<div v-for="s in detail.skus" :key="s.id" class="sku-chip">
								{{ s.sku_name }}
								<div class="sku-meta">¥{{ s.price }} · 库存{{ s.stock }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<el-divider content-position="left">商品详情</el-divider>
			<div v-if="detail?.detail" class="detail-html" v-html="detail.detail" />
			<div v-else style="color: #999">暂无详情</div>

			<el-divider content-position="left">用户评价({{ (reviews || []).length }})</el-divider>
			<div v-if="reviews?.length" class="review-list">
				<div v-for="r in reviews" :key="r.id" class="review-item">
					<div class="review-head">
						<el-avatar :size="28" :src="r.user?.avatar_url">{{ (r.user?.nickname || '客')[0] }}</el-avatar>
						<span class="review-user">{{ r.user?.nickname || '游客' }}</span>
						<span class="review-stars">{{ '⭐'.repeat(r.rating) }}</span>
						<span class="review-time">{{ r.created_at }}</span>
					</div>
					<div class="review-content">{{ r.content }}</div>
					<div v-if="r.images?.length" class="review-imgs">
						<el-image
							v-for="(img, i) in r.images"
							:key="i"
							:src="img"
							fit="cover"
							style="width: 56px; height: 56px; margin-right: 6px; border-radius: 4px"
							:preview-src-list="r.images"
							preview-teleported
						/>
					</div>
					<div v-if="r.reply_content" class="review-reply">商家回复:{{ r.reply_content }}</div>
				</div>
			</div>
			<div v-else style="color: #999">暂无评价</div>

			<template #footer>
				<span style="color: #909399; font-size: 12px; float: left; line-height: 32px">
					前台演示(游客浏览)。收藏/评价/下单需小程序登录态,订单模块由核心组交付。
				</span>
				<el-button type="primary" @click="detailVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-mall'
});

import { useCool } from '/@/cool';
import { onMounted, reactive, ref } from 'vue';

const { request } = useCool();

const query = reactive({ page: 1, size: 12, category_id: 0, keyword: '', sort: 'time' });
const categories = ref<any[]>([]);
const list = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

// 详情
const detailVisible = ref(false);
const detail = ref<any>(null);
const reviews = ref<any[]>([]);

async function load() {
	loading.value = true;
	try {
		const params: any = {
			page: query.page,
			size: query.size,
			sort: query.sort
		};
		if (query.category_id) params.category_id = query.category_id;
		if (query.keyword?.trim()) params.keyword = query.keyword.trim();
		const res: any = await request({
			url: '/app/clothing/product/list',
			method: 'get',
			params
		});
		list.value = res?.list || [];
		total.value = res?.pagination?.total || 0;
	} finally {
		loading.value = false;
	}
}

function search() {
	query.page = 1;
	load();
}

async function openDetail(p: any) {
	detailVisible.value = true;
	detail.value = null;
	reviews.value = [];
	const [d, rs]: any = await Promise.all([
		request({ url: '/app/clothing/product/detail', method: 'get', params: { id: p.id } }),
		request({ url: '/app/clothing/product/reviews', method: 'get', params: { product_id: p.id, size: 5 } })
	]);
	detail.value = d;
	reviews.value = rs?.list || [];
}

onMounted(async () => {
	try {
		const cs: any = await request({ url: '/app/clothing/category/list', method: 'get' });
		categories.value = cs || [];
	} catch (e) {}
	load();
});
</script>

<style scoped>
.mall-page {
	padding: 16px;
	min-height: calc(100vh - 100px);
	background: #f5f7fa;
}
.mall-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}
.mall-title {
	font-size: 18px;
	font-weight: 600;
	color: #303133;
}
.mall-cats {
	margin-bottom: 14px;
}
.mall-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 14px;
	min-height: 200px;
}
.mall-card {
	background: #fff;
	border-radius: 10px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid #ebeef5;
}
.mall-card:hover {
	transform: translateY(-3px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.mall-card-img {
	width: 100%;
	height: 170px;
	display: block;
	background: #f0f2f5;
}
.no-img {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #bbb;
}
.mall-card-body {
	padding: 10px 12px;
}
.mall-card-title {
	font-size: 14px;
	font-weight: 600;
	color: #303133;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.mall-card-sub {
	font-size: 12px;
	color: #909399;
	margin: 4px 0 8px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.mall-card-foot {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}
.mall-price {
	color: #e54d42;
	font-size: 17px;
	font-weight: 700;
}
.mall-market {
	color: #c0c4cc;
	font-size: 12px;
	text-decoration: line-through;
}
.mall-rate {
	color: #e6a23c;
	font-size: 12px;
}
.mall-sales {
	margin-left: auto;
	color: #909399;
	font-size: 12px;
}
.mall-pager {
	display: flex;
	justify-content: center;
	margin-top: 18px;
}

.detail-wrap {
	display: flex;
	gap: 20px;
}
.detail-imgs {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	flex: 0 0 260px;
	align-content: flex-start;
}
.detail-img {
	width: 120px;
	height: 120px;
	border-radius: 6px;
}
.detail-info {
	flex: 1;
}
.detail-cat {
	display: inline-block;
	color: #e54d42;
	font-size: 12px;
	border: 1px solid #e54d42;
	border-radius: 4px;
	padding: 1px 8px;
}
.detail-title {
	font-size: 19px;
	font-weight: 700;
	margin: 8px 0;
}
.detail-price-row {
	display: flex;
	align-items: baseline;
	gap: 10px;
	margin-bottom: 10px;
}
.detail-price {
	color: #e54d42;
	font-size: 26px;
	font-weight: 700;
}
.detail-market {
	color: #c0c4cc;
	text-decoration: line-through;
}
.detail-rate {
	color: #909399;
	font-size: 13px;
}
.detail-craft {
	background: #fdf6ec;
	color: #b88230;
	border-radius: 6px;
	padding: 8px 10px;
	font-size: 13px;
	margin-bottom: 10px;
}
.skus-label {
	font-size: 13px;
	color: #909399;
	margin-bottom: 6px;
}
.skus-list {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
.sku-chip {
	border: 1px solid #dcdfe6;
	border-radius: 6px;
	padding: 6px 10px;
	font-size: 13px;
	background: #fafafa;
}
.sku-meta {
	font-size: 11px;
	color: #909399;
	margin-top: 2px;
}
.detail-html {
	line-height: 1.7;
	color: #303133;
	font-size: 14px;
}
.review-item {
	border-bottom: 1px dashed #ebeef5;
	padding: 10px 0;
}
.review-head {
	display: flex;
	align-items: center;
	gap: 8px;
}
.review-user {
	font-size: 13px;
	font-weight: 600;
}
.review-stars {
	color: #e6a23c;
	font-size: 12px;
}
.review-time {
	margin-left: auto;
	color: #c0c4cc;
	font-size: 12px;
}
.review-content {
	font-size: 14px;
	margin: 6px 0;
}
.review-imgs {
	margin-bottom: 4px;
}
.review-reply {
	background: #f4f4f5;
	border-radius: 4px;
	padding: 6px 8px;
	font-size: 13px;
	color: #606266;
}
</style>
