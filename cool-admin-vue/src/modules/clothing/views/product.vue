<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<!-- 主图 -->
				<template #column-main_image="{ scope }">
					<el-image
						v-if="scope.row.main_image"
						:src="scope.row.main_image"
						style="width: 56px; height: 56px; border-radius: 4px"
						fit="cover"
						:preview-src-list="[scope.row.main_image]"
						preview-teleported
					/>
					<el-tag v-else size="small" type="info">无图</el-tag>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- SKU/图片 可视化编辑(组件) -->
		<sku-edit
			v-model:visible="skuVisible"
			:product="currentProduct"
			@saved="Crud?.value?.refresh()"
		/>

		<!-- 商品详情(只读) -->
		<cl-dialog v-model="visible" title="商品详情" width="720px">
			<template v-if="detail">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="商品标题">{{ detail.title }}</el-descriptions-item>
					<el-descriptions-item label="分类">{{ detail.category_name || '-' }}</el-descriptions-item>
					<el-descriptions-item label="售价">{{ detail.price }}元</el-descriptions-item>
					<el-descriptions-item label="市场价">{{ detail.market_price ? detail.market_price + '元' : '-' }}</el-descriptions-item>
					<el-descriptions-item label="总库存">{{ detail.stock }}</el-descriptions-item>
					<el-descriptions-item label="销量">{{ detail.sales }}</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag v-if="detail.status === 'on_sale'" type="success" size="small">在售</el-tag>
						<el-tag v-else type="info" size="small">下架</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="评分/评价数">
						{{ detail.rating ?? 0 }} 分 / {{ detail.review_count ?? 0 }} 条
					</el-descriptions-item>
					<el-descriptions-item label="工艺介绍" :span="2">{{ detail.craft_intro || '-' }}</el-descriptions-item>
				</el-descriptions>

				<h4 style="margin: 14px 0 6px">商品详情(HTML)</h4>
				<div v-if="detail.detail" style="border: 1px solid #ebeef5; border-radius: 4px; padding: 10px" v-html="detail.detail" />
				<el-empty v-else description="暂无详情内容" :image-size="50" />
			</template>
		</cl-dialog>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-product'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { computed, onMounted, reactive, ref } from 'vue';
import SkuEdit from './components/sku-edit.vue';

const { service } = useCool();

const options = reactive({
	status: [
		{ label: '在售', value: 'on_sale', type: 'success' },
		{ label: '下架', value: 'off_sale', type: 'danger' }
	],
	categories: [] as any[]
});

// 分类下拉选项
const categoryOptions = computed(() =>
	options.categories.map((c: any) => ({ label: c.name, value: c.id }))
);

onMounted(async () => {
	try {
		const res: any = await service.clothing.category.list({});
		options.categories = (res || []).filter((c: any) => c.status === 'active');
	} catch (e) {
		options.categories = [];
	}
});

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '主图',
			prop: 'main_image',
			width: 90
		},
		{
			label: '商品标题',
			prop: 'title',
			minWidth: 180
		},
		{
			label: '分类',
			prop: 'categoryName',
			minWidth: 100
		},
		{
			label: '售价',
			prop: 'price',
			minWidth: 100
		},
		{
			label: '库存',
			prop: 'stock',
			minWidth: 70
		},
		{
			label: '销量',
			prop: 'sales',
			minWidth: 70
		},
		{
			label: '状态',
			prop: 'status',
			dict: options.status,
			minWidth: 80
		},
		{
			label: '创建时间',
			prop: 'created_at',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 300,
			buttons: [
				{
					label: '查看',
					type: 'success',
					onClick({ scope }) {
						showDetail(scope.row);
					}
				},
				{
					label: '修改',
					type: 'warning',
					onClick({ scope }) {
						editProduct(scope.row);
					}
				},
				{
					label: 'SKU/图片',
					type: 'primary',
					onClick({ scope }) {
						openSkuEdit(scope.row);
					}
				}
			]
		}
	]
});

/**
 * 列表行(snake_case 键)→ upsert 表单(camelCase 键),供「修改」回显。
 * 说明:行数据来自 page 接口的 a.*(snake_case),而表单 prop 是 camelCase,
 * 且 categoryId/mainImage/marketPrice/craftIntro 等字段没有同名兜底,
 * 需在此显式转换后经 onInfo 回填(避免自动 info 回显把这几项清空)。
 */
function mapRowToForm(row: any) {
	const num = (v: any) => (v === null || v === undefined ? undefined : Number(v));
	return {
		id: row.id,
		title: row.title ?? '',
		subtitle: row.subtitle ?? '',
		categoryId: row.category_id,
		mainImage: row.main_image || '',
		price: num(row.price),
		marketPrice: num(row.market_price),
		stock: num(row.stock) ?? 0,
		status: row.status || 'on_sale',
		craftIntro: row.craft_intro || '',
		detail: row.detail || ''
	};
}

// cl-upsert(新增/编辑主字段;SKU/图片用 SKU/图片 按钮可视化维护)
const Upsert = useUpsert({
	// 「修改」走 edit() 的 info 回显流程,这里改为直接回填当前行(不再请求 info 接口,
	// 避免 snake_case 键无法命中表单 camelCase prop 导致主图/分类/市场价等丢失)
	onInfo(data, { done }) {
		done(mapRowToForm(data));
	},
	items: [
		{
			label: '商品标题',
			prop: 'title',
			component: { name: 'el-input' },
			required: true
		},
		{
			label: '分类',
			prop: 'categoryId',
			component: {
				name: 'cl-select',
				props: {
					options: categoryOptions
				}
			},
			required: true
		},
		{
			label: '副标题',
			prop: 'subtitle',
			component: { name: 'el-input' }
		},
		{
			label: '主图',
			prop: 'mainImage',
			component: { name: 'cl-upload' },
			required: true
		},
		{
			label: '售价(元)',
			prop: 'price',
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2 }
			},
			required: true
		},
		{
			label: '市场价(元)',
			prop: 'marketPrice',
			component: {
				name: 'el-input-number',
				props: { min: 0, precision: 2 }
			}
		},
		{
			label: '总库存',
			prop: 'stock',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 'on_sale',
			component: {
				name: 'el-radio-group',
				options: options.status
			}
		},
		{
			label: '工艺介绍',
			prop: 'craftIntro',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 2 }
			}
		},
		{
			label: '商品详情(HTML)',
			prop: 'detail',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 4 }
			}
		}
	]
});

// cl-search
const Search = useSearch({
	columns: [
		{
			label: '关键词',
			prop: 'keyWord',
			component: { name: 'el-input', props: { placeholder: '商品标题' } }
		},
		{
			label: '状态',
			prop: 'status',
			component: {
				name: 'el-select',
				options: options.status
			}
		},
		{
			label: '分类',
			prop: 'categoryId',
			component: {
				name: 'cl-select',
				props: { options: categoryOptions }
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.clothing.product
	},
	app => {
		app.refresh();
	}
);

// ---------- 详情(只读) ----------
const visible = ref(false);
const detail = ref<any>(null);

async function showDetail(row: any) {
	const res: any = await service.clothing.product.detail({ id: row.id });
	detail.value = res;
	visible.value = true;
}

// ---------- 修改(主字段,update 模式;回显键转换见 Upsert.onInfo) ----------
function editProduct(row: any) {
	(Upsert.value as any)?.edit(row);
}

// ---------- SKU/图片 编辑 ----------
const skuVisible = ref(false);
const currentProduct = ref<any>(null);

function openSkuEdit(row: any) {
	currentProduct.value = row;
	skuVisible.value = true;
}
</script>
