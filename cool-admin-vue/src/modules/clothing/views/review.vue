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
				@change="handleFilterChange"
			>
				<el-option label="待审核" :value="0" />
				<el-option label="已发布" :value="1" />
				<el-option label="已删除" :value="2" />
			</el-select>
			<el-select
				v-model="ratingFilter"
				placeholder="评分筛选"
				clearable
				style="width: 120px; margin-right: 10px"
				@change="handleFilterChange"
			>
				<el-option label="5 星" :value="5" />
				<el-option label="4 星" :value="4" />
				<el-option label="3 星" :value="3" />
				<el-option label="2 星" :value="2" />
				<el-option label="1 星" :value="1" />
			</el-select>
			<cl-search-key placeholder="搜索评价内容" />
		</cl-row>

		<cl-row>
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 商家回复对话框 -->
		<el-dialog v-model="replyVisible" title="商家回复" width="500px">
			<el-input
				v-model="replyContent"
				type="textarea"
				:rows="5"
				placeholder="请输入回复内容"
				maxlength="500"
				show-word-limit
			/>
			<template #footer>
				<el-button @click="replyVisible = false">取消</el-button>
				<el-button type="primary" @click="submitReply">确定</el-button>
			</template>
		</el-dialog>
	</cl-crud>
</template>

<script lang="ts" setup name="product-review">
import { useCrud, useTable } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

const statusFilter = ref<number | undefined>();
const ratingFilter = ref<number | undefined>();
const replyVisible = ref(false);
const replyContent = ref('');
const currentReview = ref<any>(null);

const Table = useTable({
	columns: [
		{ type: 'selection', width: 60 },
		{
			label: '头像',
			prop: 'userAvatar',
			width: 80,
			component: { name: 'cl-avatar' }
		},
		{ label: '用户', prop: 'userNickName', width: 130 },
		{ label: '商品ID', prop: 'productId', width: 90 },
		{ label: '评分', prop: 'rating', width: 80 },
		{ label: '评价内容', prop: 'content', minWidth: 200, showOverflowTooltip: true },
		{ label: '购买规格', prop: 'skuName', width: 120 },
		{ label: '点赞数', prop: 'likeCount', width: 90 },
		{
			label: '商家回复',
			prop: 'replyContent',
			minWidth: 150,
			showOverflowTooltip: true,
			formatter: (row: any) => row.replyContent || '未回复'
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
		{ label: '评价时间', prop: 'createTime', width: 160 },
		{
			type: 'op',
			width: 300,
			buttons: ({ scope }: any) => {
				const btns: any[] = [];
				if (scope.row.status === 0) {
					btns.push(
						{
							label: '通过',
							type: 'success',
							onClick: () => audit(scope.row, 1)
						},
						{
							label: '拒绝',
							type: 'danger',
							onClick: () => audit(scope.row, 2)
						}
					);
				}
				if (scope.row.status === 1) {
					btns.push(
						{
							label: scope.row.replyContent ? '修改回复' : '回复',
							type: 'primary',
							onClick: () => openReply(scope.row)
						},
						{
							label: '下架',
							type: 'warning',
							onClick: () => audit(scope.row, 2)
						}
					);
				}
				btns.push('delete');
				return btns;
			}
		}
	]
});

const Crud = useCrud(
	{
		service: service.product.review
	},
	(app) => {
		app.refresh();
	}
);

function handleFilterChange() {
	Crud.value?.refresh({
		status: statusFilter.value,
		rating: ratingFilter.value
	});
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
			service.product.review.delete({ ids }).then(() => {
				ElMessage.success('删除成功');
				Crud.value?.refresh();
			});
		})
		.catch(() => {});
}

function audit(row: any, status: number) {
	const text = status === 1 ? '通过' : '拒绝/下架';
	ElMessageBox.confirm(`确定${text}该评价吗？`, '提示', { type: 'warning' })
		.then(() => {
			service.product.review.updateStatus({ id: row.id, status }).then(() => {
				ElMessage.success(`${text}成功`);
				row.status = status;
			});
		})
		.catch(() => {});
}

function openReply(row: any) {
	currentReview.value = row;
	replyContent.value = row.replyContent || '';
	replyVisible.value = true;
}

function submitReply() {
	if (!replyContent.value.trim()) {
		ElMessage.warning('请输入回复内容');
		return;
	}
	service.product.review
		.replyReview({
			id: currentReview.value.id,
			replyContent: replyContent.value
		})
		.then(() => {
			ElMessage.success('回复成功');
			currentReview.value.replyContent = replyContent.value;
			currentReview.value.replyTime = new Date().toISOString();
			replyVisible.value = false;
		});
}
</script>
