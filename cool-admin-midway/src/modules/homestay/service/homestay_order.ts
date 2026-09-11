import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HomestayOrderEntity } from '../entity/homestay_order';
import { HomestayEntity } from '../entity/homestay';
import { RoomTypeEntity } from '../entity/room_type';

/**
 * 住宿订单服务
 */
@Provide()
export class HomestayOrderService extends BaseService {
  @InjectEntityModel(HomestayOrderEntity)
  orderEntity: Repository<HomestayOrderEntity>;

  @InjectEntityModel(HomestayEntity)
  homestayEntity: Repository<HomestayEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @Inject()
  ctx;

  /**
   * 生成订单号
   */
  generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `HS${timestamp}${random}`;
  }

  /**
   * 计算入住天数
   */
  calculateNights(checkInDate: string, checkOutDate: string): number {
    const checkIn = new Date(checkInDate).getTime();
    const checkOut = new Date(checkOutDate).getTime();
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  /**
   * 创建订单
   */
  async createOrder(userId: number, data: any) {
    const { homestayId, roomTypeId, checkInDate, checkOutDate, roomCount, guestCount, contactName, contactPhone, remark } = data;

    // 查询民宿
    const homestay = await this.homestayEntity.findOne({
      where: { id: homestayId, status: 1 },
    });

    if (!homestay) {
      throw new Error('民宿不存在');
    }

    // 查询房型
    const roomType = await this.roomTypeEntity.findOne({
      where: { id: roomTypeId, status: 1 },
    });

    if (!roomType) {
      throw new Error('房型不存在');
    }

    // 计算入住天数
    const nights = this.calculateNights(checkInDate, checkOutDate);
    if (nights <= 0) {
      throw new Error('入住日期不正确');
    }

    // 计算总金额（简化版，实际应该根据日期判断是否周末）
    const totalAmount = roomType.price * nights * roomCount;

    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 创建订单
    const order = await this.orderEntity.save({
      orderNo,
      userId,
      homestayId,
      homestayName: homestay.name,
      roomTypeId,
      roomTypeName: roomType.name,
      checkInDate,
      checkOutDate,
      nights,
      roomCount,
      guestCount,
      contactName,
      contactPhone,
      totalAmount,
      payAmount: totalAmount,
      remark: remark || '',
      status: 0, // 待付款
      payStatus: 0, // 未支付
    });

    // 增加民宿订单数
    await this.nativeQuery(
      'UPDATE homestay SET orderCount = orderCount + 1 WHERE id = ?',
      [homestayId]
    );

    return order;
  }

  /**
   * 获取订单列表
   */
  async getOrderList(userId: number, page: number, size: number, status?: number) {
    const offset = (page - 1) * size;
    const params: any[] = [userId];
    let whereCondition = 'userId = ?';

    if (status !== undefined && status !== -1) {
      whereCondition += ' AND status = ?';
      params.push(status);
    }

    const sql = `
      SELECT * FROM homestay_order
      WHERE ${whereCondition}
      ORDER BY createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM homestay_order
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
   * 获取订单详情
   */
  async getOrderDetail(orderNo: string, userId: number) {
    const sql = 'SELECT * FROM homestay_order WHERE orderNo = ? AND userId = ? LIMIT 1';
    const result = await this.nativeQuery(sql, [orderNo, userId]);

    if (!result || result.length === 0) {
      throw new Error('订单不存在');
    }

    return result[0];
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderNo: string, userId: number, reason: string) {
    const order = await this.orderEntity.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 0) {
      throw new Error('只有待付款的订单可以取消');
    }

    order.status = 4; // 已取消
    order.cancelReason = reason;

    await this.orderEntity.save(order);
    return order;
  }

  /**
   * 模拟支付
   */
  async mockPay(orderNo: string, userId: number) {
    const order = await this.orderEntity.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 0) {
      throw new Error('订单状态不正确，无法支付');
    }

    if (order.payStatus === 1) {
      throw new Error('订单已支付');
    }

    // 更新订单状态
    order.payStatus = 1; // 已支付
    order.status = 1; // 待入住
    order.payTime = new Date().toISOString();

    await this.orderEntity.save(order);
    return order;
  }
}
