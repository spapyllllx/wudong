-- ========================================
-- 社区模块 - 数据库表结构
-- 模块：shequ（社区模块）
-- 功能：UGC照片分享、帖子发布、评论互动、点赞功能
-- 版本：v1.0
-- 日期：2026-09-09
-- 说明：按照团队协作规范开发，所有表使用 shequ_ 前缀
-- ========================================

-- 使用数据库
USE cool;

-- ========================================
-- 1. 社区帖子表
-- ========================================
CREATE TABLE IF NOT EXISTS `shequ_post` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '帖子ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联 user_info.id）',
  `user_nick_name` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称（冗余字段，提升查询效率）',
  `user_avatar` VARCHAR(255) DEFAULT NULL COMMENT '用户头像（冗余字段）',
  `content` TEXT NOT NULL COMMENT '帖子内容',
  `images` JSON DEFAULT NULL COMMENT '图片列表（JSON数组）',
  `location` VARCHAR(200) DEFAULT NULL COMMENT '定位地址',
  `longitude` DECIMAL(10, 6) DEFAULT NULL COMMENT '经度',
  `latitude` DECIMAL(10, 6) DEFAULT NULL COMMENT '纬度',
  `scenic_id` BIGINT DEFAULT NULL COMMENT '关联景点ID（关联 xing_scenic.id）',
  `scenic_name` VARCHAR(100) DEFAULT NULL COMMENT '景点名称（冗余字段）',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `view_count` INT DEFAULT 0 COMMENT '浏览数',
  `share_count` INT DEFAULT 0 COMMENT '分享数',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0-待审核 1-已发布 2-已下架',
  `is_essence` TINYINT DEFAULT 0 COMMENT '是否精华：0-否 1-是',
  `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶：0-否 1-是',
  `sort` INT DEFAULT 0 COMMENT '排序（数字越大越靠前）',
  `audit_remark` VARCHAR(255) DEFAULT NULL COMMENT '审核备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_scenic_id` (`scenic_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_create_time` (`create_time`),
  INDEX `idx_sort_create` (`sort`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区帖子表';

-- ========================================
-- 2. 帖子评论表
-- ========================================
CREATE TABLE IF NOT EXISTS `shequ_comment` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
  `post_id` BIGINT NOT NULL COMMENT '帖子ID（关联 shequ_post.id）',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联 user_info.id）',
  `user_nick_name` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称（冗余字段）',
  `user_avatar` VARCHAR(255) DEFAULT NULL COMMENT '用户头像（冗余字段）',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID（回复评论用，NULL表示一级评论）',
  `reply_user_id` BIGINT DEFAULT NULL COMMENT '回复的用户ID',
  `reply_user_nick_name` VARCHAR(50) DEFAULT NULL COMMENT '回复的用户昵称（冗余字段）',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-待审核 1-已发布 2-已删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_post_id` (`post_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_parent_id` (`parent_id`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子评论表';

-- ========================================
-- 3. 点赞表
-- ========================================
CREATE TABLE IF NOT EXISTS `shequ_like` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联 user_info.id）',
  `target_id` BIGINT NOT NULL COMMENT '目标ID（帖子ID或评论ID）',
  `type` TINYINT NOT NULL COMMENT '类型：1-帖子 2-评论',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_user_target_type` (`user_id`, `target_id`, `type`),
  INDEX `idx_target_type` (`target_id`, `type`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- ========================================
-- 索引说明
-- ========================================
-- shequ_post:
--   - idx_user_id: 查询用户的帖子列表
--   - idx_scenic_id: 查询景点相关帖子
--   - idx_status: 按状态筛选（待审核/已发布）
--   - idx_create_time: 按时间排序
--   - idx_sort_create: 置顶排序 + 时间排序

-- shequ_comment:
--   - idx_post_id: 查询帖子的评论列表
--   - idx_user_id: 查询用户的评论列表
--   - idx_parent_id: 查询评论的回复列表
--   - idx_create_time: 按时间排序

-- shequ_like:
--   - uk_user_target_type: 防止重复点赞（唯一索引）
--   - idx_target_type: 查询某个帖子/评论的点赞数
--   - idx_user_id: 查询用户点赞的内容

-- ========================================
-- 表关联说明
-- ========================================
-- 1. shequ_post.user_id -> user_info.id（用户表，已存在）
-- 2. shequ_post.scenic_id -> xing_scenic.id（景点表，行模块待开发）
-- 3. shequ_comment.post_id -> shequ_post.id
-- 4. shequ_comment.user_id -> user_info.id
-- 5. shequ_like.user_id -> user_info.id
-- 6. shequ_like.target_id -> shequ_post.id 或 shequ_comment.id（根据type区分）

-- ========================================
-- 数据库变更完成
-- ========================================
SELECT '✅ 社区模块数据库表创建完成' AS message;
