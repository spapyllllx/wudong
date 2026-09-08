<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>select-table</el-tag>
			<span>选择表格</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/select-table.vue']" />

			<!-- 自定义表格组件 -->
			<cl-form ref="Form" />
		</div>

		<div class="f">
			<span class="date">2025-02-07</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service, refs, setRefs } = useCool();
const Form = useForm();

const columns = [
	{
		label: '头像',
		prop: 'avatarUrl',
		component: {
			name: 'cl-avatar'
		}
	},
	{
		label: '昵称',
		prop: 'nickName'
	},
	{
		label: '创建时间',
		prop: 'createTime'
	}
];

function open() {
	Form.value?.open({
		width: '800px',
		title: '选择表格',
		items: [
			{
				label: '多选 - default',
				prop: 'a',
				value: [],
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'default',
						multiple: true,
						columns,
						service: service.user.info
					}
				},
				span: 12
			},
			{
				label: '单选 - default',
				prop: 'b',
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'default',
						multiple: false,
						columns,
						service: service.user.info
					}
				},
				span: 12
			},
			{
				label: '多选 - text',
				prop: 'c',
				value: [],
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'text',
						multiple: true,
						columns,
						service: service.user.info
					}
				},
				span: 12
			},
			{
				label: '单选 - text',
				prop: 'd',
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'text',
						multiple: false,
						columns,
						service: service.user.info
					}
				},
				span: 12
			},
			{
				label: '回显',
				prop: 'f',
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'default',
						multiple: false,
						columns,
						service: service.user.info
					},
					// 【很重要】设置 ref
					ref: setRefs('selectTable')
				}
			},
			{
				label: '多选 - table',
				prop: 'e',
				value: [],
				component: {
					name: 'cl-select-table',
					props: {
						pickerType: 'table',
						multiple: true,
						columns,
						service: service.user.info
					}
				}
			}
		],
		// useUpsert 中使用 onOpened
		on: {
			open() {
				// 【很重要】设置回显，实际根据接口返回
				refs.selectTable?.set([
					{
						id: 1,
						avatarUrl: 'http://....',
						nickName: '橘子'
					}
				]);
			}
		}
	});
}
</script>
