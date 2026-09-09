<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>plugin</el-tag>
			<span>使用插件</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['search/layout.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="使用插件" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-flex1 />
						<!--【很重要】搜索组件 -->
						<cl-search ref="Search" />
					</cl-row>

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
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { ref } from 'vue';
import { useDict } from '/$/dict';
import { Plugins } from '/#/crud';

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
	// 【很重要】自动读取 service 下的 search 数据
	plugins: [
		Plugins.Search.setAuto({
			customComponent(field) {
				if (field.propertyName == 'name') {
					return {
						name: 'cl-select',
						props: {
							options: [
								{
									label: '张三',
									value: '1'
								},
								{
									label: '李四',
									value: '2'
								}
							]
						}
					};
				}

				// null 则不操作，按系统默认操作
				return null;
			}
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
