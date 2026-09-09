import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { ProductOrderEntity } from '../../entity/order';
import { ClothingOrderService } from '../../service/order';

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
export class AdminClothingOrderController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingOrderService: ClothingOrderService;

  @Post('/ship', { summary: '发货(填物流公司/单号)' })
  async ship(
    @Body('orderId') orderId: number,
    @Body('logisticsCompany') logisticsCompany: string,
    @Body('logisticsNo') logisticsNo: string
  ) {
    await this.clothingOrderService.ship(orderId, logisticsCompany, logisticsNo);
    return this.ok();
  }
}
