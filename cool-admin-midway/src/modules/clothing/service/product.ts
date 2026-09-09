import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
import { ProductCategoryEntity } from '../entity/category';
import { ProductImageEntity } from '../entity/image';
import { ProductEntity } from '../entity/product';
import { ProductReviewEntity } from '../entity/review';
import { ProductSkuEntity } from '../entity/sku';

/**
 * 商品
 */
@Provide()
export class ClothingProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductSkuEntity)
  skuEntity: Repository<ProductSkuEntity>;

  @InjectEntityModel(ProductImageEntity)
  imageEntity: Repository<ProductImageEntity>;

  @InjectEntityModel(ProductCategoryEntity)
  categoryEntity: Repository<ProductCategoryEntity>;

  @InjectEntityModel(ProductReviewEntity)
  reviewEntity: Repository<ProductReviewEntity>;

  /** 主表允许写入的字段(防止客户端注入 id/时间/软删字段) */
  private static readonly MAIN_FIELDS = [
    'categoryId',
    'merchantId',
    'title',
    'subtitle',
    'mainImage',
    'price',
    'marketPrice',
    'stock',
    'detail',
    'craftIntro',
    'inheritorId',
    'status',
  ];

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.productEntity);
  }

  /**
   * 新增/修改商品(含 SKU、图片,全量替换子表)
   * - id 存在=修改:先更新主表,再删除并重建 skus/images
   * - 事务由 @CoolTransaction 注入 queryRunner(最后一个参数)
   * @returns 商品ID
   */
  @CoolTransaction({ connectionName: 'default' })
  async saveProduct(param: any, queryRunner?: QueryRunner): Promise<number> {
    if (!param || !param.title || param.price === null || param.price === undefined) {
      throw new CoolCommException('商品标题与价格必填');
    }
    const { skus = [], images = [], id } = param;
    const main: any = {};
    for (const key of ClothingProductService.MAIN_FIELDS) {
      if (param[key] !== undefined) main[key] = param[key];
    }
    if (main.merchantId === undefined || main.merchantId === null) {
      // 商家模块未交付前占位 0,待商家组对接后替换
      main.merchantId = 0;
    }
    const mgr = queryRunner.manager;
    let productId: number = id;
    if (id) {
      const exist = await this.productEntity.findOneBy({ id });
      if (!exist) throw new CoolCommException('商品不存在');
      await mgr.update(ProductEntity, { id }, main);
      await mgr.delete(ProductSkuEntity, { productId: id });
      await mgr.delete(ProductImageEntity, { productId: id });
    } else {
      const saved = await mgr.save(mgr.create(ProductEntity, main));
      productId = saved.id;
    }
    for (const s of skus || []) {
      if (!s.skuName || s.price === null || s.price === undefined) {
        throw new CoolCommException('SKU名称与价格必填');
      }
      await mgr.save(mgr.create(ProductSkuEntity, { ...s, productId }));
    }
    for (const img of images || []) {
      if (!img.url) throw new CoolCommException('图片URL必填');
      await mgr.save(
        mgr.create(ProductImageEntity, { url: img.url, sort: img.sort || 0, productId })
      );
    }
    return productId;
  }

  /**
   * 删除商品:先删 skus/images 子表,再走框架删除(回收站快照+物理删除)
   */
  async deleteProduct(ids: number[]) {
    if (!ids || !ids.length) throw new CoolCommException('请选择要删除的商品');
    await this.skuEntity.delete({ productId: In(ids) });
    await this.imageEntity.delete({ productId: In(ids) });
    await super.delete(ids);
  }

  /**
   * 商品完整信息(编辑回显:主表+skus+images)
   */
  async detailWithChildren(id: number) {
    const product = await this.productEntity.findOneBy({ id });
    if (!product) throw new CoolCommException('商品不存在');
    const skus = await this.skuEntity.find({
      where: { productId: id },
      order: { id: 'ASC' },
    });
    const images = await this.imageEntity.find({
      where: { productId: id },
      order: { sort: 'ASC', id: 'ASC' },
    });
    return { ...product, skus, images };
  }

  /**
   * 前台商品分页(公开)
   * 参数:page/size/category_id/keyword/sort(sales|price|time)
   */
  async appPage(query: any) {
    return this.queryPublicList(query, false);
  }

  /**
   * 前台搜索(公开,keyword 必填)
   */
  async appSearch(query: any) {
    if (!query.keyword) {
      throw new CoolCommException('请输入搜索关键词');
    }
    return this.queryPublicList(query, true);
  }

  /** 公共列表查询实现 */
  private async queryPublicList(query: any, forceKeyword: boolean) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size) || 10, 1), 50);
    const categoryId = query.category_id || query.categoryId;
    const keyword = (query.keyword || '').trim();
    const sort = query.sort || 'time';
    const where: string[] = ['p.deleted_at IS NULL', 'p.status = ?'];
    const params: any[] = ['on_sale'];
    if (categoryId) {
      where.push('p.category_id = ?');
      params.push(Number(categoryId));
    }
    if (keyword) {
      where.push('(p.title LIKE ? OR p.subtitle LIKE ?)');
      const kw = `%${keyword}%`;
      params.push(kw, kw);
    }
    if (forceKeyword && !keyword) {
      // 空列表兜底(不会走到:appSearch 已前置校验)
      where.push('1 = 0');
    }
    // sort 白名单映射,禁止拼接用户输入
    const orderMap: any = {
      sales: 'p.sales DESC, p.id DESC',
      price: 'p.price ASC, p.id DESC',
      time: 'p.id DESC',
    };
    const orderBy = orderMap[sort] || orderMap.time;
    const whereSql = where.join(' AND ');
    const offset = (page - 1) * size;
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM products p WHERE ${whereSql}`,
      params
    );
    const list: any[] = await this.nativeQuery(
      `SELECT p.id, p.category_id, p.title, p.subtitle, p.main_image, p.price,
              p.market_price, p.sales, p.stock, rv.rating, rv.review_count
       FROM products p
       LEFT JOIN (SELECT product_id, ROUND(AVG(rating), 1) rating,
                         COUNT(*) review_count
                  FROM product_reviews GROUP BY product_id) rv
              ON rv.product_id = p.id
       WHERE ${whereSql}
       ORDER BY ${orderBy} LIMIT ?,?`,
      [...params, offset, size]
    );
    return {
      list: list.map((row: any) => this.mapListRow(row)),
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }

  /** 列表行映射:decimal/聚合字段转 number */
  private mapListRow(row: any) {
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

  /**
   * 前台商品详情(公开,仅 on_sale)
   */
  async appDetail(id: number) {
    const product = await this.productEntity.findOne({
      where: { id, status: 'on_sale' },
    });
    if (!product) throw new CoolCommException('商品不存在或已下架');
    const category = product.categoryId
      ? await this.categoryEntity.findOneBy({ id: product.categoryId })
      : null;
    const skus = await this.skuEntity.find({
      where: { productId: id, status: 'active' },
      order: { id: 'ASC' },
    });
    const images = await this.imageEntity.find({
      where: { productId: id },
      order: { sort: 'ASC', id: 'ASC' },
    });
    const aggRows: any[] = await this.nativeQuery(
      `SELECT COALESCE(ROUND(AVG(rating), 1), 0) rating,
              COUNT(*) review_count
       FROM product_reviews WHERE product_id = ?`,
      [id]
    );
    const agg = aggRows[0] || { rating: 0, review_count: 0 };
    return {
      id: product.id,
      category_id: product.categoryId,
      category_name: category ? category.name : null,
      title: product.title,
      subtitle: product.subtitle,
      main_image: product.mainImage,
      price: Number(product.price),
      market_price:
        product.marketPrice === null || product.marketPrice === undefined
          ? null
          : Number(product.marketPrice),
      stock: product.stock,
      sales: product.sales,
      detail: product.detail,
      craft_intro: product.craftIntro,
      inheritor_id: product.inheritorId,
      status: product.status,
      rating: Number(agg.rating || 0),
      review_count: Number(agg.review_count || 0),
      images: images.map((img) => img.url),
      skus: skus.map((s) => ({
        id: s.id,
        sku_name: s.skuName,
        image: s.image,
        price: Number(s.price),
        stock: s.stock,
        sales: s.sales,
        attrs: s.attrs,
        status: s.status,
      })),
      created_at: product.createdAt,
    };
  }
}
