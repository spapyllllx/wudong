import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductFavoriteEntity } from '../entity/favorite';
import { ProductSkuEntity } from '../entity/sku';

/**
 * 商品服务
 */
@Provide()
export class ProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductFavoriteEntity)
  productFavoriteEntity: Repository<ProductFavoriteEntity>;

  @InjectEntityModel(ProductSkuEntity)
  productSkuEntity: Repository<ProductSkuEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   */
  async page(query) {
    const { keyWord, categoryId, status, isRecommend, minPrice, maxPrice } =
      query;

    const sql = `
      SELECT
        a.*,
        b.name as categoryName
      FROM
        product a
      LEFT JOIN product_category b ON a.categoryId = b.id
      WHERE 1 = 1
        ${this.setSql(keyWord, 'AND a.title LIKE ?', [`%${keyWord}%`])}
        ${this.setSql(categoryId, 'AND a.categoryId = ?', [categoryId])}
        ${this.setSql(status !== undefined, 'AND a.status = ?', [status])}
        ${this.setSql(isRecommend !== undefined, 'AND a.isRecommend = ?', [
          isRecommend,
        ])}
        ${this.setSql(minPrice, 'AND a.price >= ?', [minPrice])}
        ${this.setSql(maxPrice, 'AND a.price <= ?', [maxPrice])}
    `;

    return await this.sqlRenderPage(sql, query);
  }

  /**
   * 更新状态（上架/下架）
   */
  async updateStatus(id: number, status: number) {
    await this.productEntity.update(id, { status });
  }

  /**
   * 设置推荐
   */
  async setRecommend(id: number, isRecommend: number) {
    await this.productEntity.update(id, { isRecommend });
  }

  /**
   * 增加浏览数
   */
  async increaseViewCount(productId: number) {
    await this.nativeQuery(
      'UPDATE product SET viewCount = viewCount + 1 WHERE id = ?',
      [productId]
    );
  }

  /**
   * 增加销量
   */
  async increaseSales(productId: number, quantity: number = 1) {
    await this.nativeQuery(
      'UPDATE product SET sales = sales + ? WHERE id = ?',
      [quantity, productId]
    );
  }

  /**
   * 减少库存
   */
  async decreaseStock(productId: number, quantity: number) {
    const result = await this.nativeQuery(
      'UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, productId, quantity]
    );
    return result.affectedRows > 0;
  }

  /**
   * 检查用户是否收藏
   */
  async checkUserFavorite(productIds: number[], userId: number) {
    if (!userId || productIds.length === 0) {
      return [];
    }

    const favorites = await this.productFavoriteEntity.find({
      where: { userId, productId: In(productIds) },
    });

    return favorites.map(fav => fav.productId);
  }

  /**
   * 获取商品列表（用户端）
   */
  async getProductList(
    page: number,
    size: number,
    categoryId?: number,
    keyword?: string,
    sort?: string,
    minPrice?: number,
    maxPrice?: number
  ) {
    const offset = (page - 1) * size;

    let orderBy = 'a.createTime DESC';
    if (sort === 'sales') {
      orderBy = 'a.sales DESC, a.createTime DESC';
    } else if (sort === 'price-asc') {
      orderBy = 'a.price ASC';
    } else if (sort === 'price-desc') {
      orderBy = 'a.price DESC';
    }

    // 构建WHERE条件和参数
    const params: any[] = [];
    let whereConditions = 'a.status = 1';

    if (categoryId) {
      // 查询该分类及其子分类的商品
      // 先查询是一级分类还是二级分类
      // 一级分类：查找parent_id = categoryId 的所有子分类商品
      // 二级分类：查找category_id = categoryId 的商品
      whereConditions += ` AND (
        a.categoryId = ?
        OR a.categoryId IN (
          SELECT id FROM product_category WHERE parentId = ?
        )
      )`;
      params.push(categoryId, categoryId);
    }

    if (keyword) {
      whereConditions += ' AND a.title LIKE ?';
      params.push(`%${keyword}%`);
    }

    // 价格区间筛选
    if (minPrice !== undefined && minPrice > 0) {
      whereConditions += ' AND a.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      whereConditions += ' AND a.price <= ?';
      params.push(maxPrice);
    }

    const sql = `
      SELECT
        a.*,
        b.name as categoryName
      FROM
        product a
      LEFT JOIN product_category b ON a.categoryId = b.id
      WHERE ${whereConditions}
      ORDER BY ${orderBy}
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM product a
      LEFT JOIN product_category b ON a.categoryId = b.id
      WHERE ${whereConditions}
    `;

    // 添加分页参数
    const queryParams = [...params, offset, size];

    // 调试日志
    console.log('========== 商品查询 ==========');
    console.log('SQL:', sql);
    console.log('参数:', queryParams);
    console.log('WHERE条件:', whereConditions);
    console.log('============================');

    const list = await this.nativeQuery(sql, queryParams);
    const countResult = await this.nativeQuery(countSql, params);
    const total = countResult[0]?.total || 0;

    console.log('查询结果数量:', list.length);
    console.log('总数:', total);

    // 检查当前用户是否收藏
    const userId = this.ctx.user?.id;
    if (userId && list.length > 0) {
      const productIds = list.map((item: any) => item.id);
      const favoritedIds = await this.checkUserFavorite(productIds, userId);
      list.forEach((item: any) => {
        item.isFavorited = favoritedIds.includes(item.id);
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
   * 获取商品详情（用户端）
   */
  async getProductDetail(id: number) {
    // 使用原生SQL查询避免JSON解析问题
    const sql = `
      SELECT
        a.*,
        b.name as categoryName
      FROM
        product a
      LEFT JOIN product_category b ON a.categoryId = b.id
      WHERE a.id = ?
      LIMIT 1
    `;

    const result = await this.nativeQuery(sql, [id]);

    if (!result || result.length === 0) {
      throw new Error('商品不存在');
    }

    const product = result[0];

    if (product.status === 0) {
      throw new Error('商品已下架');
    }

    // 增加浏览数
    await this.increaseViewCount(id);

    // 手动解析 images 字段（如果是字符串）
    if (product.images && typeof product.images === 'string') {
      try {
        product.images = JSON.parse(product.images);
      } catch (e) {
        console.error('解析商品图片JSON失败:', e);
        product.images = [];
      }
    }

    // 获取SKU列表
    const skus = await this.productSkuEntity.find({
      where: { productId: id, status: 1 },
    });

    // 检查当前用户是否收藏
    const userId = this.ctx.user?.id;
    let isFavorited = false;
    if (userId) {
      const favoritedIds = await this.checkUserFavorite([id], userId);
      isFavorited = favoritedIds.includes(id);
    }

    return {
      ...product,
      isFavorited,
      skus,
    };
  }

  /**
   * 收藏商品
   */
  async favoriteProduct(productId: number, userId: number) {
    // 检查是否已收藏
    const favorite = await this.productFavoriteEntity.findOne({
      where: { userId, productId },
    });

    if (favorite) {
      throw new Error('已经收藏过了');
    }

    // 收藏
    await this.productFavoriteEntity.save({
      userId,
      productId,
    });

    // 增加收藏数
    await this.nativeQuery(
      'UPDATE product SET favoriteCount = favoriteCount + 1 WHERE id = ?',
      [productId]
    );
  }

  /**
   * 取消收藏
   */
  async unfavoriteProduct(productId: number, userId: number) {
    const favorite = await this.productFavoriteEntity.findOne({
      where: { userId, productId },
    });

    if (!favorite) {
      throw new Error('还未收藏');
    }

    // 取消收藏
    await this.productFavoriteEntity.delete(favorite.id);

    // 减少收藏数
    await this.nativeQuery(
      'UPDATE product SET favoriteCount = favoriteCount - 1 WHERE id = ? AND favoriteCount > 0',
      [productId]
    );
  }

  /**
   * 我的收藏列表
   */
  async getMyFavorites(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;

    const sql = `
      SELECT
        a.*,
        b.createTime as favoriteTime
      FROM
        product a
      INNER JOIN product_favorite b ON a.id = b.productId
      WHERE b.userId = ?
      ORDER BY b.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM product a
      INNER JOIN product_favorite b ON a.id = b.productId
      WHERE b.userId = ?
    `;

    const list = await this.nativeQuery(sql, [userId, offset, size]);
    const countResult = await this.nativeQuery(countSql, [userId]);
    const total = countResult[0]?.total || 0;

    // 标记所有商品为已收藏
    list.forEach((item: any) => {
      item.isFavorited = true;
    });

    return {
      list,
      pagination: {
        page,
        size,
        total,
      },
    };
  }
}
