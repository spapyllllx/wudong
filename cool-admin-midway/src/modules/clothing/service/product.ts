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
    if (!param) {
      throw new CoolCommException('参数不能为空');
    }
    const { skus = [], images = [], id } = param;
    if (!Array.isArray(skus) || !Array.isArray(images)) {
      throw new CoolCommException('skus/images 参数格式错误');
    }
    const main: any = {};
    for (const key of ClothingProductService.MAIN_FIELDS) {
      if (param[key] !== undefined) main[key] = param[key];
    }
    const hasMainFields = Object.keys(main).length > 0;
    const mgr = queryRunner.manager;
    let productId: number = id;
    if (id) {
      const exist = await this.productEntity.findOneBy({ id });
      if (!exist) throw new CoolCommException('商品不存在');
      // 主表字段仅在本次请求携带时更新——SKU/图片弹窗只提交 {id, skus, images},
      // 标题/价格必填校验只针对"新建"(修复:此前无条件必填导致弹窗保存必失败)
      if (hasMainFields) {
        await mgr.update(ProductEntity, { id }, main);
      }
      // 子表为增量语义:请求携带 skus/images 数组才替换(便于管理端只编辑主字段)
      if (Array.isArray(param.skus)) {
        await mgr.delete(ProductSkuEntity, { productId: id });
      }
      if (Array.isArray(param.images)) {
        await mgr.delete(ProductImageEntity, { productId: id });
      }
    } else {
      if (!param.title || param.price === null || param.price === undefined) {
        throw new CoolCommException('商品标题与价格必填');
      }
      if (main.merchantId === undefined || main.merchantId === null) {
        // 商家模块未交付前占位 0,待商家组对接后替换(仅新建时兜底,避免覆盖已有值)
        main.merchantId = 0;
      }
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
    // SKU 保存后把总库存聚合为 SKU 库存之和(此前两处不同步,下单可扣成负数)
    // 注:仅当本次携带非空 skus 时聚合;空数组(仅删 SKU/改图片)保留原手工总库存
    if (Array.isArray(param.skus) && skus.length) {
      const agg: any[] = await mgr.query(
        `SELECT COALESCE(SUM(stock), 0) total FROM product_skus WHERE product_id = ?`,
        [productId]
      );
      await mgr.update(
        ProductEntity,
        { id: productId },
        { stock: Number(agg[0]?.total || 0) }
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
   * 输出与 app 端 appDetail 同构(snake_case、images 为 url 数组),
   * 供管理端"查看"弹窗与 SKU/图片弹窗解析(修复:此前直接吐实体键,
   * 前端按 sku_name/url 解析导致回显全空、保存 TypeError)
   */
  async detailWithChildren(id: number) {
    const pid = Number(id);
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new CoolCommException('商品不存在');
    }
    const product = await this.productEntity.findOneBy({ id: pid });
    if (!product) throw new CoolCommException('商品不存在');
    const category = product.categoryId
      ? await this.categoryEntity.findOneBy({ id: product.categoryId })
      : null;
    const skus = await this.skuEntity.find({
      where: { productId: pid },
      order: { id: 'ASC' },
    });
    const images = await this.imageEntity.find({
      where: { productId: pid },
      order: { sort: 'ASC', id: 'ASC' },
    });
    const aggRows: any[] = await this.nativeQuery(
      `SELECT COALESCE(ROUND(AVG(rating), 1), 0) rating,
              COUNT(*) review_count
       FROM product_reviews WHERE product_id = ?`,
      [pid]
    );
    const agg = aggRows[0] || { rating: 0, review_count: 0 };
    const num = (v: any) =>
      v === null || v === undefined ? null : Number(v);
    return {
      id: pid,
      category_id: product.categoryId,
      category_name: category ? category.name : null,
      title: product.title,
      subtitle: product.subtitle,
      main_image: product.mainImage,
      price: num(product.price),
      market_price: num(product.marketPrice),
      stock: product.stock,
      sales: product.sales,
      detail: product.detail,
      craft_intro: product.craftIntro,
      inheritor_id: num(product.inheritorId),
      merchant_id: product.merchantId,
      status: product.status,
      rating: Number(agg.rating || 0),
      review_count: Number(agg.review_count || 0),
      images: images.map((img) => img.url),
      skus: skus.map((s) => ({
        id: Number(s.id),
        sku_name: s.skuName,
        image: s.image,
        price: num(s.price),
        stock: s.stock,
        sales: s.sales,
        attrs: s.attrs,
        status: s.status,
      })),
      created_at: product.createdAt,
    };
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
    // 修复:category_id=0 表示"全部分类"(小程序首页默认传 0),
    // 字符串 '0' 为 truthy 会误入过滤条件导致首页列表恒空
    const categoryNo = Number(categoryId);
    if (Number.isInteger(categoryNo) && categoryNo > 0) {
      where.push('p.category_id = ?');
      params.push(categoryNo);
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

  /** 列表行映射:bigint/decimal/聚合字段转 number */
  private mapListRow(row: any) {
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

  /**
   * 前台商品详情(公开,仅 on_sale)
   */
  async appDetail(id: number) {
    const pid = Number(id);
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new CoolCommException('商品不存在或已下架');
    }
    const product = await this.productEntity.findOne({
      where: { id: pid, status: 'on_sale' },
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
      id: Number(product.id),
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
      inheritor_id:
        product.inheritorId === null || product.inheritorId === undefined
          ? null
          : Number(product.inheritorId),
      status: product.status,
      rating: Number(agg.rating || 0),
      review_count: Number(agg.review_count || 0),
      images: images.map((img) => img.url),
      skus: skus.map((s) => ({
        id: Number(s.id),
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
