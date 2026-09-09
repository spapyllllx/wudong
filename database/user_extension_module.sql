-- ========================================
-- 用户扩展模块 - 数据库表
-- 说明：app_user 为小程序用户表（替代SQL中的users），merchant_application 为商家入驻申请
-- ========================================

-- 【表1】app_user - 小程序用户表（替代原SQL中的users表）
CREATE TABLE `app_user` (
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
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_role_status` (`role`, `status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='小程序用户表';

-- 【表2】merchant_application - 商家入驻申请表
CREATE TABLE `merchant_application` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '申请ID',
  `user_id` BIGINT NOT NULL COMMENT '申请用户ID（关联app_user.id）',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module_type` VARCHAR(20) NOT NULL COMMENT '模块类型: yi/shi/zhu/xing',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照图片',
  `id_card_front` VARCHAR(255) DEFAULT NULL COMMENT '身份证正面',
  `id_card_back` VARCHAR(255) DEFAULT NULL COMMENT '身份证背面',
  `description` TEXT COMMENT '申请说明',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/approved/rejected',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `reviewed_by` BIGINT DEFAULT NULL COMMENT '审核人ID（关联base_sys_user.id）',
  `reviewed_at` DATETIME DEFAULT NULL COMMENT '审核时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';