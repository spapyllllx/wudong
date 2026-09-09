<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #column-image="{ scope }">
					<el-image
						v-if="scope.row.image"
						:src="scope.row.image"
						style="width: 120px; height: 56px; border-radius: 4px"
						fit="cover"
						:preview-src-list="[scope.row.image]"
						preview-teleported
					/>
					<el-tag v-else size="small" type="info">无图</el-tag>
				</template>
			</cl-table>
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
	name: 'clothing-banner'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { reactive } from 'vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '启用', value: 'active', type: 'success' },
		{ label: '停用', value: 'inactive', type: 'danger' }
	],
	linkType: [
		{ label: '商品跳转', value: 'product' },
		{ label: 'URL 跳转', value: 'url' },
		{ label: '无跳转', value: '' }
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
			label: '图片',
			prop: 'image',
			width: 140
		},
		{
			label: '标题',
			prop: 'title',
			minWidth: 180
		},
		{
			label: '跳转类型',
			prop: 'link_type',
			minWidth: 100
		},
		{
			label: '跳转值',
			prop: 'link_value',
			minWidth: 90
		},
		{
			label: '位置',
			prop: 'position',
			minWidth: 90
		},
		{
			label: '排序',
			prop: 'sort',
			minWidth: 70
		},
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 90
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
			label: '标题',
			prop: 'title',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '图片',
			prop: 'image',
			component: { name: 'cl-upload' },
			required: true
		},
		{
			label: '跳转类型',
			prop: 'linkType',
			component: {
				name: 'el-select',
				options: options.linkType
			}
		},
		{
			label: '跳转值(商品ID/URL)',
			prop: 'linkValue',
			component: { name: 'el-input' }
		},
		{
			label: '位置',
			prop: 'position',
			value: 'home',
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
		service: service.clothing.banner
	},
	app => {
		app.refresh();
	}
);
</script>
