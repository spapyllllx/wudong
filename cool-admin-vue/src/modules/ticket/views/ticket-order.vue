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
				<el-option label="待使用" :value="1" />
				<el-option label="已使用" :value="2" />
				<el-option label="已完成" :value="3" />
				<el-option label="已取消" :value="4" />
				<el-option label="已退款" :value="5" />
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
			<cl-search-key placeholder="搜索订单号/联系人/手机号" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="订单号" prop="orderNo" width="180" />

				<el-table-column label="景点信息" width="200">
					<template #default="{ row }">
						<div>
							<div style="font-weight: 500">{{ row.attractionName }}</div>
							<div style="font-size: 12px; color: #999; margin-top: 4px">{{ row.ticketTypeName }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="联系人" width="150">
					<template #default="{ row }">
						<div>
							<div>{{ row.contactName }}</div>
							<div style="font-size: 12px; color: #999">{{ row.contactPhone }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="使用日期" prop="useDate" width="120" />

				<el-table-column label="数量" width="80">
					<template #default="{ row }">
						{{ row.quantity }} 张
					</template>
				</el-table-column>

				<el-table-column label="金额" width="120">
					<template #default="{ row }">
						<div style="color: #f56c6c; font-weight: 500">实付: ¥{{ row.payAmount }}</div>
					</template>
				</el-table-column>

				<el-table-column label="订单状态" width="100">
					<template #default="{ row }">
						<el-tag v-if="row.status === 0" type="warning">待付款</el-tag>
						<el-tag v-else-if="row.status === 1" type="primary">待使用</el-tag>
						<el-tag v-else-if="row.status === 2" type="success">已使用</el-tag>
						<el-tag v-else-if="row.status === 3" type="info">已完成</el-tag>
						<el-tag v-else-if="row.status === 4" type="danger">已取消</el-tag>
						<el-tag v-else type="info">已退款</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="支付状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.payStatus === 1 ? 'success' : 'info'">
							{{ row.payStatus === 1 ? '已支付' : '未支付' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="创建时间" prop="createTime" width="160" />

				<el-table-column label="操作" width="300" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
						<el-button v-if="row.status === 1" type="success" size="small" @click="verify(row)">核销</el-button>
						<el-button v-if="row.status === 1" type="warning" size="small" @click="refund(row)">退款</el-button>
						<el-button v-if="row.status < 2" type="danger" size="small" @click="cancel(row)">取消</el-button>
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
		<el-dialog v-model="detailVisible" title="订单详情" width="800px">
			<div v-if="currentOrder">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="订单号" :span="2">
						<span style="font-weight: 500">{{ currentOrder.orderNo }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="景点名称" :span="2">
						{{ currentOrder.attractionName }}
					</el-descriptions-item>
					<el-descriptions-item label="票型名称" :span="2">
						{{ currentOrder.ticketTypeName }}
					</el-descriptions-item>
					<el-descriptions-item label="购买数量">{{ currentOrder.quantity }} 张</el-descriptions-item>
					<el-descriptions-item label="使用日期">{{ currentOrder.useDate }}</el-descriptions-item>
					<el-descriptions-item label="订单状态">
						<el-tag v-if="currentOrder.status === 0" type="warning">待付款</el-tag>
						<el-tag v-else-if="currentOrder.status === 1" type="primary">待使用</el-tag>
						<el-tag v-else-if="currentOrder.status === 2" type="success">已使用</el-tag>
						<el-tag v-else-if="currentOrder.status === 3" type="info">已完成</el-tag>
						<el-tag v-else-if="currentOrder.status === 4" type="danger">已取消</el-tag>
						<el-tag v-else type="info">已退款</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="支付状态">
						<el-tag :type="currentOrder.payStatus === 1 ? 'success' : 'info'">
							{{ currentOrder.payStatus === 1 ? '已支付' : '未支付' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="总金额">¥{{ currentOrder.totalAmount }}</el-descriptions-item>
					<el-descriptions-item label="实付金额">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentOrder.payAmount }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="联系人">{{ currentOrder.contactName }}</el-descriptions-item>
					<el-descriptions-item label="联系电话">{{ currentOrder.contactPhone }}</el-descriptions-item>
					<el-descriptions-item label="身份证号" :span="2">{{ currentOrder.contactIdCard }}</el-descriptions-item>
					<el-descriptions-item label="订单备注" :span="2">
						{{ currentOrder.remark || '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="支付时间" v-if="currentOrder.payTime">
						{{ currentOrder.payTime }}
					</el-descriptions-item>
					<el-descriptions-item label="使用时间" v-if="currentOrder.useTime">
						{{ currentOrder.useTime }}
					</el-descriptions-item>
					<el-descriptions-item label="退款时间" v-if="currentOrder.refundTime">
						{{ currentOrder.refundTime }}
					</el-descriptions-item>
					<el-descriptions-item label="退款原因" :span="2" v-if="currentOrder.refundReason">
						{{ currentOrder.refundReason }}
					</el-descriptions-item>
					<el-descriptions-item label="取消原因" :span="2" v-if="currentOrder.cancelReason">
						{{ currentOrder.cancelReason }}
					</el-descriptions-item>
					<el-descriptions-item label="二维码" :span="2" v-if="currentOrder.qrCode">
						<div style="font-family: monospace; background: #f5f5f5; padding: 8px; border-radius: 4px">
							{{ currentOrder.qrCode }}
						</div>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentOrder.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentOrder.updateTime }}</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="ticket-ticket-order">
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
		{ label: '景点名称', prop: 'attractionName', minWidth: 150 },
		{ label: '票型名称', prop: 'ticketTypeName', minWidth: 150 },
		{ label: '联系人', prop: 'contactName', width: 120 },
		{ label: '数量', prop: 'quantity', width: 80 },
		{ label: '实付金额', prop: 'payAmount', width: 100 },
		{ label: '订单状态', prop: 'status', width: 100, dict: [
			{ label: '待付款', value: 0, type: 'warning' },
			{ label: '待使用', value: 1, type: 'primary' },
			{ label: '已使用', value: 2, type: 'success' },
			{ label: '已完成', value: 3, type: 'info' },
			{ label: '已取消', value: 4, type: 'danger' },
			{ label: '已退款', value: 5, type: 'info' }
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
		service: service.ticket.ticket_order
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
			service.ticket.ticket_order.delete({ ids: [row.id] }).then(() => {
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
			service.ticket.ticket_order.delete({ ids }).then(() => {
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

function viewDetail(row: any) {
	currentOrder.value = row;
	detailVisible.value = true;
}

function verify(row: any) {
	ElMessageBox.confirm('确定要核销该门票吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.ticket.ticket_order.verify({ id: row.id }).then(() => {
				ElMessage.success('核销成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function refund(row: any) {
	ElMessageBox.prompt('请输入退款原因', '退款', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputType: 'textarea',
		inputValidator: (value) => {
			if (!value || value.trim() === '') {
				return '请输入退款原因';
			}
			return true;
		}
	})
		.then(({ value }) => {
			service.ticket.ticket_order.refund({ id: row.id, reason: value }).then(() => {
				ElMessage.success('退款成功');
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
			service.ticket.ticket_order.cancel({ id: row.id, reason: value }).then(() => {
				ElMessage.success('取消成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}
</script>
