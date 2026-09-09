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
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-order'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { reactive } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '待支付', value: 'pending', type: 'warning' },
		{ label: '已支付', value: 'paid', type: 'primary' },
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
</script>
