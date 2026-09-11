import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductReviewEntity } from '../entity/review';
import { ProductReviewLikeEntity } from '../entity/review_like';

/**
 * 商品评价服务
 */
@Provide()
export class ProductReviewService extends BaseService {
  @InjectEntityModel(ProductReviewEntity)
  productReviewEntity: Repository<ProductReviewEntity>;

  @InjectEntityModel(ProductReviewLikeEntity)
  productReviewLikeEntity: Repository<ProductReviewLikeEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   */
  async page(query) {
    const { keyWord, productId, userId, status, minRating, maxRating } = query;

    const sql = `
      SELECT
        a.*
      FROM
        product_review a
      WHERE 1 = 1
        ${this.setSql(keyWord, 'AND a.content LIKE ?', [`%${keyWord}%`])}
        ${this.setSql(productId, 'AND a.productId = ?', [productId])}
        ${this.setSql(userId, 'AND a.userId = ?', [userId])}
        ${this.setSql(status !== undefined, 'AND a.status = ?', [status])}
        ${this.setSql(minRating, 'AND a.rating >= ?', [minRating])}
        ${this.setSql(maxRating, 'AND a.rating <= ?', [maxRating])}
    `;

    return await this.sqlRenderPage(sql, query);
  }

  /**
   * 更新状态（审核）
   */
  async updateStatus(id: number, status: number, replyContent?: string) {
    await this.productReviewEntity.update(id, { status, replyContent });
  }

  /**
   * 商家回复
   */
  async replyReview(id: number, replyContent: string) {
    await this.productReviewEntity.update(id, {
      replyContent,
      replyTime: new Date().toISOString(),
    });
  }

  /**
   * 检查用户是否点赞
   */
  async checkUserLike(reviewIds: number[], userId: number) {
    if (!userId || reviewIds.length === 0) {
      return [];
    }

    const likes = await this.productReviewLikeEntity.find({
      where: { userId, reviewId: In(reviewIds) },
    });

    return likes.map(like => like.reviewId);
  }

  /**
   * 获取商品评价列表（用户端）
   */
  async getReviewList(productId: number, page: number, size: number) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT
        a.*
      FROM
        product_review a
      WHERE a.productId = ? AND a.status = 1
      ORDER BY a.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM product_review a
      WHERE a.productId = ? AND a.status = 1
    `;

    const list = await this.nativeQuery(sql, [productId, offset, size]);
    const countResult = await this.nativeQuery(countSql, [productId]);
    const total = countResult[0]?.total || 0;

    // 检查当前用户是否点赞
    const userId = this.ctx.user?.id;
    if (userId && list.length > 0) {
      const reviewIds = list.map((item: any) => item.id);
      const likedIds = await this.checkUserLike(reviewIds, userId);
      list.forEach((item: any) => {
        item.isLiked = likedIds.includes(item.id);
      });
    }

    return {
      list,
      pagination: {
        page,
        size,
        total,
      },
    };
  }

  /**
   * 发布评价
   */
  async publishReview(data: any) {
    const userId = data.userId;

    // 获取用户信息
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
        data.userAvatar =
          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
      }
    } catch (error) {
      // 如果查询失败，使用默认值
      data.userNickName = '测试用户';
      data.userAvatar =
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
    }

    // 默认状态为待审核
    data.status = 0;

    const review = await this.productReviewEntity.save(data);

    // 更新商品评价数
    await this.nativeQuery(
      'UPDATE product SET reviewCount = reviewCount + 1 WHERE id = ?',
      [data.productId]
    );

    // 重新计算商品平均分
    await this.updateProductRating(data.productId);

    return review;
  }

  /**
   * 更新商品平均评分
   */
  async updateProductRating(productId: number) {
    const result = await this.nativeQuery(
      'SELECT AVG(rating) as avgRating FROM product_review WHERE productId = ? AND status = 1',
      [productId]
    );

    if (result && result.length > 0 && result[0].avgRating) {
      const avgRating = parseFloat(result[0].avgRating).toFixed(2);
      await this.nativeQuery('UPDATE product SET rating = ? WHERE id = ?', [
        avgRating,
        productId,
      ]);
    }
  }

  /**
   * 点赞评价
   */
  async likeReview(reviewId: number, userId: number) {
    // 检查是否已点赞
    const like = await this.productReviewLikeEntity.findOne({
      where: { userId, reviewId },
    });

    if (like) {
      throw new Error('已经点赞过了');
    }

    // 点赞
    await this.productReviewLikeEntity.save({
      userId,
      reviewId,
    });

    // 增加点赞数
    await this.nativeQuery(
      'UPDATE product_review SET likeCount = likeCount + 1 WHERE id = ?',
      [reviewId]
    );
  }

  /**
   * 取消点赞
   */
  async unlikeReview(reviewId: number, userId: number) {
    const like = await this.productReviewLikeEntity.findOne({
      where: { userId, reviewId },
    });

    if (!like) {
      throw new Error('还未点赞');
    }

    // 取消点赞
    await this.productReviewLikeEntity.delete(like.id);

    // 减少点赞数
    await this.nativeQuery(
      'UPDATE product_review SET likeCount = likeCount - 1 WHERE id = ? AND likeCount > 0',
      [reviewId]
    );
  }
}
