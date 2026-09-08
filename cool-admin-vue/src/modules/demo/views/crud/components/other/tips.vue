<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>tips</el-tag>
			<span>代码类型提示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['other/tips.vue']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="代码类型提示" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<cl-refresh-btn />
						<cl-multi-delete-btn />

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

					<!-- 新增、编辑 -->
					<cl-upsert ref="Upsert" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { ref } from 'vue';
import { useCool } from '/@/cool';

const { service } = useCool();

// cl-crud 配置
const Crud = useCrud(
	{
		service: service.base.sys.user
	},
	app => {
		app.refresh();
	}
);

// cl-table 配置
//【很重要】添加类型标注 <Eps.BaseSysUserEntity>，也可以自定义类型
const Table = useTable<Eps.BaseSysUserEntity>({
	autoHeight: false,
	contextMenu: ['refresh'],

	columns: [
		{
			type: 'selection'
		},
		{
			prop: 'headImg', //【很重要】编辑的时候会提示 BaseSysUserEntity 实体的属性名
			label: '头像',
			component: {
				name: 'cl-avatar'
			},
			minWidth: 140
		},
		{
			prop: 'name',
			label: '姓名',
			minWidth: 150
		},
		{
			prop: 'nickName',
			label: '昵称',
			minWidth: 150
		},
		{
			label: '创建时间',
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op'
		}
	]
});

// cl-upsert 配置
//【很重要】添加类型标注 <Eps.BaseSysUserEntity>，也可以自定义类型
const Upsert = useUpsert<Eps.BaseSysUserEntity>({
	items: [
		{
			prop: 'headImg', //【很重要】编辑的时候会提示 BaseSysUserEntity 实体的属性名
			label: '头像',
			component: {
				name: 'cl-upload',
				props: {
					text: '选择头像'
				}
			}
		},
		{
			prop: 'name',
			label: '姓名',
			span: 12,
			required: true,
			component: {
				name: 'el-input'
			}
		},
		{
			prop: 'username',
			label: '用户名',
			required: true,
			span: 12,
			component: {
				name: 'el-input'
			}
		}
	],
	onSubmit(data, { next }) {
		// 【很重要】data 的类型也会被定义成 BaseSysUserEntity

		next({
			...data,
			title: data.title
		});
	}
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
