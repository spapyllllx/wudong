import { BaseService } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../entity/category';

/**
 * 商品分类
 */
@Provide()
export class ClothingCategoryService extends BaseService {
  @InjectEntityModel(ProductCategoryEntity)
  categoryEntity: Repository<ProductCategoryEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.categoryEntity);
  }

  /**
   * 前台分类列表(仅 active,bigint 主键统一转 number)
   */
  async activeList() {
    const list = await this.categoryEntity.find({
      where: { status: 'active' },
      order: { sort: 'ASC', id: 'ASC' },
    });
    return list.map((item) => ({ ...item, id: Number(item.id) }));
  }
}
