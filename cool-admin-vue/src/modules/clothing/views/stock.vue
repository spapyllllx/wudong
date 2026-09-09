<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-flex1 />
			<cl-search />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- SKU/图片 编辑(库存调整走这里,保存后更新总库存由服务端维护) -->
		<sku-edit
			v-model:visible="skuVisible"
			:product="currentProduct"
			@saved="Crud?.value?.refresh()"
		/>
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-stock'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable } from '@cool-vue/crud';
import { computed, onMounted, reactive, ref } from 'vue';
import SkuEdit from './components/sku-edit.vue';

const { service } = useCool();

const options = reactive({
	categories: [] as any[]
});

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
			label: '商品标题',
			prop: 'title',
			minWidth: 220
		},
		{
			label: '分类',
			prop: 'categoryName',
			minWidth: 100
		},
		{
			label: '售价',
			prop: 'price',
			minWidth: 90
		},
		{
			label: '总库存',
			prop: 'stock',
			minWidth: 90
		},
		{
			label: '销量',
			prop: 'sales',
			minWidth: 80
		},
		{
			label: '状态',
			prop: 'status',
			minWidth: 80
		},
		{
			type: 'op',
			width: 120,
			buttons: [
				{
					label: '库存管理',
					type: 'warning',
					onClick({ scope }) {
						currentProduct.value = scope.row;
						skuVisible.value = true;
					}
				}
			]
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

// ---------- 库存调整 ----------
const skuVisible = ref(false);
const currentProduct = ref<any>(null);
</script>
