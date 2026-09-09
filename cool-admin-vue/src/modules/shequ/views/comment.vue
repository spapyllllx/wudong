<template>
	<cl-crud ref="Crud">
		<cl-row>
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
				<el-option label="已删除" :value="2" />
			</el-select>
			<cl-search-key placeholder="搜索评论内容" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 所属帖子对话框 -->
		<el-dialog v-model="postVisible" title="所属帖子" width="600px">
			<div v-if="currentPostInfo">
				<el-descriptions :column="1" border>
					<el-descriptions-item label="用户">
						{{ currentPostInfo.userNickName }}
					</el-descriptions-item>
					<el-descriptions-item label="帖子内容">
						{{ currentPostInfo.content }}
					</el-descriptions-item>
					<el-descriptions-item label="发布时间">
						{{ currentPostInfo.createTime }}
					</el-descriptions-item>
					<el-descriptions-item label="互动数据">
						点赞：{{ currentPostInfo.likeCount }} | 评论：{{ currentPostInfo.commentCount }}
					</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="shequ-comment">
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const statusFilter = ref<number | undefined>();
const postVisible = ref(false);
const currentPostInfo = ref<any>(null);

const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '头像',
			prop: 'userAvatar',
			width: 80,
			component: {
				name: 'cl-avatar'
			}
		},
		{
			label: '用户昵称',
			prop: 'userNickName',
			minWidth: 120
		},
		{
			label: '评论内容',
			prop: 'content',
			minWidth: 300,
			showOverflowTooltip: true
		},
		{
			label: '回复用户',
			prop: 'replyUserNickName',
			width: 120
		},
		{
			label: '点赞数',
			prop: 'likeCount',
			width: 100
		},
		{
			label: '状态',
			prop: 'status',
			width: 100,
			dict: [
				{ label: '待审核', value: 0, type: 'warning' },
				{ label: '已发布', value: 1, type: 'success' },
				{ label: '已删除', value: 2, type: 'danger' }
			]
		},
		{
			label: '评论时间',
			prop: 'createTime',
			width: 160
		},
		{
			label: '操作',
			type: 'op',
			width: 250,
			buttons: [
				{
					label: '查看帖子',
					type: 'primary',
					onClick: ({ scope }: any) => {
						viewPost(scope.row.postId);
					}
				},
				{
					label: '删除',
					type: 'danger',
					onClick: ({ scope }: any) => {
						handleDelete(scope.row);
					}
				}
			]
		}
	]
});

const Crud = useCrud(
	{
		service: service.shequ.comment
	},
	(app) => {
		app.refresh();
	}
);

// 批量删除
function handleMultiDelete() {
	const selection = Table.value?.getSelectionRows();
	if (!selection || selection.length === 0) {
		ElMessage.warning('请先选择要删除的数据');
		return;
	}
	ElMessageBox.confirm(`确定删除选中的 ${selection.length} 条评论吗？删除后不可恢复`, '提示', {
		type: 'warning'
	})
		.then(() => {
			const ids = selection.map((item: any) => item.id);
			service.shequ.comment.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

// 删除单条
function handleDelete(row: any) {
	ElMessageBox.confirm('确定要删除该评论吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(() => {
			service.shequ.comment.delete({ ids: [row.id] }).then(() => {
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

// 查看所属帖子
function viewPost(postId: number) {
	service.shequ.post.info({ id: postId }).then((res: any) => {
		currentPostInfo.value = res;
		postVisible.value = true;
	});
}
</script>
