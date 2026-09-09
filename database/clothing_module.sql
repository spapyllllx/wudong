-- ============================================================
-- 衣模块(非遗商品电商)建表脚本 —— 第1组 交付
-- 分支: feature/clothing-module | 负责人合并用
--
-- 与 database/init_database.sql 3.2.2(约第84-174行)同源一致,
-- 本文件仅为"按模块拆分交付"而生成,改动任意一侧时须同步另一侧,避免漂移。
--
-- 本地开发说明:表由 cool-admin-midway(synchronize=true)在本地库
--   (config.local.ts 中 database 字段指定,当前为 cool-admin-midway)
--   自动创建,无需在本机执行本文件。
-- 分类种子数据:见 init_database.sql 3.3(product_categories 5 条),
--   本地开发由 cool-admin-midway 模块 db.json(clothing/db.json)自动导入,
--   本文件不重复 INSERT,避免重复执行时主键冲突。
-- 执行注意:若库中已执行过 init_database.sql,无需再执行本文件
--   (CREATE TABLE 会因表已存在而失败)。
-- ============================================================

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
