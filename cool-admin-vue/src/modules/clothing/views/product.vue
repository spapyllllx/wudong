<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="categoryFilter"
				placeholder="分类筛选"
				clearable
				style="width: 150px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option
					v-for="cat in categoryList"
					:key="cat.id"
					:label="cat.name"
					:value="cat.id"
				/>
			</el-select>
			<el-select
				v-model="statusFilter"
				placeholder="状态筛选"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="下架" :value="0" />
				<el-option label="上架" :value="1" />
			</el-select>
			<el-select
				v-model="recommendFilter"
				placeholder="推荐筛选"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="非推荐" :value="0" />
				<el-option label="推荐" :value="1" />
			</el-select>
			<cl-search-key placeholder="搜索标题" />
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

<script lang="ts" setup name="product-list">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, h } from 'vue';
import { ElImage, ElTag, ElRate } from 'element-plus';

const { service } = useCool();

const categoryList = ref<any[]>([]);
const categoryFilter = ref<number | undefined>();
const statusFilter = ref<number | undefined>();
const recommendFilter = ref<number | undefined>();

async function loadCategories() {
	try {
		const res: any = await service.product.category.list();
		categoryList.value = res || [];
	} catch (e) {
		console.error('加载分类失败', e);
	}
}

function getCategoryName(id: number) {
	const cat = categoryList.value.find((c) => c.id === id);
	return cat ? cat.name : '-';
}

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{
			label: '主图',
			prop: 'mainImage',
			width: 100,
			component: { name: 'cl-image', props: { size: 60 } }
		},
		{ label: '商品标题', prop: 'title', minWidth: 200, showOverflowTooltip: true },
		{
			label: '分类',
			prop: 'categoryId',
			width: 120,
			formatter: (row: any) => getCategoryName(row.categoryId)
		},
		{ label: '价格', prop: 'price', width: 100 },
		{ label: '库存', prop: 'stock', width: 80 },
		{ label: '销量', prop: 'sales', width: 80 },
		{ label: '浏览', prop: 'viewCount', width: 80 },
		{ label: '收藏', prop: 'favoriteCount', width: 80 },
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '下架', value: 0, type: 'info' },
				{ label: '上架', value: 1, type: 'success' }
			]
		},
		{
			label: '推荐',
			prop: 'isRecommend',
			width: 90,
			dict: [
				{ label: '否', value: 0 },
				{ label: '是', value: 1, type: 'danger' }
			]
		},
		{ label: '创建时间', prop: 'createTime', width: 160 },
		{
			type: 'op',
			width: 320,
			buttons: ({ scope }: any) => [
				{
					label: scope.row.status === 1 ? '下架' : '上架',
					type: scope.row.status === 1 ? 'warning' : 'success',
					onClick: () => toggleStatus(scope.row)
				},
				{
					label: scope.row.isRecommend === 1 ? '取消推荐' : '推荐',
					type: scope.row.isRecommend === 1 ? 'info' : 'danger',
					onClick: () => toggleRecommend(scope.row)
				},
				'edit',
				'delete'
			]
		}
	]
});

const Upsert = useUpsert({
	items: [
		{
			label: '商品分类',
			prop: 'categoryId',
			required: true,
			component: {
				name: 'el-select',
				options: [] as any[]
			}
		},
		{ label: '商品标题', prop: 'title', required: true, component: { name: 'el-input' } },
		{ label: '副标题', prop: 'subtitle', component: { name: 'el-input' } },
		{
			label: '主图',
			prop: 'mainImage',
			required: true,
			component: { name: 'cl-upload' }
		},
		{
			label: '图片列表',
			prop: 'images',
			component: { name: 'cl-upload', props: { multiple: true, limit: 9 } }
		},
		{
			label: '价格',
			prop: 'price',
			required: true,
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2, controlsPosition: 'right' }
			}
		},
		{
			label: '原价',
			prop: 'originalPrice',
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2, controlsPosition: 'right' }
			}
		},
		{
			label: '库存',
			prop: 'stock',
			required: true,
			value: 0,
			component: { name: 'el-input-number', props: { min: 0, controlsPosition: 'right' } }
		},
		{
			label: '商品详情',
			prop: 'detail',
			component: { name: 'cl-editor-wang' }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '下架', value: 0 },
					{ label: '上架', value: 1 }
				]
			}
		},
		{
			label: '是否推荐',
			prop: 'isRecommend',
			value: 0,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '否', value: 0 },
					{ label: '是', value: 1 }
				]
			}
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0, controlsPosition: 'right' } }
		}
	],
	onOpen() {
		const item = Upsert.value?.items?.find((i: any) => i.prop === 'categoryId');
		if (item && item.component) {
			(item.component as any).options = categoryList.value.map((c) => ({
				label: c.name,
				value: c.id
			}));
		}
	}
});

const Crud = useCrud(
	{
		service: service.product.product
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
			service.product.product.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		categoryId: categoryFilter.value,
		status: statusFilter.value,
		isRecommend: recommendFilter.value
	});
}

function toggleStatus(row: any) {
	const status = row.status === 1 ? 0 : 1;
	service.product.product.updateStatus({ id: row.id, status }).then(() => {
		ElMessage.success(status === 1 ? '已上架' : '已下架');
		row.status = status;
	});
}

function toggleRecommend(row: any) {
	const isRecommend = row.isRecommend === 1 ? 0 : 1;
	service.product.product.setRecommend({ id: row.id, isRecommend }).then(() => {
		ElMessage.success(isRecommend === 1 ? '已设为推荐' : '已取消推荐');
		row.isRecommend = isRecommend;
	});
}

onMounted(() => {
	loadCategories();
});
</script>
