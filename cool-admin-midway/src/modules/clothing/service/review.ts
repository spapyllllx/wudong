import { BaseService, CoolCommException } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { transformerJson } from '../entity/common';
import { ProductOrderEntity } from '../entity/order';
import { ProductOrderItemEntity } from '../entity/orderItem';
import { ProductEntity } from '../entity/product';
import { ProductReviewEntity } from '../entity/review';

/**
 * 商品评价
 */
@Provide()
export class ClothingReviewService extends BaseService {
  @InjectEntityModel(ProductReviewEntity)
  reviewEntity: Repository<ProductReviewEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductOrderEntity)
  orderEntity: Repository<ProductOrderEntity>;

  @InjectEntityModel(ProductOrderItemEntity)
  orderItemEntity: Repository<ProductOrderItemEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.reviewEntity);
  }

  /**
   * 提交评价(需登录)
   * 校验:订单存在、属于该用户、包含该商品(即"买了才能评"),同单同商品不可重复评。
   */
  async submit(userId: number, body: any) {
    const { orderId, productId, rating, content = '', images } = body || {};
    if (
      !Number.isInteger(Number(orderId)) ||
      Number(orderId) <= 0 ||
      !Number.isInteger(Number(productId)) ||
      Number(productId) <= 0
    ) {
      throw new CoolCommException('缺少订单或商品参数');
    }
    // 订单归属与商品包含校验
    const order = await this.orderEntity.findOneBy({ id: orderId });
    if (!order || order.userId !== userId || order.orderType !== 'product') {
      throw new CoolCommException('订单不存在或不属于当前用户');
    }
    if (order.status !== 'completed') {
      throw new CoolCommException('订单确认收货后才能评价');
    }
    const item = await this.orderItemEntity.findOneBy({
      orderId,
      productId,
    });
    if (!item) {
      throw new CoolCommException('该订单未包含此商品');
    }
    const already = await this.reviewEntity.findOneBy({ orderId, productId, userId });
    if (already) {
      throw new CoolCommException('该商品已评价,请勿重复提交');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new CoolCommException('评分须为1-5的整数');
    }
    if (String(content).length > 500) {
      throw new CoolCommException('评价内容不能超过500字');
    }
    if (images && (!Array.isArray(images) || images.length > 9)) {
      throw new CoolCommException('评价图片最多9张');
    }
    const product = await this.productEntity.findOneBy({ id: productId });
    if (!product) {
      throw new CoolCommException('商品不存在');
    }
    const res = await this.reviewEntity.insert({
      userId,
      orderId,
      productId,
      rating,
      content,
      images: images && images.length ? images : null,
    });
    return res.identifiers[0].id;
  }

  /**
   * 商家回复评价(admin)
   */
  async reply(id: number, replyContent: string) {
    const review = await this.reviewEntity.findOneBy({ id });
    if (!review) throw new CoolCommException('评价不存在');
    await this.reviewEntity.update(id, {
      replyContent: replyContent ? replyContent.trim().slice(0, 500) : null,
      repliedAt: new Date(),
    });
  }

  /**
   * 我的评价(分页,需登录)
   */
  async myReviews(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const rows: any[] = await this.nativeQuery(
      `SELECT r.id, r.order_id, r.product_id, r.rating, r.content, r.images,
              r.reply_content,
              DATE_FORMAT(r.replied_at, '%Y-%m-%d %H:%i:%s') replied_at,
              DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') created_at,
              p.title, p.main_image
       FROM product_reviews r
       LEFT JOIN products p ON p.id = r.product_id
       WHERE r.user_id = ?
       ORDER BY r.id DESC LIMIT ?,?`,
      [userId, offset, size]
    );
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM product_reviews WHERE user_id = ?`,
      [userId]
    );
    return {
      list: rows.map((row: any) => ({
        id: Number(row.id),
        order_id: Number(row.order_id),
        product_id: Number(row.product_id),
        title: row.title,
        main_image: row.main_image,
        rating: row.rating,
        content: row.content,
        images: transformerJson.from(row.images),
        reply_content: row.reply_content,
        replied_at: row.replied_at,
        created_at: row.created_at,
      })),
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }

  /**
   * 商品评价分页(公开)
   */
  async reviewPage(query: any) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size) || 10, 1), 50);
    const productId = Number(query.product_id || query.productId);
    // 非法商品 id:直接空列表(避免 NaN 拼进 SQL 抛原生报错)
    if (!Number.isInteger(productId) || productId <= 0) {
      return { list: [], pagination: { page, size, total: 0 } };
    }
    const rating = Number(query.rating);
    const where: string[] = ['r.product_id = ?'];
    const params: any[] = [productId];
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
      where.push('r.rating = ?');
      params.push(rating);
    }
    const whereSql = where.join(' AND ');
    const offset = (page - 1) * size;
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM product_reviews r WHERE ${whereSql}`,
      params
    );
    const list: any[] = await this.nativeQuery(
      `SELECT r.id, r.product_id, r.rating, r.content, r.images,
              r.reply_content,
              DATE_FORMAT(r.replied_at, '%Y-%m-%d %H:%i:%s') replied_at,
              DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') created_at,
              u.nickName u_nickname, u.avatarUrl u_avatar_url
       FROM product_reviews r
       LEFT JOIN user_info u ON u.id = r.user_id
       WHERE ${whereSql}
       ORDER BY r.id DESC LIMIT ?,?`,
      [...params, offset, size]
    );
    return {
      list: list.map((row: any) => ({
        id: Number(row.id),
        product_id: Number(row.product_id),
        rating: row.rating,
        content: row.content,
        images: transformerJson.from(row.images),
        user: {
          nickname: row.u_nickname,
          avatar_url: row.u_avatar_url,
        },
        reply_content: row.reply_content,
        replied_at: row.replied_at,
        created_at: row.created_at,
      })),
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }
}
