<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />

			<!-- 搜索 -->
			<cl-search ref="Search" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'user-list'
});

import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { useI18n } from 'vue-i18n';
import { useCool } from '/@/cool';
import { reactive } from 'vue';

const { t } = useI18n();
const { service } = useCool();

const options = reactive({
	loginType: [
		{
			label: t('小程序'),
			value: 0,
			type: 'danger'
		},
		{
			label: t('公众号'),
			value: 1,
			type: 'success'
		},
		{
			label: t('H5'),
			value: 2
		}
	],
	gender: [
		{
			label: t('未知'),
			value: 0,
			type: 'info'
		},
		{
			label: t('男'),
			value: 1,
			type: 'success'
		},
		{
			label: t('女'),
			value: 2,
			type: 'danger'
		}
	],
	status: [
		{
			label: t('禁用'),
			value: 0,
			type: 'danger'
		},
		{
			label: t('正常'),
			value: 1,
			type: 'success'
		},
		{
			label: t('已注销'),
			value: 2,
			type: 'warning'
		}
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
			label: t('昵称'),
			prop: 'nickName',
			minWidth: 150
		},
		{
			label: t('头像'),
			prop: 'avatarUrl',
			minWidth: 100,
			component: {
				name: 'cl-avatar'
			}
		},
		{
			label: t('手机号'),
			prop: 'phone',
			minWidth: 120
		},
		{
			label: t('性别'),
			prop: 'gender',
			dict: options.gender,
			minWidth: 120
		},
		{
			label: t('登录方式'),
			prop: 'loginType',
			dict: options.loginType,
			minWidth: 120
		},
		{
			label: t('状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{
			label: t('创建时间'),
			prop: 'createTime',
			sortable: 'desc',
			minWidth: 170
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
			prop: 'avatarUrl',
			label: t('头像'),
			component: { name: 'cl-upload' }
		},
		{
			prop: 'nickName',
			label: t('昵称'),
			component: { name: 'el-input' },
			required: true
		},
		{
			prop: 'phone',
			label: t('手机号'),
			component: {
				name: 'el-input',
				props: {
					maxlength: 11
				}
			}
		},
		{
			prop: 'gender',
			label: t('性别'),
			value: 1,
			component: {
				name: 'el-radio-group',
				options: options.gender
			}
		},
		{
			prop: 'status',
			label: t('状态'),
			value: 1,
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
		service: service.user.info
	},
	app => {
		app.refresh();
	}
);
</script>
