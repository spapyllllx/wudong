import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayEntity } from '../entity/homestay';
import { RoomTypeEntity } from '../entity/room_type';

/**
 * 民宿服务
 */
@Provide()
export class HomestayService extends BaseService {
  @InjectEntityModel(HomestayEntity)
  homestayEntity: Repository<HomestayEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @Inject()
  ctx;

  /**
   * 获取民宿列表
   */
  async getHomestayList(page: number, size: number, params: any = {}) {
    const { city, district, priceRange, sort = 'default' } = params;
    const offset = (page - 1) * size;

    const whereConditions: string[] = ['h.status = 1'];
    const queryParams: any[] = [];

    // 城市筛选
    if (city) {
      whereConditions.push('h.city = ?');
      queryParams.push(city);
    }

    // 区域筛选
    if (district) {
      whereConditions.push('h.district = ?');
      queryParams.push(district);
    }

    // 价格区间筛选
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        whereConditions.push('h.minPrice >= ? AND h.minPrice <= ?');
        queryParams.push(min, max);
      } else {
        whereConditions.push('h.minPrice >= ?');
        queryParams.push(min);
      }
    }

    // 排序
    let orderBy = 'h.sort DESC, h.createTime DESC';
    if (sort === 'rating') {
      orderBy = 'h.rating DESC, h.sort DESC';
    } else if (sort === 'price-asc') {
      orderBy = 'h.minPrice ASC';
    } else if (sort === 'price-desc') {
      orderBy = 'h.minPrice DESC';
    } else if (sort === 'popular') {
      orderBy = 'h.orderCount DESC, h.viewCount DESC';
    }

    const sql = `
      SELECT h.*
      FROM homestay h
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM homestay h
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
   * 获取民宿详情
   */
  async getHomestayDetail(id: number) {
    const sql = 'SELECT * FROM homestay WHERE id = ? AND status = 1 LIMIT 1';
    const result = await this.nativeQuery(sql, [id]);

    if (!result || result.length === 0) {
      throw new Error('民宿不存在');
    }

    const homestay = result[0];

    // 处理图片字段
    if (homestay.images && typeof homestay.images === 'string') {
      try {
        homestay.images = JSON.parse(homestay.images);
      } catch (e) {
        homestay.images = homestay.images.split(',');
      }
    }

    // 增加浏览量
    await this.nativeQuery('UPDATE homestay SET viewCount = viewCount + 1 WHERE id = ?', [id]);

    // 获取房型列表
    const roomTypes = await this.roomTypeEntity.find({
      where: { homestayId: id, status: 1 },
      order: { sort: 'ASC' },
    });

    // 处理房型图片
    roomTypes.forEach((room: any) => {
      if (room.images && typeof room.images === 'string') {
        try {
          room.images = JSON.parse(room.images);
        } catch (e) {
          room.images = room.images.split(',');
        }
      }
    });

    return {
      ...homestay,
      roomTypes,
    };
  }

  /**
   * 获取推荐民宿
   */
  async getRecommendHomestays(limit: number = 4) {
    const sql = `
      SELECT * FROM homestay
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
    await this.homestayEntity.update(id, { status });
  }
}
