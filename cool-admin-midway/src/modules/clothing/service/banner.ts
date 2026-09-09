import { BaseService } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from '../entity/banner';

/**
 * 轮播图(衣先行落地)
 */
@Provide()
export class ClothingBannerService extends BaseService {
  @InjectEntityModel(BannerEntity)
  bannerEntity: Repository<BannerEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.bannerEntity);
  }

  /** 前台轮播(active + home 位置,按 sort 排序) */
  async activeList(position: string = 'home') {
    const list = await this.bannerEntity.find({
      where: { status: 'active', position },
      order: { sort: 'ASC', id: 'ASC' },
    });
    return list.map((b) => ({
      id: Number(b.id),
      title: b.title,
      image: b.image,
      link_type: b.linkType,
      link_value: b.linkValue,
    }));
  }
}
