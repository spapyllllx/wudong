-- 社区模块菜单数据
-- 请先删除之前添加的社区管理菜单，再执行此脚本

USE `cool-admin-midway`;

-- 插入父菜单：社区管理
INSERT INTO `base_sys_menu` (`parent_id`, `name`, `router`, `perms`, `type`, `icon`, `order_num`, `view_path`, `keep_alive`, `is_show`)
VALUES (NULL, '社区管理', '/shequ', NULL, 0, 'chat-dot-round', 5, NULL, 1, 1);

-- 获取刚插入的父菜单ID（假设为最新的ID）
SET @parent_id = LAST_INSERT_ID();

-- 插入子菜单：帖子管理
INSERT INTO `base_sys_menu` (`parent_id`, `name`, `router`, `perms`, `type`, `icon`, `order_num`, `view_path`, `keep_alive`, `is_show`)
VALUES (@parent_id, '帖子管理', '/shequ/post', 'shequ:post', 1, 'document', 1, 'shequ/views/post', 1, 1);

-- 插入子菜单：评论管理
INSERT INTO `base_sys_menu` (`parent_id`, `name`, `router`, `perms`, `type`, `icon`, `order_num`, `view_path`, `keep_alive`, `is_show`)
VALUES (@parent_id, '评论管理', '/shequ/comment', 'shequ:comment', 1, 'comment', 2, 'shequ/views/comment', 1, 1);

SELECT '菜单添加完成' AS message;
