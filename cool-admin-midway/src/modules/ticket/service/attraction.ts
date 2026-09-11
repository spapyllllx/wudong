import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AttractionEntity } from '../entity/attraction';
import { TicketTypeEntity } from '../entity/ticket_type';

/**
 * 景点服务
 */
@Provide()
export class AttractionService extends BaseService {
  @InjectEntityModel(AttractionEntity)
  attractionEntity: Repository<AttractionEntity>;

  @InjectEntityModel(TicketTypeEntity)
  ticketTypeEntity: Repository<TicketTypeEntity>;

  @Inject()
  ctx;

  /**
   * 获取景点列表
   */
  async getAttractionList(page: number, size: number, params: any = {}) {
    const { city, type, priceRange, sort = 'default' } = params;
    const offset = (page - 1) * size;

    const whereConditions: string[] = ['a.status = 1'];
    const queryParams: any[] = [];

    // 城市筛选
    if (city) {
      whereConditions.push('a.city = ?');
      queryParams.push(city);
    }

    // 类型筛选
    if (type) {
      whereConditions.push('a.type = ?');
      queryParams.push(type);
    }

    // 价格区间筛选
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        whereConditions.push('a.minPrice >= ? AND a.minPrice <= ?');
        queryParams.push(min, max);
      } else {
        whereConditions.push('a.minPrice >= ?');
        queryParams.push(min);
      }
    }

    // 排序
    let orderBy = 'a.sort DESC, a.createTime DESC';
    if (sort === 'rating') {
      orderBy = 'a.rating DESC, a.sort DESC';
    } else if (sort === 'price-asc') {
      orderBy = 'a.minPrice ASC';
    } else if (sort === 'price-desc') {
      orderBy = 'a.minPrice DESC';
    } else if (sort === 'popular') {
      orderBy = 'a.orderCount DESC, a.viewCount DESC';
    }

    const sql = `
      SELECT a.*
      FROM attraction a
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM attraction a
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
   * 获取景点详情
   */
  async getAttractionDetail(id: number) {
    const sql = 'SELECT * FROM attraction WHERE id = ? AND status = 1 LIMIT 1';
    const result = await this.nativeQuery(sql, [id]);

    if (!result || result.length === 0) {
      throw new Error('景点不存在');
    }

    const attraction = result[0];

    // 处理图片字段
    if (attraction.images && typeof attraction.images === 'string') {
      try {
        attraction.images = JSON.parse(attraction.images);
      } catch (e) {
        attraction.images = attraction.images.split(',');
      }
    }

    // 增加浏览量
    await this.nativeQuery('UPDATE attraction SET viewCount = viewCount + 1 WHERE id = ?', [id]);

    // 获取票型列表
    const ticketTypes = await this.ticketTypeEntity.find({
      where: { attractionId: id, status: 1 },
      order: { sort: 'ASC' },
    });

    return {
      ...attraction,
      ticketTypes,
    };
  }

  /**
   * 获取推荐景点
   */
  async getRecommendAttractions(limit: number = 4) {
    const sql = `
      SELECT * FROM attraction
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
    await this.attractionEntity.update(id, { status });
  }
}
