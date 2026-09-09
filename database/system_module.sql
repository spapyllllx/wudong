-- ========================================
-- 系统管理模块 - 数据库表
-- 模块前缀: sys_
-- 说明：操作日志使用已有 base_sys_log，不重复创建
-- ========================================

-- 【表1】sys_banner - 轮播图表
CREATE TABLE `sys_banner` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '轮播图ID',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `image` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `link_type` VARCHAR(50) DEFAULT NULL COMMENT '跳转类型：url/product/post等',
  `link_value` VARCHAR(255) DEFAULT NULL COMMENT '跳转值',
  `position` VARCHAR(50) DEFAULT 'home' COMMENT '位置：home/category等',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_position_sort` (`position`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 【表2】sys_announcement - 公告表
CREATE TABLE `sys_announcement` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `type` VARCHAR(50) DEFAULT 'system' COMMENT '类型：system/activity',
  `status` VARCHAR(20) DEFAULT 'published' COMMENT '状态',
  `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 【表3】sys_sensitive_word - 敏感词表
CREATE TABLE `sys_sensitive_word` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '敏感词ID',
  `word` VARCHAR(100) NOT NULL COMMENT '敏感词',
  `level` TINYINT DEFAULT 1 COMMENT '级别 1:警告 2:禁止',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_word` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词表';

-- 【表4】sys_system_message - 系统消息表
CREATE TABLE `sys_system_message` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
  `user_id` BIGINT DEFAULT NULL COMMENT '用户ID，NULL表示全局消息（关联app_user.id）',
  `type` VARCHAR(50) NOT NULL COMMENT '类型：order/system/interaction',
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `link_type` VARCHAR(50) DEFAULT NULL COMMENT '跳转类型',
  `link_value` VARCHAR(255) DEFAULT NULL COMMENT '跳转值',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  KEY `idx_user_id` (`user_id`, `is_read`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';