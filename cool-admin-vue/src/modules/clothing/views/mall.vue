<template>
	<div class="mall-page">
		<!-- 头部 -->
		<div class="mall-header">
			<div class="mall-title">乌东非遗商城 · 商品预览(游客视角)</div>
			<div class="mall-tools">
				<el-input v-model="query.keyword" placeholder="搜索商品名称/工艺" clearable style="width: 220px" @keyup.enter="search" @clear="search">
					<template #append>
						<el-button @click="search">搜索</el-button>
					</template>
				</el-input>
				<el-select v-model="query.sort" style="width: 120px; margin-left: 8px" @change="load">
					<el-option label="最新" value="time" />
					<el-option label="销量优先" value="sales" />
					<el-option label="价格升序" value="price" />
				</el-select>
				<el-button v-if="!appToken" type="primary" plain style="margin-left: 8px" @click="loginDemo">游客登录(演示)</el-button>
				<template v-else>
					<el-button type="warning" plain style="margin-left: 8px" @click="openMyOrders">我的订单</el-button>
					<el-button link @click="logoutDemo">退出({{ userInfo?.nickname || '演示用户' }})</el-button>
				</template>
			</div>
		</div>

		<!-- 分类 -->
		<div class="mall-cats">
			<el-radio-group v-model="query.category_id" @change="load">
				<el-radio-button :value="0">全部</el-radio-button>
				<el-radio-button v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</el-radio-button>
			</el-radio-group>
		</div>

		<!-- 商品卡片 -->
		<div v-loading="loading" class="mall-grid">
			<div v-for="p in list" :key="p.id" class="mall-card" @click="openDetail(p)">
				<el-image v-if="p.main_image" :src="p.main_image" fit="cover" class="mall-card-img" />
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
			<el-pagination v-model:current-page="query.page" :page-size="query.size" :total="total" layout="prev, pager, next" background @current-change="load" />
		</div>

		<!-- 商品详情 -->
		<el-dialog v-model="detailVisible" :title="detail?.title || ''" width="780px" top="5vh">
			<div v-if="detail" class="detail-wrap">
				<div class="detail-imgs">
					<el-image v-for="(img, i) in detail.images?.length ? detail.images : [detail.main_image]" :key="i" :src="img" fit="cover" class="detail-img" :preview-src-list="detail.images?.length ? detail.images : [detail.main_image]" preview-teleported />
				</div>
				<div class="detail-info">
					<div class="detail-cat">{{ detail.category_name }}</div>
					<div class="detail-title">{{ detail.title }}</div>
					<div class="detail-price-row">
						<span class="detail-price">¥{{ detail.price }}</span>
						<span v-if="detail.market_price" class="detail-market">¥{{ detail.market_price }}</span>
						<span class="detail-rate">⭐ {{ detail.rating }} · {{ detail.review_count }} 条评价 · 已售 {{ detail.sales }}</span>
					</div>
					<div v-if="detail.craft_intro" class="detail-craft">工艺介绍:{{ detail.craft_intro }}</div>

					<!-- 选择规格 -->
					<div v-if="detail.skus?.length" class="buy-box">
						<div class="buy-label">规格:</div>
						<div class="skus-list">
							<div v-for="s in detail.skus" :key="s.id" class="sku-chip" :class="{ selected: buy.skuId === s.id }" @click="buy.skuId = s.id">
								{{ s.sku_name }}
								<div class="sku-meta">¥{{ s.price }} · 库存{{ s.stock }}</div>
							</div>
						</div>
						<div class="buy-row">
							<div class="buy-label">数量:</div>
							<el-input-number v-model="buy.quantity" :min="1" :max="999" />
							<el-button type="danger" style="margin-left: auto" :disabled="!appToken" @click="doBuy">立即购买</el-button>
						</div>
						<div v-if="!appToken" class="buy-tip">演示购买需先「游客登录」</div>
					</div>

					<!-- 收货信息(演示简化) -->
					<div v-if="buy.skuId" class="addr-box">
						<div class="buy-label">收货信息:</div>
						<el-input v-model="buy.consignee" placeholder="收货人" style="width: 130px" />
						<el-input v-model="buy.phone" placeholder="手机号" style="width: 150px; margin-left: 8px" />
						<el-input v-model="buy.detail" placeholder="详细地址(省市区+街道)" style="margin-top: 8px" />
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
						<el-image v-for="(img, i) in r.images" :key="i" :src="img" fit="cover" style="width: 56px; height: 56px; margin-right: 6px; border-radius: 4px" :preview-src-list="r.images" preview-teleported />
					</div>
					<div v-if="r.reply_content" class="review-reply">商家回复:{{ r.reply_content }}</div>
				</div>
			</div>
			<div v-else style="color: #999">暂无评价</div>
		</el-dialog>

		<!-- 我的订单 -->
		<el-dialog v-model="orderVisible" title="我的订单(演示)" width="860px" top="6vh">
			<div v-loading="orderLoading">
				<div v-for="o in orders" :key="o.id" class="order-card">
					<div class="order-head">
						<span class="order-no">订单号:{{ o.id }}</span>
						<el-tag :type="orderStatusType(o.status)" size="small">{{ orderStatusText(o.status) }}</el-tag>
						<span class="order-time">{{ o.created_at }}</span>
					</div>
					<div v-for="it in o.items" :key="it.sku_id || it.product_id" class="order-item">
						<el-image v-if="it.image" :src="it.image" fit="cover" style="width: 56px; height: 56px; border-radius: 4px" />
						<div class="order-item-info">
							<div>{{ it.product_name }}</div>
							<div class="order-item-sub">{{ it.sku_name }} × {{ it.quantity }}</div>
						</div>
						<span class="order-item-price">¥{{ it.total_amount }}</span>
					</div>
					<div class="order-foot">
						<span class="order-addr" v-if="o.logistics">收货:{{ o.logistics.consignee }} {{ o.logistics.phone }} {{ o.logistics.detail }}</span>
						<span class="order-total">合计:¥{{ o.total_amount }}</span>
						<div class="order-ops">
							<el-button v-if="o.status === 'pending'" size="small" type="danger" @click="orderOp(o, 'cancel')">取消</el-button>
							<el-button v-if="o.status === 'pending'" size="small" type="success" @click="orderOp(o, 'pay')">模拟支付</el-button>
							<el-button v-if="o.status === 'paid'" size="small" type="primary" @click="orderOp(o, 'confirm')">确认收货</el-button>
						</div>
					</div>
				</div>
				<el-empty v-if="!orderLoading && !orders.length" description="还没有订单,去挑一件非遗好物吧" />
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-mall'
});

import axios from 'axios';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

/**
 * app 端接口直连(经 vite /app/ 代理到后端)。
 * 注意:管理后台的全局请求拦截器会强制覆盖 Authorization 为 admin token,
 * 故本页对 /app 接口使用独立 axios 实例并携带 C 端演示登录 token。
 * 演示账号:13800000000 / 123456(本地测试账号,生产环境应移除本段逻辑)
 */
const DEMO_ACCOUNT = { phone: '13800000000', password: '123456' };

const api = axios.create({ timeout: 15000 });

async function call(method: 'get' | 'post', url: string, data?: any, withToken = true) {
	const headers: any = {};
	if (withToken && appToken.value) headers.Authorization = appToken.value;
	const res: any = await api.request({ method, url, data, params: method === 'get' ? data : undefined, headers });
	const body = res.data;
	if (body?.code === 1000) return body.data;
	throw new Error(body?.message || '请求失败');
}

// ---------- 状态 ----------
const appToken = ref('');
const userInfo = ref<any>(null);
const query = reactive({ page: 1, size: 12, category_id: 0, keyword: '', sort: 'time' });
const categories = ref<any[]>([]);
const list = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const detailVisible = ref(false);
const detail = ref<any>(null);
const reviews = ref<any[]>([]);
const buy = reactive({ skuId: null as any, quantity: 1, consignee: '', phone: '', detail: '' });

const orderVisible = ref(false);
const orders = ref<any[]>([]);
const orderLoading = ref(false);

// ---------- 登录(演示) ----------
async function loginDemo() {
	try {
		const data: any = await call('post', '/app/user/login/password', DEMO_ACCOUNT, false);
		appToken.value = data.token;
		userInfo.value = { nickname: DEMO_ACCOUNT.phone.slice(-4) };
		ElMessage.success('演示登录成功(测试账号 138****0000)');
	} catch (e: any) {
		ElMessage.error('演示登录失败:' + (e.message || e));
	}
}

function logoutDemo() {
	appToken.value = '';
	userInfo.value = null;
	ElMessage.info('已退出演示登录');
}

// ---------- 商品 ----------
async function load() {
	loading.value = true;
	try {
		const params: any = { page: query.page, size: query.size, sort: query.sort };
		if (query.category_id) params.category_id = query.category_id;
		if (query.keyword?.trim()) params.keyword = query.keyword.trim();
		const res: any = await call('get', '/app/clothing/product/list', params, false);
		list.value = res?.list || [];
		total.value = res?.pagination?.total || 0;
	} catch (e: any) {
		ElMessage.error('加载失败:' + (e.message || e));
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
	buy.skuId = null;
	buy.quantity = 1;
	buy.consignee = userInfo.value ? '演示买家' : '';
	buy.phone = userInfo.value ? DEMO_ACCOUNT.phone : '';
	buy.detail = '';
	try {
		const [d, rs]: any = await Promise.all([
			call('get', '/app/clothing/product/detail', { id: p.id }, false),
			call('get', '/app/clothing/product/reviews', { product_id: p.id, size: 5 }, false)
		]);
		detail.value = d;
		reviews.value = rs?.list || [];
		if (d.skus?.length) buy.skuId = d.skus[0].id;
	} catch (e: any) {
		ElMessage.error('加载详情失败:' + (e.message || e));
	}
}

// ---------- 购买 ----------
async function doBuy() {
	if (!buy.skuId) {
		ElMessage.warning('请先选择规格');
		return;
	}
	if (!buy.consignee || !buy.phone || !buy.detail) {
		ElMessage.warning('请填写收货人/手机号/详细地址');
		return;
	}
	try {
		const orderId = await call('post', '/app/clothing/order/create', {
			skuId: buy.skuId,
			quantity: buy.quantity,
			consignee: buy.consignee,
			phone: buy.phone,
			province: '',
			city: '',
			district: '',
			detail: buy.detail
		});
		ElMessage.success(`下单成功,订单号 ${orderId}`);
		detailVisible.value = false;
		load();
		openMyOrders();
	} catch (e: any) {
		ElMessage.error('下单失败:' + (e.message || e));
	}
}

// ---------- 我的订单 ----------
async function openMyOrders() {
	orderVisible.value = true;
	await loadOrders();
}

async function loadOrders() {
	orderLoading.value = true;
	try {
		const res: any = await call('get', '/app/clothing/order/list', { page: 1, size: 20 });
		orders.value = res?.list || [];
	} catch (e: any) {
		ElMessage.error('订单加载失败:' + (e.message || e));
	} finally {
		orderLoading.value = false;
	}
}

function orderStatusText(s: string) {
	return ({ pending: '待支付', paid: '已支付', cancelled: '已取消', completed: '已完成', refunded: '已退款' } as any)[s] || s;
}

function orderStatusType(s: string) {
	return ({ pending: 'warning', paid: 'primary', cancelled: 'info', completed: 'success', refunded: 'danger' } as any)[s] || 'info';
}

async function orderOp(o: any, op: 'pay' | 'cancel' | 'confirm') {
	const labels: any = { pay: '模拟支付', cancel: '取消', confirm: '确认收货' };
	try {
		await call('post', `/app/clothing/order/${op}`, { orderId: o.id });
		ElMessage.success(`${labels[op]}成功`);
		await loadOrders();
		load();
	} catch (e: any) {
		ElMessage.error((e.message || e) + '');
	}
}

onMounted(async () => {
	try {
		const cs: any = await call('get', '/app/clothing/category/list', undefined, false);
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
	flex-wrap: wrap;
	gap: 10px;
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
.buy-box {
	border: 1px dashed #e54d42;
	border-radius: 8px;
	padding: 10px;
	margin-bottom: 10px;
}
.buy-label {
	font-size: 13px;
	color: #909399;
	margin-bottom: 6px;
}
.buy-row {
	display: flex;
	align-items: center;
	margin-top: 10px;
	gap: 8px;
}
.buy-tip {
	color: #e6a23c;
	font-size: 12px;
	margin-top: 6px;
}
.addr-box {
	margin-top: 10px;
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
	cursor: pointer;
	transition: all 0.15s;
}
.sku-chip:hover {
	border-color: #e54d42;
}
.sku-chip.selected {
	border-color: #e54d42;
	background: #fef0ef;
	color: #e54d42;
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
.order-card {
	border: 1px solid #ebeef5;
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 12px;
	background: #fff;
}
.order-head {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 8px;
}
.order-no {
	font-size: 13px;
	color: #606266;
}
.order-time {
	margin-left: auto;
	font-size: 12px;
	color: #c0c4cc;
}
.order-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 6px 0;
	border-top: 1px dashed #f0f2f5;
}
.order-item-info {
	flex: 1;
	font-size: 14px;
}
.order-item-sub {
	font-size: 12px;
	color: #909399;
	margin-top: 2px;
}
.order-item-price {
	color: #e54d42;
	font-weight: 600;
}
.order-foot {
	display: flex;
	align-items: center;
	margin-top: 8px;
	gap: 10px;
	flex-wrap: wrap;
}
.order-addr {
	font-size: 12px;
	color: #909399;
}
.order-total {
	margin-left: auto;
	font-weight: 600;
}
.order-ops {
	display: flex;
	gap: 6px;
}
</style>
