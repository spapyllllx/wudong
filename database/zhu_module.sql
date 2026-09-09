-- ========================================
-- 住模块（民宿预订）- 数据库表
-- 模块前缀: zhu_
-- ========================================

-- 【表1】zhu_homestay - 民宿表
CREATE TABLE `zhu_homestay` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '民宿ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID（关联app_user.id）',
  `name` VARCHAR(100) NOT NULL COMMENT '民宿名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '民宿图片JSON数组',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `style_tags` JSON DEFAULT NULL COMMENT '风格标签JSON，如["苗族特色","吊脚楼"]',
  `facility_tags` JSON DEFAULT NULL COMMENT '设施标签JSON，如["WiFi","空调","独立卫浴"]',
  `description` TEXT COMMENT '民宿介绍',
  `check_in_time` VARCHAR(50) DEFAULT '14:00' COMMENT '入住时间',
  `check_out_time` VARCHAR(50) DEFAULT '12:00' COMMENT '离店时间',
  `policies` TEXT COMMENT '入住须知',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 【表2】zhu_homestay_room_type - 房型表
CREATE TABLE `zhu_homestay_room_type` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '房型ID',
  `homestay_id` BIGINT NOT NULL COMMENT '民宿ID',
  `name` VARCHAR(100) NOT NULL COMMENT '房型名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '图片JSON数组',
  `bed_type` VARCHAR(50) DEFAULT '' COMMENT '床型',
  `area` DECIMAL(10,2) DEFAULT NULL COMMENT '面积(平米)',
  `capacity` INT NOT NULL COMMENT '可住人数',
  `facilities` JSON DEFAULT NULL COMMENT '设施JSON数组',
  `price` DECIMAL(10,2) NOT NULL COMMENT '基础价格',
  `total_rooms` INT NOT NULL COMMENT '房间总数',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_homestay_id` (`homestay_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- 【表3】zhu_homestay_room_calendar - 房态日历表
CREATE TABLE `zhu_homestay_room_calendar` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '日历ID',
  `room_type_id` BIGINT NOT NULL COMMENT '房型ID',
  `date` DATE NOT NULL COMMENT '日期',
  `price` DECIMAL(10,2) NOT NULL COMMENT '当日价格（可动态调整）',
  `available_count` INT NOT NULL COMMENT '可用房间数',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_room_date` (`room_type_id`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- 【表4】zhu_homestay_booking - 住宿订单表
CREATE TABLE `zhu_homestay_booking` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '预订ID',
  `order_id` BIGINT NOT NULL COMMENT '关联订单ID',
  `homestay_id` BIGINT NOT NULL COMMENT '民宿ID',
  `room_type_id` BIGINT NOT NULL COMMENT '房型ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `check_in_date` DATE NOT NULL COMMENT '入住日期',
  `check_out_date` DATE NOT NULL COMMENT '离店日期',
  `days` INT NOT NULL COMMENT '入住天数',
  `room_count` INT NOT NULL COMMENT '房间数',
  `guest_name` VARCHAR(50) NOT NULL COMMENT '入住人姓名',
  `guest_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `guest_id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `check_in_code` VARCHAR(50) DEFAULT NULL COMMENT '入住码',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/confirmed/cancelled/completed',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_homestay_date` (`homestay_id`, `check_in_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='住宿订单表';