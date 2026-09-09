-- ============================================================
-- 购物车表(公共先行落地版)建表脚本 —— 第1组·衣 交付
-- 分支: feature/goods | 负责人合并用
--
-- 背景:设计文档 3.2.8「购物车」为跨模块公共表(核心组),因衣电商
--   演示需要先行落地,由衣模块按 init_database.sql 同源结构落地。
-- 合并约定:与 database/init_database.sql 3.2.8(约730-742行)同源,
--   核心组交付时应以此为准合并,勿另行创建同名表。
-- 本地开发:表由 cool-admin-midway(synchronize=true)自动创建,无需执行本文件。
-- ============================================================

-- 购物车表
CREATE TABLE `carts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `item_type` VARCHAR(20) NOT NULL COMMENT 'product/agri_product',
  `item_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_id` BIGINT DEFAULT NULL COMMENT 'SKU ID',
  `quantity` INT NOT NULL COMMENT '数量',
  `selected` TINYINT DEFAULT 1 COMMENT '是否选中',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_item` (`user_id`, `item_type`, `item_id`, `sku_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';
