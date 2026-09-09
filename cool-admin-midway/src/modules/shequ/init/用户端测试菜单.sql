-- 添加社区用户端测试菜单
INSERT INTO `base_sys_menu` (`parentId`, `name`, `router`, `perms`, `type`, `icon`, `orderNum`, `viewPath`, `keepAlive`, `isShow`)
VALUES
(
  (SELECT id FROM (SELECT id FROM base_sys_menu WHERE name = '社区管理') AS temp),
  '用户端测试',
  '/shequ/test',
  NULL,
  1,
  'icon-apps',
  3,
  'shequ/views/test.vue',
  1,
  1
);
