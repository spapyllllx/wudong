import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TicketOrderEntity } from '../entity/ticket_order';
import { AttractionEntity } from '../entity/attraction';
import { TicketTypeEntity } from '../entity/ticket_type';

/**
 * 票务订单服务
 */
@Provide()
export class TicketOrderService extends BaseService {
  @InjectEntityModel(TicketOrderEntity)
  orderEntity: Repository<TicketOrderEntity>;

  @InjectEntityModel(AttractionEntity)
  attractionEntity: Repository<AttractionEntity>;

  @InjectEntityModel(TicketTypeEntity)
  ticketTypeEntity: Repository<TicketTypeEntity>;

  @Inject()
  ctx;

  /**
   * 生成订单号
   */
  generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TK${timestamp}${random}`;
  }

  /**
   * 生成二维码内容
   */
  generateQRCode(orderNo: string): string {
    return `TICKET:${orderNo}:${Date.now()}`;
  }

  /**
   * 创建订单
   */
  async createOrder(userId: number, data: any) {
    const { attractionId, ticketTypeId, quantity, useDate, contactName, contactPhone, contactIdCard, remark } = data;

    // 查询景点
    const attraction = await this.attractionEntity.findOne({
      where: { id: attractionId, status: 1 },
    });

    if (!attraction) {
      throw new Error('景点不存在');
    }

    // 查询票型
    const ticketType = await this.ticketTypeEntity.findOne({
      where: { id: ticketTypeId, status: 1 },
    });

    if (!ticketType) {
      throw new Error('票型不存在');
    }

    // 检查库存
    if (ticketType.stock < quantity) {
      throw new Error('票量不足');
    }

    // 计算总金额
    const totalAmount = ticketType.price * quantity;

    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 创建订单
    const order = await this.orderEntity.save({
      orderNo,
      userId,
      attractionId,
      attractionName: attraction.name,
      ticketTypeId,
      ticketTypeName: ticketType.name,
      quantity,
      useDate,
      contactName,
      contactPhone,
      contactIdCard,
      totalAmount,
      payAmount: totalAmount,
      remark: remark || '',
      status: 0, // 待付款
      payStatus: 0, // 未支付
    });

    // 扣减库存
    await this.nativeQuery(
      'UPDATE ticket_type SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, ticketTypeId, quantity]
    );

    // 增加景点订单数
    await this.nativeQuery(
      'UPDATE attraction SET orderCount = orderCount + 1 WHERE id = ?',
      [attractionId]
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
      SELECT * FROM ticket_order
      WHERE ${whereCondition}
      ORDER BY createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM ticket_order
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
    const sql = 'SELECT * FROM ticket_order WHERE orderNo = ? AND userId = ? LIMIT 1';
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

    // 恢复库存
    await this.nativeQuery(
      'UPDATE ticket_type SET stock = stock + ? WHERE id = ?',
      [order.quantity, order.ticketTypeId]
    );

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

    // 生成二维码
    const qrCode = this.generateQRCode(orderNo);

    // 更新订单状态
    order.payStatus = 1; // 已支付
    order.status = 1; // 待使用
    order.payTime = new Date().toISOString();
    order.qrCode = qrCode;

    await this.orderEntity.save(order);
    return order;
  }

  /**
   * 管理端：核销门票
   */
  async verifyTicket(id: number) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 1) {
      throw new Error('只有待使用的订单可以核销');
    }

    order.status = 2; // 已使用
    order.useTime = new Date().toISOString();

    await this.orderEntity.save(order);
  }

  /**
   * 管理端：退款
   */
  async refundTicket(id: number, reason: string) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status >= 2) {
      throw new Error('订单已使用，无法退款');
    }

    // 恢复库存
    await this.nativeQuery(
      'UPDATE ticket_type SET stock = stock + ? WHERE id = ?',
      [order.quantity, order.ticketTypeId]
    );

    order.status = 5; // 已退款
    order.refundTime = new Date().toISOString();
    order.refundReason = reason;

    await this.orderEntity.save(order);
  }

  /**
   * 管理端：取消订单
   */
  async cancelTicket(id: number, reason: string) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status >= 2) {
      throw new Error('订单已使用，无法取消');
    }

    // 恢复库存
    await this.nativeQuery(
      'UPDATE ticket_type SET stock = stock + ? WHERE id = ?',
      [order.quantity, order.ticketTypeId]
    );

    order.status = 4; // 已取消
    order.cancelReason = reason;

    await this.orderEntity.save(order);
  }
}
