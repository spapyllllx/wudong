<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark" disable-transitions>context-menu</el-tag>
			<span>右键菜单</span>
		</div>

		<div class="c">
			<el-button @contextmenu="onContextMenu">预览</el-button>
			<demo-code :files="['other/context-menu.vue']" />
		</div>

		<div class="f">
			<span class="date">2025-02-22</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ContextMenu } from '@cool-vue/crud';
import { Edit } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

function onContextMenu(e: MouseEvent) {
	ContextMenu.open(e, {
		list: [
			{
				label: '基础',
				callback: done => {
					ElMessage.success('新增');
					done();
				}
			},
			{
				label: '图标',
				suffixIcon: Edit,
				callback: done => {
					ElMessage.success('图标');
					done();
				}
			},
			{
				label: '层级',
				children: [
					{
						label: '新增',
						callback: done => {
							ElMessage.success('新增');
							done();
						}
					},
					{
						label: '编辑',
						callback: done => {
							ElMessage.success('编辑');
							done();
						}
					},
					{
						label: '删除',
						callback: done => {
							ElMessage.success('删除');
							done();
						}
					}
				]
			}
		]
	});
}
</script>
