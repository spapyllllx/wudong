import { BaseService, CoolCommException } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entity/cart';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';

/**
 * 购物车(衣)
 */
@Provide()
export class ClothingCartService extends BaseService {
  @InjectEntityModel(CartEntity)
  cartEntity: Repository<CartEntity>;

  @InjectEntityModel(ProductSkuEntity)
  skuEntity: Repository<ProductSkuEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.cartEntity);
  }

  /** 加入购物车:同 SKU 已存在则数量累加 */
  async addCart(userId: number, skuId: number, quantity: number) {
    const qty = Number(quantity);
    if (!skuId || !Number.isInteger(qty) || qty <= 0) {
      throw new CoolCommException('参数错误');
    }
    const sku = await this.skuEntity.findOne({ where: { id: skuId } });
    if (!sku || sku.status !== 'active') {
      throw new CoolCommException('商品规格不存在');
    }
    const product = await this.productEntity.findOne({
      where: { id: sku.productId, status: 'on_sale' },
    });
    if (!product) throw new CoolCommException('商品不存在或已下架');

    const exist = await this.cartEntity.findOneBy({
      userId,
      itemType: 'product',
      itemId: product.id,
      skuId,
    });
    if (exist) {
      await this.cartEntity.update(exist.id, { quantity: exist.quantity + qty });
      return { id: exist.id, quantity: exist.quantity + qty };
    }
    const res = await this.cartEntity.insert({
      userId,
      itemType: 'product',
      itemId: product.id,
      skuId,
      quantity: qty,
      selected: 1,
    });
    return { id: res.identifiers[0].id, quantity: qty };
  }

  /** 修改数量 */
  async updateQuantity(userId: number, cartId: number, quantity: number) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new CoolCommException('数量错误');
    }
    const cart = await this.cartEntity.findOneBy({ id: cartId, userId });
    if (!cart) throw new CoolCommException('购物车项不存在');
    const sku = await this.skuEntity.findOneBy({ id: cart.skuId });
    if (sku && qty > sku.stock) {
      throw new CoolCommException(`库存不足,仅剩 ${sku.stock}`);
    }
    await this.cartEntity.update(cartId, { quantity: qty });
  }

  /** 删除(支持批量) */
  async remove(userId: number, ids: number[]) {
    if (!ids?.length) throw new CoolCommException('请选择要删除的项');
    await this.cartEntity
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId', { userId })
      .andWhere('id IN (:...ids)', { ids })
      .execute();
  }

  /** 购物车列表(join 商品/SKU 详情) */
  async cartList(userId: number) {
    const rows: any[] = await this.nativeQuery(
      `SELECT c.id, c.item_id product_id, c.sku_id, c.quantity, c.selected,
              p.title, p.subtitle, p.main_image, p.status product_status,
              s.sku_name, s.price, s.stock sku_stock, s.status sku_status
       FROM carts c
       JOIN products p ON p.id = c.item_id AND p.deleted_at IS NULL
       LEFT JOIN product_skus s ON s.id = c.sku_id
       WHERE c.user_id = ? AND c.item_type = 'product'
       ORDER BY c.id DESC`,
      [userId]
    );
    return rows.map((r: any) => ({
      id: Number(r.id),
      product_id: Number(r.product_id),
      sku_id: r.sku_id === null || r.sku_id === undefined ? null : Number(r.sku_id),
      quantity: r.quantity,
      selected: r.selected,
      title: r.title,
      subtitle: r.subtitle,
      main_image: r.main_image,
      sku_name: r.sku_name,
      price: r.price === null || r.price === undefined ? null : Number(r.price),
      sku_stock: r.sku_stock,
      invalid: !(r.product_status === 'on_sale' && (r.sku_status === 'active' || r.sku_status === null)),
      sold_out: r.sku_stock !== null && r.sku_stock <= 0,
    }));
  }
}
