<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增民宿</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
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
			<cl-search-key placeholder="搜索民宿名称或地址" />
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

				<el-table-column label="民宿信息" min-width="200">
					<template #default="{ row }">
						<div>
							<div style="font-weight: 500; margin-bottom: 4px">{{ row.name }}</div>
							<div style="font-size: 12px; color: #999">{{ row.city }} {{ row.district }}</div>
							<div v-if="row.tags" style="margin-top: 4px">
								<el-tag
									v-for="(tag, index) in row.tags.split(',')"
									:key="index"
									size="small"
									style="margin-right: 4px"
								>
									{{ tag }}
								</el-tag>
							</div>
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

		<!-- 民宿详情对话框 -->
		<el-dialog v-model="detailVisible" title="民宿详情" width="900px">
			<div v-if="currentHomestay">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="民宿名称" :span="2">
						{{ currentHomestay.name }}
					</el-descriptions-item>
					<el-descriptions-item label="联系电话">{{ currentHomestay.phone }}</el-descriptions-item>
					<el-descriptions-item label="最低价格">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentHomestay.minPrice }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="评分">
						<el-rate :model-value="currentHomestay.rating" disabled />
						<span style="margin-left: 8px">{{ currentHomestay.rating }} 分</span>
					</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="currentHomestay.status === 1 ? 'success' : 'danger'">
							{{ currentHomestay.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="省市区" :span="2">
						{{ currentHomestay.province }} {{ currentHomestay.city }} {{ currentHomestay.district }}
					</el-descriptions-item>
					<el-descriptions-item label="详细地址" :span="2">{{ currentHomestay.address }}</el-descriptions-item>
					<el-descriptions-item label="入住时间">{{ currentHomestay.checkInTime || '-' }}</el-descriptions-item>
					<el-descriptions-item label="退房时间">{{ currentHomestay.checkOutTime || '-' }}</el-descriptions-item>
					<el-descriptions-item label="标签" :span="2">{{ currentHomestay.tags || '-' }}</el-descriptions-item>
					<el-descriptions-item label="浏览量">{{ currentHomestay.viewCount }}</el-descriptions-item>
					<el-descriptions-item label="订单量">{{ currentHomestay.orderCount }}</el-descriptions-item>
					<el-descriptions-item label="排序">{{ currentHomestay.sort }}</el-descriptions-item>
					<el-descriptions-item label="封面图" :span="2">
						<el-image
							:src="currentHomestay.cover"
							:preview-src-list="[currentHomestay.cover]"
							fit="cover"
							style="width: 200px; height: 150px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="民宿图片" :span="2" v-if="currentHomestay.images">
						<el-image
							v-for="(img, index) in parseImages(currentHomestay.images)"
							:key="index"
							:src="img"
							:preview-src-list="parseImages(currentHomestay.images)"
							:initial-index="index"
							fit="cover"
							style="width: 100px; height: 100px; margin-right: 8px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="民宿简介" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentHomestay.description || '-' }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="设施服务" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentHomestay.facilities || '-' }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentHomestay.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentHomestay.updateTime }}</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="homestay-homestay">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const detailVisible = ref(false);
const currentHomestay = ref<any>(null);
const statusFilter = ref<number | undefined>();

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '封面', prop: 'cover', width: 100 },
		{ label: '民宿名称', prop: 'name', minWidth: 200 },
		{ label: '地址', prop: 'address', minWidth: 200 },
		{ label: '联系电话', prop: 'phone', width: 120 },
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
		{ label: '民宿名称', prop: 'name', required: true, component: { name: 'el-input' } },
		{
			label: '封面图',
			prop: 'cover',
			required: true,
			component: { name: 'cl-upload', props: { limit: 1 } }
		},
		{
			label: '民宿图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { limit: 9, listType: 'picture-card' } }
		},
		{
			label: '民宿简介',
			prop: 'description',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{ label: '省', prop: 'province', required: true, component: { name: 'el-input' } },
		{ label: '市', prop: 'city', required: true, component: { name: 'el-input' } },
		{ label: '区', prop: 'district', required: true, component: { name: 'el-input' } },
		{ label: '详细地址', prop: 'address', required: true, component: { name: 'el-input' } },
		{ label: '联系电话', prop: 'phone', required: true, component: { name: 'el-input' } },
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
		{ label: '标签', prop: 'tags', component: { name: 'el-input', props: { placeholder: '多个标签用逗号分隔' } } },
		{
			label: '设施服务',
			prop: 'facilities',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{ label: '入住时间', prop: 'checkInTime', component: { name: 'el-input', props: { placeholder: '如：14:00' } } },
		{ label: '退房时间', prop: 'checkOutTime', component: { name: 'el-input', props: { placeholder: '如：12:00' } } },
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
		service: service.homestay.homestay
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
	ElMessageBox.confirm('确定要删除该民宿吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.homestay.homestay.delete({ ids: [row.id] }).then(() => {
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
			service.homestay.homestay.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		status: statusFilter.value
	});
}

function viewDetail(row: any) {
	currentHomestay.value = row;
	detailVisible.value = true;
}

function toggleStatus(row: any) {
	const newStatus = row.status === 1 ? 0 : 1;
	const text = newStatus === 1 ? '上架' : '下架';
	ElMessageBox.confirm(`确定要${text}该民宿吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			service.homestay.homestay.updateStatus({ id: row.id, status: newStatus }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = newStatus;
			});
		})
		.catch(() => {});
}
</script>
