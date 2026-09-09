-- ========================================
-- 乌东文旅平台 - 完整数据库初始化脚本
-- 严格按照设计文档 2026-09-08-wudong-tourist-platform-design.md
-- 数据库: cool (MySQL 8.0+)
-- 字符集: utf8mb4
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `cool` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cool`;

-- ========================================
-- 3.2.1 用户模块
-- ========================================

-- 用户表
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '密码哈希',
  `nickname` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT '' COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别 0:未知 1:男 2:女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `region` VARCHAR(100) DEFAULT '' COMMENT '所在地区',
  `bio` VARCHAR(255) DEFAULT '' COMMENT '个人简介',
  `openid` VARCHAR(100) DEFAULT NULL COMMENT '微信openid',
  `unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色: user/merchant/admin',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/banned',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_role_status` (`role`, `status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 收货地址表
CREATE TABLE `user_addresses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省',
  `city` VARCHAR(50) NOT NULL COMMENT '市',
  `district` VARCHAR(50) NOT NULL COMMENT '区',
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认地址',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收货地址表';

-- 商家入驻申请表
CREATE TABLE `merchant_applications` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '申请用户ID',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module_type` VARCHAR(20) NOT NULL COMMENT '模块类型: clothing/food/accommodation/travel',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照图片',
  `id_card_front` VARCHAR(255) DEFAULT NULL COMMENT '身份证正面',
  `id_card_back` VARCHAR(255) DEFAULT NULL COMMENT '身份证背面',
  `description` TEXT COMMENT '申请说明',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/approved/rejected',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `reviewed_by` BIGINT DEFAULT NULL COMMENT '审核人ID',
  `reviewed_at` DATETIME DEFAULT NULL COMMENT '审核时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';

-- ========================================
-- 3.2.2 商品模块（衣）
-- ========================================

-- 商品分类表
CREATE TABLE `product_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID，0为顶级',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '' COMMENT '分类图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 商品表
CREATE TABLE `products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `title` VARCHAR(255) NOT NULL COMMENT '商品标题',
  `subtitle` VARCHAR(255) DEFAULT '' COMMENT '副标题',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
  `market_price` DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` INT DEFAULT 0 COMMENT '总库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `detail` TEXT COMMENT '商品详情（富文本）',
  `craft_intro` TEXT COMMENT '工艺介绍',
  `inheritor_id` BIGINT DEFAULT NULL COMMENT '传承人ID（可选）',
  `status` VARCHAR(20) DEFAULT 'on_sale' COMMENT '状态: on_sale/off_sale',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`),
  KEY `idx_sales` (`sales`),
  FULLTEXT KEY `ft_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 商品SKU表
CREATE TABLE `product_skus` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_name` VARCHAR(100) NOT NULL COMMENT 'SKU名称，如"银饰-手镯-中号"',
  `image` VARCHAR(255) DEFAULT NULL COMMENT 'SKU图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `attrs` JSON DEFAULT NULL COMMENT 'SKU属性JSON，如{"尺寸":"中号","颜色":"银色"}',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- 商品图片表
CREATE TABLE `product_images` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 商品收藏表
CREATE TABLE `product_favorites` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品收藏表';

-- 商品评价表
CREATE TABLE `product_reviews` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `rating` TINYINT NOT NULL COMMENT '评分 1-5',
  `content` VARCHAR(500) DEFAULT '' COMMENT '评价内容',
  `images` JSON DEFAULT NULL COMMENT '评价图片JSON数组',
  `reply_content` VARCHAR(500) DEFAULT NULL COMMENT '商家回复',
  `replied_at` DATETIME DEFAULT NULL COMMENT '回复时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- ========================================
-- 3.2.3 餐饮模块（食）
-- ========================================

-- 餐厅表
CREATE TABLE `restaurants` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
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
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_location` (`latitude`, `longitude`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 菜品表
CREATE TABLE `restaurant_dishes` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `restaurant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '菜品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `description` VARCHAR(255) DEFAULT '' COMMENT '菜品介绍',
  `is_signature` TINYINT DEFAULT 0 COMMENT '是否招牌菜',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 餐位时段配置表
CREATE TABLE `restaurant_timeslots` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `restaurant_id` BIGINT NOT NULL,
  `name` VARCHAR(50) NOT NULL COMMENT '时段名称，如"午餐 11:30-13:30"',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `max_bookings` INT NOT NULL COMMENT '最大预订数',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段配置表';

-- 餐位预订表
CREATE TABLE `restaurant_bookings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL COMMENT '关联订单ID',
  `restaurant_id` BIGINT NOT NULL,
  `timeslot_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `booking_date` DATE NOT NULL COMMENT '预订日期',
  `people_count` INT NOT NULL COMMENT '人数',
  `consignee` VARCHAR(50) NOT NULL COMMENT '预订人姓名',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/confirmed/cancelled/completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_date` (`restaurant_id`, `booking_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位预订表';

-- 农产品分类表
CREATE TABLE `agri_product_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品分类表';

-- 农产品表
CREATE TABLE `agri_products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL,
  `merchant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `market_price` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT DEFAULT 0,
  `sales` INT DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT '件' COMMENT '单位',
  `origin` VARCHAR(100) DEFAULT '' COMMENT '产地',
  `shelf_life` VARCHAR(50) DEFAULT '' COMMENT '保质期',
  `detail` TEXT COMMENT '商品详情',
  `status` VARCHAR(20) DEFAULT 'on_sale',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';

-- ========================================
-- 3.2.4 住宿模块（住）
-- ========================================

-- 民宿表
CREATE TABLE `homestays` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '民宿名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `address` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `style_tags` JSON DEFAULT NULL COMMENT '风格标签JSON，如["苗族特色","吊脚楼"]',
  `facility_tags` JSON DEFAULT NULL COMMENT '设施标签JSON，如["WiFi","空调","独立卫浴"]',
  `description` TEXT COMMENT '民宿介绍',
  `check_in_time` VARCHAR(50) DEFAULT '14:00' COMMENT '入住时间',
  `check_out_time` VARCHAR(50) DEFAULT '12:00' COMMENT '离店时间',
  `policies` TEXT COMMENT '入住须知',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 房型表
CREATE TABLE `homestay_room_types` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `homestay_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '房型名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `bed_type` VARCHAR(50) DEFAULT '' COMMENT '床型',
  `area` DECIMAL(10,2) DEFAULT NULL COMMENT '面积(平米)',
  `capacity` INT NOT NULL COMMENT '可住人数',
  `facilities` JSON DEFAULT NULL COMMENT '设施JSON数组',
  `price` DECIMAL(10,2) NOT NULL COMMENT '基础价格',
  `total_rooms` INT NOT NULL COMMENT '房间总数',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_homestay_id` (`homestay_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- 房态日历表
CREATE TABLE `homestay_room_calendar` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `room_type_id` BIGINT NOT NULL,
  `date` DATE NOT NULL COMMENT '日期',
  `price` DECIMAL(10,2) NOT NULL COMMENT '当日价格（可动态调整）',
  `available_count` INT NOT NULL COMMENT '可用房间数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_room_date` (`room_type_id`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- 住宿订单表
CREATE TABLE `homestay_bookings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `homestay_id` BIGINT NOT NULL,
  `room_type_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `check_in_date` DATE NOT NULL,
  `check_out_date` DATE NOT NULL,
  `days` INT NOT NULL COMMENT '入住天数',
  `room_count` INT NOT NULL COMMENT '房间数',
  `guest_name` VARCHAR(50) NOT NULL COMMENT '入住人姓名',
  `guest_phone` VARCHAR(11) NOT NULL,
  `guest_id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
  `remark` VARCHAR(255) DEFAULT '',
  `check_in_code` VARCHAR(50) DEFAULT NULL COMMENT '入住码',
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_homestay_date` (`homestay_id`, `check_in_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='住宿订单表';

-- ========================================
-- 3.2.5 票务模块（行）
-- ========================================

-- 景区表
CREATE TABLE `scenic_spots` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `address` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `opening_hours` VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  `description` TEXT COMMENT '景区介绍',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- 票种表
CREATE TABLE `ticket_types` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `scenic_spot_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '票种名称，如"成人票","儿童票"',
  `price` DECIMAL(10,2) NOT NULL,
  `validity_days` INT DEFAULT 1 COMMENT '有效天数',
  `description` VARCHAR(255) DEFAULT '',
  `stock` INT DEFAULT 9999 COMMENT '库存',
  `sales` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_scenic_spot` (`scenic_spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

-- 路线套餐表
CREATE TABLE `route_packages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `title` VARCHAR(100) NOT NULL COMMENT '路线标题',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `days` INT NOT NULL COMMENT '天数',
  `price` DECIMAL(10,2) NOT NULL,
  `includes` TEXT COMMENT '包含项目',
  `excludes` TEXT COMMENT '不包含项目',
  `departure_place` VARCHAR(100) DEFAULT '' COMMENT '出发地',
  `destination` VARCHAR(100) DEFAULT '' COMMENT '目的地',
  `accommodation_standard` VARCHAR(255) DEFAULT '' COMMENT '住宿标准',
  `meal_standard` VARCHAR(255) DEFAULT '' COMMENT '餐饮标准',
  `notices` TEXT COMMENT '注意事项',
  `theme_tags` JSON DEFAULT NULL COMMENT '主题标签，如["亲子","摄影","研学"]',
  `description` TEXT COMMENT '路线介绍',
  `stock` INT DEFAULT 999,
  `sales` INT DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_days` (`days`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- 路线行程表
CREATE TABLE `route_itineraries` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `route_package_id` BIGINT NOT NULL,
  `day` INT NOT NULL COMMENT '第几天',
  `title` VARCHAR(100) NOT NULL COMMENT '当天标题',
  `description` TEXT COMMENT '行程描述',
  `attractions` JSON DEFAULT NULL COMMENT '游览景点JSON数组',
  `meals` JSON DEFAULT NULL COMMENT '用餐安排JSON，如{"早餐":"含","午餐":"含","晚餐":"自理"}',
  `accommodation` VARCHAR(255) DEFAULT NULL COMMENT '住宿安排',
  `transportation` VARCHAR(255) DEFAULT NULL COMMENT '交通方式',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_route_package` (`route_package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

-- 电子票表
CREATE TABLE `e_tickets` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `ticket_type` VARCHAR(20) NOT NULL COMMENT 'scenic/route',
  `ticket_type_id` BIGINT DEFAULT NULL COMMENT '票种ID',
  `route_package_id` BIGINT DEFAULT NULL COMMENT '路线套餐ID',
  `ticket_no` VARCHAR(50) NOT NULL COMMENT '票号（唯一）',
  `qr_code` VARCHAR(255) NOT NULL COMMENT '二维码图片URL',
  `valid_date` DATE NOT NULL COMMENT '有效日期',
  `visitor_name` VARCHAR(50) NOT NULL COMMENT '游客姓名',
  `visitor_phone` VARCHAR(11) DEFAULT NULL,
  `visitor_id_card` VARCHAR(18) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'unused' COMMENT 'unused/used/refunded',
  `used_at` DATETIME DEFAULT NULL COMMENT '核销时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_ticket_no` (`ticket_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- 交通攻略表
CREATE TABLE `traffic_guides` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `departure_place` VARCHAR(100) NOT NULL COMMENT '出发地',
  `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
  `transportation_type` VARCHAR(50) NOT NULL COMMENT '交通方式：飞机/高铁/汽车/自驾',
  `duration` VARCHAR(50) DEFAULT NULL COMMENT '时长',
  `cost` VARCHAR(50) DEFAULT NULL COMMENT '费用',
  `description` TEXT COMMENT '详细说明',
  `images` JSON DEFAULT NULL,
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_departure_destination` (`departure_place`, `destination`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通攻略表';

-- ========================================
-- 3.2.6 社区模块
-- ========================================

-- 游记表
CREATE TABLE `posts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '文字内容',
  `video_url` VARCHAR(255) DEFAULT NULL COMMENT '视频URL',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联类型：restaurant/homestay/scenic_spot',
  `related_id` BIGINT DEFAULT NULL COMMENT '关联ID',
  `topic_ids` JSON DEFAULT NULL COMMENT '话题ID数组',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏数',
  `view_count` INT DEFAULT 0 COMMENT '浏览数',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/published/rejected',
  `reject_reason` VARCHAR(255) DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_like_count` (`like_count`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

-- 游记图片表
CREATE TABLE `post_images` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `sort` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记图片表';

-- 评论表
CREATE TABLE `post_comments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `parent_id` BIGINT DEFAULT 0 COMMENT '父评论ID，0为一级评论',
  `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复的用户ID',
  `content` VARCHAR(500) NOT NULL,
  `like_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 点赞表
CREATE TABLE `likes` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `target_type` VARCHAR(50) NOT NULL COMMENT 'post/comment',
  `target_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 收藏表
CREATE TABLE `post_favorites` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `post_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记收藏表';

-- 话题表
CREATE TABLE `topics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '话题名',
  `description` VARCHAR(255) DEFAULT '' COMMENT '话题简介',
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `follow_count` INT DEFAULT 0 COMMENT '关注数',
  `post_count` INT DEFAULT 0 COMMENT '游记数',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热门',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_hot_sort` (`is_hot`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

-- 话题关注表
CREATE TABLE `topic_follows` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `topic_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_topic` (`user_id`, `topic_id`),
  KEY `idx_topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题关注表';

-- 用户关注表
CREATE TABLE `user_follows` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `follower_id` BIGINT NOT NULL COMMENT '关注者ID',
  `followee_id` BIGINT NOT NULL COMMENT '被关注者ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_follower_followee` (`follower_id`, `followee_id`),
  KEY `idx_followee_id` (`followee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- 举报表
CREATE TABLE `reports` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `reporter_id` BIGINT NOT NULL COMMENT '举报人ID',
  `target_type` VARCHAR(50) NOT NULL COMMENT 'post/comment',
  `target_id` BIGINT NOT NULL,
  `reason` VARCHAR(500) NOT NULL COMMENT '举报原因',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/processed/rejected',
  `handler_id` BIGINT DEFAULT NULL COMMENT '处理人ID',
  `handle_result` VARCHAR(255) DEFAULT NULL COMMENT '处理结果',
  `handled_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_reporter_id` (`reporter_id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- ========================================
-- 3.2.7 订单模块
-- ========================================

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

-- ========================================
-- 3.2.8 购物车模块
-- ========================================

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

-- ========================================
-- 3.2.9 系统管理模块
-- ========================================

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

-- 公告表
CREATE TABLE `announcements` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'system' COMMENT '类型：system/activity',
  `status` VARCHAR(20) DEFAULT 'published',
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 敏感词表
CREATE TABLE `sensitive_words` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `word` VARCHAR(100) NOT NULL,
  `level` TINYINT DEFAULT 1 COMMENT '级别 1:警告 2:禁止',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_word` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词表';

-- 系统消息表
CREATE TABLE `system_messages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL COMMENT '用户ID，NULL表示全局消息',
  `type` VARCHAR(50) NOT NULL COMMENT '类型：order/system/interaction',
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `link_type` VARCHAR(50) DEFAULT NULL,
  `link_value` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`, `is_read`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';

-- 操作日志表
CREATE TABLE `operation_logs` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `action` VARCHAR(100) NOT NULL COMMENT '操作类型',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `content` VARCHAR(500) DEFAULT NULL COMMENT '操作内容',
  `ip` VARCHAR(50) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- ========================================
-- 3.3 初始化数据
-- ========================================

-- 插入默认管理员账号
INSERT INTO `users` (`id`, `phone`, `password`, `nickname`, `role`, `status`)
VALUES (1, '13800138000', '$2b$10$...', '超级管理员', 'admin', 'active');

-- 插入商品分类
INSERT INTO `product_categories` (`id`, `parent_id`, `name`, `sort`) VALUES
(1, 0, '银饰', 1),
(2, 0, '蜡染', 2),
(3, 0, '刺绣', 3),
(4, 0, '苗族服饰', 4),
(5, 0, '其他', 5);

-- 插入农产品分类
INSERT INTO `agri_product_categories` (`id`, `name`, `sort`) VALUES
(1, '茶叶', 1),
(2, '腊肉', 2),
(3, '米酒', 3),
(4, '酸食', 4),
(5, '其他特产', 5);

-- 插入话题
INSERT INTO `topics` (`name`, `description`, `is_hot`, `sort`) VALUES
('苗寨美景', '分享苗寨的美丽风光', 1, 1),
('美食探店', '推荐乌东特色美食', 1, 2),
('民宿体验', '分享民宿入住体验', 1, 3),
('旅行攻略', '实用的旅行攻略分享', 1, 4);

-- ========================================
-- 完成
-- ========================================
-- 数据库初始化完成！
-- 接下来在DataGrip中连接数据库并执行此脚本
