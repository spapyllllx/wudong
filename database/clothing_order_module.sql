-- ============================================================
-- 订单模块(公共先行落地版)建表脚本 —— 第1组·衣 交付
-- 分支: feature/goods | 负责人合并用
--
-- 背景:设计文档 3.2.7「统一订单」原属核心组公共模块,因交付窗口
--   压缩且衣商品下单链路必须闭环,由衣模块按 init_database.sql
--   同源结构先行落地 orders/product_order_items/product_order_logistics。
-- 合并约定:本文件与 database/init_database.sql 3.2.7(约645-722行)同源,
--   核心组交付统一订单时应以此为准进行合并,勿另行创建同名表;
--   order_refunds 退款表本轮未落地(衣模块暂不提供退款功能),由核心组补齐。
-- 本地开发:表由 cool-admin-midway(synchronize=true)自动创建,无需执行本文件。
-- 执行注意:已执行过 init_database.sql 的库无需再执行(CREATE TABLE 冲突)。
-- ============================================================

-- 统一订单表
CREATE TABLE `orders` (
  `id` BIGINT PRIMARY KEY COMMENT '订单号（雪花算法生成）',
  `user_id` BIGINT NOT NULL,
  `order_type` VARCHAR(20) NOT NULL COMMENT 'product/restaurant/homestay/ticket/route',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `paid_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '实付金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式：wechat/alipay',
  `payment_no` VARCHAR(100) DEFAULT NULL COMMENT '支付流水号',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/paid/cancelled/completed/refunded',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '订单备注',
  `paid_at` DATETIME DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `cancelled_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一订单表';

-- 商品订单明细表
CREATE TABLE `product_order_items` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `sku_id` BIGINT DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `sku_name` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT NOT NULL COMMENT '数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单明细表';

-- 商品订单物流表
CREATE TABLE `product_order_logistics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL,
  `province` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `shipping_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
  `logistics_company` VARCHAR(50) DEFAULT NULL COMMENT '物流公司',
  `logistics_no` VARCHAR(100) DEFAULT NULL COMMENT '物流单号',
  `shipped_at` DATETIME DEFAULT NULL COMMENT '发货时间',
  `received_at` DATETIME DEFAULT NULL COMMENT '收货时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单物流表';
