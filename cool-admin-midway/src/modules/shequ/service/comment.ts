import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShequCommentEntity } from '../entity/comment';
import { ShequLikeEntity } from '../entity/like';
import { ShequPostEntity } from '../entity/post';

/**
 * 评论服务
 */
@Provide()
export class ShequCommentService extends BaseService {
  @InjectEntityModel(ShequCommentEntity)
  shequCommentEntity: Repository<ShequCommentEntity>;

  @InjectEntityModel(ShequLikeEntity)
  shequLikeEntity: Repository<ShequLikeEntity>;

  @InjectEntityModel(ShequPostEntity)
  shequPostEntity: Repository<ShequPostEntity>;

  @Inject()
  ctx;

  /**
   * 获取帖子的评论列表（带子评论）
   */
  async getCommentsByPostId(postId: number, userId?: number) {
    // 获取所有评论
    const comments = await this.shequCommentEntity.find({
      where: { postId, status: 1 },
      order: { createTime: 'DESC' },
    });

    // 获取用户点赞的评论
    let likedCommentIds = [];
    if (userId) {
      const commentIds = comments.map(c => c.id);
      const likes = await this.shequLikeEntity.find({
        where: { userId, targetId: In(commentIds), type: 2 },
      });
      likedCommentIds = likes.map(like => like.targetId);
    }

    // 构建树形结构
    const commentMap = new Map();
    comments.forEach(comment => {
      comment.replies = [];
      comment.isLiked = likedCommentIds.includes(comment.id);
      commentMap.set(comment.id, comment);
    });

    const rootComments = [];
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  /**
   * 发布评论
   */
  async publish(data, userId: number) {
    // 获取用户信息（如果查询失败使用默认值）
    try {
      const userInfo = await this.nativeQuery(
        'SELECT nickName, avatarUrl FROM user_info WHERE id = ?',
        [userId]
      );

      if (userInfo && userInfo.length > 0) {
        data.userNickName = userInfo[0].nickName;
        data.userAvatar = userInfo[0].avatarUrl;
      } else {
        // 使用默认用户信息
        data.userNickName = '测试用户';
        data.userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
      }
    } catch (error) {
      // 查询失败，使用默认值
      data.userNickName = '测试用户';
      data.userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
    }

    // 如果是回复评论，获取被回复用户信息
    if (data.replyUserId) {
      try {
        const replyUserInfo = await this.nativeQuery(
          'SELECT nickName FROM user_info WHERE id = ?',
          [data.replyUserId]
        );
        if (replyUserInfo && replyUserInfo.length > 0) {
          data.replyUserNickName = replyUserInfo[0].nickName;
        } else {
          data.replyUserNickName = '测试用户';
        }
      } catch (error) {
        data.replyUserNickName = '测试用户';
      }
    }

    data.userId = userId;
    const comment = await this.shequCommentEntity.save(data);

    // 更新帖子评论数
    await this.nativeQuery(
      'UPDATE shequ_post SET commentCount = commentCount + 1 WHERE id = ?',
      [data.postId]
    );

    return comment;
  }

  /**
   * 删除评论
   */
  async remove(id: number) {
    const comment = await this.shequCommentEntity.findOne({ where: { id } });
    if (comment) {
      // 删除评论
      await this.shequCommentEntity.delete(id);

      // 删除子评论
      await this.shequCommentEntity.delete({ parentId: id });

      // 更新帖子评论数
      await this.nativeQuery(
        'UPDATE shequ_post SET commentCount = commentCount - 1 WHERE id = ?',
        [comment.postId]
      );
    }
  }

  /**
   * 点赞/取消点赞评论
   */
  async toggleLike(commentId: number, userId: number) {
    // 检查是否已点赞
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: commentId, type: 2 },
    });

    if (like) {
      // 取消点赞
      await this.shequLikeEntity.delete(like.id);
      await this.nativeQuery(
        'UPDATE shequ_comment SET likeCount = likeCount - 1 WHERE id = ?',
        [commentId]
      );
      return { action: 'unlike' };
    } else {
      // 点赞
      await this.shequLikeEntity.save({
        userId,
        targetId: commentId,
        type: 2,
      });
      await this.nativeQuery(
        'UPDATE shequ_comment SET likeCount = likeCount + 1 WHERE id = ?',
        [commentId]
      );
      return { action: 'like' };
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: number, userId: number) {
    // 检查是否已点赞
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: commentId, type: 2 },
    });

    if (like) {
      throw new Error('已经点赞过了');
    }

    // 点赞
    await this.shequLikeEntity.save({
      userId,
      targetId: commentId,
      type: 2,
    });
    await this.nativeQuery(
      'UPDATE shequ_comment SET likeCount = likeCount + 1 WHERE id = ?',
      [commentId]
    );
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(commentId: number, userId: number) {
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: commentId, type: 2 },
    });

    if (!like) {
      throw new Error('还未点赞');
    }

    await this.shequLikeEntity.delete(like.id);
    await this.nativeQuery(
      'UPDATE shequ_comment SET likeCount = likeCount - 1 WHERE id = ?',
      [commentId]
    );
  }

  /**
   * 获取评论列表（用户端，分页）
   */
  async getCommentList(postId: number, page: number, size: number) {
    const sql = `
      SELECT
        a.*,
        u.nickName as userNickName,
        u.avatarUrl as userAvatar
      FROM
        shequ_comment a
        LEFT JOIN user_info u ON a.userId = u.id
      WHERE a.postId = ${postId} AND a.status = 1 AND a.parentId IS NULL
      ORDER BY a.createTime DESC
    `;

    const result = await this.sqlRenderPage(sql, { page, size });

    // 获取当前用户
    const userId = this.ctx.user?.id;

    // 为每个评论加载回复列表
    for (const comment of result.list) {
      // 使用SQL查询回复并关联用户信息
      const repliesSql = `
        SELECT
          a.*,
          u.nickName as userNickName,
          u.avatarUrl as userAvatar,
          ru.nickName as replyUserNickName
        FROM
          shequ_comment a
          LEFT JOIN user_info u ON a.userId = u.id
          LEFT JOIN user_info ru ON a.replyUserId = ru.id
        WHERE a.parentId = ${comment.id} AND a.status = 1
        ORDER BY a.createTime ASC
      `;
      const replies = await this.nativeQuery(repliesSql);
      comment.replies = replies;

      // 检查点赞状态
      if (userId) {
        const allCommentIds = [comment.id, ...replies.map(r => r.id)];
        const likes = await this.shequLikeEntity.find({
          where: { userId, targetId: In(allCommentIds), type: 2 },
        });
        const likedIds = likes.map(like => like.targetId);

        comment.isLiked = likedIds.includes(comment.id);
        comment.replies = replies.map(r => ({
          ...r,
          isLiked: likedIds.includes(r.id)
        }));
      }
    }

    return result;
  }

  /**
   * 发表评论（用户端）
   */
  async publishComment(data: any) {
    const userId = data.userId;

    // 获取用户信息
    const userInfo = await this.nativeQuery(
      'SELECT nickName, avatarUrl FROM user_info WHERE id = ?',
      [userId]
    );

    if (userInfo && userInfo.length > 0) {
      data.userNickName = userInfo[0].nickName;
      data.userAvatar = userInfo[0].avatarUrl;
    }

    // 如果是回复评论，获取被回复用户信息
    if (data.replyUserId) {
      const replyUserInfo = await this.nativeQuery(
        'SELECT nickName FROM user_info WHERE id = ?',
        [data.replyUserId]
      );
      if (replyUserInfo && replyUserInfo.length > 0) {
        data.replyUserNickName = replyUserInfo[0].nickName;
      }
    }

    // 默认状态为已发布（或待审核，根据需求）
    data.status = 1;

    const comment = await this.shequCommentEntity.save(data);

    // 更新帖子评论数
    await this.nativeQuery(
      'UPDATE shequ_post SET commentCount = commentCount + 1 WHERE id = ?',
      [data.postId]
    );

    return comment;
  }

  /**
   * 删除我的评论
   */
  async deleteMyComment(id: number, userId: number) {
    const comment = await this.shequCommentEntity.findOne({ where: { id, userId } });

    if (!comment) {
      throw new Error('评论不存在或无权删除');
    }

    // 删除评论
    await this.shequCommentEntity.delete(id);

    // 删除子评论
    const replies = await this.shequCommentEntity.find({ where: { parentId: id } });
    if (replies.length > 0) {
      await this.shequCommentEntity.delete(replies.map(r => r.id));
    }

    // 更新帖子评论数（减去评论和回复的总数）
    const totalCount = 1 + replies.length;
    await this.nativeQuery(
      'UPDATE shequ_post SET commentCount = commentCount - ? WHERE id = ? AND commentCount >= ?',
      [totalCount, comment.postId, totalCount]
    );
  }
}
