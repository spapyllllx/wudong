<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="statusFilter"
				placeholder="订单状态"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="待付款" :value="0" />
				<el-option label="待发货" :value="1" />
				<el-option label="待收货" :value="2" />
				<el-option label="已完成" :value="3" />
				<el-option label="已取消" :value="4" />
			</el-select>
			<el-select
				v-model="payStatusFilter"
				placeholder="支付状态"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="未支付" :value="0" />
				<el-option label="已支付" :value="1" />
			</el-select>
			<cl-search-key placeholder="搜索订单号/收货人/手机号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="订单号" prop="orderNo" width="180" />

				<el-table-column label="收货人信息" width="200">
					<template #default="{ row }">
						<div>
							<div style="font-weight: 500">{{ row.receiverName }}</div>
							<div style="font-size: 12px; color: #999">{{ row.receiverPhone }}</div>
							<div style="font-size: 12px; color: #999; margin-top: 4px">
								{{ row.receiverProvince }} {{ row.receiverCity }} {{ row.receiverDistrict }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="金额信息" width="150">
					<template #default="{ row }">
						<div>
							<div style="color: #f56c6c; font-weight: 500">实付: ¥{{ row.payAmount }}</div>
							<div style="font-size: 12px; color: #999">总额: ¥{{ row.totalAmount }}</div>
							<div v-if="row.freight > 0" style="font-size: 12px; color: #999">运费: ¥{{ row.freight }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="订单状态" width="100">
					<template #default="{ row }">
						<el-tag v-if="row.status === 0" type="warning">待付款</el-tag>
						<el-tag v-else-if="row.status === 1" type="primary">待发货</el-tag>
						<el-tag v-else-if="row.status === 2" type="info">待收货</el-tag>
						<el-tag v-else-if="row.status === 3" type="success">已完成</el-tag>
						<el-tag v-else type="danger">已取消</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="支付状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.payStatus === 1 ? 'success' : 'info'">
							{{ row.payStatus === 1 ? '已支付' : '未支付' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="支付方式" width="100">
					<template #default="{ row }">
						<span v-if="row.payType === 'wechat'">微信支付</span>
						<span v-else-if="row.payType === 'alipay'">支付宝</span>
						<span v-else style="color: #999">-</span>
					</template>
				</el-table-column>

				<el-table-column label="创建时间" prop="createTime" width="160" />

				<el-table-column label="操作" width="280" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
						<el-button v-if="row.status === 1" type="success" size="small" @click="ship(row)">发货</el-button>
						<el-button v-if="row.status < 3" type="danger" size="small" @click="cancel(row)">取消</el-button>
						<el-button v-if="row.status >= 3" type="danger" size="small" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 订单详情对话框 -->
		<el-dialog v-model="detailVisible" title="订单详情" width="1000px">
			<div v-if="currentOrder">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="订单号" :span="2">
						<span style="font-weight: 500">{{ currentOrder.orderNo }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="订单状态">
						<el-tag v-if="currentOrder.status === 0" type="warning">待付款</el-tag>
						<el-tag v-else-if="currentOrder.status === 1" type="primary">待发货</el-tag>
						<el-tag v-else-if="currentOrder.status === 2" type="info">待收货</el-tag>
						<el-tag v-else-if="currentOrder.status === 3" type="success">已完成</el-tag>
						<el-tag v-else type="danger">已取消</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="支付状态">
						<el-tag :type="currentOrder.payStatus === 1 ? 'success' : 'info'">
							{{ currentOrder.payStatus === 1 ? '已支付' : '未支付' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="总金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
					<el-descriptions-item label="运费">¥{{ currentOrder.freight }}</el-descriptions-item>
					<el-descriptions-item label="优惠金额">¥{{ currentOrder.discountAmount }}</el-descriptions-item>
					<el-descriptions-item label="实付金额">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentOrder.payAmount }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="支付方式">
						<span v-if="currentOrder.payType === 'wechat'">微信支付</span>
						<span v-else-if="currentOrder.payType === 'alipay'">支付宝</span>
						<span v-else>-</span>
					</el-descriptions-item>
					<el-descriptions-item label="支付时间">{{ currentOrder.payTime || '-' }}</el-descriptions-item>
					<el-descriptions-item label="收货人">{{ currentOrder.receiverName }}</el-descriptions-item>
					<el-descriptions-item label="联系电话">{{ currentOrder.receiverPhone }}</el-descriptions-item>
					<el-descriptions-item label="收货地址" :span="2">
						{{ currentOrder.receiverProvince }} {{ currentOrder.receiverCity }} {{ currentOrder.receiverDistrict }} {{ currentOrder.receiverAddress }}
					</el-descriptions-item>
					<el-descriptions-item label="订单备注" :span="2">
						{{ currentOrder.remark || '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="发货时间" v-if="currentOrder.shipTime">
						{{ currentOrder.shipTime }}
					</el-descriptions-item>
					<el-descriptions-item label="完成时间" v-if="currentOrder.finishTime">
						{{ currentOrder.finishTime }}
					</el-descriptions-item>
					<el-descriptions-item label="取消时间" v-if="currentOrder.cancelTime">
						{{ currentOrder.cancelTime }}
					</el-descriptions-item>
					<el-descriptions-item label="取消原因" :span="2" v-if="currentOrder.cancelReason">
						{{ currentOrder.cancelReason }}
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentOrder.updateTime }}</el-descriptions-item>
				</el-descriptions>

				<!-- 订单商品 -->
				<el-divider>订单商品</el-divider>
				<el-table :data="currentOrder.items" border style="margin-bottom: 20px">
					<el-table-column label="商品图片" width="100">
						<template #default="{ row }">
							<el-image
								:src="row.productImage"
								:preview-src-list="[row.productImage]"
								fit="cover"
								style="width: 60px; height: 60px; border-radius: 4px"
							/>
						</template>
					</el-table-column>
					<el-table-column label="商品名称" prop="productTitle" min-width="200" />
					<el-table-column label="规格" prop="skuName" width="150">
						<template #default="{ row }">
							{{ row.skuName || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="单价" width="100">
						<template #default="{ row }">
							¥{{ row.price }}
						</template>
					</el-table-column>
					<el-table-column label="数量" prop="quantity" width="80" />
					<el-table-column label="小计" width="120">
						<template #default="{ row }">
							<span style="color: #f56c6c; font-weight: 500">¥{{ row.totalAmount }}</span>
						</template>
					</el-table-column>
				</el-table>

				<!-- 订单日志 -->
				<el-divider>订单日志</el-divider>
				<el-timeline v-if="currentOrder.logs && currentOrder.logs.length > 0">
					<el-timeline-item
						v-for="log in currentOrder.logs"
						:key="log.id"
						:timestamp="log.createTime"
						placement="top"
					>
						<div>
							<div style="font-weight: 500">{{ log.operateType }}</div>
							<div style="color: #999; font-size: 12px">{{ log.operateContent }}</div>
							<div style="color: #999; font-size: 12px">操作人: {{ log.operatorName || '系统' }}</div>
						</div>
					</el-timeline-item>
				</el-timeline>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="order-order">
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const statusFilter = ref<number | undefined>();
const payStatusFilter = ref<number | undefined>();
const detailVisible = ref(false);
const currentOrder = ref<any>(null);

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '订单号', prop: 'orderNo', width: 180 },
		{ label: '收货人', prop: 'receiverName', width: 120 },
		{ label: '联系电话', prop: 'receiverPhone', width: 120 },
		{ label: '实付金额', prop: 'payAmount', width: 100 },
		{ label: '订单状态', prop: 'status', width: 100, dict: [
			{ label: '待付款', value: 0, type: 'warning' },
			{ label: '待发货', value: 1, type: 'primary' },
			{ label: '待收货', value: 2, type: 'info' },
			{ label: '已完成', value: 3, type: 'success' },
			{ label: '已取消', value: 4, type: 'danger' }
		]},
		{ label: '支付状态', prop: 'payStatus', width: 100, dict: [
			{ label: '未支付', value: 0, type: 'info' },
			{ label: '已支付', value: 1, type: 'success' }
		]},
		{ label: '创建时间', prop: 'createTime', width: 160 }
	]
});

const Crud = useCrud(
	{
		service: service.order.order
	},
	(app) => {
		app.refresh();
	}
);

function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该订单吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.order.order.delete({ ids: [row.id] }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleMultiDelete() {
	const selection = Table.value?.getSelectionRows();
	if (!selection || selection.length === 0) {
		ElMessage.warning('请先选择要删除的数据');
		return;
	}
	ElMessageBox.confirm(`确定删除选中的 ${selection.length} 条订单吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			const ids = selection.map((item: any) => item.id);
			service.order.order.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		status: statusFilter.value,
		payStatus: payStatusFilter.value
	});
}

async function viewDetail(row: any) {
	try {
		const res = await service.order.order.detail({ id: row.id });
		currentOrder.value = res;
		detailVisible.value = true;
	} catch (e) {
		ElMessage.error('获取订单详情失败');
	}
}

function ship(row: any) {
	ElMessageBox.confirm('确定要为该订单发货吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.order.order.ship({ id: row.id }).then(() => {
				ElMessage.success('发货成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function cancel(row: any) {
	ElMessageBox.prompt('请输入取消原因', '取消订单', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputType: 'textarea',
		inputValidator: (value) => {
			if (!value || value.trim() === '') {
				return '请输入取消原因';
			}
			return true;
		}
	})
		.then(({ value }) => {
			service.order.order.cancel({ id: row.id, reason: value }).then(() => {
				ElMessage.success('取消成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}
</script>
