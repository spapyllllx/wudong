import { Get, Post, Body, Inject, Provide, Query } from '@midwayjs/core';
import { CoolController, BaseController, CoolTag, TagTypes, CoolUrlTag } from '@cool-midway/core';
import { ShequPostEntity } from '../../entity/post';
import { ShequPostService } from '../../service/post';
import { ShequCommentService } from '../../service/comment';

/**
 * 社区（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/shequ/community')
export class AppShequCommunityController extends BaseController {
  @Inject()
  shequPostService: ShequPostService;

  @Inject()
  shequCommentService: ShequCommentService;

  @Inject()
  ctx;

  /**
   * 首页帖子列表 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/postList', { summary: '首页帖子列表' })
  async postList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body('type') type?: string // hot: 热门, essence: 精华, latest: 最新
  ) {
    const result = await this.shequPostService.getPostList(page, size, type);
    return this.ok(result);
  }

  /**
   * 帖子详情 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/postDetail', { summary: '帖子详情' })
  async postDetail(@Query('id') id: number) {
    const post = await this.shequPostService.getPostDetail(id);
    return this.ok(post);
  }

  /**
   * 评论列表 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/commentList', { summary: '评论列表' })
  async commentList(@Body('postId') postId: number) {
    const userId = this.ctx.user?.id;
    const result = await this.shequCommentService.getCommentsByPostId(postId, userId);
    return this.ok(result);
  }

  /**
   * 发布帖子
   */
  @Post('/publishPost', { summary: '发布帖子' })
  async publishPost(@Body() data: any) {
    // 测试模式：如果没有userId，使用测试用户ID
    let userId = this.ctx.user?.id;
    if (!userId) {
      // 使用固定的测试用户ID
      userId = 1;
    }

    const result = await this.shequPostService.publishPost({
      ...data,
      userId
    });
    return this.ok(result);
  }

  /**
   * 删除我的帖子
   */
  @Post('/deleteMyPost', { summary: '删除我的帖子' })
  async deleteMyPost(@Body('id') id: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequPostService.deleteMyPost(id, userId);
    return this.ok();
  }

  /**
   * 点赞帖子
   */
  @Post('/likePost', { summary: '点赞帖子' })
  async likePost(@Body('postId') postId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequPostService.likePost(postId, userId);
    return this.ok();
  }

  /**
   * 取消点赞
   */
  @Post('/unlikePost', { summary: '取消点赞' })
  async unlikePost(@Body('postId') postId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequPostService.unlikePost(postId, userId);
    return this.ok();
  }

  /**
   * 发表评论
   */
  @Post('/publishComment', { summary: '发表评论' })
  async publishComment(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.shequCommentService.publishComment({
      ...data,
      userId
    });
    return this.ok(result);
  }

  /**
   * 删除我的评论
   */
  @Post('/deleteMyComment', { summary: '删除我的评论' })
  async deleteMyComment(@Body('id') id: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequCommentService.deleteMyComment(id, userId);
    return this.ok();
  }

  /**
   * 点赞评论
   */
  @Post('/likeComment', { summary: '点赞评论' })
  async likeComment(@Body('commentId') commentId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequCommentService.likeComment(commentId, userId);
    return this.ok();
  }

  /**
   * 取消点赞评论
   */
  @Post('/unlikeComment', { summary: '取消点赞评论' })
  async unlikeComment(@Body('commentId') commentId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.shequCommentService.unlikeComment(commentId, userId);
    return this.ok();
  }

  /**
   * 我的帖子列表
   */
  @Post('/myPostList', { summary: '我的帖子列表' })
  async myPostList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10
  ) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      throw new Error('用户未登录');
    }
    const result = await this.shequPostService.getMyPostList(userId, page, size);
    return this.ok(result);
  }

  /**
   * 我点赞的帖子列表
   */
  @Post('/myLikeList', { summary: '我点赞的帖子列表' })
  async myLikeList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10
  ) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.shequPostService.getMyLikeList(userId, page, size);
    return this.ok(result);
  }

  /**
   * 相关推荐帖子 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/recommendPosts', { summary: '相关推荐帖子' })
  async recommendPosts(
    @Query('postId') postId: number,
    @Query('limit') limit: number = 5
  ) {
    const result = await this.shequPostService.getRecommendPosts(postId, limit);
    return this.ok(result);
  }
}
