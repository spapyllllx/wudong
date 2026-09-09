import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { XingTicketTypeEntity } from '../entity/ticketType';

/**
 * 票种服务
 */
@Provide()
export class XingTicketTypeService extends BaseService {
  @InjectEntityModel(XingTicketTypeEntity)
  xingTicketTypeEntity: Repository<XingTicketTypeEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   * @param query
   */
  async page(query) {
    const { keyWord, scenicId, status } = query;
    const find = this.xingTicketTypeEntity.createQueryBuilder('a');
    if (keyWord) {
      find.andWhere('a.name LIKE :keyWord', { keyWord: `%${keyWord}%` });
    }
    if (scenicId) {
      find.andWhere('a.scenicId = :scenicId', { scenicId });
    }
    if (status !== undefined && status !== null) {
      find.andWhere('a.status = :status', { status });
    }
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
    return await this.xingTicketTypeEntity.findOneBy({ id });
  }
}
