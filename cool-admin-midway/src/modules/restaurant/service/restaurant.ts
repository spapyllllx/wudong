import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../entity/restaurant';
import { DishEntity } from '../entity/dish';
import { DishCategoryEntity } from '../entity/dish_category';

/**
 * 餐厅服务
 */
@Provide()
export class RestaurantService extends BaseService {
  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  @InjectEntityModel(DishEntity)
  dishEntity: Repository<DishEntity>;

  @InjectEntityModel(DishCategoryEntity)
  dishCategoryEntity: Repository<DishCategoryEntity>;

  @Inject()
  ctx;

  /**
   * 获取餐厅列表
   */
  async getRestaurantList(page: number, size: number, params: any = {}) {
    const { city, district, priceRange, sort = 'default' } = params;
    const offset = (page - 1) * size;

    const whereConditions: string[] = ['r.status = 1'];
    const queryParams: any[] = [];

    // 城市筛选
    if (city) {
      whereConditions.push('r.city = ?');
      queryParams.push(city);
    }

    // 区域筛选
    if (district) {
      whereConditions.push('r.district = ?');
      queryParams.push(district);
    }

    // 价格区间筛选
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        whereConditions.push('r.avgPrice >= ? AND r.avgPrice <= ?');
        queryParams.push(min, max);
      } else {
        whereConditions.push('r.avgPrice >= ?');
        queryParams.push(min);
      }
    }

    // 排序
    let orderBy = 'r.sort DESC, r.createTime DESC';
    if (sort === 'rating') {
      orderBy = 'r.rating DESC, r.sort DESC';
    } else if (sort === 'price-asc') {
      orderBy = 'r.avgPrice ASC';
    } else if (sort === 'price-desc') {
      orderBy = 'r.avgPrice DESC';
    } else if (sort === 'popular') {
      orderBy = 'r.orderCount DESC, r.viewCount DESC';
    }

    const sql = `
      SELECT r.*
      FROM restaurant r
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM restaurant r
      WHERE ${whereConditions.join(' AND ')}
    `;

    queryParams.push(offset, size);

    const list = await this.nativeQuery(sql, queryParams);
    const countResult = await this.nativeQuery(countSql, queryParams.slice(0, -2));
    const total = countResult[0]?.total || 0;

    // 处理图片字段
    list.forEach((item: any) => {
      if (item.images && typeof item.images === 'string') {
        try {
          item.images = JSON.parse(item.images);
        } catch (e) {
          item.images = item.images.split(',');
        }
      }
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

  /**
   * 获取餐厅详情
   */
  async getRestaurantDetail(id: number) {
    const sql = 'SELECT * FROM restaurant WHERE id = ? AND status = 1 LIMIT 1';
    const result = await this.nativeQuery(sql, [id]);

    if (!result || result.length === 0) {
      throw new Error('餐厅不存在');
    }

    const restaurant = result[0];

    // 处理图片字段
    if (restaurant.images && typeof restaurant.images === 'string') {
      try {
        restaurant.images = JSON.parse(restaurant.images);
      } catch (e) {
        restaurant.images = restaurant.images.split(',');
      }
    }

    // 增加浏览量
    await this.nativeQuery('UPDATE restaurant SET viewCount = viewCount + 1 WHERE id = ?', [id]);

    // 获取菜品分类
    const categories = await this.dishCategoryEntity.find({
      where: { restaurantId: id },
      order: { sort: 'ASC' },
    });

    // 获取菜品列表
    const dishes = await this.dishEntity.find({
      where: { restaurantId: id, status: 1 },
      order: { sort: 'ASC' },
    });

    return {
      ...restaurant,
      categories,
      dishes,
    };
  }

  /**
   * 获取推荐餐厅
   */
  async getRecommendRestaurants(limit: number = 4) {
    const sql = `
      SELECT * FROM restaurant
      WHERE status = 1
      ORDER BY rating DESC, orderCount DESC
      LIMIT ?
    `;

    const list = await this.nativeQuery(sql, [limit]);

    list.forEach((item: any) => {
      if (item.images && typeof item.images === 'string') {
        try {
          item.images = JSON.parse(item.images);
        } catch (e) {
          item.images = item.images.split(',');
        }
      }
    });

    return list;
  }

  /**
   * 管理端：更新状态
   */
  async updateStatus(id: number, status: number) {
    await this.restaurantEntity.update(id, { status });
  }
}
