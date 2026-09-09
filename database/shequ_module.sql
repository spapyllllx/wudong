-- ========================================
-- 社区模块（UGC照片分享）- 数据库表
-- 模块前缀: shequ_
-- ========================================

-- 【表1】shequ_topic - 话题表
CREATE TABLE `shequ_topic` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '话题ID',
  `name` VARCHAR(50) NOT NULL COMMENT '话题名',
  `description` VARCHAR(255) DEFAULT '' COMMENT '话题简介',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `follow_count` INT DEFAULT 0 COMMENT '关注数',
  `post_count` INT DEFAULT 0 COMMENT '游记数',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热门',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_hot_sort` (`is_hot`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

-- 【表2】shequ_post - 游记表
CREATE TABLE `shequ_post` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '游记ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
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
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_like_count` (`like_count`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

-- 【表3】shequ_post_image - 游记图片表
CREATE TABLE `shequ_post_image` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
  `post_id` BIGINT NOT NULL COMMENT '游记ID',
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记图片表';

-- 【表4】shequ_post_comment - 游记评论表
CREATE TABLE `shequ_post_comment` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评论ID',
  `post_id` BIGINT NOT NULL COMMENT '游记ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `parent_id` BIGINT DEFAULT 0 COMMENT '父评论ID，0为一级评论',
  `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复的用户ID',
  `content` VARCHAR(500) NOT NULL COMMENT '评论内容',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `status` VARCHAR(20) DEFAULT 'published',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` DATETIME DEFAULT NULL COMMENT '删除时间',
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记评论表';

-- 【表5】shequ_like - 点赞表（统一点赞，支持游记和评论）
CREATE TABLE `shequ_like` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `target_type` VARCHAR(50) NOT NULL COMMENT '目标类型：post/comment',
  `target_id` BIGINT NOT NULL COMMENT '目标ID',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 【表6】shequ_post_favorite - 游记收藏表
CREATE TABLE `shequ_post_favorite` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `post_id` BIGINT NOT NULL COMMENT '游记ID',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记收藏表';

-- 【表7】shequ_topic_follow - 话题关注表
CREATE TABLE `shequ_topic_follow` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关注ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID（关联app_user.id）',
  `topic_id` BIGINT NOT NULL COMMENT '话题ID',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_user_topic` (`user_id`, `topic_id`),
  KEY `idx_topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题关注表';

-- 【表8】shequ_user_follow - 用户关注表
CREATE TABLE `shequ_user_follow` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关注ID',
  `follower_id` BIGINT NOT NULL COMMENT '关注者ID（关联app_user.id）',
  `followee_id` BIGINT NOT NULL COMMENT '被关注者ID（关联app_user.id）',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  UNIQUE KEY `uk_follower_followee` (`follower_id`, `followee_id`),
  KEY `idx_followee_id` (`followee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- 【表9】shequ_report - 举报表
CREATE TABLE `shequ_report` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '举报ID',
  `reporter_id` BIGINT NOT NULL COMMENT '举报人ID（关联app_user.id）',
  `target_type` VARCHAR(50) NOT NULL COMMENT '目标类型：post/comment',
  `target_id` BIGINT NOT NULL COMMENT '目标ID',
  `reason` VARCHAR(500) NOT NULL COMMENT '举报原因',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/processed/rejected',
  `handler_id` BIGINT DEFAULT NULL COMMENT '处理人ID（关联base_sys_user.id）',
  `handle_result` VARCHAR(255) DEFAULT NULL COMMENT '处理结果',
  `handled_at` DATETIME DEFAULT NULL COMMENT '处理时间',
  `create_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` VARCHAR(30) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  KEY `idx_reporter_id` (`reporter_id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- 初始化数据
INSERT INTO `shequ_topic` (`id`, `name`, `description`, `is_hot`, `sort`) VALUES
(1, '苗寨美景', '分享苗寨的美丽风光', 1, 1),
(2, '美食探店', '推荐乌东特色美食', 1, 2),
(3, '民宿体验', '分享民宿入住体验', 1, 3),
(4, '旅行攻略', '实用的旅行攻略分享', 1, 4);