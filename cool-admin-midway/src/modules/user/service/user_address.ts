import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddressEntity } from '../entity/user_address';

/**
 * 用户地址服务
 */
@Provide()
export class UserAddressService extends BaseService {
  @InjectEntityModel(UserAddressEntity)
  userAddressEntity: Repository<UserAddressEntity>;

  @Inject()
  ctx;

  /**
   * 获取地址列表
   */
  async getAddressList(userId: number) {
    return await this.userAddressEntity.find({
      where: { userId },
      order: { isDefault: 'DESC', createTime: 'DESC' },
    });
  }

  /**
   * 获取默认地址
   */
  async getDefaultAddress(userId: number) {
    return await this.userAddressEntity.findOne({
      where: { userId, isDefault: 1 },
    });
  }

  /**
   * 添加地址
   */
  async addAddress(userId: number, data: any) {
    const { receiverName, receiverPhone, province, city, district, address, isDefault } = data;

    // 如果设置为默认地址，先取消其他默认地址
    if (isDefault === 1) {
      await this.nativeQuery(
        'UPDATE user_address SET isDefault = 0 WHERE userId = ?',
        [userId]
      );
    }

    const addressEntity = await this.userAddressEntity.save({
      userId,
      receiverName,
      receiverPhone,
      province,
      city,
      district,
      address,
      isDefault: isDefault || 0,
    });

    return addressEntity;
  }

  /**
   * 更新地址
   */
  async updateAddress(id: number, userId: number, data: any) {
    const addressEntity = await this.userAddressEntity.findOne({
      where: { id, userId },
    });

    if (!addressEntity) {
      throw new Error('地址不存在');
    }

    const { receiverName, receiverPhone, province, city, district, address, isDefault } = data;

    // 如果设置为默认地址，先取消其他默认地址
    if (isDefault === 1) {
      await this.nativeQuery(
        'UPDATE user_address SET isDefault = 0 WHERE userId = ? AND id != ?',
        [userId, id]
      );
    }

    Object.assign(addressEntity, {
      receiverName,
      receiverPhone,
      province,
      city,
      district,
      address,
      isDefault: isDefault !== undefined ? isDefault : addressEntity.isDefault,
    });

    await this.userAddressEntity.save(addressEntity);
    return addressEntity;
  }

  /**
   * 设置默认地址
   */
  async setDefaultAddress(id: number, userId: number) {
    const addressEntity = await this.userAddressEntity.findOne({
      where: { id, userId },
    });

    if (!addressEntity) {
      throw new Error('地址不存在');
    }

    // 取消其他默认地址
    await this.nativeQuery(
      'UPDATE user_address SET isDefault = 0 WHERE userId = ?',
      [userId]
    );

    // 设置当前为默认
    addressEntity.isDefault = 1;
    await this.userAddressEntity.save(addressEntity);

    return addressEntity;
  }

  /**
   * 删除地址
   */
  async deleteAddress(id: number, userId: number) {
    const addressEntity = await this.userAddressEntity.findOne({
      where: { id, userId },
    });

    if (!addressEntity) {
      throw new Error('地址不存在');
    }

    await this.userAddressEntity.delete(id);
  }
}
