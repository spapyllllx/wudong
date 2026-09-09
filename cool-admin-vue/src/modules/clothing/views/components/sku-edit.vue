<template>
	<cl-dialog
		:model-value="visible"
		:title="`SKU 与图片管理 · ${product?.title || ''}`"
		width="780px"
		@close="close"
	>
		<el-tabs v-model="tab">
			<!-- SKU 可视化编辑 -->
			<el-tab-pane label="SKU 列表" name="sku">
				<el-table :data="skus" size="small" border>
					<el-table-column label="SKU 名称" min-width="160">
						<template #default="{ row }">
							<el-input v-model="row.skuName" placeholder="如:银饰-手镯-中号" />
						</template>
					</el-table-column>
					<el-table-column label="价格(元)" width="130">
						<template #default="{ row }">
							<el-input-number v-model="row.price" :min="0" :precision="2" :controls="false" style="width: 100%" />
						</template>
					</el-table-column>
					<el-table-column label="库存" width="120">
						<template #default="{ row }">
							<el-input-number v-model="row.stock" :min="0" :controls="false" style="width: 100%" />
						</template>
					</el-table-column>
					<el-table-column label="属性(JSON)" min-width="200">
						<template #default="{ row }">
							<el-input v-model="row.attrsText" placeholder='{"尺寸":"中号","颜色":"银色"}' />
						</template>
					</el-table-column>
					<el-table-column width="60" align="center">
						<template #default="{ $index }">
							<el-button link type="danger" @click="skus.splice($index, 1)">删</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button style="margin-top: 10px" @click="addSku">+ 添加 SKU</el-button>
			</el-tab-pane>

			<!-- 商品图片 -->
			<el-tab-pane label="商品图片" name="img">
				<div class="img-edit">
					<div v-for="(img, i) in images" :key="i" class="img-row">
						<el-image :src="img" fit="cover" style="width: 56px; height: 56px; border-radius: 4px" />
						<el-input v-model="images[i]" placeholder="图片 URL" style="flex: 1" />
						<el-button link type="danger" @click="images.splice(i, 1)">删除</el-button>
					</div>
					<el-button style="margin-top: 10px" @click="addImage">+ 添加图片</el-button>
					<div style="margin-top: 12px; color: #909399; font-size: 12px">
						上传方式:在「商品管理」新增/编辑表单的主图组件上传后,把返回的 URL 粘贴到此处;或用任意图片外链。
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>

		<template #footer>
			<el-button @click="close">关闭</el-button>
			<el-button type="primary" :loading="saving" @click="save">保存 SKU/图片</el-button>
		</template>
	</cl-dialog>
</template>

<script lang="ts" setup>
import { useCool } from '/@/cool';
import { ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
	visible: boolean;
	product: any;
}>();

const emit = defineEmits(['update:visible', 'saved']);

const { service } = useCool();

const tab = ref('sku');
const saving = ref(false);
const skus = ref<any[]>([]);
const images = ref<string[]>([]);

const visible = computed({
	get: () => props.visible,
	set: v => emit('update:visible', v)
});

// 打开时拉取商品详情
watch(
	() => props.visible,
	async v => {
		if (!v || !props.product?.id) return;
		tab.value = 'sku';
		try {
			const res: any = await service.clothing.product.detail({ id: props.product.id });
			skus.value = (res.skus || []).map((s: any) => ({
				id: s.id,
				skuName: s.sku_name,
				price: s.price,
				stock: s.stock,
				sales: s.sales,
				attrsText: s.attrs ? JSON.stringify(s.attrs) : ''
			}));
			images.value = (res.images || []).slice();
		} catch (e) {
			skus.value = [];
			images.value = [];
		}
	}
);

function addSku() {
	skus.value.push({ skuName: '', price: 0, stock: 0, sales: 0, attrsText: '' });
}

function addImage() {
	images.value.push('');
}

function close() {
	visible.value = false;
}

async function save() {
	for (const s of skus.value) {
		if (!s.skuName.trim() || s.price === null || s.price === undefined || s.price < 0) {
			ElMessage.warning('SKU 名称与价格必填,且价格不能为负');
			return;
		}
	}
	const body: any = {
		id: props.product.id,
		skus: skus.value.map((s: any) => {
			const item: any = {
				skuName: s.skuName.trim(),
				price: s.price,
				stock: s.stock || 0
			};
			if (s.id) item.id = s.id;
			if (s.attrsText && s.attrsText.trim()) {
				try {
					item.attrs = JSON.parse(s.attrsText);
				} catch (e) {
					ElMessage.error('属性 JSON 格式错误:' + s.attrsText);
					return null;
				}
			}
			return item;
		}),
		images: images.value
			.filter((u: string) => u && u.trim())
			.map((u: string, i: number) => ({ url: u.trim(), sort: i + 1 }))
	};
	if (body.skus.includes(null)) return;
	saving.value = true;
	try {
		await service.clothing.product.update(body);
		ElMessage.success('保存成功');
		visible.value = false;
		emit('saved');
	} finally {
		saving.value = false;
	}
}
</script>

<style scoped>
.img-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 8px;
}
</style>
