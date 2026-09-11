<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增商品</el-button>
			<el-button type="danger" @click="handleMultiDelete">批量删除</el-button>
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
					v-for="cat in categories"
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
				<el-option label="上架" :value="1" />
				<el-option label="下架" :value="0" />
			</el-select>
			<cl-search-key placeholder="搜索商品标题" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="主图" width="100">
					<template #default="{ row }">
						<el-image
							v-if="row.mainImage"
							:src="row.mainImage"
							:preview-src-list="[row.mainImage]"
							fit="cover"
							style="width: 70px; height: 70px; border-radius: 4px; cursor: pointer"
						/>
					</template>
				</el-table-column>

				<el-table-column label="商品信息" min-width="250">
					<template #default="{ row }">
						<div>
							<div style="font-weight: 500; margin-bottom: 4px">{{ row.title }}</div>
							<div v-if="row.subtitle" style="font-size: 12px; color: #999; margin-bottom: 4px">
								{{ row.subtitle }}
							</div>
							<el-tag v-if="row.categoryName" size="small" type="info">{{ row.categoryName }}</el-tag>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="价格" width="150">
					<template #default="{ row }">
						<div>
							<div style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ row.price }}</div>
							<div
								v-if="row.originalPrice && row.originalPrice > row.price"
								style="font-size: 12px; color: #999; text-decoration: line-through"
							>
								¥{{ row.originalPrice }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="库存" width="100">
					<template #default="{ row }">
						{{ row.stock }}
					</template>
				</el-table-column>

				<el-table-column label="销量" width="100">
					<template #default="{ row }">
						{{ row.sales }}
					</template>
				</el-table-column>

				<el-table-column label="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="250" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button
							:type="row.status === 1 ? 'warning' : 'success'"
							link
							size="small"
							@click="toggleStatus(row)"
						>
							{{ row.status === 1 ? '下架' : '上架' }}
						</el-button>
						<el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup name="product-product">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';

const { service } = useCool();

const categoryFilter = ref<number | undefined>();
const statusFilter = ref<number | undefined>();
const categories = ref<any[]>([]);

onMounted(async () => {
	await loadCategories();
});

async function loadCategories() {
	try {
		const res = await service.product.category.list();
		categories.value = res.filter((item: any) => item.status === 1);
	} catch (e) {
		console.error('加载分类失败:', e);
	}
}

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '主图', prop: 'mainImage', width: 100 },
		{ label: '商品标题', prop: 'title', minWidth: 250 },
		{ label: '价格', prop: 'price', width: 150 },
		{ label: '库存', prop: 'stock', width: 100 },
		{ label: '销量', prop: 'sales', width: 100 },
		{ label: '状态', prop: 'status', width: 100 },
		{ label: '创建时间', prop: 'createTime', width: 160 }
	]
});

const Upsert = useUpsert({
	width: '900px',
	items: [
		{
			label: '商品标题',
			prop: 'title',
			required: true,
			span: 24,
			component: { name: 'el-input' }
		},
		{
			label: '副标题',
			prop: 'subtitle',
			span: 24,
			component: { name: 'el-input' }
		},
		{
			label: '商品分类',
			prop: 'categoryId',
			required: true,
			span: 12,
			component: {
				name: 'el-select',
				props: { placeholder: '请选择分类' },
				options: () => categories.value.map((item: any) => ({
					label: item.name,
					value: item.id
				}))
			}
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			span: 12,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '价格',
			prop: 'price',
			required: true,
			span: 12,
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '原价',
			prop: 'originalPrice',
			span: 12,
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '库存',
			prop: 'stock',
			value: 0,
			span: 12,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '销量',
			prop: 'sales',
			value: 0,
			span: 12,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '主图',
			prop: 'mainImage',
			required: true,
			span: 24,
			component: { name: 'cl-upload', props: { limit: 1 } }
		},
		{
			label: '商品图片',
			prop: 'images',
			span: 24,
			component: { name: 'cl-upload', props: { limit: 9 } }
		},
		{
			label: '商品详情',
			prop: 'detail',
			span: 24,
			component: { name: 'el-input', props: { type: 'textarea', rows: 6 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '上架', value: 1 },
					{ label: '下架', value: 0 }
				]
			}
		},
		{
			label: '推荐',
			prop: 'isRecommend',
			value: 0,
			span: 12,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '是', value: 1 },
					{ label: '否', value: 0 }
				]
			}
		}
	]
});

const Crud = useCrud({ service: service.product.product }, (app) => {
	app.refresh();
});

function handleAdd() {
	Crud.value?.rowAppend();
}

function handleEdit(row: any) {
	Crud.value?.rowEdit(row);
}

function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.product.product.delete({ ids: [row.id] }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleMultiDelete() {
	const selection = Table.value?.getSelectionRows();
	if (!selection || selection.length === 0) {
		ElMessage.warning('请先选择要删除的商品');
		return;
	}
	ElMessageBox.confirm(`确定删除选中的 ${selection.length} 个商品吗？`, '提示', {
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
		status: statusFilter.value
	});
}

function toggleStatus(row: any) {
	const newStatus = row.status === 1 ? 0 : 1;
	const text = newStatus === 1 ? '上架' : '下架';
	ElMessageBox.confirm(`确定要${text}该商品吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			service.product.product.update({ id: row.id, status: newStatus }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = newStatus;
			});
		})
		.catch(() => {});
}
</script>
