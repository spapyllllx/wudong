import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entity/cart';

/**
 * 购物车服务
 */
@Provide()
export class CartService extends BaseService {
  @InjectEntityModel(CartEntity)
  cartEntity: Repository<CartEntity>;

  @Inject()
  ctx;

  /**
   * 添加到购物车
   */
  async addToCart(userId: number, data: any) {
    const { productId, skuId, quantity = 1 } = data;

    // 检查购物车中是否已存在该商品（同SKU）
    const existCart = await this.cartEntity.findOne({
      where: {
        userId,
        productId,
        skuId: skuId || null,
      },
    });

    if (existCart) {
      // 已存在，增加数量
      existCart.quantity += quantity;
      await this.cartEntity.save(existCart);
      return existCart;
    } else {
      // 不存在，新增
      const cart = await this.cartEntity.save({
        userId,
        productId,
        skuId: skuId || null,
        quantity,
        selected: 1,
      });
      return cart;
    }
  }

  /**
   * 获取购物车列表
   */
  async getCartList(userId: number) {
    const sql = `
      SELECT
        c.id,
        c.userId,
        c.productId,
        c.skuId,
        c.quantity,
        c.selected,
        p.title as productTitle,
        p.mainImage as productImage,
        p.price as productPrice,
        p.stock as productStock,
        p.status as productStatus,
        s.specName as skuName,
        s.price as skuPrice,
        s.stock as skuStock,
        s.image as skuImage,
        s.status as skuStatus
      FROM
        cart c
      LEFT JOIN product p ON c.productId = p.id
      LEFT JOIN product_sku s ON c.skuId = s.id
      WHERE c.userId = ?
      ORDER BY c.createTime DESC
    `;

    const list = await this.nativeQuery(sql, [userId]);

    // 处理每一项
    list.forEach((item: any) => {
      // 计算实际价格（有SKU用SKU价格，否则用商品价格）
      item.currentPrice = item.skuId ? item.skuPrice : item.productPrice;
      item.currentStock = item.skuId ? item.skuStock : item.productStock;
      item.currentImage = item.skuImage || item.productImage;

      // 检查商品状态
      item.isAvailable = item.productStatus === 1 && (item.skuId ? item.skuStatus === 1 : true);
      item.isInStock = item.currentStock >= item.quantity;
    });

    return list;
  }

  /**
   * 更新购物车商品数量
   */
  async updateQuantity(id: number, userId: number, quantity: number) {
    const cart = await this.cartEntity.findOne({
      where: { id, userId },
    });

    if (!cart) {
      throw new Error('购物车项不存在');
    }

    if (quantity <= 0) {
      throw new Error('数量必须大于0');
    }

    cart.quantity = quantity;
    await this.cartEntity.save(cart);
    return cart;
  }

  /**
   * 更新选中状态
   */
  async updateSelected(id: number, userId: number, selected: number) {
    const cart = await this.cartEntity.findOne({
      where: { id, userId },
    });

    if (!cart) {
      throw new Error('购物车项不存在');
    }

    cart.selected = selected;
    await this.cartEntity.save(cart);
    return cart;
  }

  /**
   * 全选/取消全选
   */
  async selectAll(userId: number, selected: number) {
    await this.nativeQuery(
      'UPDATE cart SET selected = ? WHERE userId = ?',
      [selected, userId]
    );
  }

  /**
   * 删除购物车商品
   */
  async removeFromCart(id: number, userId: number) {
    const cart = await this.cartEntity.findOne({
      where: { id, userId },
    });

    if (!cart) {
      throw new Error('购物车项不存在');
    }

    await this.cartEntity.delete(id);
  }

  /**
   * 批量删除
   */
  async batchRemove(ids: number[], userId: number) {
    await this.nativeQuery(
      'DELETE FROM cart WHERE id IN (?) AND userId = ?',
      [ids, userId]
    );
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: number) {
    await this.cartEntity.delete({ userId });
  }

  /**
   * 获取购物车数量
   */
  async getCartCount(userId: number) {
    const result = await this.nativeQuery(
      'SELECT COUNT(*) as count FROM cart WHERE userId = ?',
      [userId]
    );
    return result[0]?.count || 0;
  }

  /**
   * 获取选中的商品列表
   */
  async getSelectedItems(userId: number) {
    const list = await this.getCartList(userId);
    return list.filter((item: any) => item.selected === 1);
  }
}
