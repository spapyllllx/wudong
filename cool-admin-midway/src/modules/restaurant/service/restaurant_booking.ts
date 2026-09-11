import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantBookingEntity } from '../entity/restaurant_booking';
import { RestaurantEntity } from '../entity/restaurant';

/**
 * 餐厅预订服务
 */
@Provide()
export class RestaurantBookingService extends BaseService {
  @InjectEntityModel(RestaurantBookingEntity)
  bookingEntity: Repository<RestaurantBookingEntity>;

  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  @Inject()
  ctx;

  /**
   * 生成预订号
   */
  generateBookingNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `B${timestamp}${random}`;
  }

  /**
   * 创建预订
   */
  async createBooking(userId: number, data: any) {
    const { restaurantId, bookingDate, bookingTime, peopleCount, contactName, contactPhone, remark } = data;

    // 查询餐厅
    const restaurant = await this.restaurantEntity.findOne({
      where: { id: restaurantId, status: 1 },
    });

    if (!restaurant) {
      throw new Error('餐厅不存在');
    }

    // 生成预订号
    const bookingNo = this.generateBookingNo();

    // 创建预订
    const booking = await this.bookingEntity.save({
      bookingNo,
      userId,
      restaurantId,
      restaurantName: restaurant.name,
      bookingDate,
      bookingTime,
      peopleCount,
      contactName,
      contactPhone,
      remark: remark || '',
      status: 0, // 待确认
    });

    // 增加餐厅订单数
    await this.nativeQuery(
      'UPDATE restaurant SET orderCount = orderCount + 1 WHERE id = ?',
      [restaurantId]
    );

    return booking;
  }

  /**
   * 获取预订列表
   */
  async getBookingList(userId: number, page: number, size: number, status?: number) {
    const offset = (page - 1) * size;
    const params: any[] = [userId];
    let whereCondition = 'userId = ?';

    if (status !== undefined && status !== -1) {
      whereCondition += ' AND status = ?';
      params.push(status);
    }

    const sql = `
      SELECT * FROM restaurant_booking
      WHERE ${whereCondition}
      ORDER BY createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM restaurant_booking
      WHERE ${whereCondition}
    `;

    params.push(offset, size);

    const list = await this.nativeQuery(sql, params);
    const countResult = await this.nativeQuery(countSql, params.slice(0, -2));
    const total = countResult[0]?.total || 0;

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
   * 获取预订详情
   */
  async getBookingDetail(bookingNo: string, userId: number) {
    const sql = 'SELECT * FROM restaurant_booking WHERE bookingNo = ? AND userId = ? LIMIT 1';
    const result = await this.nativeQuery(sql, [bookingNo, userId]);

    if (!result || result.length === 0) {
      throw new Error('预订不存在');
    }

    return result[0];
  }

  /**
   * 取消预订
   */
  async cancelBooking(bookingNo: string, userId: number, reason: string) {
    const booking = await this.bookingEntity.findOne({
      where: { bookingNo, userId },
    });

    if (!booking) {
      throw new Error('预订不存在');
    }

    if (booking.status !== 0) {
      throw new Error('只有待确认的预订可以取消');
    }

    booking.status = 3; // 已取消
    booking.cancelReason = reason;

    await this.bookingEntity.save(booking);
    return booking;
  }
}
