import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';

/**
 * 搜索服务
 */
@Provide()
export class SearchService extends BaseService {
  @Inject()
  ctx;

  /**
   * 全局搜索
   */
  async globalSearch(keyword: string, type?: string) {
    if (!keyword || keyword.trim() === '') {
      return {
        products: [],
        restaurants: [],
        homestays: [],
        attractions: [],
      };
    }

    const searchKeyword = `%${keyword}%`;

    // 如果指定了类型，只搜索该类型
    if (type) {
      const results: any = {
        products: [],
        restaurants: [],
        homestays: [],
        attractions: [],
      };

      switch (type) {
        case 'product':
          results.products = await this.searchProducts(searchKeyword);
          break;
        case 'restaurant':
          results.restaurants = await this.searchRestaurants(searchKeyword);
          break;
        case 'homestay':
          results.homestays = await this.searchHomestays(searchKeyword);
          break;
        case 'attraction':
          results.attractions = await this.searchAttractions(searchKeyword);
          break;
      }

      return results;
    } else {
      // 搜索所有类型
      const [products, restaurants, homestays, attractions] = await Promise.all([
        this.searchProducts(searchKeyword),
        this.searchRestaurants(searchKeyword),
        this.searchHomestays(searchKeyword),
        this.searchAttractions(searchKeyword),
      ]);

      return {
        products,
        restaurants,
        homestays,
        attractions,
      };
    }
  }

  /**
   * 搜索商品
   */
  async searchProducts(keyword: string) {
    const sql = `
      SELECT id, title, mainImage as cover, price, sales, status
      FROM product
      WHERE status = 1 AND title LIKE ?
      ORDER BY sales DESC
      LIMIT 20
    `;
    return await this.nativeQuery(sql, [keyword]);
  }

  /**
   * 搜索餐厅
   */
  async searchRestaurants(keyword: string) {
    const sql = `
      SELECT id, name, cover, avgPrice, rating, tags, status
      FROM restaurant
      WHERE status = 1 AND (name LIKE ? OR tags LIKE ?)
      ORDER BY rating DESC
      LIMIT 20
    `;
    return await this.nativeQuery(sql, [keyword, keyword]);
  }

  /**
   * 搜索民宿
   */
  async searchHomestays(keyword: string) {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM homestay
      WHERE status = 1 AND (name LIKE ? OR tags LIKE ?)
      ORDER BY rating DESC
      LIMIT 20
    `;
    return await this.nativeQuery(sql, [keyword, keyword]);
  }

  /**
   * 搜索景点
   */
  async searchAttractions(keyword: string) {
    const sql = `
      SELECT id, name, cover, minPrice, rating, tags, status
      FROM attraction
      WHERE status = 1 AND (name LIKE ? OR tags LIKE ?)
      ORDER BY rating DESC
      LIMIT 20
    `;
    return await this.nativeQuery(sql, [keyword, keyword]);
  }

  /**
   * 搜索建议
   */
  async searchSuggest(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const searchKeyword = `%${keyword}%`;
    const suggestions: string[] = [];

    // 从各个表中获取建议
    const [products, restaurants, homestays, attractions] = await Promise.all([
      this.nativeQuery(
        'SELECT DISTINCT title FROM product WHERE status = 1 AND title LIKE ? LIMIT 5',
        [searchKeyword]
      ),
      this.nativeQuery(
        'SELECT DISTINCT name FROM restaurant WHERE status = 1 AND name LIKE ? LIMIT 5',
        [searchKeyword]
      ),
      this.nativeQuery(
        'SELECT DISTINCT name FROM homestay WHERE status = 1 AND name LIKE ? LIMIT 5',
        [searchKeyword]
      ),
      this.nativeQuery(
        'SELECT DISTINCT name FROM attraction WHERE status = 1 AND name LIKE ? LIMIT 5',
        [searchKeyword]
      ),
    ]);

    // 合并建议
    products.forEach((item: any) => suggestions.push(item.title));
    restaurants.forEach((item: any) => suggestions.push(item.name));
    homestays.forEach((item: any) => suggestions.push(item.name));
    attractions.forEach((item: any) => suggestions.push(item.name));

    // 去重并限制数量
    return [...new Set(suggestions)].slice(0, 10);
  }
}
