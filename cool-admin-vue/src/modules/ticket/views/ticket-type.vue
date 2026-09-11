<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增票型</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="attractionFilter"
				placeholder="景点筛选"
				clearable
				style="width: 200px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option
					v-for="attraction in attractions"
					:key="attraction.id"
					:label="attraction.name"
					:value="attraction.id"
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
			<cl-search-key placeholder="搜索票型名称" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="票型名称" prop="name" min-width="150" />

				<el-table-column label="所属景点" width="180">
					<template #default="{ row }">
						{{ getAttractionName(row.attractionId) }}
					</template>
				</el-table-column>

				<el-table-column label="价格" width="150">
					<template #default="{ row }">
						<div>
							<div style="color: #f56c6c; font-weight: 500">¥{{ row.price }}</div>
							<div v-if="row.originalPrice" style="font-size: 12px; color: #999; text-decoration: line-through">
								原价: ¥{{ row.originalPrice }}
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="库存" prop="stock" width="80" />

				<el-table-column label="有效天数" width="100">
					<template #default="{ row }">
						{{ row.validDays }}天
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

		<!-- 票型详情对话框 -->
		<el-dialog v-model="detailVisible" title="票型详情" width="700px">
			<div v-if="currentTicket">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="票型名称" :span="2">
						{{ currentTicket.name }}
					</el-descriptions-item>
					<el-descriptions-item label="所属景点" :span="2">
						{{ getAttractionName(currentTicket.attractionId) }}
					</el-descriptions-item>
					<el-descriptions-item label="价格">
						<span style="color: #f56c6c; font-weight: 500; font-size: 16px">¥{{ currentTicket.price }}</span>
					</el-descriptions-item>
					<el-descriptions-item label="原价">
						{{ currentTicket.originalPrice ? `¥${currentTicket.originalPrice}` : '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="库存">{{ currentTicket.stock }}</el-descriptions-item>
					<el-descriptions-item label="有效天数">{{ currentTicket.validDays }}天</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="currentTicket.status === 1 ? 'success' : 'danger'">
							{{ currentTicket.status === 1 ? '上架' : '下架' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="排序">{{ currentTicket.sort }}</el-descriptions-item>
					<el-descriptions-item label="票型描述" :span="2">
						{{ currentTicket.description }}
					</el-descriptions-item>
					<el-descriptions-item label="退改规则" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentTicket.refundRule }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="使用规则" :span="2">
						<div style="white-space: pre-wrap; line-height: 1.6">{{ currentTicket.useRule }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">{{ currentTicket.createTime }}</el-descriptions-item>
					<el-descriptions-item label="更新时间">{{ currentTicket.updateTime }}</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="ticket-ticket-type">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';

const { service } = useCool();

const attractionFilter = ref<number | undefined>();
const statusFilter = ref<number | undefined>();
const detailVisible = ref(false);
const currentTicket = ref<any>(null);
const attractions = ref<any[]>([]);

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{ label: '票型名称', prop: 'name', minWidth: 150 },
		{ label: '景点ID', prop: 'attractionId', width: 100 },
		{ label: '价格', prop: 'price', width: 100 },
		{ label: '库存', prop: 'stock', width: 80 },
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
			label: '所属景点',
			prop: 'attractionId',
			required: true,
			component: {
				name: 'el-select',
				options: () => attractions.value.map((item: any) => ({
					label: item.name,
					value: item.id
				})),
				props: { placeholder: '请选择景点' }
			}
		},
		{ label: '票型名称', prop: 'name', required: true, component: { name: 'el-input' } },
		{ label: '票型描述', prop: 'description', required: true, component: { name: 'el-input' } },
		{
			label: '价格',
			prop: 'price',
			required: true,
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '原价',
			prop: 'originalPrice',
			component: { name: 'el-input-number', props: { min: 0, precision: 2 } }
		},
		{
			label: '库存',
			prop: 'stock',
			value: 999,
			component: { name: 'el-input-number', props: { min: 0 } }
		},
		{
			label: '有效天数',
			prop: 'validDays',
			value: 1,
			component: { name: 'el-input-number', props: { min: 1 } }
		},
		{
			label: '退改规则',
			prop: 'refundRule',
			required: true,
			component: { name: 'el-input', props: { type: 'textarea', rows: 3 } }
		},
		{
			label: '使用规则',
			prop: 'useRule',
			required: true,
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
		service: service.ticket.ticket_type
	},
	async (app) => {
		await loadAttractions();
		app.refresh();
	}
);

async function loadAttractions() {
	try {
		const res = await service.ticket.attraction.list();
		attractions.value = res;
	} catch (e) {
		console.error('加载景点列表失败:', e);
	}
}

function getAttractionName(attractionId: number) {
	const attraction = attractions.value.find((item: any) => item.id === attractionId);
	return attraction ? attraction.name : '-';
}

function handleAdd() {
	Crud.value?.rowAppend();
}

function handleEdit(row: any) {
	Crud.value?.rowEdit(row);
}

function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该票型吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.ticket.ticket_type.delete({ ids: [row.id] }).then(() => {
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
			service.ticket.ticket_type.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function handleFilterChange() {
	Crud.value?.refresh({
		attractionId: attractionFilter.value,
		status: statusFilter.value
	});
}

function viewDetail(row: any) {
	currentTicket.value = row;
	detailVisible.value = true;
}

function toggleStatus(row: any) {
	const newStatus = row.status === 1 ? 0 : 1;
	const text = newStatus === 1 ? '上架' : '下架';
	ElMessageBox.confirm(`确定要${text}该票型吗？`, '提示', {
		type: 'warning'
	})
		.then(() => {
			service.ticket.ticket_type.updateStatus({ id: row.id, status: newStatus }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = newStatus;
			});
		})
		.catch(() => {});
}
</script>
