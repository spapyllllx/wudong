<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
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

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-category'
});

import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { reactive } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '启用', value: 'active', type: 'success' },
		{ label: '停用', value: 'inactive', type: 'danger' }
	]
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '分类名称',
			prop: 'name',
			minWidth: 140
		},
		{
			label: '图标',
			prop: 'icon',
			minWidth: 120
		},
		{
			label: '排序',
			prop: 'sort',
			minWidth: 80
		},
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 90
		},
		{
			label: '创建时间',
			prop: 'created_at',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op'
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: '分类名称',
			prop: 'name',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '分类图标',
			prop: 'icon',
			component: { name: 'el-input' }
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 'active',
			component: {
				name: 'el-radio-group',
				options: options.status
			}
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.clothing.category
	},
	app => {
		app.refresh();
	}
);
</script>
