<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="parentFilter"
				placeholder="父分类筛选"
				clearable
				style="width: 150px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="一级分类" :value="0" />
				<el-option
					v-for="cat in topCategories"
					:key="cat.id"
					:label="cat.name"
					:value="cat.id"
				/>
			</el-select>
			<cl-search-key placeholder="搜索分类名称" />
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

<script lang="ts" setup name="product-category">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, computed, onMounted } from 'vue';

const { service } = useCool();

const allCategories = ref<any[]>([]);
const parentFilter = ref<number | undefined>();

const topCategories = computed(() =>
	allCategories.value.filter((c) => c.parentId === 0)
);

async function loadCategories() {
	try {
		const res: any = await service.product.category.list();
		allCategories.value = res || [];
	} catch (e) {
		console.error('加载分类失败', e);
	}
}

function getParentName(parentId: number) {
	if (parentId === 0) return '-';
	const parent = allCategories.value.find((c) => c.id === parentId);
	return parent ? parent.name : '-';
}

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: 'ID', prop: 'id', width: 80 },
		{
			label: '图标',
			prop: 'icon',
			width: 80,
			component: { name: 'cl-image', props: { size: 40 } }
		},
		{ label: '分类名称', prop: 'name', minWidth: 180 },
		{
			label: '层级',
			prop: 'parentId',
			width: 120,
			formatter: (row: any) => (row.parentId === 0 ? '一级分类' : '二级分类')
		},
		{
			label: '父分类',
			width: 150,
			formatter: (row: any) => getParentName(row.parentId)
		},
		{ label: '排序', prop: 'sort', width: 80 },
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '禁用', value: 0, type: 'danger' },
				{ label: '启用', value: 1, type: 'success' }
			]
		},
		{ label: '创建时间', prop: 'createTime', width: 160 },
		{
			type: 'op',
			width: 240,
			buttons: ({ scope }: any) => [
				{
					label: scope.row.status === 1 ? '禁用' : '启用',
					type: scope.row.status === 1 ? 'warning' : 'success',
					onClick: () => toggleStatus(scope.row)
				},
				'edit',
				'delete'
			]
		}
	]
});

const Upsert = useUpsert({
	items: [
		{ label: '分类名称', prop: 'name', required: true, component: { name: 'el-input' } },
		{
			label: '父分类',
			prop: 'parentId',
			value: 0,
			component: {
				name: 'el-select',
				options: [] as any[]
			}
		},
		{ label: '分类图标', prop: 'icon', component: { name: 'cl-upload' } },
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0, controlsPosition: 'right' } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '禁用', value: 0 },
					{ label: '启用', value: 1 }
				]
			}
		}
	],
	onOpen() {
		const item = Upsert.value?.items?.find((i: any) => i.prop === 'parentId');
		if (item && item.component) {
			(item.component as any).options = [
				{ label: '一级分类', value: 0 },
				...topCategories.value.map((c) => ({ label: c.name, value: c.id }))
			];
		}
	}
});

const Crud = useCrud(
	{
		service: service.product.category
	},
	(app) => {
		app.refresh();
	}
);

function handleAdd() {
	Crud.value?.rowAppend();
}

function handleMultiDelete() {
	const selection = Table.value?.getSelectionRows();
	if (!selection || selection.length === 0) {
		ElMessage.warning('请先选择要删除的数据');
		return;
	}
	ElMessageBox.confirm(`确定删除选中的 ${selection.length} 条数据吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			const ids = selection.map((item: any) => item.id);
			service.product.category.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
				loadCategories();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		parentId: parentFilter.value
	});
}

function toggleStatus(row: any) {
	const status = row.status === 1 ? 0 : 1;
	service.product.category.update({ id: row.id, status }).then(() => {
		ElMessage.success(status === 1 ? '已启用' : '已禁用');
		row.status = status;
		loadCategories();
	});
}

onMounted(() => {
	loadCategories();
});
</script>
