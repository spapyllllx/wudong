<template>
	<div class="user-community">
		<el-tabs v-model="activeTab" @tab-change="handleTabChange">
			<!-- 我的帖子 -->
			<el-tab-pane label="我的帖子" name="myPosts">
				<div class="post-list">
					<el-empty v-if="myPosts.length === 0" description="还没有发布帖子" />

					<div v-for="post in myPosts" :key="post.id" class="post-item">
						<div class="post-header">
							<div class="post-status">
								<el-tag v-if="post.status === 0" type="warning">待审核</el-tag>
								<el-tag v-else-if="post.status === 1" type="success">已发布</el-tag>
								<el-tag v-else type="danger">已下架</el-tag>
								<el-tag v-if="post.isEssence" type="danger" style="margin-left: 8px">精华</el-tag>
								<el-tag v-if="post.isTop" type="warning" style="margin-left: 8px">置顶</el-tag>
							</div>
							<span class="post-time">{{ post.createTime }}</span>
						</div>

						<div class="post-content">
							<div class="content-text">{{ post.content }}</div>
							<div v-if="post.images && post.images.length > 0" class="content-images">
								<el-image
									v-for="(img, index) in post.images.slice(0, 3)"
									:key="index"
									:src="img"
									:preview-src-list="post.images"
									:initial-index="index"
									fit="cover"
									class="image-item"
								/>
								<span v-if="post.images.length > 3" class="more-images">+{{ post.images.length - 3 }}</span>
							</div>
							<div v-if="post.location" class="location">
								<el-icon><Location /></el-icon>
								{{ post.location }}
							</div>
						</div>

						<div class="post-footer">
							<div class="interact-data">
								<span class="data-item">
									<el-icon><Star /></el-icon>
									{{ post.likeCount }}
								</span>
								<span class="data-item">
									<el-icon><ChatDotRound /></el-icon>
									{{ post.commentCount }}
								</span>
								<span class="data-item">
									<el-icon><View /></el-icon>
									{{ post.viewCount }}
								</span>
							</div>
							<div class="actions">
								<el-button type="primary" size="small" @click="viewPostDetail(post)">查看</el-button>
								<el-button type="danger" size="small" @click="deleteMyPost(post)">删除</el-button>
							</div>
						</div>
					</div>

					<div class="pagination">
						<el-pagination
							v-model:current-page="myPostsPage"
							:page-size="10"
							:total="myPostsTotal"
							layout="prev, pager, next"
							@current-change="loadMyPosts"
						/>
					</div>
				</div>
			</el-tab-pane>

			<!-- 我的点赞 -->
			<el-tab-pane label="我的点赞" name="myLikes">
				<div class="post-list">
					<el-empty v-if="myLikes.length === 0" description="还没有点赞" />

					<div v-for="post in myLikes" :key="post.id" class="post-item">
						<div class="post-header">
							<div class="user-info">
								<el-avatar :src="post.userAvatar" :size="32" />
								<span class="nick-name">{{ post.userNickName }}</span>
							</div>
							<span class="post-time">{{ post.likeTime || post.createTime }}</span>
						</div>

						<div class="post-content">
							<div class="content-text">{{ post.content }}</div>
							<div v-if="post.images && post.images.length > 0" class="content-images">
								<el-image
									v-for="(img, index) in post.images.slice(0, 3)"
									:key="index"
									:src="img"
									:preview-src-list="post.images"
									:initial-index="index"
									fit="cover"
									class="image-item"
								/>
								<span v-if="post.images.length > 3" class="more-images">+{{ post.images.length - 3 }}</span>
							</div>
						</div>

						<div class="post-footer">
							<div class="interact-data">
								<span class="data-item">
									<el-icon><Star /></el-icon>
									{{ post.likeCount }}
								</span>
								<span class="data-item">
									<el-icon><ChatDotRound /></el-icon>
									{{ post.commentCount }}
								</span>
							</div>
							<div class="actions">
								<el-button type="primary" size="small" @click="viewPostDetail(post)">查看</el-button>
								<el-button type="danger" size="small" @click="unlikePost(post)">取消点赞</el-button>
							</div>
						</div>
					</div>

					<div class="pagination">
						<el-pagination
							v-model:current-page="myLikesPage"
							:page-size="10"
							:total="myLikesTotal"
							layout="prev, pager, next"
							@current-change="loadMyLikes"
						/>
					</div>
				</div>
			</el-tab-pane>

			<!-- 我的评论 -->
			<el-tab-pane label="我的评论" name="myComments">
				<div class="comment-list">
					<el-empty v-if="myComments.length === 0" description="还没有评论" />

					<div v-for="comment in myComments" :key="comment.id" class="comment-item">
						<div class="comment-header">
							<span class="comment-time">{{ comment.createTime }}</span>
							<el-tag v-if="comment.status === 0" type="warning" size="small">待审核</el-tag>
							<el-tag v-else-if="comment.status === 1" type="success" size="small">已发布</el-tag>
						</div>

						<div class="comment-content">
							<div v-if="comment.replyUserNickName" class="reply-info">
								回复 <span class="user-name">@{{ comment.replyUserNickName }}</span>
							</div>
							<div class="content-text">{{ comment.content }}</div>
							<div class="post-preview">
								<el-icon><Document /></el-icon>
								<span>来自帖子：{{ comment.postContent?.substring(0, 30) }}...</span>
							</div>
						</div>

						<div class="comment-footer">
							<span class="like-count">
								<el-icon><Star /></el-icon>
								{{ comment.likeCount }}
							</span>
							<div class="actions">
								<el-button type="primary" size="small" @click="viewPostByComment(comment)">查看帖子</el-button>
								<el-button type="danger" size="small" @click="deleteMyComment(comment)">删除</el-button>
							</div>
						</div>
					</div>

					<div class="pagination">
						<el-pagination
							v-model:current-page="myCommentsPage"
							:page-size="10"
							:total="myCommentsTotal"
							layout="prev, pager, next"
							@current-change="loadMyComments"
						/>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>

		<!-- 帖子详情对话框 -->
		<el-dialog v-model="detailVisible" title="帖子详情" width="800px">
			<div v-if="currentPost" class="post-detail">
				<div class="detail-header">
					<el-avatar :src="currentPost.userAvatar" :size="50" />
					<div class="user-info">
						<div class="nick-name">{{ currentPost.userNickName }}</div>
						<div class="create-time">{{ currentPost.createTime }}</div>
					</div>
				</div>

				<div class="detail-content">
					<div class="content-text">{{ currentPost.content }}</div>
					<div v-if="currentPost.images && currentPost.images.length > 0" class="content-images">
						<el-image
							v-for="(img, index) in currentPost.images"
							:key="index"
							:src="img"
							:preview-src-list="currentPost.images"
							:initial-index="index"
							fit="cover"
							class="image-item"
						/>
					</div>
					<div v-if="currentPost.location" class="location">
						<el-icon><Location /></el-icon>
						{{ currentPost.location }}
					</div>
				</div>

				<div class="detail-stats">
					<span>点赞 {{ currentPost.likeCount }}</span>
					<span>评论 {{ currentPost.commentCount }}</span>
					<span>浏览 {{ currentPost.viewCount }}</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="user-community">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Star, ChatDotRound, View, Location, Document } from '@element-plus/icons-vue';
import { useCool } from '/@/cool';

const { service } = useCool();

const activeTab = ref('myPosts');

// 我的帖子
const myPosts = ref<any[]>([]);
const myPostsPage = ref(1);
const myPostsTotal = ref(0);

// 我的点赞
const myLikes = ref<any[]>([]);
const myLikesPage = ref(1);
const myLikesTotal = ref(0);

// 我的评论
const myComments = ref<any[]>([]);
const myCommentsPage = ref(1);
const myCommentsTotal = ref(0);

// 帖子详情
const detailVisible = ref(false);
const currentPost = ref<any>(null);

// 切换标签
const handleTabChange = (tab: string) => {
	if (tab === 'myPosts' && myPosts.value.length === 0) {
		loadMyPosts();
	} else if (tab === 'myLikes' && myLikes.value.length === 0) {
		loadMyLikes();
	} else if (tab === 'myComments' && myComments.value.length === 0) {
		loadMyComments();
	}
};

// 加载我的帖子
const loadMyPosts = async () => {
	try {
		const res = await service.shequ.post.page({
			page: myPostsPage.value,
			size: 10,
			userId: 1, // 测试用户ID，实际应该从登录信息获取
			order: 'createTime',
			sort: 'desc'
		});
		myPosts.value = res.list || [];
		myPostsTotal.value = res.pagination?.total || 0;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 加载我的点赞
const loadMyLikes = async () => {
	try {
		// 这里需要自定义查询，暂时用帖子列表模拟
		const res = await service.shequ.post.page({
			page: myLikesPage.value,
			size: 10,
			order: 'createTime',
			sort: 'desc'
		});
		myLikes.value = res.list || [];
		myLikesTotal.value = res.pagination?.total || 0;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 加载我的评论
const loadMyComments = async () => {
	try {
		const res = await service.shequ.comment.page({
			page: myCommentsPage.value,
			size: 10,
			userId: 1, // 测试用户ID
			order: 'createTime',
			sort: 'desc'
		});
		myComments.value = res.list || [];
		myCommentsTotal.value = res.pagination?.total || 0;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 查看帖子详情
const viewPostDetail = async (post: any) => {
	try {
		const res = await service.shequ.post.info({ id: post.id });
		currentPost.value = res;
		detailVisible.value = true;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 删除我的帖子
const deleteMyPost = (post: any) => {
	ElMessageBox.confirm('确定要删除这条帖子吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(async () => {
			try {
				await service.shequ.post.delete({ ids: [post.id] });
				ElMessage.success('删除成功');
				loadMyPosts();
			} catch (error: any) {
				ElMessage.error(error.message || '删除失败');
			}
		})
		.catch(() => {});
};

// 取消点赞
const unlikePost = async (post: any) => {
	try {
		// 这里应该调用取消点赞接口，暂时用更新模拟
		await service.shequ.post.update({
			id: post.id,
			likeCount: Math.max(0, post.likeCount - 1)
		});
		ElMessage.success('已取消点赞');
		loadMyLikes();
	} catch (error: any) {
		ElMessage.error(error.message || '操作失败');
	}
};

// 通过评论查看帖子
const viewPostByComment = async (comment: any) => {
	try {
		const res = await service.shequ.post.info({ id: comment.postId });
		currentPost.value = res;
		detailVisible.value = true;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 删除我的评论
const deleteMyComment = (comment: any) => {
	ElMessageBox.confirm('确定要删除这条评论吗？删除后不可恢复', '提示', {
		type: 'warning'
	})
		.then(async () => {
			try {
				await service.shequ.comment.delete({ ids: [comment.id] });
				ElMessage.success('删除成功');
				loadMyComments();
			} catch (error: any) {
				ElMessage.error(error.message || '删除失败');
			}
		})
		.catch(() => {});
};

onMounted(() => {
	loadMyPosts();
});
</script>

<style scoped lang="scss">
.user-community {
	padding: 20px;

	.post-list,
	.comment-list {
		.post-item,
		.comment-item {
			background: #fff;
			border-radius: 8px;
			padding: 16px;
			margin-bottom: 16px;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

			.post-header,
			.comment-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;

				.post-status {
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.user-info {
					display: flex;
					align-items: center;
					gap: 8px;

					.nick-name {
						font-weight: 500;
					}
				}

				.post-time,
				.comment-time {
					color: #999;
					font-size: 13px;
				}
			}

			.post-content,
			.comment-content {
				margin-bottom: 12px;

				.reply-info {
					color: #666;
					font-size: 13px;
					margin-bottom: 4px;

					.user-name {
						color: #409eff;
					}
				}

				.content-text {
					font-size: 14px;
					line-height: 1.6;
					margin-bottom: 8px;
				}

				.content-images {
					display: flex;
					gap: 8px;
					margin-bottom: 8px;

					.image-item {
						width: 80px;
						height: 80px;
						border-radius: 4px;
					}

					.more-images {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 80px;
						height: 80px;
						background: #f5f5f5;
						border-radius: 4px;
						color: #999;
						font-size: 13px;
					}
				}

				.location {
					display: flex;
					align-items: center;
					gap: 4px;
					color: #666;
					font-size: 12px;
				}

				.post-preview {
					display: flex;
					align-items: center;
					gap: 6px;
					color: #999;
					font-size: 13px;
					margin-top: 8px;
					padding: 8px;
					background: #f5f5f5;
					border-radius: 4px;
				}
			}

			.post-footer,
			.comment-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 12px;
				border-top: 1px solid #f0f0f0;

				.interact-data,
				.like-count {
					display: flex;
					gap: 16px;
					color: #909399;
					font-size: 13px;

					.data-item {
						display: flex;
						align-items: center;
						gap: 4px;
					}
				}

				.actions {
					display: flex;
					gap: 8px;
				}
			}
		}
	}

	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.post-detail {
		.detail-header {
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			.user-info {
				margin-left: 12px;

				.nick-name {
					font-weight: 500;
					font-size: 16px;
				}

				.create-time {
					color: #999;
					font-size: 13px;
					margin-top: 4px;
				}
			}
		}

		.detail-content {
			.content-text {
				font-size: 15px;
				line-height: 1.8;
				margin-bottom: 16px;
			}

			.content-images {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 12px;
				margin-bottom: 16px;

				.image-item {
					width: 100%;
					height: 160px;
					border-radius: 8px;
				}
			}

			.location {
				display: flex;
				align-items: center;
				gap: 6px;
				color: #666;
				font-size: 14px;
			}
		}

		.detail-stats {
			display: flex;
			gap: 24px;
			padding-top: 16px;
			border-top: 1px solid #f0f0f0;
			color: #666;
			font-size: 14px;
		}
	}
}
</style>
