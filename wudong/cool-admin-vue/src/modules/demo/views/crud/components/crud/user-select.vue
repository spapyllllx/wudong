<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>user-select</el-tag>
			<span>选择成员</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/user-select.vue']" />

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

const Form = useForm();

function open() {
	Form.value?.open({
		title: '选择成员',
		items: [
			{
				label: '单选',
				prop: 'userId',
				component: {
					name: 'cl-user-select',
					props: {
						multiple: false,
						onChange(val) {
							console.log(val);
						}
					}
				},
				required: true
			},
			{
				label: '多选',
				prop: 'userIds',
				component: {
					name: 'cl-user-select',
					props: {
						multiple: true,
						onChange(val) {
							console.log(val);
						}
					}
				},
				required: true
			},
			{
				label: '回显',
				prop: 'testId',
				component: {
					name: 'cl-user-select',
					props: {
						// 【很重要】立即刷新
						immediate: true
					}
				}
			}
		],
		form: {
			// 【很重要】手动设置值，实际根据接口返回
			testId: 2
		}
	});
}
</script>
