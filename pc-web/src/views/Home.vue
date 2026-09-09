<template>
	<div class="page">
		<!-- 顶部导航 -->
		<div class="topbar">
			<div class="topbar-inner">
				<div class="logo" @click="router.push('/')">乌东非遗商城</div>
				<div class="search">
					<el-input v-model="keyword" placeholder="搜索非遗好物,如:银饰 / 蜡染" clearable @keyup.enter="doSearch" @clear="doSearch">
						<template #append>
							<el-button @click="doSearch">搜索</el-button>
						</template>
					</el-input>
				</div>
				<div class="nav">
					<span class="nav-item" :class="{ active: query.category_id === 0 }" @click="setCat(0)">全部</span>
					<span v-for="c in categories" :key="c.id" class="nav-item" :class="{ active: query.category_id === c.id }" @click="setCat(c.id)">
						{{ c.name }}
					</span>
				</div>
				<div class="user">
					<el-button v-if="!token" size="small" type="primary" plain @click="loginVisible = true">登录</el-button>
					<template v-else>
						<el-button size="small" @click="openOrders">我的订单</el-button>
						<el-button size="small" link @click="logout">退出</el-button>
					</template>
				</div>
			</div>
		</div>

		<!-- 主内容 -->
		<div class="main">
			<!-- 排序 -->
			<div class="toolbar">
				<div class="sorts">
					<el-radio-group v-model="query.sort" @change="load">
						<el-radio-button value="time">最新</el-radio-button>
						<el-radio-button value="sales">销量优先</el-radio-button>
						<el-radio-button value="price">价格升序</el-radio-button>
					</el-radio-group>
				</div>
			</div>

			<div v-loading="loading" class="grid">
				<div v-for="p in list" :key="p.id" class="card" @click="router.push(`/product/${p.id}`)">
					<div class="img-wrap">
						<img v-if="p.main_image" :src="p.main_image" />
						<div v-else class="no-img">无图</div>
						<span class="cat-tag" v-if="p.categoryName">{{ p.categoryName }}</span>
					</div>
					<div class="info">
						<div class="title">{{ p.title }}</div>
						<div class="sub">{{ p.subtitle }}</div>
						<div class="foot">
							<span class="price">¥{{ p.price }}</span>
							<span class="market" v-if="p.market_price">¥{{ p.market_price }}</span>
							<span class="meta" v-if="p.rating">⭐{{ p.rating }}({{ p.review_count }})</span>
							<span class="meta">已售 {{ p.sales }}</span>
						</div>
					</div>
				</div>
			</div>
			<el-empty v-if="!loading && !list.length" description="暂无商品" />
			<div class="pager">
				<el-pagination v-model:current-page="query.page" :page-size="query.size" :total="total" layout="prev, pager, next" background @current-change="load" />
			</div>
		</div>

		<!-- 登录 -->
		<el-dialog v-model="loginVisible" title="登录(演示环境)" width="380px">
			<el-form label-width="70px">
				<el-form-item label="手机号"><el-input v-model="loginForm.phone" /></el-form-item>
				<el-form-item label="密码"><el-input v-model="loginForm.password" type="password" show-password /></el-form-item>
			</el-form>
			<div style="color: #909399; font-size: 12px">演示账号:13800000000 / 123456(开发环境自动登录,无需手动)</div>
			<template #footer>
				<el-button @click="loginVisible = false">取消</el-button>
				<el-button type="primary" @click="doLogin">登录</el-button>
			</template>
		</el-dialog>

		<!-- 我的订单 -->
		<el-dialog v-model="orderVisible" title="我的订单" width="720px">
			<div v-loading="orderLoading">
				<div v-for="o in orders" :key="o.id" class="order-card">
					<div class="order-head">
						<span>订单号:{{ o.id }}</span>
						<el-tag size="small" :type="statusType(o.status)">{{ statusText(o.status) }}</el-tag>
						<span class="order-time">{{ o.created_at }}</span>
					</div>
					<div v-for="it in o.items" :key="it.product_id" class="order-item">
						<img v-if="it.image" :src="it.image" class="order-img" />
						<div class="order-info">
							<div>{{ it.product_name }}</div>
							<div class="order-sub">{{ it.sku_name }} × {{ it.quantity }}</div>
						</div>
						<span class="order-price">¥{{ it.total_amount }}</span>
					</div>
					<div class="order-foot">
						<span class="order-total">合计 ¥{{ o.total_amount }}</span>
						<div>
							<el-button v-if="o.status === 'pending'" size="small" type="danger" @click="orderOp(o, 'cancel')">取消订单</el-button>
							<el-button v-if="o.status === 'pending'" size="small" type="success" @click="orderOp(o, 'pay')">模拟支付</el-button>
							<el-button v-if="o.status === 'paid'" size="small" type="primary" @click="orderOp(o, 'confirm')">确认收货</el-button>
						</div>
					</div>
				</div>
				<el-empty v-if="!orderLoading && !orders.length" description="暂无订单" />
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import { api, DEMO_ACCOUNT } from '../api';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
const list = ref([]);
const total = ref(0);
const loading = ref(false);
const keyword = ref('');
const query = reactive({ page: 1, size: 16, category_id: 0, sort: 'time' });
const token = ref(localStorage.getItem('app_token'));

const loginVisible = ref(false);
const loginForm = reactive({ phone: DEMO_ACCOUNT.phone, password: DEMO_ACCOUNT.password });

const orderVisible = ref(false);
const orders = ref([]);
const orderLoading = ref(false);

async function load() {
	loading.value = true;
	try {
		const params = { page: query.page, size: query.size, sort: query.sort };
		if (query.category_id) params.category_id = query.category_id;
		if (keyword.value.trim()) params.keyword = keyword.value.trim();
		const res = await api.productList(params);
		list.value = res.list;
		total.value = res.pagination.total;
	} finally {
		loading.value = false;
	}
}

function setCat(id) {
	query.category_id = id;
	query.page = 1;
	load();
}
function doSearch() {
	query.page = 1;
	load();
}
async function doLogin() {
	try {
		const data = await api.login(loginForm.phone, loginForm.password);
		localStorage.setItem('app_token', data.token);
		token.value = data.token;
		loginVisible.value = false;
		ElMessage.success('登录成功');
	} catch (e) {
		ElMessage.error(e.message);
	}
}
function logout() {
	localStorage.removeItem('app_token');
	token.value = '';
	ElMessage.info('已退出');
}

const statusText = s => ({ pending: '待支付', paid: '已支付', cancelled: '已取消', completed: '已完成' })[s] || s;
const statusType = s => ({ pending: 'warning', paid: 'primary', cancelled: 'info', completed: 'success' })[s];

async function openOrders() {
	orderVisible.value = true;
	orderLoading.value = true;
	try {
		const res = await api.myOrders({ page: 1, size: 20 });
		orders.value = res.list;
	} catch (e) {
		ElMessage.error(e.message);
	} finally {
		orderLoading.value = false;
	}
}
async function orderOp(o, op) {
	try {
		await { pay: api.orderPay, cancel: api.orderCancel, confirm: api.orderConfirm }[op](o.id);
		ElMessage.success('操作成功');
		await openOrders();
		load();
	} catch (e) {
		ElMessage.error(e.message);
	}
}

onMounted(async () => {
	try {
		categories.value = await api.categories();
	} catch (e) {}
	load();
});
</script>

<style scoped>
.topbar {
	background: linear-gradient(120deg, #8e2f2f, #b5453a);
	color: #fff;
	padding: 0 40px;
	position: sticky;
	top: 0;
	z-index: 9;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.topbar-inner {
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	gap: 24px;
	padding: 10px 0;
}
.logo {
	font-size: 20px;
	font-weight: 700;
	letter-spacing: 1px;
	cursor: pointer;
	white-space: nowrap;
}
.search {
	flex: 1;
	max-width: 420px;
}
.nav {
	display: flex;
	gap: 14px;
	align-items: center;
	overflow-x: auto;
}
.nav-item {
	cursor: pointer;
	white-space: nowrap;
	font-size: 14px;
	opacity: 0.85;
	padding: 4px 2px;
}
.nav-item:hover,
.nav-item.active {
	opacity: 1;
	font-weight: 600;
	border-bottom: 2px solid #fff;
}
.user {
	margin-left: auto;
	white-space: nowrap;
}
.main {
	max-width: 1200px;
	margin: 20px auto;
	padding: 0 20px;
}
.toolbar {
	margin-bottom: 16px;
	background: #fff;
	border-radius: 8px;
	padding: 12px 16px;
}
.grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
	gap: 16px;
	min-height: 200px;
}
.card {
	background: #fff;
	border-radius: 10px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid #eee;
}
.card:hover {
	transform: translateY(-4px);
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
.img-wrap {
	position: relative;
	height: 190px;
	background: #f2f2f2;
}
.img-wrap img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.no-img {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	color: #bbb;
}
.cat-tag {
	position: absolute;
	left: 8px;
	top: 8px;
	background: rgba(181, 69, 58, 0.9);
	color: #fff;
	font-size: 12px;
	border-radius: 4px;
	padding: 2px 8px;
}
.info {
	padding: 12px;
}
.title {
	font-weight: 600;
	font-size: 15px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.sub {
	color: #999;
	font-size: 12px;
	margin: 4px 0 8px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.foot {
	display: flex;
	align-items: baseline;
	gap: 8px;
	flex-wrap: wrap;
}
.price {
	color: #e54d42;
	font-weight: 700;
	font-size: 17px;
}
.market {
	color: #bbb;
	font-size: 12px;
	text-decoration: line-through;
}
.meta {
	margin-left: auto;
	color: #999;
	font-size: 12px;
}
.pager {
	display: flex;
	justify-content: center;
	margin: 20px 0;
}
.order-card {
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 12px;
	margin-bottom: 12px;
}
.order-head {
	display: flex;
	align-items: center;
	gap: 10px;
	color: #666;
	font-size: 13px;
}
.order-time {
	margin-left: auto;
	color: #bbb;
}
.order-item {
	display: flex;
	gap: 12px;
	align-items: center;
	padding: 8px 0;
	border-top: 1px dashed #f0f0f0;
}
.order-img {
	width: 52px;
	height: 52px;
	border-radius: 6px;
	object-fit: cover;
}
.order-info {
	flex: 1;
}
.order-sub {
	color: #999;
	font-size: 12px;
	margin-top: 2px;
}
.order-price {
	color: #e54d42;
	font-weight: 600;
}
.order-foot {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 16px;
	border-top: 1px solid #f0f0f0;
	padding-top: 10px;
}
.order-total {
	font-weight: 600;
}
</style>
