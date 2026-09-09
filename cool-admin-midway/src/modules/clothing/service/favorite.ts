import { BaseService, CoolCommException } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductFavoriteEntity } from '../entity/favorite';

/**
 * 商品收藏
 */
@Provide()
export class ClothingFavoriteService extends BaseService {
  @InjectEntityModel(ProductFavoriteEntity)
  favoriteEntity: Repository<ProductFavoriteEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.favoriteEntity);
  }

  /**
   * 收藏/取消收藏(toggle)
   * @param userId 用户ID
   * @param productId 商品ID
   * @returns true=已收藏, false=已取消收藏
   */
  async toggle(userId: number, productId: number): Promise<boolean> {
    const pid = Number(productId);
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new CoolCommException('商品不存在或已下架');
    }
    const product = await this.productEntity.findOne({
      where: { id: pid, status: 'on_sale' },
    });
    if (!product) {
      throw new CoolCommException('商品不存在或已下架');
    }
    const exists = await this.favoriteEntity.findOneBy({ userId, productId: pid });
    if (exists) {
      await this.favoriteEntity.delete({ userId, productId: pid });
      return false;
    }
    try {
      await this.favoriteEntity.insert({ userId, productId: pid });
      return true;
    } catch (err) {
      // 并发重复收藏:唯一键兜底,按已收藏处理
      return true;
    }
  }

  /**
   * 我的收藏(分页,含评价聚合)
   */
  async myFavorites(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const where = `f.user_id = ? AND p.deleted_at IS NULL`;
    const params: any[] = [userId];
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM product_favorites f
       INNER JOIN products p ON p.id = f.product_id
       WHERE ${where}`,
      params
    );
    const list: any[] = await this.nativeQuery(
      `SELECT p.id, p.category_id, p.title, p.subtitle, p.main_image, p.price,
              p.market_price, p.sales, p.stock, f.created_at favorited_at,
              rv.rating, rv.review_count
       FROM product_favorites f
       INNER JOIN products p ON p.id = f.product_id
       LEFT JOIN (SELECT product_id, ROUND(AVG(rating), 1) rating,
                         COUNT(*) review_count
                  FROM product_reviews GROUP BY product_id) rv
              ON rv.product_id = p.id
       WHERE ${where}
       ORDER BY f.id DESC LIMIT ?,?`,
      [...params, offset, size]
    );
    return {
      list: list.map((row: any) => this.mapRow(row)),
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }

  /** 行映射:bigint/decimal/聚合字段统一转 number */
  private mapRow(row: any) {
    row.id = Number(row.id);
    row.category_id = Number(row.category_id);
    row.price = row.price === null || row.price === undefined ? null : Number(row.price);
    row.market_price =
      row.market_price === null || row.market_price === undefined
        ? null
        : Number(row.market_price);
    row.rating =
      row.rating === null || row.rating === undefined ? null : Number(row.rating);
    row.review_count = Number(row.review_count || 0);
    return row;
  }
}
