-- 添加测试用户（用户名密码登录）
-- 密码：123456（MD5加密后：e10adc3949ba59abbe56e057f20f883e）

INSERT INTO `user_info` (
  `id`,
  `username`,
  `phone`,
  `password`,
  `nickName`,
  `avatarUrl`,
  `gender`,
  `status`,
  `loginType`,
  `createTime`,
  `updateTime`
) VALUES (
  1,
  'testuser',
  '13800138000',
  'e10adc3949ba59abbe56e057f20f883e',
  '测试用户',
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  1,
  1,
  0,
  NOW(),
  NOW()
);

-- 如果已存在，则更新
UPDATE `user_info`
SET
  `username` = 'testuser',
  `password` = 'e10adc3949ba59abbe56e057f20f883e',
  `nickName` = '测试用户',
  `status` = 1
WHERE `id` = 1;
