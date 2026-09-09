-- 用户端测试用户SQL脚本
--
-- 说明：
-- 1. 这是用户端（wudong-web）的测试用户
-- 2. 使用 user_info 表
-- 3. 与管理后台（base_sys_user）是独立的用户系统
--
-- 测试账号：
-- 用户名：testuser
-- 密码：123456

-- 检查 user_info 表是否存在 username 字段，如果不存在则添加
-- 注意：如果已经添加过，这条语句会报错，可以忽略
ALTER TABLE `user_info`
ADD COLUMN `username` VARCHAR(100) NULL COMMENT '用户名' AFTER `unionid`,
ADD UNIQUE INDEX `idx_username` (`username`);

-- 插入测试用户（如果已存在会报错，可以忽略）
INSERT INTO `user_info` (
  `username`,
  `password`,
  `nickName`,
  `avatarUrl`,
  `phone`,
  `gender`,
  `status`,
  `loginType`,
  `createTime`,
  `updateTime`
) VALUES (
  'testuser',
  'e10adc3949ba59abbe56e057f20f883e',  -- 123456的MD5值
  '测试用户',
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  '13800138000',
  1,
  1,
  0,
  NOW(),
  NOW()
);

-- 如果用户已存在，可以用这条语句更新
-- UPDATE `user_info`
-- SET
--   `username` = 'testuser',
--   `password` = 'e10adc3949ba59abbe56e057f20f883e',
--   `status` = 1
-- WHERE `phone` = '13800138000';

-- 验证插入结果
SELECT id, username, nickName, phone, status FROM `user_info` WHERE username = 'testuser';
