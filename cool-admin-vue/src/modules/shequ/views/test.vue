<template>
	<div class="community-test">
		<el-card class="mb-20">
			<template #header>
				<div class="card-header">
					<span>社区首页 - 帖子列表</span>
					<el-radio-group v-model="listType" @change="handleTypeChange">
						<el-radio-button value="latest">最新</el-radio-button>
						<el-radio-button value="hot">热门</el-radio-button>
						<el-radio-button value="essence">精华</el-radio-button>
					</el-radio-group>
				</div>
			</template>

			<div class="post-list">
				<el-empty v-if="postList.length === 0" description="暂无帖子" />

				<div v-for="post in postList" :key="post.id" class="post-item" @click="viewPost(post)">
					<!-- 用户信息 -->
					<div class="post-header">
						<el-avatar :src="post.userAvatar" :size="40" />
						<div class="user-info">
							<div class="nick-name">{{ post.userNickName }}</div>
							<div class="create-time">{{ post.createTime }}</div>
						</div>
					</div>

					<!-- 帖子内容 -->
					<div class="post-content">
						<div class="content-text">{{ post.content }}</div>
						<div v-if="post.images && post.images.length > 0" class="content-images">
							<el-image
								v-for="(img, index) in post.images.slice(0, 9)"
								:key="index"
								:src="img"
								:preview-src-list="post.images"
								:initial-index="index"
								fit="cover"
								class="image-item"
							/>
						</div>
						<div v-if="post.location" class="location">
							<el-icon><Location /></el-icon>
							{{ post.location }}
						</div>
					</div>

					<!-- 互动数据 -->
					<div class="post-footer">
						<div class="interact-item" @click.stop="toggleLike(post)">
							<el-icon :color="post.isLiked ? '#f56c6c' : '#909399'">
								<component :is="post.isLiked ? 'StarFilled' : 'Star'" />
							</el-icon>
							<span>{{ post.likeCount }}</span>
						</div>
						<div class="interact-item">
							<el-icon><ChatDotRound /></el-icon>
							<span>{{ post.commentCount }}</span>
						</div>
						<div class="interact-item">
							<el-icon><View /></el-icon>
							<span>{{ post.viewCount }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="pagination">
				<el-pagination
					v-model:current-page="currentPage"
					:page-size="10"
					:total="total"
					layout="prev, pager, next"
					@current-change="loadPostList"
				/>
			</div>
		</el-card>

		<!-- 发布帖子按钮 -->
		<el-button type="primary" class="publish-btn" circle size="large" @click="showPublishDialog">
			<el-icon><Plus /></el-icon>
		</el-button>

		<!-- 发布帖子对话框 -->
		<el-dialog v-model="publishDialogVisible" title="发布帖子" width="600px">
			<el-form :model="publishForm" label-width="80px">
				<el-form-item label="帖子内容">
					<el-input
						v-model="publishForm.content"
						type="textarea"
						:rows="4"
						placeholder="分享你的想法..."
						maxlength="500"
						show-word-limit
					/>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload
						action="/dev/admin/base/comm/upload"
						:headers="uploadHeaders"
						list-type="picture-card"
						:on-success="handleUploadSuccess"
						:on-remove="handleRemove"
						:file-list="imageList"
						:limit="9"
					>
						<el-icon><Plus /></el-icon>
					</el-upload>
				</el-form-item>
				<el-form-item label="定位">
					<el-input v-model="publishForm.location" placeholder="请输入地址" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="publishDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handlePublish" :loading="publishing">发布</el-button>
			</template>
		</el-dialog>

		<!-- 帖子详情对话框 -->
		<el-dialog v-model="detailDialogVisible" title="帖子详情" width="800px">
			<div v-if="currentPost" class="post-detail">
				<!-- 帖子信息 -->
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

				<div class="detail-footer">
					<el-button :type="currentPost.isLiked ? 'danger' : 'default'" @click="toggleLike(currentPost)">
						<el-icon><StarFilled v-if="currentPost.isLiked" /><Star v-else /></el-icon>
						{{ currentPost.isLiked ? '已点赞' : '点赞' }} ({{ currentPost.likeCount }})
					</el-button>
				</div>

				<!-- 评论列表 -->
				<div class="comment-section">
					<div class="comment-title">评论 ({{ commentList.length }})</div>

					<div class="comment-input">
						<el-input
							v-model="commentContent"
							placeholder="说点什么..."
							@keyup.enter="handleComment"
						>
							<template #append>
								<el-button @click="handleComment" :loading="commenting">发送</el-button>
							</template>
						</el-input>
					</div>

					<div class="comment-list">
						<div v-for="comment in commentList" :key="comment.id" class="comment-item">
							<el-avatar :src="comment.userAvatar" :size="36" />
							<div class="comment-content">
								<div class="comment-header">
									<span class="nick-name">{{ comment.userNickName }}</span>
									<span class="time">{{ comment.createTime }}</span>
								</div>
								<div class="comment-text">{{ comment.content }}</div>

								<!-- 回复列表 -->
								<div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
									<div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
										<span class="nick-name">{{ reply.userNickName }}</span>
										<span v-if="reply.replyUserNickName"> 回复 </span>
										<span v-if="reply.replyUserNickName" class="nick-name">{{ reply.replyUserNickName }}</span>
										<span>: {{ reply.content }}</span>
									</div>
								</div>

								<div class="comment-footer">
									<el-button text size="small" @click="showReplyInput(comment)">回复</el-button>
								</div>

								<!-- 回复输入框 -->
								<div v-if="replyingCommentId === comment.id" class="reply-input">
									<el-input
										v-model="replyContent"
										placeholder="回复评论..."
										size="small"
										@keyup.enter="handleReply(comment)"
									>
										<template #append>
											<el-button size="small" @click="handleReply(comment)">发送</el-button>
										</template>
									</el-input>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="shequ-test">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, StarFilled, Star, ChatDotRound, View, Location } from '@element-plus/icons-vue';
import { useCool } from '/@/cool';
import { useBase } from '/$/base';

const { service } = useCool();
const { user } = useBase();

const listType = ref('latest');
const postList = ref<any[]>([]);
const currentPage = ref(1);
const total = ref(0);

const publishDialogVisible = ref(false);
const publishForm = ref({
	content: '',
	location: '',
	images: []
});
const imageList = ref<any[]>([]);
const publishing = ref(false);

// 使用 computed 获取 token
const uploadHeaders = computed(() => ({
	Authorization: user.token
}));

const detailDialogVisible = ref(false);
const currentPost = ref<any>(null);
const commentList = ref<any[]>([]);
const commentContent = ref('');
const commenting = ref(false);

const replyingCommentId = ref<number | null>(null);
const replyContent = ref('');

// 加载帖子列表
const loadPostList = async () => {
	try {
		// 使用管理后台的接口，不需要用户登录
		const params: any = {
			page: currentPage.value,
			size: 10,
			keyWord: '',
			order: listType.value === 'hot' ? 'likeCount' : 'createTime',
			sort: 'desc'
		};

		// 精华筛选
		if (listType.value === 'essence') {
			params.isEssence = 1;
		}

		const res = await service.shequ.post.page(params);
		postList.value = res.list || [];
		total.value = res.pagination?.total || 0;
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 切换列表类型
const handleTypeChange = () => {
	currentPage.value = 1;
	loadPostList();
};

// 点赞/取消点赞
const toggleLike = async (post: any) => {
	try {
		// 管理员测试模式，直接修改数据
		const newCount = post.isLiked ? post.likeCount - 1 : post.likeCount + 1;
		await service.shequ.post.update({
			id: post.id,
			likeCount: newCount
		});
		post.isLiked = !post.isLiked;
		post.likeCount = newCount;
		ElMessage.success(post.isLiked ? '点赞成功' : '已取消点赞');
	} catch (error: any) {
		ElMessage.error(error.message || '操作失败');
	}
};

// 查看帖子详情
const viewPost = async (post: any) => {
	try {
		const res = await service.shequ.post.info({ id: post.id });
		currentPost.value = res;
		currentPost.value.isLiked = post.isLiked || false;
		detailDialogVisible.value = true;
		loadCommentList(post.id);
	} catch (error: any) {
		ElMessage.error(error.message || '加载失败');
	}
};

// 加载评论列表
const loadCommentList = async (postId: number) => {
	try {
		const res = await service.shequ.comment.page({
			postId,
			page: 1,
			size: 100
		});
		commentList.value = res.list || [];
	} catch (error: any) {
		ElMessage.error(error.message || '加载评论失败');
	}
};

// 显示发布对话框
const showPublishDialog = () => {
	publishForm.value = { content: '', location: '', images: [] };
	imageList.value = [];
	publishDialogVisible.value = true;
};

// 图片上传成功
const handleUploadSuccess = (response: any) => {
	if (response.code === 1000) {
		publishForm.value.images.push(response.data);
	}
};

// 移除图片
const handleRemove = (file: any) => {
	const index = publishForm.value.images.indexOf(file.response?.data);
	if (index > -1) {
		publishForm.value.images.splice(index, 1);
	}
};

// 发布帖子
const handlePublish = async () => {
	if (!publishForm.value.content) {
		ElMessage.warning('请输入帖子内容');
		return;
	}

	publishing.value = true;
	try {
		// 使用管理后台接口添加
		await service.shequ.post.add({
			...publishForm.value,
			userId: 1, // 测试用户ID
			userNickName: '测试用户',
			userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			status: 0 // 待审核
		});
		ElMessage.success('发布成功，等待审核');
		publishDialogVisible.value = false;
		loadPostList();
	} catch (error: any) {
		ElMessage.error(error.message || '发布失败');
	} finally {
		publishing.value = false;
	}
};

// 发表评论
const handleComment = async () => {
	if (!commentContent.value) {
		ElMessage.warning('请输入评论内容');
		return;
	}

	commenting.value = true;
	try {
		await service.shequ.comment.add({
			postId: currentPost.value.id,
			content: commentContent.value,
			userId: 1,
			userNickName: '测试用户',
			userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			status: 1 // 直接发布
		});
		ElMessage.success('评论成功');
		commentContent.value = '';
		loadCommentList(currentPost.value.id);
		// 更新评论数
		currentPost.value.commentCount += 1;
	} catch (error: any) {
		ElMessage.error(error.message || '评论失败');
	} finally {
		commenting.value = false;
	}
};

// 显示回复输入框
const showReplyInput = (comment: any) => {
	replyingCommentId.value = comment.id;
	replyContent.value = '';
};

// 回复评论
const handleReply = async (comment: any) => {
	if (!replyContent.value) {
		ElMessage.warning('请输入回复内容');
		return;
	}

	try {
		await service.shequ.comment.add({
			postId: currentPost.value.id,
			content: replyContent.value,
			parentId: comment.id,
			userId: 1,
			userNickName: '测试用户',
			userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
			replyUserId: comment.userId,
			replyUserNickName: comment.userNickName,
			status: 1
		});
		ElMessage.success('回复成功');
		replyContent.value = '';
		replyingCommentId.value = null;
		loadCommentList(currentPost.value.id);
		// 更新评论数
		currentPost.value.commentCount += 1;
	} catch (error: any) {
		ElMessage.error(error.message || '回复失败');
	}
};

onMounted(() => {
	loadPostList();
});
</script>

<style scoped lang="scss">
.community-test {
	padding: 20px;
	max-width: 800px;
	margin: 0 auto;
	position: relative;

	.mb-20 {
		margin-bottom: 20px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.post-list {
		.post-item {
			padding: 16px;
			border-bottom: 1px solid #f0f0f0;
			cursor: pointer;
			transition: background 0.3s;

			&:hover {
				background: #fafafa;
			}

			.post-header {
				display: flex;
				align-items: center;
				margin-bottom: 12px;

				.user-info {
					margin-left: 12px;

					.nick-name {
						font-weight: 500;
						font-size: 14px;
					}

					.create-time {
						color: #999;
						font-size: 12px;
						margin-top: 2px;
					}
				}
			}

			.post-content {
				.content-text {
					font-size: 14px;
					line-height: 1.6;
					margin-bottom: 8px;
				}

				.content-images {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 8px;
					margin-bottom: 8px;

					.image-item {
						width: 100%;
						height: 120px;
						border-radius: 4px;
					}
				}

				.location {
					display: flex;
					align-items: center;
					color: #666;
					font-size: 12px;
					gap: 4px;
				}
			}

			.post-footer {
				display: flex;
				gap: 20px;
				margin-top: 12px;

				.interact-item {
					display: flex;
					align-items: center;
					gap: 4px;
					color: #909399;
					font-size: 13px;
					cursor: pointer;

					&:hover {
						color: #409eff;
					}
				}
			}
		}
	}

	.pagination {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.publish-btn {
		position: fixed;
		right: 40px;
		bottom: 40px;
		width: 56px;
		height: 56px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
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
				color: #666;
				font-size: 14px;
				gap: 6px;
			}
		}

		.detail-footer {
			padding: 20px 0;
			border-top: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
			margin-bottom: 20px;
		}

		.comment-section {
			.comment-title {
				font-size: 16px;
				font-weight: 500;
				margin-bottom: 16px;
			}

			.comment-input {
				margin-bottom: 20px;
			}

			.comment-list {
				.comment-item {
					display: flex;
					gap: 12px;
					margin-bottom: 20px;

					.comment-content {
						flex: 1;

						.comment-header {
							display: flex;
							align-items: center;
							gap: 12px;
							margin-bottom: 8px;

							.nick-name {
								font-weight: 500;
								font-size: 14px;
							}

							.time {
								color: #999;
								font-size: 12px;
							}
						}

						.comment-text {
							font-size: 14px;
							line-height: 1.6;
							margin-bottom: 8px;
						}

						.reply-list {
							background: #f5f5f5;
							padding: 12px;
							border-radius: 4px;
							margin-bottom: 8px;

							.reply-item {
								font-size: 13px;
								line-height: 1.8;
								color: #666;

								.nick-name {
									color: #409eff;
									font-weight: 500;
								}
							}
						}

						.comment-footer {
							display: flex;
							gap: 16px;
						}

						.reply-input {
							margin-top: 8px;
						}
					}
				}
			}
		}
	}
}
</style>
