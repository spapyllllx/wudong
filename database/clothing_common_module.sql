-- ============================================================
-- 衣模块配套公共表(先行落地版)建表脚本 —— 第1组·衣 交付
-- 分支: feature/goods | 负责人合并用
--
-- 背景:以下表在设计文档中属平台运营/统一订单公共范围,因衣电商
--   演示闭环需要,由衣模块按 init_database.sql 同源结构先行落地:
--   1) banners(3.2.9 轮播图)2) order_refunds(3.2.7 退款申请)
--   3) user_addresses(4.2 收货地址):本轮**未建表**——C 端地址已复用
--      cool-admin user 模块既有 user_address 表与 /app/user/address 接口,
--      避免重复建设;如组长要求统一为 user_addresses 命名,再做迁移。
-- 本地开发:表由 cool-admin-midway(synchronize=true)自动创建,无需执行本文件。
-- 演示种子:本地可执行下列 INSERT(幂等),首页轮播即显示商品图。
-- ============================================================

-- 轮播图表
CREATE TABLE `banners` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `link_type` VARCHAR(50) DEFAULT NULL COMMENT '跳转类型：url/product/post等',
  `link_value` VARCHAR(255) DEFAULT NULL COMMENT '跳转值',
  `position` VARCHAR(50) DEFAULT 'home' COMMENT '位置：home/category等',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_position_sort` (`position`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 退款申请表
CREATE TABLE `order_refunds` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `refund_amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额',
  `reason` VARCHAR(500) NOT NULL COMMENT '退款原因',
  `images` JSON DEFAULT NULL COMMENT '凭证图片',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/approved/rejected/completed',
  `reject_reason` VARCHAR(255) DEFAULT NULL,
  `handler_id` BIGINT DEFAULT NULL,
  `handled_at` DATETIME DEFAULT NULL,
  `refund_no` VARCHAR(100) DEFAULT NULL COMMENT '退款流水号',
  `refunded_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='退款申请表';

-- 演示轮播种子(幂等,可重复执行)
INSERT IGNORE INTO `banners` (`id`, `title`, `image`, `link_type`, `link_value`, `position`, `sort`, `status`) VALUES
  (1, '苗族银饰 · 非遗之美', 'http://127.0.0.1:8001/upload/test/silver.jpg', 'product', '1', 'home', 1, 'active'),
  (2, '手工银饰专场', 'http://127.0.0.1:8001/upload/test/silver2.jpg', 'product', '1', 'home', 2, 'active'),
  (3, '匠心非遗好物推荐', 'http://127.0.0.1:8001/upload/test/silver.jpg', 'product', '1', 'home', 3, 'active');
