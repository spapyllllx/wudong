-- 乌东文旅 · 行票务模块数据库脚本
-- 对应模块前缀：xing_
-- 可与 database/schema.sql 合并执行

USE wudong_tourism;

-- ==================== 景区表 ====================
CREATE TABLE IF NOT EXISTS xing_scenic (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL                COMMENT '景区名称',
  cover_image VARCHAR(255)    DEFAULT NULL            COMMENT '封面图URL',
  description TEXT            DEFAULT NULL            COMMENT '景区描述',
  address     VARCHAR(255)    DEFAULT NULL            COMMENT '地址',
  latitude    DECIMAL(10,7)   DEFAULT NULL            COMMENT '纬度',
  longitude   DECIMAL(10,7)   DEFAULT NULL            COMMENT '经度',
  open_time   TIME            DEFAULT NULL            COMMENT '开放时间',
  close_time  TIME            DEFAULT NULL            COMMENT '关闭时间',
  rating      DECIMAL(2,1)    DEFAULT 0.0             COMMENT '评分（满分5.0）',
  sales       INT             DEFAULT 0               COMMENT '销量',
  status      TINYINT         DEFAULT 1               COMMENT '状态：0禁用 1启用',
  create_time DATETIME        DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- ==================== 门票类型表 ====================
CREATE TABLE IF NOT EXISTS xing_ticket_type (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  scenic_id   BIGINT          NOT NULL                COMMENT '所属景区ID',
  name        VARCHAR(100)    NOT NULL                COMMENT '票种名称，如：成人票、学生票',
  price       DECIMAL(10,2)   NOT NULL                COMMENT '售价（元）',
  original_price DECIMAL(10,2) DEFAULT NULL           COMMENT '原价（元），用于展示折扣',
  stock       INT             DEFAULT 0               COMMENT '库存，-1表示不限',
  valid_days  INT             DEFAULT 1               COMMENT '有效天数，1=当日有效',
  age_limit   VARCHAR(50)     DEFAULT NULL            COMMENT '年龄限制说明',
  description TEXT            DEFAULT NULL            COMMENT '票种描述',
  cover_image VARCHAR(255)    DEFAULT NULL            COMMENT '票种展示图',
  status      TINYINT         DEFAULT 1               COMMENT '状态：0禁用 1启用',
  create_time DATETIME        DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scenic (scenic_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门票类型表';

-- ==================== 路线套餐表 ====================
CREATE TABLE IF NOT EXISTS xing_route (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  title          VARCHAR(100)    NOT NULL               COMMENT '路线标题',
  days           INT             NOT NULL               COMMENT '天数',
  cover_image    VARCHAR(255)    DEFAULT NULL           COMMENT '封面图URL',
  price          DECIMAL(10,2)   NOT NULL               COMMENT '售价（元）',
  original_price DECIMAL(10,2)   DEFAULT NULL           COMMENT '原价（元）',
  description    TEXT            DEFAULT NULL           COMMENT '路线描述',
  include_items  VARCHAR(500)    DEFAULT NULL           COMMENT '包含内容，逗号分隔',
  note           VARCHAR(500)    DEFAULT NULL           COMMENT '注意事项',
  rating         DECIMAL(2,1)    DEFAULT 0.0            COMMENT '评分',
  sales          INT             DEFAULT 0              COMMENT '销量',
  status         TINYINT         DEFAULT 1              COMMENT '状态：0禁用 1启用',
  create_time    DATETIME        DEFAULT CURRENT_TIMESTAMP,
  update_time    DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- ==================== 路线行程详情表 ====================
CREATE TABLE IF NOT EXISTS xing_route_detail (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  route_id    BIGINT          NOT NULL                COMMENT '所属路线ID',
  day_order   INT             NOT NULL                COMMENT '第几天（从1起）',
  title       VARCHAR(100)    NOT NULL                COMMENT '行程标题，如：上午-苗寨参观',
  description TEXT            DEFAULT NULL            COMMENT '行程描述',
  images      VARCHAR(1000)   DEFAULT NULL            COMMENT '图片URL列表，逗号分隔',
  sort_order  INT             DEFAULT 0               COMMENT '排序权重',
  create_time DATETIME        DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程详情表';

-- ==================== 示例初始数据 ====================
INSERT INTO xing_scenic (name, cover_image, description, address, open_time, close_time, rating, status) VALUES
('乌东苗寨', 'https://via.placeholder.com/800x400', '贵州黔东南苗族特色古寨，保留完整的苗族建筑与民俗', '贵州省黔东南苗族侗族自治州从江县乌东村', '08:00:00', '18:00:00', 4.8, 1),
('梯田景区', 'https://via.placeholder.com/800x400', '千年哈尼梯田，世界文化遗产', '云南省红河哈尼族彝族自治州元阳县', '06:00:00', '20:00:00', 4.6, 1);

INSERT INTO xing_ticket_type (scenic_id, name, price, original_price, stock, valid_days, age_limit, status) VALUES
(1, '成人票', 50.00, 60.00, 1000, 1, NULL, 1),
(1, '学生票', 25.00, 30.00, 500, 1, '凭学生证', 1),
(1, '儿童票', 0.00, 0.00, 200, 1, '1.2米以下免费', 1),
(2, '成人票', 80.00, 100.00, 800, 1, NULL, 1),
(2, '优惠票', 40.00, 50.00, 400, 1, '60岁以上老人及残疾人', 1);

INSERT INTO xing_route (title, days, cover_image, price, original_price, description, include_items, note, rating, status) VALUES
('乌东苗寨一日游', 1, 'https://via.placeholder.com/800x400', 128.00, 168.00, '深度体验苗族文化的一日游线路', '门票+农家午餐+民俗体验', '请提前一天预约', 4.7, 1),
('梯田摄影两日游', 2, 'https://via.placeholder.com/800x400', 368.00, 458.00, '摄影爱好者的梯田经典线路', '门票+住宿+早餐+导拍服务', '最佳摄影季节：3-5月灌水期、9-10月丰收期', 4.9, 1);

INSERT INTO xing_route_detail (route_id, day_order, title, description, sort_order) VALUES
(1, 1, '上午-苗寨参观', '参观吊脚楼、鼓楼、风雨桥，了解苗族建筑风格', 1),
(1, 1, '中午-苗家午餐', '品尝长桌宴、酸汤鱼等苗家特色菜', 2),
(1, 1, '下午-民俗体验', '体验银饰制作、蜡染手工、芦笙舞蹈', 3);

INSERT INTO xing_route_detail (route_id, day_order, title, description, sort_order) VALUES
(2, 1, '第一天-梯田日落', '抵达元阳，观赏多依树梯田日落', 1),
(2, 1, '第二天-云海日出', '攀龙梯田观云海日出，专业摄影师跟拍', 2);
