<template>
	<cl-crud ref="Crud">
		<cl-row>
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

<script lang="ts" setup name="product-review">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '用户昵称', prop: 'userNickName', width: 150 },
		{ label: '商品ID', prop: 'productId', width: 100 },
		{ label: '评分', prop: 'rating', width: 100 },
		{ label: '评价内容', prop: 'content', minWidth: 300 },
		{ label: '点赞数', prop: 'likeCount', width: 100 },
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '待审核', value: 0, type: 'warning' },
				{ label: '已发布', value: 1, type: 'success' },
				{ label: '已删除', value: 2, type: 'danger' }
			]
		},
		{ label: '创建时间', prop: 'createTime', width: 170 }
	]
});

const Upsert = useUpsert({
	items: [
		{
			label: '状态',
			prop: 'status',
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '待审核', value: 0 },
					{ label: '已发布', value: 1 },
					{ label: '已删除', value: 2 }
				]
			}
		}
	]
});

const Crud = useCrud({ service: service.product.review }, (app) => {
	app.refresh();
});
</script>
