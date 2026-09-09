import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { ProductRefundEntity } from '../../entity/refund';
import { ClothingRefundService } from '../../service/refund';

/**
 * 退款审核(admin)
 */
@CoolController({
  api: ['page', 'info', 'delete'],
  entity: ProductRefundEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    addOrderBy: { id: 'DESC' },
  },
})
export class AdminClothingRefundController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingRefundService: ClothingRefundService;

  @Post('/approve', { summary: '退款通过(订单refunded+回补库存)' })
  async approve(@Body('id') id: number) {
    await this.clothingRefundService.approve(id, this.ctx.admin.userId);
    return this.ok();
  }

  @Post('/reject', { summary: '驳回退款' })
  async reject(@Body('id') id: number, @Body('reason') reason: string) {
    await this.clothingRefundService.reject(id, this.ctx.admin.userId, reason);
    return this.ok();
  }
}
