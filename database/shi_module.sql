-- ========================================
-- 食模块（餐饮美食+农产品）- 数据库表
-- 模块前缀: shi_
-- ========================================

-- 【表1】shi_restaurant - 餐厅表
CREATE TABLE `shi_restaurant` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '餐厅ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID（关联app_user.id）',
  `name` VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '餐厅图片JSON数组',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `capacity` INT DEFAULT 0 COMMENT '容纳人数',
  `avg_price` DECIMAL(10,2) DEFAULT NULL COMMENT '人均消费',
  `description` TEXT COMMENT '餐厅介绍',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_location` (`latitude`, `longitude`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 【表2】shi_restaurant_dish - 菜品表
CREATE TABLE `shi_restaurant_dish` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜品ID',
  `restaurant_id` BIGINT NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '菜品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `description` VARCHAR(255) DEFAULT '' COMMENT '菜品介绍',
  `is_signature` TINYINT DEFAULT 0 COMMENT '是否招牌菜',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 【表3】shi_restaurant_timeslot - 餐位时段配置表
CREATE TABLE `shi_restaurant_timeslot` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '时段ID',
  `restaurant_id` BIGINT NOT NULL COMMENT '餐厅ID',
  `name` VARCHAR(50) NOT NULL COMMENT '时段名称，如"午餐 11:30-13:30"',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `max_bookings` INT NOT NULL COMMENT '最大预订数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段配置表';

-- 【表4】shi_restaurant_booking - 餐位预订表
CREATE TABLE `shi_restaurant_booking` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '预订ID',
  `order_id` BIGINT NOT NULL COMMENT '关联订单ID',
  `restaurant_id` BIGINT NOT NULL COMMENT '餐厅ID',
  `timeslot_id` BIGINT NOT NULL COMMENT '时段ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `booking_date` DATE NOT NULL COMMENT '预订日期',
  `people_count` INT NOT NULL COMMENT '人数',
  `consignee` VARCHAR(50) NOT NULL COMMENT '预订人姓名',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/confirmed/cancelled/completed',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_restaurant_date` (`restaurant_id`, `booking_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位预订表';

-- 【表5】shi_agri_category - 农产品分类表
CREATE TABLE `shi_agri_category` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '' COMMENT '分类图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品分类表';

-- 【表6】shi_agri_product - 农产品表
CREATE TABLE `shi_agri_product` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID（关联app_user.id）',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '详情图片JSON数组',
  `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
  `market_price` DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `unit` VARCHAR(20) DEFAULT '件' COMMENT '单位',
  `origin` VARCHAR(100) DEFAULT '' COMMENT '产地',
  `shelf_life` VARCHAR(50) DEFAULT '' COMMENT '保质期',
  `detail` TEXT COMMENT '商品详情',
  `status` VARCHAR(20) DEFAULT 'on_sale',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';

-- 初始化数据
INSERT INTO `shi_agri_category` (`id`, `name`, `sort`) VALUES
(1, '茶叶', 1),
(2, '腊肉', 2),
(3, '米酒', 3),
(4, '酸食', 4),
(5, '其他特产', 5);