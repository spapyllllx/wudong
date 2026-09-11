import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ShequPostEntity } from '../entity/post';
import { ShequLikeEntity } from '../entity/like';
import { ShequCommentEntity } from '../entity/comment';

/**
 * 帖子服务
 */
@Provide()
export class ShequPostService extends BaseService {
  @InjectEntityModel(ShequPostEntity)
  shequPostEntity: Repository<ShequPostEntity>;

  @InjectEntityModel(ShequLikeEntity)
  shequLikeEntity: Repository<ShequLikeEntity>;

  @InjectEntityModel(ShequCommentEntity)
  shequCommentEntity: Repository<ShequCommentEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   */
  async page(query) {
    const { keyWord, userId, status, isEssence, isTop, scenicId } = query;

    const sql = `
      SELECT
        a.*
      FROM
        shequ_post a
      WHERE 1 = 1
        ${this.setSql(keyWord, 'AND a.content LIKE ?', [`%${keyWord}%`])}
        ${this.setSql(userId, 'AND a.userId = ?', [userId])}
        ${this.setSql(status !== undefined, 'AND a.status = ?', [status])}
        ${this.setSql(isEssence !== undefined, 'AND a.isEssence = ?', [isEssence])}
        ${this.setSql(isTop !== undefined, 'AND a.isTop = ?', [isTop])}
        ${this.setSql(scenicId, 'AND a.scenicId = ?', [scenicId])}
    `;

    return await this.sqlRenderPage(sql, query);
  }

  /**
   * 发布帖子
   */
  async publish(data, userId: number) {
    // 获取用户信息
    const userInfo = await this.nativeQuery(
      'SELECT nickName, avatarUrl FROM user_info WHERE id = ?',
      [userId]
    );

    if (userInfo && userInfo.length > 0) {
      data.userNickName = userInfo[0].nickName;
      data.userAvatar = userInfo[0].avatarUrl;
    }

    data.userId = userId;
    return await this.shequPostEntity.save(data);
  }

  /**
   * 更新状态（审核）
   */
  async updateStatus(id: number, status: number, auditRemark?: string) {
    await this.shequPostEntity.update(id, { status, auditRemark });
  }

  /**
   * 设置精华
   */
  async setEssence(id: number, isEssence: number) {
    await this.shequPostEntity.update(id, { isEssence });
  }

  /**
   * 设置置顶
   */
  async setTop(id: number, isTop: number) {
    await this.shequPostEntity.update(id, { isTop });
  }

  /**
   * 点赞/取消点赞
   */
  async toggleLike(postId: number, userId: number) {
    // 检查是否已点赞
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: postId, type: 1 },
    });

    if (like) {
      // 取消点赞
      await this.shequLikeEntity.delete(like.id);
      await this.nativeQuery(
        'UPDATE shequ_post SET likeCount = likeCount - 1 WHERE id = ?',
        [postId]
      );
      return { action: 'unlike' };
    } else {
      // 点赞
      await this.shequLikeEntity.save({
        userId,
        targetId: postId,
        type: 1,
      });
      await this.nativeQuery(
        'UPDATE shequ_post SET likeCount = likeCount + 1 WHERE id = ?',
        [postId]
      );
      return { action: 'like' };
    }
  }

  /**
   * 增加浏览数
   */
  async increaseViewCount(postId: number) {
    await this.nativeQuery(
      'UPDATE shequ_post SET viewCount = viewCount + 1 WHERE id = ?',
      [postId]
    );
  }

  /**
   * 增加分享数
   */
  async increaseShareCount(postId: number) {
    await this.nativeQuery(
      'UPDATE shequ_post SET shareCount = shareCount + 1 WHERE id = ?',
      [postId]
    );
  }

  /**
   * 获取用户点赞的帖子列表
   */
  async getLikedPosts(userId: number) {
    const likes = await this.shequLikeEntity.find({
      where: { userId, type: 1 },
      order: { createTime: 'DESC' },
    });

    if (likes.length === 0) {
      return [];
    }

    const postIds = likes.map(like => like.targetId);
    return await this.shequPostEntity.find({
      where: { id: In(postIds) },
    });
  }

  /**
   * 检查用户是否点赞
   */
  async checkUserLike(postIds: number[], userId: number) {
    if (!userId || postIds.length === 0) {
      return [];
    }

    const likes = await this.shequLikeEntity.find({
      where: { userId, targetId: In(postIds), type: 1 },
    });

    return likes.map(like => like.targetId);
  }

  /**
   * 获取帖子列表（用户端）
   */
  async getPostList(page: number, size: number, type?: string) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT
        a.*,
        (SELECT COUNT(*) FROM shequ_like WHERE targetId = a.id AND type = 1) as realLikeCount
      FROM
        shequ_post a
      WHERE a.status = 1
        ${type === 'essence' ? 'AND a.isEssence = 1' : ''}
      ORDER BY ${type === 'hot' ? '(a.likeCount + a.commentCount) DESC, ' : ''}a.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM shequ_post a
      WHERE a.status = 1
        ${type === 'essence' ? 'AND a.isEssence = 1' : ''}
    `;

    const list = await this.nativeQuery(sql, [offset, size]);
    const countResult = await this.nativeQuery(countSql, []);
    const total = countResult[0]?.total || 0;

    // 检查当前用户是否点赞
    const userId = this.ctx.user?.id;
    if (userId && list.length > 0) {
      const postIds = list.map((item: any) => item.id);
      const likedIds = await this.checkUserLike(postIds, userId);
      list.forEach((item: any) => {
        item.isLiked = likedIds.includes(item.id);
      });
    }

    return {
      list,
      pagination: {
        page,
        size,
        total
      }
    };
  }

  /**
   * 获取帖子详情（用户端）
   */
  async getPostDetail(id: number) {
    const post = await this.shequPostEntity.findOne({ where: { id } });

    if (!post) {
      throw new Error('帖子不存在');
    }

    // 增加浏览数
    await this.increaseViewCount(id);

    // 检查当前用户是否点赞
    const userId = this.ctx.user?.id;
    let isLiked = false;
    if (userId) {
      const likedIds = await this.checkUserLike([id], userId);
      isLiked = likedIds.includes(id);
    }

    return {
      ...post,
      isLiked
    };
  }

  /**
   * 发布帖子（用户端）
   */
  async publishPost(data: any) {
    const userId = data.userId;

    // 获取用户信息（如果表不存在或查询失败，使用默认值）
    try {
      const userInfo = await this.nativeQuery(
        'SELECT nickName, avatarUrl FROM user_info WHERE id = ?',
        [userId]
      );

      if (userInfo && userInfo.length > 0) {
        data.userNickName = userInfo[0].nickName;
        data.userAvatar = userInfo[0].avatarUrl;
      } else {
        // 使用默认测试用户信息
        data.userNickName = '测试用户';
        data.userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
      }
    } catch (error) {
      // 如果查询失败（表不存在等），使用默认值
      data.userNickName = '测试用户';
      data.userAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
    }

    // 默认状态为待审核
    data.status = 0;

    return await this.shequPostEntity.save(data);
  }

  /**
   * 删除我的帖子
   */
  async deleteMyPost(id: number, userId: number) {
    const post = await this.shequPostEntity.findOne({ where: { id, userId } });

    if (!post) {
      throw new Error('帖子不存在或无权删除');
    }

    await this.shequPostEntity.delete(id);
  }

  /**
   * 点赞帖子
   */
  async likePost(postId: number, userId: number) {
    // 检查是否已点赞
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: postId, type: 1 },
    });

    if (like) {
      throw new Error('已经点赞过了');
    }

    // 点赞
    await this.shequLikeEntity.save({
      userId,
      targetId: postId,
      type: 1,
    });

    // 增加点赞数
    await this.nativeQuery(
      'UPDATE shequ_post SET likeCount = likeCount + 1 WHERE id = ?',
      [postId]
    );
  }

  /**
   * 取消点赞
   */
  async unlikePost(postId: number, userId: number) {
    const like = await this.shequLikeEntity.findOne({
      where: { userId, targetId: postId, type: 1 },
    });

    if (!like) {
      throw new Error('还未点赞');
    }

    // 取消点赞
    await this.shequLikeEntity.delete(like.id);

    // 减少点赞数
    await this.nativeQuery(
      'UPDATE shequ_post SET likeCount = likeCount - 1 WHERE id = ? AND likeCount > 0',
      [postId]
    );
  }

  /**
   * 我的帖子列表
   */
  async getMyPostList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT
        a.*
      FROM
        shequ_post a
      WHERE a.userId = ?
      ORDER BY a.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM shequ_post a
      WHERE a.userId = ?
    `;

    const list = await this.nativeQuery(sql, [userId, offset, size]);
    const countResult = await this.nativeQuery(countSql, [userId]);
    const total = countResult[0]?.total || 0;

    return {
      list,
      pagination: {
        page,
        size,
        total
      }
    };
  }

  /**
   * 我点赞的帖子列表
   */
  async getMyLikeList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT
        a.*,
        b.createTime as likeTime
      FROM
        shequ_post a
      INNER JOIN shequ_like b ON a.id = b.targetId AND b.type = 1
      WHERE b.userId = ?
      ORDER BY b.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM shequ_post a
      INNER JOIN shequ_like b ON a.id = b.targetId AND b.type = 1
      WHERE b.userId = ?
    `;

    const list = await this.nativeQuery(sql, [userId, offset, size]);
    const countResult = await this.nativeQuery(countSql, [userId]);
    const total = countResult[0]?.total || 0;

    // 标记所有帖子为已点赞
    list.forEach((item: any) => {
      item.isLiked = true;
    });

    return {
      list,
      pagination: {
        page,
        size,
        total
      }
    };
  }

  /**
   * 获取相关推荐帖子
   */
  async getRecommendPosts(postId: number, limit: number = 5) {
    // 获取当前帖子信息
    const currentPost = await this.shequPostEntity.findOne({ where: { id: postId } });

    if (!currentPost) {
      throw new Error('帖子不存在');
    }

    // 推荐策略：
    // 1. 优先推荐相同景点的其他帖子
    // 2. 其次推荐热门帖子（点赞+评论数高）
    // 3. 排除当前帖子
    const sql = `
      SELECT
        a.*
      FROM
        shequ_post a
      WHERE a.status = 1 AND a.id != ?
      ORDER BY
        CASE WHEN a.scenicId = ? AND a.scenicId IS NOT NULL THEN 0 ELSE 1 END,
        (a.likeCount + a.commentCount * 2) DESC,
        a.createTime DESC
      LIMIT ?
    `;

    const list = await this.nativeQuery(sql, [postId, currentPost.scenicId || 0, limit]);

    // 检查当前用户是否点赞
    const userId = this.ctx.user?.id;
    if (userId && list.length > 0) {
      const postIds = list.map((item: any) => item.id);
      const likedIds = await this.checkUserLike(postIds, userId);
      list.forEach((item: any) => {
        item.isLiked = likedIds.includes(item.id);
      });
    }

    return list;
  }
}
