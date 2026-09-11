import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';

/**
 * 推荐服务
 */
@Provide()
export class RecommendService extends BaseService {
  @Inject()
  ctx;

  /**
   * 首页推荐（随机）
   */
  async getHomeRecommend() {
    // 并行获取各类随机推荐数据
    const [
      hotProducts,
      hotRestaurants,
      hotHomestays,
      hotAttractions,
    ] = await Promise.all([
      this.getRandomProducts(),
      this.getRandomRestaurants(),
      this.getRandomHomestays(),
      this.getRandomAttractions(),
    ]);

    return {
      hotProducts,
      hotRestaurants,
      hotHomestays,
      hotAttractions,
    };
  }

  /**
   * 热门商品
   */
  async getHotProducts() {
    const sql = `
      SELECT id, title, main_image as cover, price, sales, status
      FROM product
      WHERE status = 1
      ORDER BY sales DESC
      LIMIT 8
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 热门餐厅
   */
  async getHotRestaurants() {
    const sql = `
      SELECT id, name, cover, avgPrice, rating, tags, status
      FROM restaurant
      WHERE status = 1
      ORDER BY rating DESC, orderCount DESC
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 热门民宿
   */
  async getHotHomestays() {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM homestay
      WHERE status = 1
      ORDER BY rating DESC, orderCount DESC
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 热门景点
   */
  async getHotAttractions() {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM attraction
      WHERE status = 1
      ORDER BY rating DESC, orderCount DESC
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 随机商品
   */
  async getRandomProducts() {
    const sql = `
      SELECT id, title, main_image as cover, price, sales, status
      FROM product
      WHERE status = 1
      ORDER BY RAND()
      LIMIT 8
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 随机餐厅
   */
  async getRandomRestaurants() {
    const sql = `
      SELECT id, name, cover, avgPrice, rating, tags, status
      FROM restaurant
      WHERE status = 1
      ORDER BY RAND()
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 随机民宿
   */
  async getRandomHomestays() {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM homestay
      WHERE status = 1
      ORDER BY RAND()
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }

  /**
   * 随机景点
   */
  async getRandomAttractions() {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM attraction
      WHERE status = 1
      ORDER BY RAND()
      LIMIT 6
    `;
    return await this.nativeQuery(sql);
  }
}
