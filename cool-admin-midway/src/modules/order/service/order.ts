import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entity/order';
import { OrderItemEntity } from '../entity/order_item';
import { OrderLogEntity } from '../entity/order_log';

/**
 * 订单服务
 */
@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(OrderItemEntity)
  orderItemEntity: Repository<OrderItemEntity>;

  @InjectEntityModel(OrderLogEntity)
  orderLogEntity: Repository<OrderLogEntity>;

  @Inject()
  ctx;

  /**
   * 生成订单号
   */
  generateOrderNo(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp}${random}`;
  }

  /**
   * 创建订单
   */
  async createOrder(userId: number, data: any) {
    const { items, address, remark } = data;

    if (!items || items.length === 0) {
      throw new Error('请选择要购买的商品');
    }

    if (!address) {
      throw new Error('请选择收货地址');
    }

    // 生成订单号
    const orderNo = this.generateOrderNo();

    // 计算订单金额
    let totalAmount = 0;
    items.forEach((item: any) => {
      totalAmount += item.currentPrice * item.quantity;
    });

    const freight = 0; // 暂时免运费
    const discountAmount = 0; // 暂无优惠
    const payAmount = totalAmount + freight - discountAmount;

    // 创建订单主表
    const order = await this.orderEntity.save({
      orderNo,
      userId,
      totalAmount,
      payAmount,
      freight,
      discountAmount,
      status: 0, // 待付款
      payStatus: 0, // 未支付
      remark: remark || '',
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      receiverProvince: address.receiverProvince,
      receiverCity: address.receiverCity,
      receiverDistrict: address.receiverDistrict,
      receiverAddress: address.receiverAddress,
    });

    // 创建订单商品
    const orderItems = items.map((item: any) => ({
      orderId: order.id,
      orderNo,
      productId: item.productId,
      productTitle: item.productTitle,
      productImage: item.currentImage,
      skuId: item.skuId || null,
      skuName: item.skuName || null,
      price: item.currentPrice,
      quantity: item.quantity,
      totalAmount: item.currentPrice * item.quantity,
    }));

    await this.orderItemEntity.save(orderItems);

    // 记录订单日志
    await this.addOrderLog(order.id, orderNo, '创建订单', '用户创建订单', userId);

    // 扣减库存（这里简化处理，实际应该加锁）
    for (const item of items) {
      if (item.skuId) {
        await this.nativeQuery(
          'UPDATE product_sku SET stock = stock - ? WHERE id = ? AND stock >= ?',
          [item.quantity, item.skuId, item.quantity]
        );
      } else {
        await this.nativeQuery(
          'UPDATE product SET stock = stock - ? WHERE id = ? AND stock >= ?',
          [item.quantity, item.productId, item.quantity]
        );
      }
    }

    // 删除购物车中的商品
    const cartIds = items.map((item: any) => item.id).filter(Boolean);
    if (cartIds.length > 0) {
      await this.nativeQuery(
        'DELETE FROM cart WHERE id IN (?) AND userId = ?',
        [cartIds, userId]
      );
    }

    return order;
  }

  /**
   * 获取订单列表
   */
  async getOrderList(userId: number, page: number, size: number, status?: number) {
    const offset = (page - 1) * size;

    const params: any[] = [userId];
    let whereCondition = 'o.userId = ?';

    if (status !== undefined && status !== -1) {
      whereCondition += ' AND o.status = ?';
      params.push(status);
    }

    const sql = `
      SELECT
        o.*
      FROM
        \`order\` o
      WHERE ${whereCondition}
      ORDER BY o.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM \`order\` o
      WHERE ${whereCondition}
    `;

    params.push(offset, size);

    const list = await this.nativeQuery(sql, params);
    const countResult = await this.nativeQuery(countSql, params.slice(0, -2));
    const total = countResult[0]?.total || 0;

    // 查询订单商品
    for (const order of list) {
      const items = await this.orderItemEntity.find({
        where: { orderId: order.id },
      });
      order.items = items;
    }

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
    const sql = `
      SELECT o.*
      FROM \`order\` o
      WHERE o.orderNo = ? AND o.userId = ?
      LIMIT 1
    `;

    const result = await this.nativeQuery(sql, [orderNo, userId]);

    if (!result || result.length === 0) {
      throw new Error('订单不存在');
    }

    const order = result[0];

    // 查询订单商品
    order.items = await this.orderItemEntity.find({
      where: { orderId: order.id },
    });

    // 查询订单日志
    order.logs = await this.orderLogEntity.find({
      where: { orderId: order.id },
      order: { createTime: 'ASC' },
    });

    return order;
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
      throw new Error('只有待付款订单可以取消');
    }

    order.status = 4; // 已取消
    order.cancelTime = new Date().toISOString();
    order.cancelReason = reason;

    await this.orderEntity.save(order);

    // 恢复库存
    const items = await this.orderItemEntity.find({
      where: { orderId: order.id },
    });

    for (const item of items) {
      if (item.skuId) {
        await this.nativeQuery(
          'UPDATE product_sku SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.skuId]
        );
      } else {
        await this.nativeQuery(
          'UPDATE product SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
    }

    // 记录日志
    await this.addOrderLog(order.id, orderNo, '取消订单', `用户取消订单：${reason}`, userId);

    return order;
  }

  /**
   * 确认收货
   */
  async confirmReceipt(orderNo: string, userId: number) {
    const order = await this.orderEntity.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 2) {
      throw new Error('只有待收货订单可以确认收货');
    }

    order.status = 3; // 已完成
    order.finishTime = new Date().toISOString();

    await this.orderEntity.save(order);

    // 增加商品销量
    const items = await this.orderItemEntity.find({
      where: { orderId: order.id },
    });

    for (const item of items) {
      await this.nativeQuery(
        'UPDATE product SET sales = sales + ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // 记录日志
    await this.addOrderLog(order.id, orderNo, '确认收货', '用户确认收货', userId);

    return order;
  }

  /**
   * 删除订单
   */
  async deleteOrder(orderNo: string, userId: number) {
    const order = await this.orderEntity.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    // 只能删除已完成或已取消的订单
    if (![3, 4].includes(order.status)) {
      throw new Error('只能删除已完成或已取消的订单');
    }

    await this.orderEntity.delete(order.id);
    await this.orderItemEntity.delete({ orderId: order.id });
    await this.orderLogEntity.delete({ orderId: order.id });
  }

  /**
   * 添加订单日志
   */
  async addOrderLog(
    orderId: number,
    orderNo: string,
    operateType: string,
    operateContent: string,
    operatorId?: number
  ) {
    await this.orderLogEntity.save({
      orderId,
      orderNo,
      operateType,
      operateContent,
      operatorId: operatorId || null,
      operatorName: operatorId ? '用户' : '系统',
    });
  }

  /**
   * 获取订单统计
   */
  async getOrderStats(userId: number) {
    const sql = `
      SELECT
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as waitPayCount,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as waitShipCount,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as waitReceiveCount,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) as finishedCount
      FROM \`order\`
      WHERE userId = ?
    `;

    const result = await this.nativeQuery(sql, [userId]);
    return result[0] || {
      waitPayCount: 0,
      waitShipCount: 0,
      waitReceiveCount: 0,
      finishedCount: 0,
    };
  }

  /**
   * 管理端：分页查询订单
   */
  async page(query: any) {
    const { keyWord, status, payStatus, startTime, endTime, page = 1, size = 20 } = query;
    const offset = (page - 1) * size;

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (keyWord) {
      whereClauses.push('(o.orderNo LIKE ? OR o.receiverName LIKE ? OR o.receiverPhone LIKE ?)');
      params.push(`%${keyWord}%`, `%${keyWord}%`, `%${keyWord}%`);
    }

    if (status !== undefined && status !== null && status !== '') {
      whereClauses.push('o.status = ?');
      params.push(status);
    }

    if (payStatus !== undefined && payStatus !== null && payStatus !== '') {
      whereClauses.push('o.payStatus = ?');
      params.push(payStatus);
    }

    if (startTime) {
      whereClauses.push('o.createTime >= ?');
      params.push(startTime);
    }

    if (endTime) {
      whereClauses.push('o.createTime <= ?');
      params.push(endTime);
    }

    const whereClause = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const sql = `
      SELECT
        o.*
      FROM
        \`order\` o
      ${whereClause}
      ORDER BY o.createTime DESC
      LIMIT ?, ?
    `;

    const countSql = `
      SELECT COUNT(*) as total
      FROM \`order\` o
      ${whereClause}
    `;

    const list = await this.nativeQuery(sql, [...params, offset, size]);
    const countResult = await this.nativeQuery(countSql, params);
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
   * 管理端：发货
   */
  async shipOrder(id: number) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 1) {
      throw new Error('只有待发货订单可以发货');
    }

    order.status = 2; // 待收货
    order.shipTime = new Date().toISOString();

    await this.orderEntity.save(order);

    await this.addOrderLog(order.id, order.orderNo, '订单发货', '管理员发货');
  }

  /**
   * 管理端：取消订单
   */
  async adminCancelOrder(id: number, reason: string) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status >= 3) {
      throw new Error('订单已完成或已取消，无法取消');
    }

    order.status = 4; // 已取消
    order.cancelTime = new Date().toISOString();
    order.cancelReason = reason;

    await this.orderEntity.save(order);

    // 恢复库存
    const items = await this.orderItemEntity.find({
      where: { orderId: order.id },
    });

    for (const item of items) {
      if (item.skuId) {
        await this.nativeQuery(
          'UPDATE product_sku SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.skuId]
        );
      } else {
        await this.nativeQuery(
          'UPDATE product SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }
    }

    await this.addOrderLog(order.id, order.orderNo, '取消订单', `管理员取消订单：${reason}`);
  }

  /**
   * 管理端：获取订单详情（包含商品和日志）
   */
  async getAdminOrderDetail(id: number) {
    const order = await this.orderEntity.findOne({ where: { id } });

    if (!order) {
      throw new Error('订单不存在');
    }

    // 查询订单商品
    order.items = await this.orderItemEntity.find({
      where: { orderId: order.id },
    });

    // 查询订单日志
    order.logs = await this.orderLogEntity.find({
      where: { orderId: order.id },
      order: { createTime: 'ASC' },
    });

    return order;
  }
}
