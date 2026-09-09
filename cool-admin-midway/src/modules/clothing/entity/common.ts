import * as moment from 'moment';

/**
 * 衣模块通用 transformer
 *
 * 本模块实体不继承 base 模块的 BaseEntity(其列为 camelCase:
 * createTime/updateTime varchar + tenantId,与技术文档 DDL 不符),
 * 而是显式声明全部列、把 TS 属性映射到 snake_case 列名。
 * 此处复制时间/JSON transformer,保证模块自包含、不依赖 base 内部实现。
 */

/**
 * 时间转换器:datetime 列统一输出 'YYYY-MM-DD HH:mm:ss' 字符串
 * 注意:to() 对空值必须原样直通(undefined 保持 undefined,
 * 让 TypeORM 走列默认值;null 保持 null),不能转成 null,
 * 否则会把空值显式写入 NOT NULL 列导致插入失败。
 */
export const transformerTime = {
  to(value: any) {
    if (value === undefined || value === null || value === '') return value;
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  },
  from(value: any) {
    if (value === undefined || value === null || value === '') return null;
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  },
};

/**
 * JSON 转换器:原生 SQL 场景下 MySQL 返回字符串,统一转对象
 */
export const transformerJson = {
  to: (value: any) => value,
  from: (value: any) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  },
};

/**
 * 金额转换器:DECIMAL 列在驱动层返回字符串,统一转 number
 */
export const transformerDecimal = {
  to: (value: any) => value,
  from: (value: any) =>
    value === null || value === undefined ? null : Number(value),
};

/**
 * BIGINT 转换器:mysql2 驱动对 bigint 列返回字符串(即使值很小),
 * 统一转 number(项目数据量远小于 2^53,安全)
 */
export const transformerInt = {
  to: (value: any) => value,
  from: (value: any) =>
    value === null || value === undefined || value === '' ? null : Number(value),
};
