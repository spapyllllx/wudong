-- ========================================
-- 衣模块（非遗商品电商）- 数据库表
-- 模块前缀: yi_
-- ========================================

-- 【表1】yi_product_category - 商品分类表
CREATE TABLE `yi_product_category` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
  `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID，0为顶级',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '' COMMENT '分类图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 【表2】yi_product - 商品表
CREATE TABLE `yi_product` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID（关联app_user.id）',
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
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`),
  KEY `idx_sales` (`sales`),
  FULLTEXT KEY `ft_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 【表3】yi_product_sku - 商品SKU表
CREATE TABLE `yi_product_sku` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'SKU ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_name` VARCHAR(100) NOT NULL COMMENT 'SKU名称，如"银饰-手镯-中号"',
  `image` VARCHAR(255) DEFAULT NULL COMMENT 'SKU图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `attrs` JSON DEFAULT NULL COMMENT 'SKU属性JSON，如{"尺寸":"中号","颜色":"银色"}',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- 【表4】yi_product_image - 商品图片表
CREATE TABLE `yi_product_image` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 【表5】yi_product_favorite - 商品收藏表
CREATE TABLE `yi_product_favorite` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品收藏表';

-- 【表6】yi_product_review - 商品评价表
CREATE TABLE `yi_product_review` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `rating` TINYINT NOT NULL COMMENT '评分 1-5',
  `content` VARCHAR(500) DEFAULT '' COMMENT '评价内容',
  `images` JSON DEFAULT NULL COMMENT '评价图片JSON数组',
  `reply_content` VARCHAR(500) DEFAULT NULL COMMENT '商家回复',
  `replied_at` DATETIME DEFAULT NULL COMMENT '回复时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- 初始化数据
INSERT INTO `yi_product_category` (`id`, `parent_id`, `name`, `sort`) VALUES
(1, 0, '银饰', 1),
(2, 0, '蜡染', 2),
(3, 0, '刺绣', 3),
(4, 0, '苗族服饰', 4),
(5, 0, '其他', 5);