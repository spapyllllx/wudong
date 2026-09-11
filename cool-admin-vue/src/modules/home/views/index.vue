<template>
	<div class="home-container">
		<!-- 欢迎横幅 -->
		<el-card class="welcome-card" shadow="never">
			<div class="welcome-content">
				<div class="welcome-text">
					<h1>欢迎使用贵州文旅管理系统</h1>
					<p>这是基于 Cool-Admin 框架开发的后台管理系统</p>
				</div>
			</div>
		</el-card>

		<el-row :gutter="20" style="margin-top: 20px">
			<!-- 数据统计卡片 -->
			<el-col :xs="24" :sm="12" :md="6" v-for="item in stats" :key="item.key">
				<el-card class="stat-card" shadow="hover">
					<div class="stat-content">
						<div class="stat-icon" :style="{ background: item.color }">
							<el-icon :size="32">
								<component :is="item.icon" />
							</el-icon>
						</div>
						<div class="stat-info">
							<div class="stat-label">{{ item.label }}</div>
							<div class="stat-value">
								<span v-if="loading.stats">加载中...</span>
								<span v-else>{{ item.value }}</span>
							</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<el-row :gutter="20" style="margin-top: 20px">
			<!-- 近期订单 -->
			<el-col :xs="24" :md="12">
				<el-card class="content-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>近期订单</span>
							<el-button text type="primary" @click="goToOrders">查看更多</el-button>
						</div>
					</template>
					<el-table :data="recentOrders" style="width: 100%" v-loading="loading.orders">
						<el-table-column prop="orderNo" label="订单号" width="160" />
						<el-table-column prop="receiverName" label="收货人" width="100" />
						<el-table-column prop="totalAmount" label="金额" width="100">
							<template #default="{ row }">
								<span style="color: #f56c6c">¥{{ row.totalAmount }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态" width="100">
							<template #default="{ row }">
								<el-tag :type="getOrderStatusType(row.status)">
									{{ getOrderStatusText(row.status) }}
								</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<!-- 热门商品 -->
			<el-col :xs="24" :md="12">
				<el-card class="content-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>热门商品</span>
							<el-button text type="primary" @click="goToProducts">查看更多</el-button>
						</div>
					</template>
					<el-table :data="hotProducts" style="width: 100%" v-loading="loading.products">
						<el-table-column prop="title" label="商品名称" show-overflow-tooltip />
						<el-table-column prop="price" label="价格" width="100">
							<template #default="{ row }">
								<span style="color: #f56c6c">¥{{ row.price }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="stock" label="库存" width="80" />
						<el-table-column prop="status" label="状态" width="80">
							<template #default="{ row }">
								<el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
									{{ row.status === 1 ? '上架' : '下架' }}
								</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

		<el-row :gutter="20" style="margin-top: 20px">
			<!-- 社区动态 -->
			<el-col :xs="24" :md="12">
				<el-card class="content-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>社区动态</span>
							<el-button text type="primary" @click="goToCommunity">查看更多</el-button>
						</div>
					</template>
					<el-table :data="communityPosts" style="width: 100%" v-loading="loading.community">
						<el-table-column prop="content" label="内容" show-overflow-tooltip>
							<template #default="{ row }">
								{{ truncateText(row.content, 30) }}
							</template>
						</el-table-column>
						<el-table-column prop="likeCount" label="点赞" width="80" align="center" />
						<el-table-column prop="commentCount" label="评论" width="80" align="center" />
						<el-table-column prop="status" label="状态" width="80">
							<template #default="{ row }">
								<el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
									{{ row.status === 1 ? '已发布' : '待审核' }}
								</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<!-- 景点门票 -->
			<el-col :xs="24" :md="12">
				<el-card class="content-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>热门景点</span>
							<el-button text type="primary" @click="goToAttractions">查看更多</el-button>
						</div>
					</template>
					<el-table :data="attractions" style="width: 100%" v-loading="loading.attractions">
						<el-table-column prop="name" label="景点名称" show-overflow-tooltip />
						<el-table-column prop="price" label="门票价格" width="100">
							<template #default="{ row }">
								<span style="color: #f56c6c">¥{{ row.price }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="stock" label="余量" width="80" />
						<el-table-column prop="status" label="状态" width="80">
							<template #default="{ row }">
								<el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
									{{ row.status === 1 ? '开放' : '关闭' }}
								</el-tag>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useCool } from '/@/cool';
import { useRouter } from 'vue-router';
import {
	User,
	ShoppingCart,
	Ticket,
	ChatDotRound,
	Shop,
	House
} from '@element-plus/icons-vue';

const { service } = useCool();
const router = useRouter();

// 统计数据
const stats = ref([
	{
		key: 'users',
		label: '用户总数',
		value: 0,
		icon: User,
		color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
	},
	{
		key: 'orders',
		label: '订单总数',
		value: 0,
		icon: ShoppingCart,
		color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
	},
	{
		key: 'products',
		label: '商品总数',
		value: 0,
		icon: Shop,
		color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
	},
	{
		key: 'community',
		label: '社区帖子',
		value: 0,
		icon: ChatDotRound,
		color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
	}
]);

// 加载状态
const loading = reactive({
	stats: false,
	orders: false,
	products: false,
	community: false,
	attractions: false
});

// 近期订单
const recentOrders = ref([]);

// 热门商品
const hotProducts = ref([]);

// 社区动态
const communityPosts = ref([]);

// 景点门票
const attractions = ref([]);

// 获取统计数据
const getStats = async () => {
	loading.stats = true;
	try {
		// 用户总数
		const userRes = await service.user.info.page({ page: 1, size: 1 });
		stats.value[0].value = userRes.pagination?.total || 0;

		// 订单总数
		const orderRes = await service.order.order.page({ page: 1, size: 1 });
		stats.value[1].value = orderRes.pagination?.total || 0;

		// 商品总数
		const productRes = await service.product.product.page({ page: 1, size: 1 });
		stats.value[2].value = productRes.pagination?.total || 0;

		// 社区帖子总数
		const communityRes = await service.shequ.post.page({ page: 1, size: 1 });
		stats.value[3].value = communityRes.pagination?.total || 0;
	} catch (error) {
		console.error('获取统计数据失败:', error);
	} finally {
		loading.stats = false;
	}
};

// 获取近期订单
const getRecentOrders = async () => {
	loading.orders = true;
	try {
		const res = await service.order.order.page({
			page: 1,
			size: 5,
			order: 'createTime',
			sort: 'desc'
		});
		recentOrders.value = res.list || [];
	} catch (error) {
		console.error('获取订单列表失败:', error);
		recentOrders.value = [];
	} finally {
		loading.orders = false;
	}
};

// 获取热门商品
const getHotProducts = async () => {
	loading.products = true;
	try {
		const res = await service.product.product.page({
			page: 1,
			size: 5,
			status: 1
		});
		hotProducts.value = res.list || [];
	} catch (error) {
		console.error('获取商品列表失败:', error);
		hotProducts.value = [];
	} finally {
		loading.products = false;
	}
};

// 获取社区动态
const getCommunityPosts = async () => {
	loading.community = true;
	try {
		const res = await service.shequ.post.page({
			page: 1,
			size: 5,
			order: 'createTime',
			sort: 'desc'
		});
		communityPosts.value = res.list || [];
	} catch (error) {
		console.error('获取社区动态失败:', error);
		communityPosts.value = [];
	} finally {
		loading.community = false;
	}
};

// 获取景点列表
const getAttractions = async () => {
	loading.attractions = true;
	try {
		const res = await service.ticket.attraction.page({
			page: 1,
			size: 5,
			status: 1
		});
		attractions.value = res.list || [];
	} catch (error) {
		console.error('获取景点列表失败:', error);
		attractions.value = [];
	} finally {
		loading.attractions = false;
	}
};

// 订单状态
const getOrderStatusText = (status: number) => {
	const map: Record<number, string> = {
		0: '待付款',
		1: '待发货',
		2: '待收货',
		3: '已完成',
		4: '已取消',
		5: '已关闭'
	};
	return map[status] || '未知';
};

const getOrderStatusType = (status: number) => {
	const map: Record<number, string> = {
		0: 'warning',
		1: 'primary',
		2: 'info',
		3: 'success',
		4: 'info',
		5: 'info'
	};
	return map[status] || 'info';
};

// 文本截断
const truncateText = (text: string, length: number) => {
	if (!text) return '';
	return text.length > length ? text.substring(0, length) + '...' : text;
};

// 跳转
const goToOrders = () => {
	router.push('/order/order');
};

const goToProducts = () => {
	router.push('/product/product');
};

const goToCommunity = () => {
	router.push('/shequ/post');
};

const goToAttractions = () => {
	router.push('/ticket/attraction');
};

onMounted(() => {
	getStats();
	getRecentOrders();
	getHotProducts();
	getCommunityPosts();
	getAttractions();
});
</script>

<style lang="scss" scoped>
.home-container {
	padding: 20px;
	background: #f5f7fa;
	min-height: calc(100vh - 120px);
}

.welcome-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border: none;
	margin-bottom: 20px;

	:deep(.el-card__body) {
		padding: 40px;
	}

	.welcome-content {
		.welcome-text {
			color: white;

			h1 {
				font-size: 32px;
				font-weight: 600;
				margin: 0 0 12px 0;
			}

			p {
				font-size: 16px;
				margin: 0;
				opacity: 0.9;
			}
		}
	}
}

.stat-card {
	margin-bottom: 20px;
	border-radius: 12px;
	transition: all 0.3s;

	&:hover {
		transform: translateY(-4px);
	}

	:deep(.el-card__body) {
		padding: 20px;
	}

	.stat-content {
		display: flex;
		align-items: center;
		gap: 16px;

		.stat-icon {
			width: 64px;
			height: 64px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			flex-shrink: 0;
		}

		.stat-info {
			flex: 1;

			.stat-label {
				font-size: 14px;
				color: #909399;
				margin-bottom: 8px;
			}

			.stat-value {
				font-size: 28px;
				font-weight: 600;
				color: #303133;
			}
		}
	}
}

.content-card {
	border-radius: 12px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
		font-size: 16px;
	}

	:deep(.el-table) {
		font-size: 14px;

		.el-table__header {
			th {
				background: #f5f7fa;
				color: #606266;
				font-weight: 600;
			}
		}
	}
}
</style>
