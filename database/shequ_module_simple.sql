-- Community Module Database Tables
-- Module: shequ (Community)
-- Version: v1.0
-- Date: 2026-09-09

USE cool;

-- Post Table
CREATE TABLE IF NOT EXISTS `shequ_post` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `user_nick_name` VARCHAR(50) DEFAULT NULL,
  `user_avatar` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `images` JSON DEFAULT NULL,
  `location` VARCHAR(200) DEFAULT NULL,
  `longitude` DECIMAL(10, 6) DEFAULT NULL,
  `latitude` DECIMAL(10, 6) DEFAULT NULL,
  `scenic_id` BIGINT DEFAULT NULL,
  `scenic_name` VARCHAR(100) DEFAULT NULL,
  `like_count` INT DEFAULT 0,
  `comment_count` INT DEFAULT 0,
  `view_count` INT DEFAULT 0,
  `share_count` INT DEFAULT 0,
  `status` TINYINT DEFAULT 0,
  `is_essence` TINYINT DEFAULT 0,
  `is_top` TINYINT DEFAULT 0,
  `sort` INT DEFAULT 0,
  `audit_remark` VARCHAR(255) DEFAULT NULL,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_scenic_id` (`scenic_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_create_time` (`create_time`),
  INDEX `idx_sort_create` (`sort`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment Table
CREATE TABLE IF NOT EXISTS `shequ_comment` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `user_nick_name` VARCHAR(50) DEFAULT NULL,
  `user_avatar` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `parent_id` BIGINT DEFAULT NULL,
  `reply_user_id` BIGINT DEFAULT NULL,
  `reply_user_nick_name` VARCHAR(50) DEFAULT NULL,
  `like_count` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_post_id` (`post_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_parent_id` (`parent_id`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Like Table
CREATE TABLE IF NOT EXISTS `shequ_like` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `target_id` BIGINT NOT NULL,
  `type` TINYINT NOT NULL,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_target_type` (`user_id`, `target_id`, `type`),
  INDEX `idx_target_type` (`target_id`, `type`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Community module tables created successfully' AS message;
