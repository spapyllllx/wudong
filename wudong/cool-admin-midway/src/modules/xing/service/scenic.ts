import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { XingScenicEntity } from '../entity/scenic';

/**
 * 景区服务
 */
@Provide()
export class XingScenicService extends BaseService {
  @InjectEntityModel(XingScenicEntity)
  xingScenicEntity: Repository<XingScenicEntity>;

  @Inject()
  ctx;

  /**
   * 分页查询
   * @param query
   */
  async page(query) {
    const { keyWord, status } = query;
    const find = this.xingScenicEntity.createQueryBuilder('a');
    if (keyWord) {
      find.andWhere('(a.name LIKE :keyWord OR a.address LIKE :keyWord)', { keyWord: '%' + keyWord + '%' } );
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
    return await this.xingScenicEntity.findOneBy({ id, status: 1 })
  }
}
