<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>setFocus</el-tag>
			<span>自动聚焦</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/setFocus.vue']" />

			<!-- 自定义表单组件 -->
			<cl-form ref="Form"></cl-form>
		</div>

		<div class="f">
			<span class="date">2025-03-12</span>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { useForm } from '@cool-vue/crud';
import { Plugins } from '/#/crud';

const Form = useForm();

function open() {
	Form.value?.open(
		{
			title: '自动聚焦',

			items: [
				{
					label: '昵称',
					prop: 'nickname',
					component: {
						name: 'el-input',

						props: {
							placeholder: '请输入昵称',
							clearable: true
						}
					}
				},
				{
					prop: 'age',
					component: {
						name: 'el-input-number'
					},
					// 默认值，第一次打开有效
					value: 18
				}
			]
		},
		[
			// 【很重要】全局已添加该插件
			// Plugins.Form.setFocus('age'), // 指定自动聚焦的字段
			Plugins.Form.setFocus('') // 禁用自动聚焦
		]
	);
}
</script>
