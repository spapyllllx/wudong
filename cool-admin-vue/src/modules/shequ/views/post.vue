<template>
	<cl-crud ref="Crud">
		<cl-row>
			<el-button type="primary" @click="handleAdd">新增</el-button>
			<el-button type="danger" @click="handleMultiDelete">删除</el-button>
			<cl-refresh-btn />
			<cl-flex1 />
			<el-select
				v-model="statusFilter"
				placeholder="状态筛选"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleStatusChange"
			>
				<el-option label="待审核" :value="0" />
				<el-option label="已发布" :value="1" />
				<el-option label="已下架" :value="2" />
			</el-select>
			<cl-search-key placeholder="搜索内容或地址" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<el-table-column type="selection" width="60" />

				<el-table-column label="用户" width="180">
					<template #default="{ row }">
						<div style="display: flex; align-items: center">
							<el-avatar :src="row.userAvatar" :size="40" style="margin-right: 10px" />
							<span>{{ row.userNickName }}</span>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="帖子内容" min-width="250">
					<template #default="{ row }">
						<div>
							<div style="margin-bottom: 8px">{{ row.content }}</div>
							<div v-if="row.images && row.images.length > 0">
								<el-image
									v-for="(img, index) in row.images.slice(0, 3)"
									:key="index"
									:src="img"
									:preview-src-list="row.images"
									:initial-index="index"
									fit="cover"
									style="width: 60px; height: 60px; margin-right: 4px; border-radius: 4px"
								/>
								<span v-if="row.images.length > 3" style="color: #999">+{{ row.images.length - 3 }}</span>
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="定位" prop="location" width="150" show-overflow-tooltip />
				<el-table-column label="景点" prop="scenicName" width="120" />

				<el-table-column label="互动数据" width="200">
					<template #default="{ row }">
						<div>
							<div>
								<el-tag type="success" size="small">赞 {{ row.likeCount }}</el-tag>
								<el-tag type="info" size="small" style="margin-left: 4px">评 {{ row.commentCount }}</el-tag>
							</div>
							<div style="margin-top: 4px">
								<el-tag type="warning" size="small">看 {{ row.viewCount }}</el-tag>
								<el-tag type="primary" size="small" style="margin-left: 4px">享 {{ row.shareCount }}</el-tag>
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="状态" prop="status" width="100">
					<template #default="{ row }">
						<el-tag v-if="row.status === 0" type="warning">待审核</el-tag>
						<el-tag v-else-if="row.status === 1" type="success">已发布</el-tag>
						<el-tag v-else type="danger">已下架</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="标签" width="120">
					<template #default="{ row }">
						<div>
							<el-tag v-if="row.isEssence" type="danger" size="small">精华</el-tag>
							<el-tag v-if="row.isTop" type="warning" size="small" :style="row.isEssence ? 'margin-left: 4px' : ''">置顶</el-tag>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="发布时间" prop="createTime" width="160" />

				<el-table-column label="操作" width="280" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="viewDetail(row)">详情</el-button>
						<el-button v-if="row.status === 0" type="success" size="small" @click="audit(row, 1)">通过</el-button>
						<el-button v-if="row.status === 0" type="danger" size="small" @click="audit(row, 2)">拒绝</el-button>
						<el-button v-if="row.status === 1" :type="row.isEssence ? 'warning' : 'primary'" size="small" @click="toggleEssence(row)">
							{{ row.isEssence ? '取消精华' : '设为精华' }}
						</el-button>
						<el-button v-if="row.status === 1" :type="row.isTop ? 'warning' : 'primary'" size="small" @click="toggleTop(row)">
							{{ row.isTop ? '取消置顶' : '置顶' }}
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

		<!-- 帖子详情对话框 -->
		<el-dialog v-model="detailVisible" title="帖子详情" width="800px">
			<div v-if="currentPost">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="用户">
						<div style="display: flex; align-items: center">
							<el-avatar :src="currentPost.userAvatar" :size="40" />
							<span style="margin-left: 10px">{{ currentPost.userNickName }}</span>
						</div>
					</el-descriptions-item>
					<el-descriptions-item label="发布时间">
						{{ currentPost.createTime }}
					</el-descriptions-item>
					<el-descriptions-item label="定位" :span="2">
						{{ currentPost.location || '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="关联景点" :span="2">
						{{ currentPost.scenicName || '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="帖子内容" :span="2">
						<div style="line-height: 1.6; white-space: pre-wrap">{{ currentPost.content }}</div>
					</el-descriptions-item>
					<el-descriptions-item label="图片" :span="2" v-if="currentPost.images && currentPost.images.length > 0">
						<el-image
							v-for="(img, index) in currentPost.images"
							:key="index"
							:src="img"
							:preview-src-list="currentPost.images"
							:initial-index="index"
							fit="cover"
							style="width: 100px; height: 100px; margin-right: 8px; border-radius: 4px; cursor: pointer"
						/>
					</el-descriptions-item>
					<el-descriptions-item label="点赞数">{{ currentPost.likeCount }}</el-descriptions-item>
					<el-descriptions-item label="评论数">{{ currentPost.commentCount }}</el-descriptions-item>
					<el-descriptions-item label="浏览数">{{ currentPost.viewCount }}</el-descriptions-item>
					<el-descriptions-item label="分享数">{{ currentPost.shareCount }}</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag v-if="currentPost.status === 0" type="warning">待审核</el-tag>
						<el-tag v-else-if="currentPost.status === 1" type="success">已发布</el-tag>
						<el-tag v-else type="danger">已下架</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="标签">
						<el-tag v-if="currentPost.isEssence" type="danger" size="small">精华</el-tag>
						<el-tag v-if="currentPost.isTop" type="warning" size="small" style="margin-left: 4px">置顶</el-tag>
						<span v-if="!currentPost.isEssence && !currentPost.isTop">-</span>
					</el-descriptions-item>
					<el-descriptions-item label="审核备注" :span="2" v-if="currentPost.auditRemark">
						{{ currentPost.auditRemark }}
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="shequ-post">
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const detailVisible = ref(false);
const currentPost = ref<any>(null);
const statusFilter = ref<number | undefined>();

const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '用户',
			prop: 'userNickName',
			width: 150
		},
		{
			label: '帖子内容',
			prop: 'content',
			minWidth: 200,
			showOverflowTooltip: true
		},
		{
			label: '定位',
			prop: 'location',
			width: 150,
			showOverflowTooltip: true
		},
		{
			label: '景点',
			prop: 'scenicName',
			width: 120
		},
		{
			label: '点赞数',
			prop: 'likeCount',
			width: 100
		},
		{
			label: '评论数',
			prop: 'commentCount',
			width: 100
		},
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '待审核', value: 0, type: 'warning' },
				{ label: '已发布', value: 1, type: 'success' },
				{ label: '已下架', value: 2, type: 'danger' }
			]
		},
		{
			label: '精华',
			prop: 'isEssence',
			width: 80,
			dict: [
				{ label: '否', value: 0 },
				{ label: '是', value: 1, type: 'danger' }
			]
		},
		{
			label: '置顶',
			prop: 'isTop',
			width: 80,
			dict: [
				{ label: '否', value: 0 },
				{ label: '是', value: 1, type: 'warning' }
			]
		},
		{
			label: '发布时间',
			prop: 'createTime',
			width: 160
		},
		{
			type: 'op',
			width: 280,
			buttons: [
				{
					label: '详情',
					type: 'primary',
					onClick: ({ scope }: any) => {
						viewDetail(scope.row);
					}
				},
				{
					label: '通过',
					type: 'success',
					onClick: ({ scope }: any) => {
						audit(scope.row, 1);
					}
				},
				{
					label: '精华',
					type: 'warning',
					onClick: ({ scope }: any) => {
						toggleEssence(scope.row);
					}
				},
				{
					label: '置顶',
					type: 'warning',
					onClick: ({ scope }: any) => {
						toggleTop(scope.row);
					}
				},
				'edit',
				'delete'
			]
		}
	]
});

const Upsert = useUpsert({
	items: [
		{ label: '用户ID', prop: 'userId', required: true, component: { name: 'el-input-number' } },
		{ label: '用户昵称', prop: 'userNickName', component: { name: 'el-input' } },
		{ label: '帖子内容', prop: 'content', required: true, component: { name: 'el-input', props: { type: 'textarea', rows: 4 } } },
		{ label: '定位地址', prop: 'location', component: { name: 'el-input' } },
		{ label: '景点名称', prop: 'scenicName', component: { name: 'el-input' } },
		{
			label: '状态',
			prop: 'status',
			value: 0,
			component: {
				name: 'el-radio-group',
				options: [
					{ label: '待审核', value: 0 },
					{ label: '已发布', value: 1 },
					{ label: '已下架', value: 2 }
				]
			}
		}
	]
});

const Crud = useCrud(
	{
		service: service.shequ.post
	},
	(app) => {
		app.refresh();
	}
);

// 新增
function handleAdd() {
	Crud.value?.rowAppend();
}

// 编辑
function handleEdit(row: any) {
	Crud.value?.rowEdit(row);
}

// 删除单条
function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该帖子吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.shequ.post.delete({ ids: [row.id] }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

// 批量删除
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
			service.shequ.post.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

// 状态筛选
function handleStatusChange() {
	Crud.value?.refresh({
		status: statusFilter.value
	});
}

// 查看详情
function viewDetail(row: any) {
	currentPost.value = row;
	detailVisible.value = true;
}

// 审核
function audit(row: any, status: number) {
	const text = status === 1 ? '通过' : '拒绝';
	ElMessageBox.prompt(`请输入${text}原因（可选）`, `${text}审核`, {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputType: 'textarea'
	})
		.then(({ value }) => {
			service.shequ.post
				.updateStatus({
					id: row.id,
					status,
					auditRemark: value || ''
				})
				.then(() => {
					ElMessage.success(`${text}成功`);
					Crud.value?.refresh();
				});
		})
		.catch(() => {});
}

// 切换精华
function toggleEssence(row: any) {
	const isEssence = row.isEssence ? 0 : 1;
	service.shequ.post.setEssence({ id: row.id, isEssence }).then(() => {
		ElMessage.success(isEssence ? '已设为精华' : '已取消精华');
		row.isEssence = isEssence;
	});
}

// 切换置顶
function toggleTop(row: any) {
	const isTop = row.isTop ? 0 : 1;
	service.shequ.post.setTop({ id: row.id, isTop }).then(() => {
		ElMessage.success(isTop ? '已置顶' : '已取消置顶');
		row.isTop = isTop;
	});
}
</script>
