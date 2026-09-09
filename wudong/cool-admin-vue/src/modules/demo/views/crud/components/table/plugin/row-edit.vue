<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>rowEdit</el-tag>
			<span>行编辑</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['table/plugin/row-edit.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="行编辑" width="80%">
				<cl-crud ref="Crud">
					<el-text class="mb-4" tag="p">点击姓名、手机号可以进行编辑</el-text>

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
import { useCrud, useTable } from '@cool-vue/crud';
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
			minWidth: 140,
			// 【很重要】行编辑，默认 el-input
			edit: true
		},
		{
			label: '手机号',
			prop: 'phone',
			minWidth: 140,
			// 【很重要】行编辑，开启、关闭
			edit: {
				enable: true
			}
		},
		{
			label: '工作',
			prop: 'occupation',
			dict: dict.get('occupation'),
			minWidth: 140,
			edit: {
				enable: true,
				// 【很重要】行编辑，组件配置
				component: {
					name: 'cl-select',
					props: {
						options: dict.get('occupation'),
						tree: true
					}
				}
			}
		},
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			// 【很重要】行编辑，组件配置
			edit: {
				enable: true,
				component: {
					name: 'el-date-picker',
					props: {
						type: 'date',
						valueFormat: 'YYYY-MM-DD'
					}
				}
			}
		},
		{
			type: 'op',
			buttons: ['delete']
		}
	],

	//【很重要】行编辑插件
	plugins: [Plugins.Table.rowEdit()]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
