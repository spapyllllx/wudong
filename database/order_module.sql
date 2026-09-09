-- ========================================
-- 订单模块（统一订单+退款）- 数据库表
-- 模块前缀: order_
-- 说明：关联 app_user.id 作为 user_id，关联 base_sys_user.id 作为 handler_id
-- ========================================

-- 【表1】order_main - 统一订单表
CREATE TABLE `order_main` (
  `id` BIGINT PRIMARY KEY COMMENT '订单号（雪花算法生成）',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `order_type` VARCHAR(20) NOT NULL COMMENT '订单类型：product/restaurant/homestay/ticket/route',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `paid_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '实付金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式：wechat/alipay',
  `payment_no` VARCHAR(100) DEFAULT NULL COMMENT '支付流水号',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/paid/cancelled/completed/refunded',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '订单备注',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `cancelled_at` DATETIME DEFAULT NULL COMMENT '取消时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一订单表';

-- 【表2】order_product_item - 商品订单明细表
CREATE TABLE `order_product_item` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '明细ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_id` BIGINT DEFAULT NULL COMMENT 'SKU ID',
  `product_name` VARCHAR(255) NOT NULL COMMENT '商品名称',
  `sku_name` VARCHAR(100) DEFAULT NULL COMMENT 'SKU名称',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT NOT NULL COMMENT '数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单明细表';

-- 【表3】order_product_logistics - 商品订单物流表
CREATE TABLE `order_product_logistics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '物流ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省',
  `city` VARCHAR(50) NOT NULL COMMENT '市',
  `district` VARCHAR(50) NOT NULL COMMENT '区',
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `shipping_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
  `logistics_company` VARCHAR(50) DEFAULT NULL COMMENT '物流公司',
  `logistics_no` VARCHAR(100) DEFAULT NULL COMMENT '物流单号',
  `shipped_at` DATETIME DEFAULT NULL COMMENT '发货时间',
  `received_at` DATETIME DEFAULT NULL COMMENT '收货时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单物流表';

-- 【表4】order_refund - 退款申请表
CREATE TABLE `order_refund` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '退款ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `refund_amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额',
  `reason` VARCHAR(500) NOT NULL COMMENT '退款原因',
  `images` JSON DEFAULT NULL COMMENT '凭证图片JSON数组',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/approved/rejected/completed',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `handler_id` BIGINT DEFAULT NULL COMMENT '处理人ID（关联base_sys_user.id）',
  `handled_at` DATETIME DEFAULT NULL COMMENT '处理时间',
  `refund_no` VARCHAR(100) DEFAULT NULL COMMENT '退款流水号',
  `refunded_at` DATETIME DEFAULT NULL COMMENT '退款时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='退款申请表';