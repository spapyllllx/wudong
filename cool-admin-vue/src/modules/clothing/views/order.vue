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

		<!-- 发货弹窗 -->
		<cl-dialog v-model="shipVisible" title="订单发货" width="420px">
			<el-descriptions :column="1" border v-if="currentShip">
				<el-descriptions-item label="订单号">{{ currentShip.id }}</el-descriptions-item>
				<el-descriptions-item label="金额">{{ currentShip.total_amount }}元</el-descriptions-item>
			</el-descriptions>
			<el-form label-width="80px" style="margin-top: 12px">
				<el-form-item label="物流公司"><el-input v-model="shipForm.company" placeholder="如:顺丰速运" /></el-form-item>
				<el-form-item label="物流单号"><el-input v-model="shipForm.no" placeholder="运单号" /></el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="shipVisible = false">取消</el-button>
				<el-button type="primary" @click="doShip">确认发货</el-button>
			</template>
		</cl-dialog>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-order'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '待支付', value: 'pending', type: 'warning' },
		{ label: '已支付', value: 'paid', type: 'primary' },
		{ label: '已发货', value: 'shipped', type: 'primary' },
		{ label: '已完成', value: 'completed', type: 'success' },
		{ label: '已取消', value: 'cancelled', type: 'info' },
		{ label: '已退款', value: 'refunded', type: 'danger' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			label: '订单号',
			prop: 'id',
			minWidth: 160
		},
		{
			label: '用户ID',
			prop: 'user_id',
			minWidth: 80
		},
		{
			label: '总金额',
			prop: 'total_amount',
			minWidth: 110
		},
		{
			label: '实付',
			prop: 'paid_amount',
			minWidth: 110
		},
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 100
		},
		{
			label: '支付方式',
			prop: 'payment_method',
			minWidth: 110
		},
		{
			label: '支付流水号',
			prop: 'payment_no',
			minWidth: 170
		},
		{
			label: '创建时间',
			prop: 'created_at',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 110,
			buttons: [
				{
					label: '发货',
					type: 'success',
					onClick({ scope }) {
						if (scope.row.status !== 'paid') {
							return ElMessage.warning('仅已支付订单可发货');
						}
						openShip(scope.row);
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
		service: service.clothing.order
	},
	app => {
		app.refresh();
	}
);

// ---------- 发货 ----------
const shipVisible = ref(false);
const currentShip = ref<any>(null);
const shipForm = reactive({ company: '', no: '' });

function openShip(row: any) {
	currentShip.value = row;
	shipForm.company = '';
	shipForm.no = '';
	shipVisible.value = true;
}

async function doShip() {
	if (!shipForm.company.trim() || !shipForm.no.trim()) {
		return ElMessage.warning('请填写物流公司与单号');
	}
	try {
		await service.clothing.order.ship({
			orderId: currentShip.value.id,
			logisticsCompany: shipForm.company.trim(),
			logisticsNo: shipForm.no.trim()
		});
		ElMessage.success('发货成功');
		shipVisible.value = false;
		Crud.value?.refresh();
	} catch (e: any) {
		ElMessage.error(e.message || '发货失败');
	}
}
</script>
