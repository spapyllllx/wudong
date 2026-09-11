<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增景点</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="typeFilter"
				placeholder="类型筛选"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="景点" :value="1" />
				<el-option label="活动" :value="2" />
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
			<cl-search-key placeholder="搜索景点名称或地址" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="封面" width="100">
					<template #default="{ row }">
						<el-image
							:src="row.cover"
							:preview-src-list="[row.cover]"
							fit="cover"
							style="width: 80px; height: 80px; border-radius: 4px"
						/>
					</template>
				</el-table-column>

				<el-table-column label="景点信息" min-width="200">
					<template #default="{ row }">
						<div>
							<div style="font-weight: 500; margin-bottom: 4px">{{ row.name }}</div>
							<div style="font-size: 12px; color: #999">{{ row.city }} {{ row.district }}</div>
							<el-tag :type="row.type === 1 ? 'primary' : 'success'" size="small" style="margin-top: 4px">
								{{ row.type === 1 ? '景点' : '活动' }}
							</el-tag>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="地址" prop="address" min-width="200" show-overflow-tooltip />

				<el-table-column label="联系方式" width="120">
					<template #default="{ row }">
						{{ row.phone }}
					</template>
				</el-table-column>

				<el-table-column label="最低价格" width="100">
					<template #default="{ row }">
						<span style="color: #f56c6c; font-weight: 500">¥{{ row.minPrice }}</span>
					</template>
				</el-table-column>

				<el-table-column label="开放时间" width="150" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.openTime }}
					</template>
				</el-table-column>

				<el-table-column label="评分" width="120">
					<template #default="{ row }">
						<el-rate :model-value="row.rating" disabled size="small" />
					</template>
				</el-table-column>

				<el-table-column label="数据" width="120">
					<template #default="{ row }">
						<div style="font-size: 12px">
							<div>浏览: {{ row.viewCount }}</div>
							<div>订单: {{ row.orderCount }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="状态" width="80">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="排序" prop="sort" width="80" />

				<el-table-column label="创建时间" prop="createTime" width="160" />

				<el-table-column label="操作" width="250" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
						<el-button
							:type="row.status === 1 ? 'warning' : 'success'"
							size="small"
							@click="toggleStatus(row)"
						>
							{{ row.status === 1 ? '下架' : '上架' }}
						</el-button>
						<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<cl-upsert ref="Upsert" />

		<!-- 景点详情对话框 -->
		<el-dialog v-model="detailVisible" title="景点详情" width="900px">
			<div v-if="currentAttraction">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="景点名称" :span="2">
						{{ currentAttraction.name }}
					</el-descriptions-item>
					<el-descriptions-item label="类型">
						<el-tag :type="currentAttraction.type === 1 ? 'primary' : 'success'">
							{{ currentAttraction.type === 1 ? '景点' : '活动' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="currentAttraction.status === 1 ? 'success' : 'danger'">
							{{ currentAttraction.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="联系电话">{{ currentAttraction.phone }}</el-descriptions-item>
					<el-descriptions-item label="最低价格">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentAttraction.minPrice }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="评分">
						<el-rate :model-value="currentAttraction.rating" disabled />
						<span style="margin-left: 8px">{{ currentAttraction.rating }} 分</span>
					</el-descriptions-item>
					<el-descriptions-item label="开放时间">{{ currentAttraction.openTime }}</el-descriptions-item>
					<el-descriptions-item label="省市区" :span="2">
						{{ currentAttraction.province }} {{ currentAttraction.city }} {{ currentAttraction.district }}
					</el-descriptions-item>
					<el-descriptions-item label="详细地址" :span="2">{{ currentAttraction.address }}</el-descriptions-item>
					<el-descriptions-item label="标签" :span="2">{{ currentAttraction.tags }}</el-descriptions-item>
					<el-descriptions-item label="浏览量">{{ currentAttraction.viewCount }}</el-descriptions-item>
					<el-descriptions-item label="订单量">{{ currentAttraction.orderCount }}</el-descriptions-item>
					<el-descriptions-item label="排序">{{ currentAttraction.sort }}</el-descriptions-item>
					<el-descriptions-item label="封面图" :span="2">
						<el-image
							:src="currentAttraction.cover"
							:preview-src-list="[currentAttraction.cover]"
							fit="cover"
							style="width: 200px; height: 150px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="景点图片" :span="2" v-if="currentAttraction.images">
						<el-image
							v-for="(img, index) in parseImages(currentAttraction.images)"
							:key="index"
							:src="img"
							:preview-src-list="parseImages(currentAttraction.images)"
							:initial-index="index"
							fit="cover"
							style="width: 100px; height: 100px; margin-right: 8px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="景点简介" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentAttraction.description }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="详细介绍" :span="2" v-if="currentAttraction.detailContent">
						<div style="max-height: 300px; overflow-y: auto; white-space: pre-wrap; line-height: 1.6">
							{{ currentAttraction.detailContent }}
						</div>
					</el-descriptions-item>
					<el-descriptions-item label="游玩贴士" :span="2" v-if="currentAttraction.tips">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentAttraction.tips }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="交通指南" :span="2" v-if="currentAttraction.traffic">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentAttraction.traffic }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentAttraction.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentAttraction.updateTime }}</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="ticket-attraction">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const detailVisible = ref(false);
const currentAttraction = ref<any>(null);
const typeFilter = ref<number | undefined>();
const statusFilter = ref<number | undefined>();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '封面', prop: 'cover', width: 100 },
		{ label: '景点名称', prop: 'name', minWidth: 200 },
		{ label: '类型', prop: 'type', width: 80, dict: [
			{ label: '景点', value: 1, type: 'primary' },
			{ label: '活动', value: 2, type: 'success' }
		]},
		{ label: '地址', prop: 'address', minWidth: 200 },
		{ label: '最低价格', prop: 'minPrice', width: 100 },
		{ label: '评分', prop: 'rating', width: 80 },
		{ label: '状态', prop: 'status', width: 80, dict: [
			{ label: '下架', value: 0, type: 'danger' },
			{ label: '上架', value: 1, type: 'success' }
		]},
		{ label: '排序', prop: 'sort', width: 80 },
		{ label: '创建时间', prop: 'createTime', width: 160 }
	]
});

const Upsert = useUpsert({
	items: [
		{ label: '景点名称', prop: 'name', required: true, component: { name: 'el-input' } },
		{
			label: '类型',
			prop: 'type',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '景点', value: 1 },
					{ label: '活动', value: 2 }
				]
			}
		},
		{
			label: '封面图',
			prop: 'cover',
			required: true,
			component: { name: 'cl-upload', props: { limit: 1 } }
		},
		{
			label: '景点图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { limit: 9, listType: 'picture-card' } }
		},
		{
			label: '景点简介',
			prop: 'description',
			required: true,
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '详细介绍',
			prop: 'detailContent',
			component: { name: 'el-input', props: { type: 'textarea', rows: 5 } }
		},
		{ label: '省', prop: 'province', required: true, component: { name: 'el-input' } },
		{ label: '市', prop: 'city', required: true, component: { name: 'el-input' } },
		{ label: '区', prop: 'district', required: true, component: { name: 'el-input' } },
		{ label: '详细地址', prop: 'address', required: true, component: { name: 'el-input' } },
		{ label: '联系电话', prop: 'phone', required: true, component: { name: 'el-input' } },
		{ label: '开放时间', prop: 'openTime', required: true, component: { name: 'el-input' } },
		{
			label: '最低价格',
			prop: 'minPrice',
			required: true,
			value: 0,
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '评分',
			prop: 'rating',
			value: 5.0,
			component: { name: 'el-input-number', props: { min: 0, max: 5, precision: 1, step: 0.1 } }
		},
		{ label: '标签', prop: 'tags', required: true, component: { name: 'el-input' } },
		{
			label: '游玩贴士',
			prop: 'tips',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '交通指南',
			prop: 'traffic',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '状态',
			prop: 'status',
			value: 1,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '上架', value: 1 },
					{ label: '下架', value: 0 }
				]
			}
		},
		{
			label: '排序',
			prop: 'sort',
			value: 0,
			component: { name: 'el-input-number', props: { min: 0 } }
		}
	]
});

const Crud = useCrud(
	{
		service: service.ticket.attraction
	},
	(app) => {
		app.refresh();
	}
);

function parseImages(images: any) {
	if (!images) return [];
	if (Array.isArray(images)) return images;
	if (typeof images === 'string') {
		try {
			return JSON.parse(images);
		} catch {
			return images.split(',');
		}
	}
	return [];
}

function handleAdd() {
	Crud.value?.rowAppend();
}

function handleEdit(row: any) {
	Crud.value?.rowEdit(row);
}

function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该景点吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.ticket.attraction.delete({ ids: [row.id] }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
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
			service.ticket.attraction.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		type: typeFilter.value,
		status: statusFilter.value
	});
}

function viewDetail(row: any) {
	currentAttraction.value = row;
	detailVisible.value = true;
}

function toggleStatus(row: any) {
	const newStatus = row.status === 1 ? 0 : 1;
	const text = newStatus === 1 ? '上架' : '下架';
	ElMessageBox.confirm(`确定要${text}该景点吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			service.ticket.attraction.updateStatus({ id: row.id, status: newStatus }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = newStatus;
			});
		})
		.catch(() => {});
}
</script>
