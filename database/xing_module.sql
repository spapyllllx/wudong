-- ========================================
-- 行模块（门票+路线套餐+交通攻略）- 数据库表
-- 模块前缀: xing_
-- ========================================

-- 【表1】xing_scenic_spot - 景区表
CREATE TABLE `xing_scenic_spot` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '景区ID',
  `name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '景区图片JSON数组',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `opening_hours` VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  `description` TEXT COMMENT '景区介绍',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- 【表2】xing_ticket_type - 票种表
CREATE TABLE `xing_ticket_type` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '票种ID',
  `scenic_spot_id` BIGINT NOT NULL COMMENT '景区ID',
  `name` VARCHAR(100) NOT NULL COMMENT '票种名称，如"成人票","儿童票"',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `validity_days` INT DEFAULT 1 COMMENT '有效天数',
  `description` VARCHAR(255) DEFAULT '' COMMENT '说明',
  `stock` INT DEFAULT 9999 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_scenic_spot` (`scenic_spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

-- 【表3】xing_route_package - 路线套餐表
CREATE TABLE `xing_route_package` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '路线ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID（关联app_user.id）',
  `title` VARCHAR(100) NOT NULL COMMENT '路线标题',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '图片JSON数组',
  `days` INT NOT NULL COMMENT '天数',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `includes` TEXT COMMENT '包含项目',
  `excludes` TEXT COMMENT '不包含项目',
  `departure_place` VARCHAR(100) DEFAULT '' COMMENT '出发地',
  `destination` VARCHAR(100) DEFAULT '' COMMENT '目的地',
  `accommodation_standard` VARCHAR(255) DEFAULT '' COMMENT '住宿标准',
  `meal_standard` VARCHAR(255) DEFAULT '' COMMENT '餐饮标准',
  `notices` TEXT COMMENT '注意事项',
  `theme_tags` JSON DEFAULT NULL COMMENT '主题标签，如["亲子","摄影","研学"]',
  `description` TEXT COMMENT '路线介绍',
  `stock` INT DEFAULT 999 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_days` (`days`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- 【表4】xing_route_itinerary - 路线行程表
CREATE TABLE `xing_route_itinerary` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '行程ID',
  `route_package_id` BIGINT NOT NULL COMMENT '路线套餐ID',
  `day` INT NOT NULL COMMENT '第几天',
  `title` VARCHAR(100) NOT NULL COMMENT '当天标题',
  `description` TEXT COMMENT '行程描述',
  `attractions` JSON DEFAULT NULL COMMENT '游览景点JSON数组',
  `meals` JSON DEFAULT NULL COMMENT '用餐安排JSON',
  `accommodation` VARCHAR(255) DEFAULT NULL COMMENT '住宿安排',
  `transportation` VARCHAR(255) DEFAULT NULL COMMENT '交通方式',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_route_package` (`route_package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

-- 【表5】xing_e_ticket - 电子票表
CREATE TABLE `xing_e_ticket` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '电子票ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `ticket_type` VARCHAR(20) NOT NULL COMMENT '票种类型：scenic/route',
  `ticket_type_id` BIGINT DEFAULT NULL COMMENT '票种ID',
  `route_package_id` BIGINT DEFAULT NULL COMMENT '路线套餐ID',
  `ticket_no` VARCHAR(50) NOT NULL COMMENT '票号（唯一）',
  `qr_code` VARCHAR(255) NOT NULL COMMENT '二维码图片URL',
  `valid_date` DATE NOT NULL COMMENT '有效日期',
  `visitor_name` VARCHAR(50) NOT NULL COMMENT '游客姓名',
  `visitor_phone` VARCHAR(11) DEFAULT NULL COMMENT '游客电话',
  `visitor_id_card` VARCHAR(18) DEFAULT NULL COMMENT '游客身份证号',
  `status` VARCHAR(20) DEFAULT 'unused' COMMENT 'unused/used/refunded',
  `used_at` DATETIME DEFAULT NULL COMMENT '核销时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_ticket_no` (`ticket_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- 【表6】xing_traffic_guide - 交通攻略表
CREATE TABLE `xing_traffic_guide` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '攻略ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `departure_place` VARCHAR(100) NOT NULL COMMENT '出发地',
  `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
  `transportation_type` VARCHAR(50) NOT NULL COMMENT '交通方式：飞机/高铁/汽车/自驾',
  `duration` VARCHAR(50) DEFAULT NULL COMMENT '时长',
  `cost` VARCHAR(50) DEFAULT NULL COMMENT '费用',
  `description` TEXT COMMENT '详细说明',
  `images` JSON DEFAULT NULL COMMENT '图片JSON数组',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_departure_destination` (`departure_place`, `destination`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通攻略表';