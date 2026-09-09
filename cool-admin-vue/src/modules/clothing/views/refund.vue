<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-flex1 />
			<cl-search />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 审核弹窗 -->
		<cl-dialog v-model="auditVisible" title="退款审核" width="440px">
			<el-descriptions :column="1" border v-if="current">
				<el-descriptions-item label="订单号">{{ current.order_id }}</el-descriptions-item>
				<el-descriptions-item label="退款金额">{{ current.refund_amount }}元</el-descriptions-item>
				<el-descriptions-item label="退款原因">{{ current.reason }}</el-descriptions-item>
			</el-descriptions>
			<el-input v-model="rejectReason" type="textarea" :rows="3" maxlength="255" placeholder="驳回原因(驳回时必填)" style="margin-top: 12px" />
			<template #footer>
				<el-button @click="auditVisible = false">取消</el-button>
				<el-button type="danger" @click="doAudit('reject')">驳回</el-button>
				<el-button type="success" @click="doAudit('approve')">通过并退款</el-button>
			</template>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-refund'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '待审核', value: 'pending', type: 'warning' },
		{ label: '已通过', value: 'approved', type: 'success' },
		{ label: '已驳回', value: 'rejected', type: 'danger' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			label: '退款单号',
			prop: 'id',
			minWidth: 90
		},
		{
			label: '订单号',
			prop: 'order_id',
			minWidth: 170
		},
		{
			label: '用户ID',
			prop: 'user_id',
			minWidth: 80
		},
		{
			label: '退款金额',
			prop: 'refund_amount',
			minWidth: 110
		},
		{
			label: '原因',
			prop: 'reason',
			minWidth: 160
		},
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 100
		},
		{
			label: '驳回原因',
			prop: 'reject_reason',
			minWidth: 130
		},
		{
			label: '申请时间',
			prop: 'created_at',
			minWidth: 170
		},
		{
			type: 'op',
			width: 120,
			buttons: [
				{
					label: '审核',
					type: 'warning',
					onClick({ scope }) {
						openAudit(scope.row);
					}
				}
			]
		}
	]
});

// cl-search
const Search = useSearch({
	columns: [
		{
			label: '状态',
			prop: 'status',
			component: {
				name: 'el-select',
				options: options.status
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.clothing.refund
	},
	app => {
		app.refresh();
	}
);

// ---------- 审核 ----------
const auditVisible = ref(false);
const current = ref<any>(null);
const rejectReason = ref('');

function openAudit(row: any) {
	current.value = row;
	rejectReason.value = '';
	auditVisible.value = true;
}

async function doAudit(op: 'approve' | 'reject') {
	if (op === 'reject' && !rejectReason.value.trim()) {
		return ElMessage.warning('驳回时请填写原因');
	}
	try {
		if (op === 'approve') {
			await service.clothing.refund.approve({ id: current.value.id });
		} else {
			await service.clothing.refund.reject({ id: current.value.id, reason: rejectReason.value.trim() });
		}
		ElMessage.success(op === 'approve' ? '已通过并退款(库存已回补)' : '已驳回');
		auditVisible.value = false;
		Crud.value?.refresh();
	} catch (e: any) {
		ElMessage.error(e.message || '操作失败');
	}
}
</script>
