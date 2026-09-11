<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-refresh-btn />
			<cl-flex1 />
			<cl-search-key />
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

<script lang="ts" setup name="product-category">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '分类名称', prop: 'name', minWidth: 200 },
		{ label: '排序', prop: 'sort', width: 100 },
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '禁用', value: 0, type: 'danger' },
				{ label: '启用', value: 1, type: 'success' }
			]
		},
		{ label: '创建时间', prop: 'createTime', width: 170 }
	]
});

const Upsert = useUpsert({
	items: [
		{
			label: '分类名称',
			prop: 'name',
			required: true,
			component: { name: 'el-input', props: { placeholder: '请输入分类名称' } }
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '分类图标',
			prop: 'icon',
			component: { name: 'cl-upload', props: { limit: 1 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '启用', value: 1 },
					{ label: '禁用', value: 0 }
				]
			}
		}
	]
});

const Crud = useCrud({ service: service.product.category }, (app) => {
	app.refresh();
});
</script>
