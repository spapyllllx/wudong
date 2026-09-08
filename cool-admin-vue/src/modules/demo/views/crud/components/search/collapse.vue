<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>collapse</el-tag>
			<span>折叠</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['search/collapse.vue']" />

			<!-- 折叠表格组件 -->
			<cl-dialog v-model="visible" title="折叠" width="80%">
				<cl-crud ref="Crud">
					<!--【collapse】折叠参数，【inline】是否行内 -->
					<cl-search ref="Search" reset-btn collapse :inline="false" />

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-12-26</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { ref } from 'vue';
import { useDict } from '/$/dict';
import { range } from 'lodash-es';

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		service: 'test'
	},
	app => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ['refresh'],

	columns: [
		{
			label: '姓名',
			prop: 'name',
			minWidth: 140
		},
		{
			label: '手机号',
			prop: 'phone',
			minWidth: 140
		},
		{
			label: '工作',
			prop: 'occupation',
			dict: dict.get('occupation'),
			minWidth: 140
		},
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc'
		}
	]
});

// cl-search 配置
const Search = useSearch({
	items: [
		...range(20).map(i => {
			return {
				label: '输入框',
				prop: `T${i + 1}`,
				component: {
					name: 'el-input'
				}
			};
		})
	]
});

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
x
