-- 食模块数据库脚本
-- 模块前缀: shi_
-- 关联公共表: sys_user, sys_merchant, oms_order, oms_cart

USE wudong_tourism;

-- ==================== 餐厅表 ====================
CREATE TABLE IF NOT EXISTS shi_restaurant (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_id BIGINT NOT NULL COMMENT '商家ID',
  name VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  cover_image VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  description TEXT COMMENT '简介',
  address VARCHAR(255) DEFAULT NULL COMMENT '地址',
  latitude DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  longitude DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  business_hours VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  max_people INT DEFAULT NULL COMMENT '最大餐位',
  rating DECIMAL(2,1) DEFAULT 0.0 COMMENT '评分',
  status TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_merchant (merchant_id),
  INDEX idx_status (status)
) COMMENT '餐厅表';

-- ==================== 菜品表 ====================
CREATE TABLE IF NOT EXISTS shi_dish (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL COMMENT '餐厅ID',
  name VARCHAR(100) NOT NULL COMMENT '菜品名称',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  image VARCHAR(255) DEFAULT NULL COMMENT '图片',
  description TEXT COMMENT '描述',
  is_signature TINYINT DEFAULT 0 COMMENT '是否招牌菜: 0否 1是',
  status TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_status (status)
) COMMENT '菜品表';

-- ==================== 餐位时段表 ====================
CREATE TABLE IF NOT EXISTS shi_seat_slot (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL COMMENT '餐厅ID',
  slot_name VARCHAR(50) NOT NULL COMMENT '时段名称',
  start_time TIME NOT NULL COMMENT '开始时间',
  end_time TIME NOT NULL COMMENT '结束时间',
  max_bookings INT DEFAULT NULL COMMENT '最大预订数',
  status TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id)
) COMMENT '餐位时段表';

-- ==================== 农产品分类表 ====================
CREATE TABLE IF NOT EXISTS shi_product_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(255) DEFAULT NULL COMMENT '图标',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '农产品分类表';

-- ==================== 农产品表 ====================
CREATE TABLE IF NOT EXISTS shi_product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL COMMENT '分类ID',
  merchant_id BIGINT NOT NULL COMMENT '商家ID',
  name VARCHAR(100) NOT NULL COMMENT '名称',
  main_image VARCHAR(255) DEFAULT NULL COMMENT '主图',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  origin VARCHAR(100) DEFAULT NULL COMMENT '产地',
  shelf_life VARCHAR(50) DEFAULT NULL COMMENT '保质期',
  description TEXT COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_merchant (merchant_id),
  INDEX idx_status (status)
) COMMENT '农产品表';

-- ==================== 餐厅/农产品评价表 ====================
CREATE TABLE IF NOT EXISTS shi_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL COMMENT '订单ID',
  restaurant_id BIGINT DEFAULT NULL COMMENT '餐厅ID',
  product_id BIGINT DEFAULT NULL COMMENT '农产品ID',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  rating TINYINT NOT NULL COMMENT '评分1-5',
  content TEXT DEFAULT NULL COMMENT '评价内容',
  images VARCHAR(500) DEFAULT NULL COMMENT '图片(逗号分隔)',
  reply_content TEXT COMMENT '商家回复',
  reply_time DATETIME DEFAULT NULL COMMENT '回复时间',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_product (product_id),
  INDEX idx_user (user_id)
) COMMENT '餐厅/农产品评价表';

-- ==================== 初始数据 ====================
INSERT INTO shi_product_category (name, sort_order, status) VALUES
('茶叶', 1, 1),
('腊肉', 2, 1),
('米酒', 3, 1),
('酸食', 4, 1),
('其他', 5, 1);
