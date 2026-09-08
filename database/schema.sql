-- 乌东文旅衣食住行综合服务平台 - 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS wudong_tourism DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_tourism;

-- ==================== 公共核心表 ====================

-- 用户表
CREATE TABLE sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  gender TINYINT DEFAULT 0,
  password VARCHAR(128) DEFAULT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_openid (openid)
) COMMENT '用户表';

-- 用户地址表
CREATE TABLE sys_user_address (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  province VARCHAR(50) DEFAULT NULL,
  city VARCHAR(50) DEFAULT NULL,
  district VARCHAR(50) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  receiver_name VARCHAR(50) DEFAULT NULL,
  receiver_phone VARCHAR(20) DEFAULT NULL,
  is_default TINYINT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) COMMENT '用户地址表';

-- 商家账号表
CREATE TABLE sys_merchant (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  module_type TINYINT NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50) DEFAULT NULL,
  contact_phone VARCHAR(20) DEFAULT NULL,
  business_license VARCHAR(255) DEFAULT NULL,
  id_card VARCHAR(255) DEFAULT NULL,
  status TINYINT DEFAULT 0,
  reject_reason VARCHAR(255) DEFAULT NULL,
  audit_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_module (module_type)
) COMMENT '商家账号表';

-- ==================== 订单相关表 ====================

-- 统一订单表
CREATE TABLE oms_order (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(32) NOT NULL,
  user_id BIGINT NOT NULL,
  order_type TINYINT NOT NULL,
  module_id BIGINT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  pay_amount DECIMAL(10,2) NOT NULL,
  status TINYINT DEFAULT 0,
  pay_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) COMMENT '统一订单表';

-- 订单明细表
CREATE TABLE oms_order_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  module_type TINYINT NOT NULL,
  module_item_id BIGINT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id)
) COMMENT '订单明细表';

-- 购物车表
CREATE TABLE oms_cart (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  module_type TINYINT NOT NULL,
  item_id BIGINT NOT NULL,
  sku_id BIGINT DEFAULT NULL,
  quantity INT DEFAULT 1,
  selected TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) COMMENT '购物车表';

-- ==================== 认证与权限表 ====================

-- 管理员表
CREATE TABLE sys_admin (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(128) NOT NULL,
  real_name VARCHAR(50) DEFAULT NULL,
  role_id BIGINT DEFAULT NULL,
  status TINYINT DEFAULT 1,
  last_login_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_username (username)
) COMMENT '管理员表';

-- 角色表
CREATE TABLE sys_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL,
  role_code VARCHAR(50) NOT NULL,
  permissions TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '角色表';

-- 操作日志表
CREATE TABLE sys_operation_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  admin_id BIGINT NOT NULL,
  operation_type VARCHAR(50) NOT NULL,
  operation_module VARCHAR(50) DEFAULT NULL,
  operation_content TEXT,
  ip_address VARCHAR(50) DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_id (admin_id),
  INDEX idx_create_time (create_time)
) COMMENT '操作日志表';

-- ==================== 模块一：衣——非遗商品表 ====================

-- 商品分类表
CREATE TABLE yi_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  parent_id BIGINT DEFAULT 0,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(255) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '商品分类表';

-- 商品表
CREATE TABLE yi_product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(200) DEFAULT NULL,
  main_image VARCHAR(255) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  stock INT DEFAULT 0,
  sales INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  craft_introduction TEXT,
  inheritor_id BIGINT DEFAULT NULL,
  description LONGTEXT,
  status TINYINT DEFAULT 1,
  freight_template_id BIGINT DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_merchant (merchant_id),
  INDEX idx_status (status)
) COMMENT '非遗商品表';

-- 商品SKU表
CREATE TABLE yi_product_sku (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  spec_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255) DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id)
) COMMENT '商品SKU表';

-- 商品图片表
CREATE TABLE yi_product_image (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id)
) COMMENT '商品图片表';

-- 商品评价表
CREATE TABLE yi_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  content TEXT DEFAULT NULL,
  images VARCHAR(500) DEFAULT NULL,
  reply_content TEXT,
  reply_time DATETIME DEFAULT NULL,
  is_anonymous TINYINT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product (product_id),
  INDEX idx_user (user_id)
) COMMENT '商品评价表';

-- 收藏表
CREATE TABLE yi_favorite (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_product (user_id, product_id)
) COMMENT '商品收藏表';

-- ==================== 模块二：食——餐饮美食表 ====================

-- 餐厅表
CREATE TABLE shi_restaurant (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  cover_image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  address VARCHAR(255) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  business_hours VARCHAR(100) DEFAULT NULL,
  max_people INT DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_merchant (merchant_id)
) COMMENT '餐厅表';

-- 餐厅菜品表
CREATE TABLE shi_dish (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  is_signature TINYINT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id)
) COMMENT '餐厅菜品表';

-- 餐位时段表
CREATE TABLE shi_seat_slot (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  slot_name VARCHAR(50) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_bookings INT DEFAULT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id)
) COMMENT '餐位时段表';

-- 餐位预订表
CREATE TABLE shi_seat_booking (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  slot_id BIGINT NOT NULL,
  booking_date DATE NOT NULL,
  people_count INT NOT NULL,
  customer_name VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  remark VARCHAR(255) DEFAULT NULL,
  status TINYINT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order (order_id),
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_date (booking_date)
) COMMENT '餐位预订表';

-- 农产品分类表
CREATE TABLE shi_product_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(255) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '农产品分类表';

-- 农产品表
CREATE TABLE shi_product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  main_image VARCHAR(255) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  origin VARCHAR(100) DEFAULT NULL,
  shelf_life VARCHAR(50) DEFAULT NULL,
  description TEXT,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_merchant (merchant_id)
) COMMENT '农产品表';

-- 餐厅/商品评价表
CREATE TABLE shi_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  restaurant_id BIGINT DEFAULT NULL,
  product_id BIGINT DEFAULT NULL,
  user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  content TEXT DEFAULT NULL,
  images VARCHAR(500) DEFAULT NULL,
  reply_content TEXT,
  reply_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_product (product_id)
) COMMENT '餐厅/商品评价表';

-- ==================== 模块三：住——住宿预订表 ====================

-- 民宿表
CREATE TABLE zhu_homestay (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  merchant_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  cover_image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  address VARCHAR(255) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  style_tags VARCHAR(255) DEFAULT NULL,
  facility_tags VARCHAR(255) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_merchant (merchant_id)
) COMMENT '民宿表';

-- 房型表
CREATE TABLE zhu_room_type (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  homestay_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  bed_type VARCHAR(50) DEFAULT NULL,
  area DECIMAL(8,2) DEFAULT NULL,
  max_people INT DEFAULT NULL,
  facilities VARCHAR(255) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255) DEFAULT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_homestay (homestay_id)
) COMMENT '房型表';

-- 房态日历表
CREATE TABLE zhu_room_calendar (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_type_id BIGINT NOT NULL,
  calendar_date DATE NOT NULL,
  available_stock INT DEFAULT 0,
  price DECIMAL(10,2) DEFAULT NULL,
  is_bookable TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_room_date (room_type_id, calendar_date),
  INDEX idx_date (calendar_date)
) COMMENT '房态日历表';

-- 入住须知表
CREATE TABLE zhu_check_in_rules (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  homestay_id BIGINT NOT NULL,
  check_in_time TIME DEFAULT NULL,
  check_out_time TIME DEFAULT NULL,
  pet_policy TINYINT DEFAULT 0,
  breakfast_included TINYINT DEFAULT 0,
  deposit DECIMAL(10,2) DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_homestay (homestay_id)
) COMMENT '入住须知表';

-- 民宿评价表
CREATE TABLE zhu_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  homestay_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  content TEXT DEFAULT NULL,
  images VARCHAR(500) DEFAULT NULL,
  reply_content TEXT,
  reply_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_homestay (homestay_id),
  INDEX idx_user (user_id)
) COMMENT '民宿评价表';

-- 民宿收藏表
CREATE TABLE zhu_favorite (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  homestay_id BIGINT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_homestay (user_id, homestay_id)
) COMMENT '民宿收藏表';

-- ==================== 模块四：行——线路订票表 ====================

-- 景区表
CREATE TABLE xing_scenic (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  cover_image VARCHAR(255) DEFAULT NULL,
  description TEXT,
  address VARCHAR(255) DEFAULT NULL,
  latitude DECIMAL(10,7) DEFAULT NULL,
  longitude DECIMAL(10,7) DEFAULT NULL,
  open_time TIME DEFAULT NULL,
  close_time TIME DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '景区表';

-- 票种表
CREATE TABLE xing_ticket_type (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  scenic_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  valid_days INT DEFAULT 1,
  age_limit VARCHAR(50) DEFAULT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scenic (scenic_id)
) COMMENT '票种表';

-- 路线套餐表
CREATE TABLE xing_route (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  days INT NOT NULL,
  cover_image VARCHAR(255) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) DEFAULT NULL,
  description TEXT,
  include_items VARCHAR(500) DEFAULT NULL,
  note VARCHAR(500) DEFAULT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  sales INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) COMMENT '路线套餐表';

-- 路线行程表
CREATE TABLE xing_route_itinerary (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id BIGINT NOT NULL,
  day_number INT NOT NULL,
  description TEXT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_route (route_id)
) COMMENT '路线行程表';

-- 电子票表
CREATE TABLE xing_e_ticket (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  ticket_type_id BIGINT DEFAULT NULL,
  route_id BIGINT DEFAULT NULL,
  ticket_code VARCHAR(32) NOT NULL,
  qr_code_url VARCHAR(255) DEFAULT NULL,
  valid_date DATE DEFAULT NULL,
  status TINYINT DEFAULT 0 COMMENT '0未使用 1已使用 2已退款',
  verify_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ticket_code (ticket_code),
  INDEX idx_order (order_id)
) COMMENT '电子票表';

-- 交通攻略表
CREATE TABLE xing_transport_guide (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  from_place VARCHAR(100) DEFAULT NULL,
  to_place VARCHAR(100) DEFAULT NULL,
  transport_method VARCHAR(50) DEFAULT NULL,
  duration VARCHAR(50) DEFAULT NULL,
  cost VARCHAR(50) DEFAULT NULL,
  description TEXT,
  image VARCHAR(255) DEFAULT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '交通攻略表';

-- 评价表
CREATE TABLE xing_review (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  scenic_id BIGINT DEFAULT NULL,
  route_id BIGINT DEFAULT NULL,
  user_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  content TEXT DEFAULT NULL,
  images VARCHAR(500) DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scenic (scenic_id),
  INDEX idx_route (route_id)
) COMMENT '评价表';

-- ==================== 模块五：社区——照片分享表 ====================

-- 游记表
CREATE TABLE shequ_travel_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  images VARCHAR(1000) DEFAULT NULL,
  video_url VARCHAR(255) DEFAULT NULL,
  related_place_type TINYINT DEFAULT NULL,
  related_place_id BIGINT DEFAULT NULL,
  topic_tags VARCHAR(255) DEFAULT NULL,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  favorite_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  status TINYINT DEFAULT 0 COMMENT '0审核中 1正常 2已下架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_create_time (create_time)
) COMMENT '游记表';

-- 评论表
CREATE TABLE shequ_comment (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  log_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  content VARCHAR(500) NOT NULL,
  reply_to_id BIGINT DEFAULT NULL,
  like_count INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_log (log_id),
  INDEX idx_user (user_id)
) COMMENT '评论表';

-- 话题表
CREATE TABLE shequ_topic (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  icon VARCHAR(255) DEFAULT NULL,
  follow_count INT DEFAULT 0,
  log_count INT DEFAULT 0,
  is_recommended TINYINT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_name (name)
) COMMENT '话题表';

-- 关注关系表
CREATE TABLE shequ_follow (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  follower_id BIGINT NOT NULL,
  followee_id BIGINT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_follower_followee (follower_id, followee_id),
  INDEX idx_follower (follower_id),
  INDEX idx_followee (followee_id)
) COMMENT '关注关系表';

-- 收藏表
CREATE TABLE shequ_favorite (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  log_id BIGINT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_log (user_id, log_id)
) COMMENT '游记收藏表';

-- 点赞表
CREATE TABLE shequ_like (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  target_type TINYINT NOT NULL,
  target_id BIGINT NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_target (user_id, target_type, target_id)
) COMMENT '点赞表';

-- 举报表
CREATE TABLE shequ_report (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reporter_id BIGINT NOT NULL,
  target_type TINYINT NOT NULL,
  target_id BIGINT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status TINYINT DEFAULT 0,
  handle_result VARCHAR(255) DEFAULT NULL,
  handler_id BIGINT DEFAULT NULL,
  handle_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id),
  INDEX idx_status (status)
) COMMENT '举报表';

-- ==================== 模块六：平台管理后台表 ====================

-- 商家入驻申请表
CREATE TABLE admin_merchant_apply (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  module_type TINYINT NOT NULL,
  shop_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(50) DEFAULT NULL,
  contact_phone VARCHAR(20) DEFAULT NULL,
  business_license VARCHAR(255) DEFAULT NULL,
  id_card VARCHAR(255) DEFAULT NULL,
  status TINYINT DEFAULT 0,
  reject_reason VARCHAR(255) DEFAULT NULL,
  auditor_id BIGINT DEFAULT NULL,
  audit_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_user (user_id)
) COMMENT '商家入驻申请表';

-- 平台公告表
CREATE TABLE admin_announcement (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  status TINYINT DEFAULT 1,
  publish_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) COMMENT '平台公告表';

-- 首页轮播图表
CREATE TABLE admin_banner (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) DEFAULT NULL,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) COMMENT '首页轮播图表';

-- 活动横幅表
CREATE TABLE admin_activity_banner (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) DEFAULT NULL,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255) DEFAULT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) COMMENT '活动横幅表';

-- 推荐位表
CREATE TABLE admin_recommend (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  position_name VARCHAR(50) NOT NULL,
  content_type TINYINT NOT NULL,
  content_id BIGINT NOT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_position (position_name)
) COMMENT '推荐位表';

-- 系统消息表
CREATE TABLE admin_system_message (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  message_type TINYINT NOT NULL,
  title VARCHAR(100) DEFAULT NULL,
  content TEXT,
  is_read TINYINT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_read (is_read)
) COMMENT '系统消息表';

-- 财务记录表
CREATE TABLE admin_financial_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  order_amount DECIMAL(10,2) NOT NULL,
  platform_commission DECIMAL(10,2) NOT NULL,
  merchant_income DECIMAL(10,2) NOT NULL,
  settle_status TINYINT DEFAULT 0,
  settle_time DATETIME DEFAULT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order (order_id),
  INDEX idx_merchant (merchant_id),
  INDEX idx_settle (settle_status)
) COMMENT '财务记录表';

-- 敏感词库表
CREATE TABLE admin_sensitive_word (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  word VARCHAR(100) NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_word (word)
) COMMENT '敏感词库表';

-- ==================== 初始数据 ====================

-- 插入默认管理员账号 (密码: admin123)
INSERT INTO sys_admin (username, password, real_name, status) VALUES
('admin', '.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 1);

-- 插入默认角色
INSERT INTO sys_role (role_name, role_code, permissions) VALUES
('超级管理员', 'super_admin', '["*"]');

-- 插入默认分类数据
INSERT INTO yi_category (parent_id, name, sort_order, status) VALUES
(0, '银饰', 1, 1),
(0, '蜡染', 2, 1),
(0, '刺绣', 3, 1),
(0, '苗族服饰', 4, 1),
(0, '其他', 5, 1);

INSERT INTO shi_product_category (name, sort_order, status) VALUES
('茶叶', 1, 1),
('腊肉', 2, 1),
('米酒', 3, 1),
('酸食', 4, 1),
('其他', 5, 1);

-- 插入示例数据
INSERT INTO yi_product (category_id, merchant_id, title, main_image, price, stock, description, status) VALUES
(1, 1, '苗族银饰手镯', 'https://via.placeholder.com/400x400', 299.00, 50, '纯手工打造的苗族银饰手镯，传承百年工艺', 1),
(2, 1, '苗族蜡染布艺', 'https://via.placeholder.com/400x400', 158.00, 30, '传统蜡染工艺制作的布艺装饰品', 1);

INSERT INTO xing_scenic (name, cover_image, description, address, status) VALUES
('乌东苗寨', 'https://via.placeholder.com/400x300', '贵州黔东南苗族特色村寨', '贵州省黔东南苗族侗族自治州', 1);

INSERT INTO xing_ticket_type (scenic_id, name, price, stock) VALUES
(1, '成人票', 50.00, 1000),
(1, '学生票', 25.00, 500);

INSERT INTO xing_route (title, days, cover_image, price, description, status) VALUES
('乌东苗寨一日游', 1, 'https://via.placeholder.com/400x300', 128.00, '包含景区门票、农家午餐、民俗体验', 1);

INSERT INTO shequ_topic (name, description, status) VALUES
('苗寨风光', '记录乌东苗寨的美丽风景', 1),
('非遗传承', '分享苗族传统文化', 1),
('美食探店', '品尝苗家特色美食', 1);
