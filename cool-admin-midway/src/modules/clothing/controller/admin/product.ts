import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { ProductEntity } from '../../entity/product';
import { ClothingProductService } from '../../service/product';

/**
 * 商品管理(admin)
 * 说明:add/update/delete 含 skus/images 子表处理,由服务层实现,
 * 不走框架自动 CRUD(自动 CRUD 仅保留 page/list/info)。
 */
@CoolController({
  api: ['page', 'list', 'info'],
  entity: ProductEntity,
  pageQueryOp: {
    fieldEq: [
      'a.status',
      { column: 'a.category_id', requestParam: 'categoryId' },
      { column: 'a.merchant_id', requestParam: 'merchantId' },
    ],
    keyWordLikeFields: ['a.title'],
    addOrderBy: { id: 'DESC' },
  },
})
export class AdminClothingProductController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingProductService: ClothingProductService;

  @Post('/add', { summary: '新增商品(含SKU/图片)' })
  async createProduct(@Body() body) {
    return this.ok(await this.clothingProductService.saveProduct(body));
  }

  @Post('/update', { summary: '修改商品(含SKU/图片全量替换)' })
  async updateProduct(@Body() body) {
    return this.ok(await this.clothingProductService.saveProduct(body));
  }

  @Post('/delete', { summary: '删除商品(级联删除SKU/图片)' })
  async removeProduct() {
    const { ids } = this.ctx.request.body;
    await this.clothingProductService.deleteProduct(ids);
    return this.ok();
  }

  @Get('/detail', { summary: '商品完整信息(编辑回显)' })
  async productDetail(@Query('id') id: number) {
    return this.ok(await this.clothingProductService.detailWithChildren(id));
  }
}
