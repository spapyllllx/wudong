import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../entity/category';

/**
 * 商品分类服务
 */
@Provide()
export class ProductCategoryService extends BaseService {
  @InjectEntityModel(ProductCategoryEntity)
  productCategoryEntity: Repository<ProductCategoryEntity>;

  /**
   * 获取分类树（两层）
   */
  async getCategoryTree() {
    // 获取所有启用的分类
    const categories = await this.productCategoryEntity.find({
      where: { status: 1 },
      order: { sort: 'ASC', createTime: 'ASC' },
    });

    // 构建树形结构
    const tree: any[] = [];
    const map = new Map();

    // 先找出所有一级分类
    categories.forEach(category => {
      if (category.parentId === 0) {
        tree.push({
          ...category,
          children: [],
        });
        map.set(category.id, tree[tree.length - 1]);
      }
    });

    // 再找出所有二级分类
    categories.forEach(category => {
      if (category.parentId !== 0) {
        const parent = map.get(category.parentId);
        if (parent) {
          parent.children.push(category);
        }
      }
    });

    return tree;
  }

  /**
   * 获取分类列表（扁平）
   */
  async getCategoryList() {
    return await this.productCategoryEntity.find({
      where: { status: 1 },
      order: { parentId: 'ASC', sort: 'ASC', createTime: 'ASC' },
    });
  }
}
