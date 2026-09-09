-- ========================================
-- 购物车模块 - 数据库表
-- 模块前缀: cart_
-- ========================================

-- 【表1】cart_item - 购物车表
CREATE TABLE `cart_item` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车项ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `item_type` VARCHAR(20) NOT NULL COMMENT '商品类型：product/agri_product',
  `item_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_id` BIGINT DEFAULT NULL COMMENT 'SKU ID',
  `quantity` INT NOT NULL COMMENT '数量',
  `selected` TINYINT DEFAULT 1 COMMENT '是否选中',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_user_item` (`user_id`, `item_type`, `item_id`, `sku_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';