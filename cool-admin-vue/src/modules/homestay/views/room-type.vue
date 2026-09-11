<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增房型</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="homestayFilter"
				placeholder="民宿筛选"
				clearable
				style="width: 200px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option
					v-for="homestay in homestays"
					:key="homestay.id"
					:label="homestay.name"
					:value="homestay.id"
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
			<cl-search-key placeholder="搜索房型名称" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="房型图片" width="100">
					<template #default="{ row }">
						<el-image
							:src="row.image"
							:preview-src-list="[row.image]"
							fit="cover"
							style="width: 80px; height: 80px; border-radius: 4px"
						/>
					</template>
				</el-table-column>

				<el-table-column label="房型名称" prop="name" min-width="150" />

				<el-table-column label="所属民宿" width="180">
					<template #default="{ row }">
						{{ getHomestayName(row.homestayId) }}
					</template>
				</el-table-column>

				<el-table-column label="房型信息" width="200">
					<template #default="{ row }">
						<div style="font-size: 12px">
							<div>面积: {{ row.area || '-' }}㎡</div>
							<div>床型: {{ row.bedType || '-' }}</div>
							<div>最多入住: {{ row.maxGuests }}人</div>
							<div>房间数: {{ row.totalRooms }}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="价格" width="150">
					<template #default="{ row }">
						<div>
							<div style="color: #f56c6c; font-weight: 500">平日: ¥{{ row.price }}</div>
							<div v-if="row.weekendPrice" style="color: #e6a23c; font-size: 12px">周末: ¥{{ row.weekendPrice }}</div>
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

		<!-- 房型详情对话框 -->
		<el-dialog v-model="detailVisible" title="房型详情" width="800px">
			<div v-if="currentRoom">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="房型名称" :span="2">
						{{ currentRoom.name }}
					</el-descriptions-item>
					<el-descriptions-item label="所属民宿" :span="2">
						{{ getHomestayName(currentRoom.homestayId) }}
					</el-descriptions-item>
					<el-descriptions-item label="平日价格">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentRoom.price }}/晚</span>
					</el-descriptions-item>
					<el-descriptions-item label="周末价格">
						<span v-if="currentRoom.weekendPrice" style="color: #e6a23c; font-weight: 500; font-size: 16px">¥{{ currentRoom.weekendPrice }}/晚</span>
						<span v-else>-</span>
					</el-descriptions-item>
					<el-descriptions-item label="面积">{{ currentRoom.area ? `${currentRoom.area}㎡` : '-' }}</el-descriptions-item>
					<el-descriptions-item label="床型">{{ currentRoom.bedType || '-' }}</el-descriptions-item>
					<el-descriptions-item label="最多入住">{{ currentRoom.maxGuests }}人</el-descriptions-item>
					<el-descriptions-item label="房间总数">{{ currentRoom.totalRooms }}</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="currentRoom.status === 1 ? 'success' : 'danger'">
							{{ currentRoom.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="排序">{{ currentRoom.sort }}</el-descriptions-item>
					<el-descriptions-item label="房型图片" :span="2">
						<el-image
							:src="currentRoom.image"
							:preview-src-list="[currentRoom.image]"
							fit="cover"
							style="width: 200px; height: 150px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="更多图片" :span="2" v-if="currentRoom.images">
						<el-image
							v-for="(img, index) in parseImages(currentRoom.images)"
							:key="index"
							:src="img"
							:preview-src-list="parseImages(currentRoom.images)"
							:initial-index="index"
							fit="cover"
							style="width: 100px; height: 100px; margin-right: 8px; border-radius: 4px"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="房型描述" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentRoom.description || '-' }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="房间设施" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentRoom.facilities || '-' }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentRoom.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentRoom.updateTime }}</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="homestay-room-type">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';

const { service } = useCool();

const homestayFilter = ref<number | undefined>();
const statusFilter = ref<number | undefined>();
const detailVisible = ref(false);
const currentRoom = ref<any>(null);
const homestays = ref<any[]>([]);

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '房型图片', prop: 'image', width: 100 },
		{ label: '房型名称', prop: 'name', minWidth: 150 },
		{ label: '民宿ID', prop: 'homestayId', width: 100 },
		{ label: '价格', prop: 'price', width: 100 },
		{ label: '房间数', prop: 'totalRooms', width: 80 },
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
		{
			label: '所属民宿',
			prop: 'homestayId',
			required: true,
			component: {
				name: 'el-select',
				options: () => homestays.value.map((item: any) => ({
					label: item.name,
					value: item.id
				})),
				props: { placeholder: '请选择民宿' }
			}
		},
		{ label: '房型名称', prop: 'name', required: true, component: { name: 'el-input' } },
		{
			label: '房型图片',
			prop: 'image',
			required: true,
			component: { name: 'cl-upload', props: { limit: 1 } }
		},
		{
			label: '更多图片',
			prop: 'images',
			component: { name: 'cl-upload', props: { limit: 9, listType: 'picture-card' } }
		},
		{
			label: '房型描述',
			prop: 'description',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '面积(㎡)',
			prop: 'area',
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{ label: '床型', prop: 'bedType', component: { name: 'el-input', props: { placeholder: '如：大床/双床' } } },
		{
			label: '最多入住',
			prop: 'maxGuests',
			value: 2,
			component: { name: 'el-input-number', props: { min: 1 } }
		},
		{
			label: '平日价格',
			prop: 'price',
			required: true,
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '周末价格',
			prop: 'weekendPrice',
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '房间设施',
			prop: 'facilities',
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '房间总数',
			prop: 'totalRooms',
			value: 1,
			component: { name: 'el-input-number', props: { min: 1 } }
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
		service: service.homestay.room_type
	},
	async (app) => {
		await loadHomestays();
		app.refresh();
	}
);

async function loadHomestays() {
	try {
		const res = await service.homestay.homestay.list();
		homestays.value = res;
	} catch (e) {
		console.error('加载民宿列表失败:', e);
	}
}

function getHomestayName(homestayId: number) {
	const homestay = homestays.value.find((item: any) => item.id === homestayId);
	return homestay ? homestay.name : '-';
}

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
	ElMessageBox.confirm('确定要删除该房型吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.homestay.room_type.delete({ ids: [row.id] }).then(() => {
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
			service.homestay.room_type.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		homestayId: homestayFilter.value,
		status: statusFilter.value
	});
}

function viewDetail(row: any) {
	currentRoom.value = row;
	detailVisible.value = true;
}

function toggleStatus(row: any) {
	const newStatus = row.status === 1 ? 0 : 1;
	const text = newStatus === 1 ? '上架' : '下架';
	ElMessageBox.confirm(`确定要${text}该房型吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			service.homestay.room_type.updateStatus({ id: row.id, status: newStatus }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = newStatus;
			});
		})
		.catch(() => {});
}
</script>
