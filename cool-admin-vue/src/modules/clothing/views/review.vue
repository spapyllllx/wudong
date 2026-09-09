<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search />
		</cl-row>

		<cl-row>
			<cl-table ref="Table">
				<template #slot-content="{ scope }">
					<span>{{ scope.row.content }}</span>
					<span v-if="scope.row.images?.length" style="margin-left: 6px">
						<el-image
							v-for="(img, i) in scope.row.images"
							:key="i"
							:src="img"
							style="width: 36px; height: 36px; margin-right: 4px; border-radius: 3px"
							fit="cover"
							:preview-src-list="scope.row.images"
							preview-teleported
						/>
					</span>
				</template>
			</cl-table>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<cl-pagination />
		</cl-row>

		<!-- 回复弹窗 -->
		<cl-dialog v-model="replyVisible" title="商家回复" width="480px">
			<el-input
				v-model="replyContent"
				type="textarea"
				:rows="4"
				maxlength="500"
				show-word-limit
				placeholder="请输入回复内容"
			/>
			<template #footer>
				<el-button @click="replyVisible = false">取消</el-button>
				<el-button type="primary" :loading="replying" @click="submitReply">提交回复</el-button>
			</template>
		</cl-dialog>

		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'clothing-review'
});

import { useCool } from '/@/cool';
import { useCrud, useSearch, useTable, useUpsert } from '@cool-vue/crud';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const { service } = useCool();

// cl-table
const Table = useTable({
	columns: [
		{
			type: 'selection',
			width: 60
		},
		{
			label: '评分',
			prop: 'rating',
			minWidth: 80,
			formatter: (row: any) => `${row.rating} 分`
		},
		{
			label: '评价内容',
			prop: 'content',
			minWidth: 200,
			name: 'slot-content'
		},
		{
			label: '商品ID',
			prop: 'product_id',
			minWidth: 80
		},
		{
			label: '回复',
			prop: 'reply_content',
			minWidth: 160
		},
		{
			label: '回复时间',
			prop: 'replied_at',
			minWidth: 170
		},
		{
			label: '评价时间',
			prop: 'created_at',
			minWidth: 170,
			sortable: 'desc'
		},
		{
			type: 'op',
			width: 140,
			buttons: [
				{
					label: '回复',
					type: 'primary',
					onClick({ scope }) {
						openReply(scope.row);
					}
				}
			]
		}
	]
});

// cl-upsert(仅删除能力,无新增表单)
const Upsert = useUpsert({
	items: []
});

// cl-search
const Search = useSearch({
	columns: [
		{
			label: '关键词',
			prop: 'keyWord',
			component: { name: 'el-input', props: { placeholder: '评价内容' } }
		},
		{
			label: '评分',
			prop: 'rating',
			component: {
				name: 'el-select',
				options: [
					{ label: '5 分', value: 5 },
					{ label: '4 分', value: 4 },
					{ label: '3 分', value: 3 },
					{ label: '2 分', value: 2 },
					{ label: '1 分', value: 1 }
				]
			}
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.clothing.review
	},
	app => {
		app.refresh();
	}
);

// ---------- 回复 ----------
const replyVisible = ref(false);
const replyContent = ref('');
const replying = ref(false);
const currentReview = ref<any>(null);

function openReply(row: any) {
	currentReview.value = row;
	replyContent.value = row.reply_content || '';
	replyVisible.value = true;
}

async function submitReply() {
	if (!replyContent.value.trim()) {
		ElMessage.warning('请输入回复内容');
		return;
	}
	replying.value = true;
	try {
		await service.clothing.review.reply({
			id: currentReview.value.id,
			replyContent: replyContent.value.trim()
		});
		ElMessage.success('回复成功');
		replyVisible.value = false;
		Crud.value?.refresh();
	} finally {
		replying.value = false;
	}
}
</script>
