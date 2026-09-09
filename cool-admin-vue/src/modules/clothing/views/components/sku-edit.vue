<template>
	<cl-dialog
		:model-value="visible"
		:title="`SKU 与图片管理 · ${product?.title || ''}`"
		width="820px"
		@close="close"
	>
		<el-tabs v-model="tab">
			<!-- SKU 列表 -->
			<el-tab-pane label="SKU 列表" name="sku">
				<el-table :data="skus" size="small" border>
					<!-- 展开行:属性键值对可视化编辑 -->
					<el-table-column type="expand">
						<template #default="{ row }">
							<div class="attrs-editor">
								<div class="attrs-tip">SKU 属性(如:尺寸、颜色、克重…)</div>
								<div v-for="(a, i) in row.attrsItems" :key="i" class="attr-row">
									<el-input v-model="a.k" placeholder="属性名,如:尺寸" style="width: 150px" />
									<span style="margin: 0 6px">:</span>
									<el-input v-model="a.v" placeholder="属性值,如:中号" style="width: 180px" />
									<el-button link type="danger" @click="row.attrsItems.splice(i, 1)">删除</el-button>
								</div>
								<el-button size="small" style="margin-top: 6px" @click="row.attrsItems.push({ k: '', v: '' })">
									+ 添加属性
								</el-button>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="SKU 名称" min-width="150">
						<template #default="{ row }">
							<el-input v-model="row.skuName" placeholder="如:银饰-手镯-中号" />
						</template>
					</el-table-column>
					<el-table-column label="价格(元)" width="120">
						<template #default="{ row }">
							<el-input-number v-model="row.price" :min="0" :precision="2" :controls="false" style="width: 100%" />
						</template>
					</el-table-column>
					<el-table-column label="库存" width="110">
						<template #default="{ row }">
							<el-input-number v-model="row.stock" :min="0" :controls="false" style="width: 100%" />
						</template>
					</el-table-column>
					<el-table-column label="属性" min-width="170">
						<template #default="{ row }">
							<div class="attrs-preview">
								<el-tag v-for="(a, i) in row.attrsItems.filter(x => x.k && x.v)" :key="i" size="small" style="margin: 2px">
									{{ a.k }}:{{ a.v }}
								</el-tag>
								<span v-if="!row.attrsItems.filter(x => x.k && x.v).length" class="no-attr">点左边箭头添加属性</span>
							</div>
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
					<div class="img-upload-bar">
						<el-upload
							:show-file-list="false"
							accept="image/*"
							:http-request="uploadFile"
						>
							<el-button type="primary" plain size="small">+ 上传图片</el-button>
						</el-upload>
						<span style="color: #909399; font-size: 12px; margin-left: 10px">
							上传后自动加入列表(可直接删除);也可手动粘贴图片 URL
						</span>
					</div>
					<div v-for="(img, i) in images" :key="i" class="img-row">
						<el-image :src="img" fit="cover" style="width: 56px; height: 56px; border-radius: 4px" />
						<el-input v-model="images[i]" placeholder="图片 URL" style="flex: 1" />
						<el-button link type="danger" @click="images.splice(i, 1)">删除</el-button>
					</div>
					<div v-if="!images.length" class="no-img-tip">暂无图片,点击上方按钮上传</div>
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

const { service, request } = useCool();

const tab = ref('sku');
const saving = ref(false);
const skus = ref<any[]>([]);
const images = ref<string[]>([]);

const visible = computed({
	get: () => props.visible,
	set: v => emit('update:visible', v)
});

/** 属性对象 ↔ 键值对数组 */
function attrsToItems(attrs: any) {
	if (!attrs || typeof attrs !== 'object') return [];
	return Object.keys(attrs)
		.filter(k => attrs[k] !== undefined && attrs[k] !== null && attrs[k] !== '')
		.map(k => ({ k, v: String(attrs[k]) }));
}
function itemsToAttrs(items: any[]) {
	const attrs: any = {};
	for (const a of items || []) {
		const k = (a.k || '').trim();
		const v = (a.v || '').trim();
		if (k && v) attrs[k] = v;
	}
	return Object.keys(attrs).length ? attrs : undefined;
}

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
				attrsItems: attrsToItems(s.attrs)
			}));
			images.value = (res.images || []).slice();
		} catch (e) {
			skus.value = [];
			images.value = [];
		}
	}
);

function addSku() {
	skus.value.push({ skuName: '', price: 0, stock: 0, sales: 0, attrsItems: [] });
}

/** 图片上传(复用后端 /admin/base/comm/upload) */
async function uploadFile(opt: any) {
	const fd = new FormData();
	fd.append('file', opt.file);
	try {
		const url: any = await request({
			url: '/admin/base/comm/upload',
			method: 'post',
			data: fd
		});
		if (url && typeof url === 'string') {
			images.value.push(url);
			ElMessage.success('上传成功');
		} else {
			ElMessage.error('上传返回异常');
		}
	} catch (e: any) {
		ElMessage.error('上传失败:' + (e?.message || e));
	}
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
		for (const a of s.attrsItems) {
			if ((a.k.trim() && !a.v.trim()) || (!a.k.trim() && a.v.trim())) {
				ElMessage.warning('属性名与属性值需成对填写,或删掉空行');
				return;
			}
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
			const attrs = itemsToAttrs(s.attrsItems);
			if (attrs) item.attrs = attrs;
			return item;
		}),
		images: images.value
			.filter((u: string) => u && u.trim())
			.map((u: string, i: number) => ({ url: u.trim(), sort: i + 1 }))
	};
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
.attrs-editor {
	background: #fafafa;
	border-radius: 6px;
	padding: 10px;
}
.attrs-tip {
	color: #909399;
	font-size: 12px;
	margin-bottom: 8px;
}
.attr-row {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}
.attrs-preview {
	min-height: 24px;
}
.no-attr {
	color: #c0c4cc;
	font-size: 12px;
}
.img-upload-bar {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}
.img-row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 8px;
}
.no-img-tip {
	color: #c0c4cc;
	text-align: center;
	padding: 24px 0;
	font-size: 13px;
}
</style>
