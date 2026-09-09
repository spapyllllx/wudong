import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { XingRouteItineraryEntity } from '../entity/routeItinerary';

/**
 * 路线行程服务
 */
@Provide()
export class XingRouteItineraryService extends BaseService {
  @InjectEntityModel(XingRouteItineraryEntity)
  xingRouteItineraryEntity: Repository<XingRouteItineraryEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   * @param query
   */
  async page(query) {
    const { keyWord, routeId } = query;
    const find = this.xingRouteItineraryEntity.createQueryBuilder('a');
    if (keyWord) {
      find.andWhere('a.description LIKE :keyWord', { keyWord: '%' + keyWord + '%' } );
    }
    if (routeId) {
      find.andWhere('a.routeId = :routeId', { routeId });
    }
    find.addOrderBy('a.dayNumber', 'ASC');
    return this.entityRenderPage(find, query);
  }

  /**
   * 新增
   * @param param
   */
  async add(param) {
    return super.add(param);
  }

  /**
   * 修改
   * @param param
   */
  async update(param) {
    return super.update(param);
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids: number[]) {
    return super.delete(ids);
  }

  /**
   * 根据ID获取信息
   * @param id
   */
  async info(id: number) {
    return await this.xingRouteItineraryEntity.findOneBy({ id });
  }
}
