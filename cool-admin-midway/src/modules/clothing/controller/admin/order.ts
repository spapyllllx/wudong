import { CoolController, BaseController } from '@cool-midway/core';
import { ProductOrderEntity } from '../../entity/order';

/**
 * 订单管理(admin,仅 product 类型订单)
 * 说明:统一订单公共模块先行落地版本,核心组交付后并入公共订单管理。
 */
@CoolController({
  api: ['page', 'info', 'delete'],
  entity: ProductOrderEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    where: async () => [['a.order_type = :ot', { ot: 'product' }]],
    addOrderBy: { id: 'DESC' },
  },
})
export class AdminClothingOrderController extends BaseController {}
