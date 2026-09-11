-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cool-admin-midway
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attraction`
--

DROP TABLE IF EXISTS `attraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attraction` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '景点/活动名称',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '景点图片（多张）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '景点简介',
  `detailContent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '详细介绍',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `minPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最低价格',
  `rating` decimal(3,1) NOT NULL DEFAULT '5.0' COMMENT '评分',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标签',
  `tips` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '游玩贴士',
  `traffic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '交通指南',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览量',
  `orderCount` int NOT NULL DEFAULT '0' COMMENT '订单量',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面图',
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `openTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开放时间',
  `type` int NOT NULL DEFAULT '1' COMMENT '类型 1-景点 2-活动',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_4c37a81246838dfd8540617d9f` (`createTime`),
  KEY `IDX_1ed3d2f318eb6e67c03830cf36` (`updateTime`),
  KEY `IDX_b78903e2e20311cc1aed7aaaf9` (`tenantId`),
  KEY `IDX_f3da08aaf5015a09d4ab0c2254` (`type`),
  KEY `IDX_3792617776378339e3ba227b4c` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `link_type` varchar(50) DEFAULT NULL COMMENT '跳转类型：url/product/post等',
  `link_value` varchar(255) DEFAULT NULL COMMENT '跳转值',
  `position` varchar(50) DEFAULT 'home' COMMENT '位置：home/category等',
  `sort` int DEFAULT '0',
  `status` varchar(20) DEFAULT 'active',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_position_sort` (`position`,`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='轮播图表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_conf`
--

DROP TABLE IF EXISTS `base_sys_conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_conf` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置键',
  `cValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9be195d27767b4485417869c3a` (`cKey`),
  KEY `IDX_905208f206a3ff9fd513421971` (`createTime`),
  KEY `IDX_4c6f27f6ecefe51a5a196a047a` (`updateTime`),
  KEY `IDX_03fc424a2f8093a538730a7ff2` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_department`
--

DROP TABLE IF EXISTS `base_sys_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '部门名称',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `parentId` int DEFAULT NULL COMMENT '上级部门ID',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_be4c53cd671384fa588ca9470a` (`createTime`),
  KEY `IDX_ca1473a793961ec55bc0c8d268` (`updateTime`),
  KEY `IDX_f19e8ffd9c62ddb17e76c8b9d7` (`tenantId`),
  KEY `IDX_f5fb5ac30b3609c27af3517727` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_log`
--

DROP TABLE IF EXISTS `base_sys_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int DEFAULT NULL COMMENT '用户ID',
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '行为',
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ip',
  `params` json DEFAULT NULL COMMENT '参数',
  PRIMARY KEY (`id`),
  KEY `IDX_c9382b76219a1011f7b8e7bcd1` (`createTime`),
  KEY `IDX_bfd44e885b470da43bcc39aaa7` (`updateTime`),
  KEY `IDX_384bde153859845bf0dcdc00f6` (`tenantId`),
  KEY `IDX_51a2caeb5713efdfcb343a8772` (`userId`),
  KEY `IDX_938f886fb40e163db174b7f6c3` (`action`),
  KEY `IDX_24e18767659f8c7142580893f2` (`ip`)
) ENGINE=InnoDB AUTO_INCREMENT=5536 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_menu`
--

DROP TABLE IF EXISTS `base_sys_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `router` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜单地址',
  `perms` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '权限标识',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-目录 1-菜单 2-按钮',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图标',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint NOT NULL DEFAULT '1' COMMENT '是否显示',
  PRIMARY KEY (`id`),
  KEY `IDX_05e3d6a56604771a6da47ebf8e` (`createTime`),
  KEY `IDX_d5203f18daaf7c3fe0ab34497f` (`updateTime`),
  KEY `IDX_2087f9610c1fc5a184bedaacef` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_param`
--

DROP TABLE IF EXISTS `base_sys_param`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_param` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `keyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '键',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '数据',
  `dataType` int NOT NULL DEFAULT '0' COMMENT '数据类型 0-字符串 1-富文本 2-文件 ',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cf19b5e52d8c71caa9c4534454` (`keyName`),
  KEY `IDX_7bcb57371b481d8e2d66ddeaea` (`createTime`),
  KEY `IDX_479122e3bf464112f7a7253dac` (`updateTime`),
  KEY `IDX_8a0ab598ca7d63475356ca1157` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_role`
--

DROP TABLE IF EXISTS `base_sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色标签',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `relevance` tinyint NOT NULL DEFAULT '0' COMMENT '数据权限是否关联上下级',
  `menuIdList` json NOT NULL COMMENT '菜单权限',
  `departmentIdList` json NOT NULL COMMENT '部门权限',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469d49a5998170e9550cf113da` (`name`),
  UNIQUE KEY `IDX_f3f24fbbccf00192b076e549a7` (`label`),
  KEY `IDX_6f01184441dec49207b41bfd92` (`createTime`),
  KEY `IDX_d64ca209f3fc52128d9b20e97b` (`updateTime`),
  KEY `IDX_953dc26a4e8bd5d9c989295796` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_role_department`
--

DROP TABLE IF EXISTS `base_sys_role_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `departmentId` int NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`),
  KEY `IDX_e881a66f7cce83ba431cf20194` (`createTime`),
  KEY `IDX_cbf48031efee5d0de262965e53` (`updateTime`),
  KEY `IDX_055658b2de49d547635e06f160` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_role_menu`
--

DROP TABLE IF EXISTS `base_sys_role_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  `menuId` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `IDX_3641f81d4201c524a57ce2aa54` (`createTime`),
  KEY `IDX_f860298298b26e7a697be36e5b` (`updateTime`),
  KEY `IDX_fd2d8bbe13949cfa56b1ed0a5d` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_user`
--

DROP TABLE IF EXISTS `base_sys_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `departmentId` int DEFAULT NULL COMMENT '部门ID',
  `userId` int DEFAULT NULL COMMENT '创建者ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '姓名',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `passwordV` int NOT NULL DEFAULT '1' COMMENT '密码版本, 作用是改完密码，让原来的token失效',
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `headImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  `socketId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'socketId',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469ad55973f5b98930f6ad627b` (`username`),
  KEY `IDX_ca8611d15a63d52aa4e292e46a` (`createTime`),
  KEY `IDX_a0f2f19cee18445998ece93ddd` (`updateTime`),
  KEY `IDX_94cb6e88070603ac6729d514fd` (`tenantId`),
  KEY `IDX_0cf944da378d70a94f5fefd803` (`departmentId`),
  KEY `IDX_40541b0502eb2422c73ae2aad1` (`userId`),
  KEY `IDX_9ec6d7ac6337eafb070e4881a8` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `base_sys_user_role`
--

DROP TABLE IF EXISTS `base_sys_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_sys_user_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `roleId` int NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  KEY `IDX_fa9555e03e42fce748c9046b1c` (`createTime`),
  KEY `IDX_3e36c0d2b1a4c659c6b4fc64b3` (`updateTime`),
  KEY `IDX_2f1dc0b6aad5604a2ddf37fba6` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `skuId` int DEFAULT NULL COMMENT 'SKU ID',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `selected` int NOT NULL DEFAULT '1' COMMENT '是否选中 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_52873a7f7f6d060d4f24d4fcb3` (`createTime`),
  KEY `IDX_296a70648b8c86e9b050675287` (`updateTime`),
  KEY `IDX_1906b116db4aabb57c5e68e2dc` (`tenantId`),
  KEY `IDX_756f53ab9466eb52a52619ee01` (`userId`),
  KEY `IDX_371eb56ecc4104c2644711fa85` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `item_type` varchar(20) NOT NULL COMMENT 'product/agri_product',
  `item_id` bigint NOT NULL COMMENT '商品ID',
  `sku_id` bigint DEFAULT NULL COMMENT 'SKU ID',
  `quantity` int NOT NULL COMMENT '数量',
  `selected` tinyint DEFAULT '1' COMMENT '是否选中',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_item` (`user_id`,`item_type`,`item_id`,`sku_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='购物车表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `demo_goods`
--

DROP TABLE IF EXISTS `demo_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demo_goods` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `price` decimal(5,2) NOT NULL COMMENT '价格',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '描述',
  `mainImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '主图',
  `type` int NOT NULL COMMENT '分类',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `exampleImages` json DEFAULT NULL COMMENT '示例图',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存',
  PRIMARY KEY (`id`),
  KEY `IDX_5075bf301ed9c39b5ca534231c` (`createTime`),
  KEY `IDX_82703e0477d1219261277df718` (`updateTime`),
  KEY `IDX_4773d4d34db0d601516da30bf3` (`tenantId`),
  KEY `IDX_85a70ee36c7c1b0a04bfa1ed27` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dict_info`
--

DROP TABLE IF EXISTS `dict_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dict_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `typeId` int NOT NULL COMMENT '类型ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '值',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `parentId` int DEFAULT NULL COMMENT '父ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5c311a4af30de1181a5d7a7cc2` (`createTime`),
  KEY `IDX_10362a62adbf120821fff209d8` (`updateTime`),
  KEY `IDX_c26dc4b1ccb26e642191995edd` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dict_type`
--

DROP TABLE IF EXISTS `dict_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dict_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标识',
  PRIMARY KEY (`id`),
  KEY `IDX_69734e5c2d29cc2139d5078f2c` (`createTime`),
  KEY `IDX_6cccb2e33846cd354e8dc0e0ef` (`updateTime`),
  KEY `IDX_7d4f3d2336e1afdda38278a07e` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜品名称',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `originalPrice` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签',
  `stock` int NOT NULL DEFAULT '999' COMMENT '库存',
  `sales` int NOT NULL DEFAULT '0' COMMENT '销量',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜品图片',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '菜品描述',
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '份' COMMENT '单位',
  `isRecommend` int NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_47b3c423a0c8627b74b7504d8c` (`createTime`),
  KEY `IDX_fa243eb96f7f6a702ac25a0c8c` (`updateTime`),
  KEY `IDX_4f47db9c2b24c290b8057889f0` (`tenantId`),
  KEY `IDX_3bf1369e81b12358ba268f7f68` (`restaurantId`),
  KEY `IDX_f101936095917dde2a9f060951` (`categoryId`),
  KEY `IDX_4a87d4fc2c0d56ab6ad8fb732d` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dish_category`
--

DROP TABLE IF EXISTS `dish_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  PRIMARY KEY (`id`),
  KEY `IDX_bb4786f80ea680ae290648e0ff` (`createTime`),
  KEY `IDX_3233da5f18afeeec0a1f37068f` (`updateTime`),
  KEY `IDX_79ee3c096778e5e5e057751c2b` (`tenantId`),
  KEY `IDX_74ddbf5af5c912c6293eb86650` (`restaurantId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homestay`
--

DROP TABLE IF EXISTS `homestay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homestay` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '民宿名称',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '民宿图片（多张）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '民宿简介',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `minPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最低价格',
  `rating` decimal(3,1) NOT NULL DEFAULT '5.0' COMMENT '评分',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '设施服务',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览量',
  `orderCount` int NOT NULL DEFAULT '0' COMMENT '订单量',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面图',
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `checkInTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '入住时间',
  `checkOutTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '退房时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_86615ae1ec4afb1e93b1477503` (`createTime`),
  KEY `IDX_6f29708420f53a06a840c24c7a` (`updateTime`),
  KEY `IDX_55916a0a199e82be8bac6d5989` (`tenantId`),
  KEY `IDX_93d0a9f160285575373841ffa5` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homestay_order`
--

DROP TABLE IF EXISTS `homestay_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homestay_order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `homestayId` int NOT NULL COMMENT '民宿ID',
  `homestayName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '民宿名称',
  `roomTypeId` int NOT NULL COMMENT '房型ID',
  `nights` int NOT NULL COMMENT '入住天数',
  `roomCount` int NOT NULL COMMENT '房间数',
  `guestCount` int NOT NULL COMMENT '入住人数',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `payAmount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `payTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付时间',
  `cancelReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消原因',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `roomTypeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房型名称',
  `checkInDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '入住日期',
  `checkOutDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '退房日期',
  `contactName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contactPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-待付款 1-待入住 2-已入住 3-已完成 4-已取消',
  `payStatus` int NOT NULL DEFAULT '0' COMMENT '支付状态 0-未支付 1-已支付',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_d50f2f8e2d26a16e9f43bbfe1d` (`orderNo`),
  KEY `IDX_da87fdf0308111c2c16129c6f5` (`createTime`),
  KEY `IDX_04549df7ce95614e8f18d05020` (`updateTime`),
  KEY `IDX_55df5bc0b9bfeeec67325da9c0` (`tenantId`),
  KEY `IDX_8867d41fccb167783013f8074d` (`userId`),
  KEY `IDX_042298dc8db7188bc353caf296` (`homestayId`),
  KEY `IDX_1de9ced66d9c4d9933770f73ad` (`checkInDate`),
  KEY `IDX_cb1e7fdb69bed4e0af7f3453bd` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `userId` int NOT NULL COMMENT '用户ID',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `payAmount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `freight` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '运费',
  `discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `status` int NOT NULL DEFAULT '0' COMMENT '订单状态 0-待付款 1-待发货 2-待收货 3-已完成 4-已取消 5-已关闭',
  `payStatus` int NOT NULL DEFAULT '0' COMMENT '支付状态 0-未支付 1-已支付',
  `payType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付方式 wechat-微信 alipay-支付宝',
  `payTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付时间',
  `shipTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发货时间',
  `finishTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '完成时间',
  `cancelTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消时间',
  `cancelReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消原因',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '订单备注',
  `receiverName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人姓名',
  `receiverPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人电话',
  `receiverProvince` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `receiverCity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `receiverDistrict` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区',
  `receiverAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_2fa775b82a212c5fc3bb4074c6` (`orderNo`),
  KEY `IDX_99a5dd229861d593ffa8095b4a` (`createTime`),
  KEY `IDX_0e4b93fe2bf6bf8a7ec7c9e25b` (`updateTime`),
  KEY `IDX_7853202400ba8726242baa7a91` (`tenantId`),
  KEY `IDX_caabe91507b3379c7ba73637b8` (`userId`),
  KEY `IDX_7a9573d6a1fb982772a9123320` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `orderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `productId` int NOT NULL COMMENT '商品ID',
  `productTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
  `productImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品图片',
  `skuId` int DEFAULT NULL COMMENT 'SKU ID',
  `skuName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SKU名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品单价',
  `quantity` int NOT NULL COMMENT '购买数量',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '小计金额',
  PRIMARY KEY (`id`),
  KEY `IDX_97866742aa4000d78259a5c35a` (`createTime`),
  KEY `IDX_3aca5cb8f9529f5155bf561973` (`updateTime`),
  KEY `IDX_a314b14ebe69c34e51df02f49a` (`tenantId`),
  KEY `IDX_646bf9ece6f45dbe41c203e06e` (`orderId`),
  KEY `IDX_b039815e4b7722a66bce5b867a` (`orderNo`),
  KEY `IDX_904370c093ceea4369659a3c81` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_log`
--

DROP TABLE IF EXISTS `order_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderId` int NOT NULL COMMENT '订单ID',
  `orderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `operateType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型',
  `operateContent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作内容',
  `operatorId` int DEFAULT NULL COMMENT '操作人ID',
  `operatorName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作人姓名',
  PRIMARY KEY (`id`),
  KEY `IDX_7690369d59389b4cc263778723` (`createTime`),
  KEY `IDX_5628a38444fd1c5417bd0aa535` (`updateTime`),
  KEY `IDX_c404f48ca76be6c3a2469bed7a` (`tenantId`),
  KEY `IDX_18cb39f392d9654af485d16919` (`orderId`),
  KEY `IDX_d3f5dd5c7b3381e7dc5ba34072` (`orderNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plugin_info`
--

DROP TABLE IF EXISTS `plugin_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugin_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '简介',
  `keyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Key名',
  `hook` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hook',
  `readme` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '描述',
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '版本',
  `logo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Logo(base64)',
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '作者',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-禁用 1-启用',
  `content` json NOT NULL COMMENT '内容',
  `tsContent` json NOT NULL COMMENT 'ts内容',
  `pluginJson` json DEFAULT NULL COMMENT '插件的plugin.json',
  `config` json DEFAULT NULL COMMENT '配置',
  PRIMARY KEY (`id`),
  KEY `IDX_071da0804576df95363c24357c` (`createTime`),
  KEY `IDX_d94d7c2437aca9f1b183979b07` (`updateTime`),
  KEY `IDX_89a39daf328b50686755795546` (`tenantId`),
  KEY `IDX_95719662507de0fbf70ad1b5ee` (`keyName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
  `subtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '副标题',
  `images` json DEFAULT NULL COMMENT '图片列表（JSON数组）',
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '商品详情（富文本）',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `stock` int NOT NULL DEFAULT '0' COMMENT '总库存',
  `sales` int NOT NULL DEFAULT '0' COMMENT '销量',
  `rating` decimal(3,2) NOT NULL DEFAULT '5.00' COMMENT '评分（1-5）',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `categoryId` int NOT NULL COMMENT '分类ID',
  `mainImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '主图',
  `originalPrice` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `reviewCount` int NOT NULL DEFAULT '0' COMMENT '评价数',
  `favoriteCount` int NOT NULL DEFAULT '0' COMMENT '收藏数',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览数',
  `isRecommend` int NOT NULL DEFAULT '0' COMMENT '是否推荐 0-否 1-是',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_b337971dcc056dc4f33b793b4b` (`createTime`),
  KEY `IDX_a11e5200288f7b16d0867450d3` (`updateTime`),
  KEY `IDX_08293ca31a601d3cd0228120bc` (`tenantId`),
  KEY `IDX_ff0c0301a95e517153df97f681` (`categoryId`),
  KEY `IDX_4183f9ae55368b456b7e08a953` (`sales`),
  KEY `IDX_01286e06a0554cbb19375f0178` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '分类图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `parentId` int NOT NULL DEFAULT '0' COMMENT '父分类ID，0为一级分类',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  PRIMARY KEY (`id`),
  KEY `IDX_efb46307d87701bdd660ea36f1` (`createTime`),
  KEY `IDX_0d9b50aca4adf3411e7f434d9a` (`updateTime`),
  KEY `IDX_0a0cf25cd8232a154d1cce2641` (`tenantId`),
  KEY `IDX_569b30aa4b0a1ad42bcd30916a` (`parentId`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_favorite`
--

DROP TABLE IF EXISTS `product_favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_favorite` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6dc55d8be40c8c971d6a24decc` (`createTime`),
  KEY `IDX_5dc8df6c69b4d06a92a7ae10a6` (`updateTime`),
  KEY `IDX_d102d76388b3c149a07fdb17d8` (`tenantId`),
  KEY `IDX_fe333c42575527e1e9e2978a14` (`userId`),
  KEY `IDX_69e5f6a640707ee3f5d6eab20c` (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_review`
--

DROP TABLE IF EXISTS `product_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `rating` tinyint NOT NULL COMMENT '评分（1-5）',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '评价图片（JSON数组）',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `userNickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `orderId` int DEFAULT NULL COMMENT '订单ID',
  `skuName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '购买的规格',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `replyContent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '商家回复',
  `replyTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '回复时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-待审核 1-已发布 2-已删除',
  PRIMARY KEY (`id`),
  KEY `IDX_d2bf3bf7d4176c196e2f360d0c` (`createTime`),
  KEY `IDX_721035f45dde81af1280a92472` (`updateTime`),
  KEY `IDX_586e6b1273ba2732ec0ee41a80` (`tenantId`),
  KEY `IDX_06e7335708b5e7870f1eaa608d` (`productId`),
  KEY `IDX_db21a1dc776b455ee83eb7ff88` (`userId`),
  KEY `IDX_fb12b4f7c7cf7728866222259d` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_review_like`
--

DROP TABLE IF EXISTS `product_review_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `reviewId` int NOT NULL COMMENT '评价ID',
  PRIMARY KEY (`id`),
  KEY `IDX_794876e9583a9c224412d155eb` (`createTime`),
  KEY `IDX_d543f192ed1fa4e6bd0750e368` (`updateTime`),
  KEY `IDX_a7fa57a04ecf808be0e58e1cf9` (`tenantId`),
  KEY `IDX_431b684121880b749fcb817f70` (`userId`),
  KEY `IDX_4c4d76ff32bd9fa0a54db3df70` (`reviewId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_sku`
--

DROP TABLE IF EXISTS `product_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sku` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `price` decimal(10,2) NOT NULL COMMENT 'SKU价格',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'SKU库存',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `productId` int NOT NULL COMMENT '商品ID',
  `specName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规格名称（如：红色-L）',
  `specValue` json DEFAULT NULL COMMENT '规格值JSON',
  `skuCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SKU编码',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'SKU图片',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-禁用 1-启用',
  PRIMARY KEY (`id`),
  KEY `IDX_333010cb899d20891e1fb096a7` (`createTime`),
  KEY `IDX_8cb115c6497c411a9b9189c6fb` (`updateTime`),
  KEY `IDX_505d4bf5fa042f7254adff9d6a` (`tenantId`),
  KEY `IDX_0833ab73f1447c11d5acd37cc2` (`productId`),
  KEY `IDX_007e7f9a7d9f38608feb2eb705` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `query-result-cache`
--

DROP TABLE IF EXISTS `query-result-cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `query-result-cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` bigint NOT NULL,
  `duration` int NOT NULL,
  `query` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recycle_data`
--

DROP TABLE IF EXISTS `recycle_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recycle_data` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `entityInfo` json NOT NULL COMMENT '表',
  `userId` int DEFAULT NULL COMMENT '操作人',
  `data` json NOT NULL COMMENT '被删除的数据',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '请求的接口',
  `params` json DEFAULT NULL COMMENT '请求参数',
  `count` int NOT NULL DEFAULT '1' COMMENT '删除数据条数',
  PRIMARY KEY (`id`),
  KEY `IDX_59fc783673f4a322e9c83e0599` (`createTime`),
  KEY `IDX_c6a499c4a4fcd37f2930d27816` (`updateTime`),
  KEY `IDX_6659453338145e11d9b5103f38` (`tenantId`),
  KEY `IDX_f3ed09ba7090f3eb378cb83b5b` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '餐厅名称',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '餐厅图片（多张）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '餐厅简介',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `avgPrice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '人均消费',
  `rating` decimal(3,1) NOT NULL DEFAULT '5.0' COMMENT '评分',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '设施服务',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览量',
  `orderCount` int NOT NULL DEFAULT '0' COMMENT '订单量',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面图',
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `businessHours` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '营业时间',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_b02c0d5e53d559a3467cf96d4b` (`createTime`),
  KEY `IDX_5a5bfff5d9f94094ba9dc09eff` (`updateTime`),
  KEY `IDX_0bd1169e9ed565069e4257b3a8` (`tenantId`),
  KEY `IDX_c3d622494c1f8305034a54cbe0` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `restaurant_booking`
--

DROP TABLE IF EXISTS `restaurant_booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_booking` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `restaurantId` int NOT NULL COMMENT '餐厅ID',
  `restaurantName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '餐厅名称',
  `peopleCount` int NOT NULL COMMENT '就餐人数',
  `cancelReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消原因',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `bookingNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '预订号',
  `bookingDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '预订日期',
  `bookingTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '预订时间',
  `contactName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contactPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-待确认 1-已确认 2-已完成 3-已取消',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_49e2d020cbcb236cefc7acacfc` (`bookingNo`),
  KEY `IDX_8701044029b8ae17193a2460a6` (`createTime`),
  KEY `IDX_da0eb3574ff580fffcc5342ca1` (`updateTime`),
  KEY `IDX_7d19fade916bea978acc0039f3` (`tenantId`),
  KEY `IDX_699b5b43b6e35815887ee49f4c` (`userId`),
  KEY `IDX_ab0b07f11c08c5846b9709696f` (`restaurantId`),
  KEY `IDX_021fb9552c562ccf34186728a3` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room_type`
--

DROP TABLE IF EXISTS `room_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `homestayId` int NOT NULL COMMENT '民宿ID',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '房型图片（多张）',
  `area` int DEFAULT NULL COMMENT '面积（平方米）',
  `maxGuests` int NOT NULL DEFAULT '2' COMMENT '最多入住人数',
  `price` decimal(10,2) NOT NULL COMMENT '价格/晚',
  `weekendPrice` decimal(10,2) DEFAULT NULL COMMENT '周末价格/晚',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '房间设施',
  `totalRooms` int NOT NULL DEFAULT '1' COMMENT '房间总数',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房型名称',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房型图片',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '房型描述',
  `bedType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '床型',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_5b706687506b1bff566365e2a2` (`createTime`),
  KEY `IDX_21466b390609e8a1dfb792a28e` (`updateTime`),
  KEY `IDX_0be4bb95eef7c8e3648d8f21c6` (`tenantId`),
  KEY `IDX_d084b051f2140f29f0b22b1a06` (`homestayId`),
  KEY `IDX_ea3b06cbd70740da6d9c6055bc` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shequ_comment`
--

DROP TABLE IF EXISTS `shequ_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shequ_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `postId` int NOT NULL COMMENT '帖子ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `userNickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `parentId` int DEFAULT NULL COMMENT '父评论ID（回复评论用）',
  `replyUserId` int DEFAULT NULL COMMENT '回复的用户ID',
  `replyUserNickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '回复的用户昵称',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-待审核 1-已发布 2-已删除',
  PRIMARY KEY (`id`),
  KEY `IDX_6da7ea3b3eabccefb298cdde0f` (`createTime`),
  KEY `IDX_09779da6155c8f6d4917d9640e` (`updateTime`),
  KEY `IDX_dbd84ef5cfbef98d525bd751cd` (`tenantId`),
  KEY `IDX_6ee2b5ce084ab842b2997dbe8c` (`postId`),
  KEY `IDX_d5dfa25f9692e3268d15baf280` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shequ_like`
--

DROP TABLE IF EXISTS `shequ_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shequ_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `targetId` int NOT NULL COMMENT '目标ID（帖子ID或评论ID）',
  `type` int NOT NULL COMMENT '类型 1-帖子 2-评论',
  PRIMARY KEY (`id`),
  KEY `IDX_a8332531203dac248b328c024c` (`createTime`),
  KEY `IDX_c36cf58662a6d20e8ff409db62` (`updateTime`),
  KEY `IDX_623a658f448a69fd9566cc89f2` (`tenantId`),
  KEY `IDX_8fc74ce80c2d742b9981c4aa83` (`userId`),
  KEY `IDX_ba1e7c2910ef09c0dfaa590d6d` (`targetId`),
  KEY `IDX_421aaa87d6237e412b05c077cf` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shequ_post`
--

DROP TABLE IF EXISTS `shequ_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shequ_post` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `userNickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '帖子内容',
  `images` json DEFAULT NULL COMMENT '图片列表（JSON数组）',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '定位地址',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `scenicId` int DEFAULT NULL COMMENT '景点ID',
  `scenicName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '景点名称',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `commentCount` int NOT NULL DEFAULT '0' COMMENT '评论数',
  `viewCount` int NOT NULL DEFAULT '0' COMMENT '浏览数',
  `shareCount` int NOT NULL DEFAULT '0' COMMENT '分享数',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-待审核 1-已发布 2-已下架',
  `isEssence` int NOT NULL DEFAULT '0' COMMENT '是否精华 0-否 1-是',
  `isTop` int NOT NULL DEFAULT '0' COMMENT '是否置顶 0-否 1-是',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `auditRemark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核备注',
  PRIMARY KEY (`id`),
  KEY `IDX_a5fe5dca7ffce7560cee75b4b2` (`createTime`),
  KEY `IDX_9c6b8e062b26701564ebffac91` (`updateTime`),
  KEY `IDX_b57d50c2232fa59f5f3d9b4a10` (`tenantId`),
  KEY `IDX_d9b72ea1f26e121cc57734e88c` (`userId`),
  KEY `IDX_61c2ec9b01eb60a5e670b0a612` (`scenicId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `space_info`
--

DROP TABLE IF EXISTS `space_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型',
  `classifyId` int DEFAULT NULL COMMENT '分类ID',
  `fileId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件名',
  `size` int NOT NULL COMMENT '文件大小',
  `version` int NOT NULL DEFAULT '1' COMMENT '文档版本',
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件位置',
  PRIMARY KEY (`id`),
  KEY `IDX_eb1da2f304c760846b5add09b3` (`createTime`),
  KEY `IDX_d7a2539961e9aacba8b353f3c9` (`updateTime`),
  KEY `IDX_6001c5ed2088b893c0d69bb244` (`tenantId`),
  KEY `IDX_0975633032bfe6574468b3a4ae` (`fileId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `space_type`
--

DROP TABLE IF EXISTS `space_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类别名称',
  `parentId` int DEFAULT NULL COMMENT '父分类ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6669449501d275f367ca295472` (`createTime`),
  KEY `IDX_0749b509b68488caecd4cc2bbc` (`updateTime`),
  KEY `IDX_5e7f846b8cdabbceba95ed3314` (`tenantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task_info`
--

DROP TABLE IF EXISTS `task_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `jobId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务ID',
  `repeatConf` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '任务配置',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '名称',
  `cron` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'cron',
  `limit` int DEFAULT NULL COMMENT '最大执行次数 不传为无限次',
  `every` int DEFAULT NULL COMMENT '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-停止 1-运行',
  `startDate` datetime DEFAULT NULL COMMENT '开始时间',
  `endDate` datetime DEFAULT NULL COMMENT '结束时间',
  `data` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '数据',
  `service` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '执行的service实例ID',
  `type` int NOT NULL DEFAULT '0' COMMENT '状态 0-系统 1-用户',
  `nextRunTime` datetime DEFAULT NULL COMMENT '下一次执行时间',
  `taskType` int NOT NULL DEFAULT '0' COMMENT '状态 0-cron 1-时间间隔',
  `lastExecuteTime` datetime DEFAULT NULL,
  `lockExpireTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6ced02f467e59bd6306b549bb0` (`createTime`),
  KEY `IDX_2adc6f9c241391126f27dac145` (`updateTime`),
  KEY `IDX_11b991dc4a7a5585c636008d3a` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task_log`
--

DROP TABLE IF EXISTS `task_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `taskId` int DEFAULT NULL COMMENT '任务ID',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-失败 1-成功',
  `detail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '详情描述',
  PRIMARY KEY (`id`),
  KEY `IDX_b9af0e100be034924b270aab31` (`createTime`),
  KEY `IDX_8857d8d43d38bebd7159af1fa6` (`updateTime`),
  KEY `IDX_fa4cb94036d961600c0f22ed91` (`tenantId`),
  KEY `IDX_1142dfec452e924b346f060fda` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ticket_order`
--

DROP TABLE IF EXISTS `ticket_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_order` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `attractionId` int NOT NULL COMMENT '景点ID',
  `attractionName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '景点名称',
  `ticketTypeId` int NOT NULL COMMENT '票型ID',
  `quantity` int NOT NULL COMMENT '购买数量',
  `totalAmount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `payAmount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `payTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '支付时间',
  `useTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '使用时间',
  `refundTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '退款时间',
  `refundReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '退款原因',
  `cancelReason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '取消原因',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `orderNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `ticketTypeName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票型名称',
  `useDate` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用日期',
  `contactName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系人',
  `contactPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `contactIdCard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份证号',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态 0-待付款 1-待使用 2-已使用 3-已完成 4-已取消 5-已退款',
  `payStatus` int NOT NULL DEFAULT '0' COMMENT '支付状态 0-未支付 1-已支付',
  `qrCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '二维码',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f6786d792b9494ead75e55e994` (`orderNo`),
  KEY `IDX_1cf57fafda86b58f142d5dfba3` (`createTime`),
  KEY `IDX_beac5a1bfe947aeb575b842e7b` (`updateTime`),
  KEY `IDX_c8586d3b834cefb9fd98a26f76` (`tenantId`),
  KEY `IDX_c12989e34be619d0ad06e2195f` (`userId`),
  KEY `IDX_6b281d7131ffc694721b8f6ce7` (`attractionId`),
  KEY `IDX_16887b85ca5939b0a77ae3e652` (`useDate`),
  KEY `IDX_552e3bb92ec1765359f05ac4c2` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ticket_type`
--

DROP TABLE IF EXISTS `ticket_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `attractionId` int NOT NULL COMMENT '景点ID',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `originalPrice` decimal(10,2) NOT NULL COMMENT '原价',
  `stock` int NOT NULL DEFAULT '999' COMMENT '库存',
  `validDays` int NOT NULL DEFAULT '1' COMMENT '有效天数',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票型名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '票型描述',
  `refundRule` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '退改规则',
  `useRule` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '使用规则',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态 0-下架 1-上架',
  PRIMARY KEY (`id`),
  KEY `IDX_b3336fe89ea1724e4b47ebaa32` (`createTime`),
  KEY `IDX_556e074500f8675b608023095e` (`updateTime`),
  KEY `IDX_8eb369b4ebd923554a8ca1a780` (`tenantId`),
  KEY `IDX_b876da2cddbd6ef08e1b09157d` (`attractionId`),
  KEY `IDX_7f2db7314fa03326f317234d19` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userId` int NOT NULL COMMENT '用户ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区',
  `receiverName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人姓名',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `receiverPhone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人电话',
  `isDefault` int NOT NULL DEFAULT '0' COMMENT '是否默认 0-否 1-是',
  PRIMARY KEY (`id`),
  KEY `IDX_144621f4f7bf21e72ed6972d85` (`createTime`),
  KEY `IDX_de647797f6286697bfe9527955` (`updateTime`),
  KEY `IDX_d93103979d4be73c3192163996` (`tenantId`),
  KEY `IDX_1abd8badc4a127b0f357d9ecbc` (`userId`),
  KEY `IDX_fed662338b8eaf9d49fe3c097b` (`receiverPhone`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '登录唯一ID',
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别',
  `status` int NOT NULL DEFAULT '1' COMMENT '状态',
  `loginType` int NOT NULL DEFAULT '0' COMMENT '登录方式',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '密码',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '介绍',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_6edeceee578056a2c1e493563a` (`unionid`),
  UNIQUE KEY `IDX_9234e7bac72991a93b172618e2` (`phone`),
  UNIQUE KEY `IDX_a9fd4d9a39d96e3628d6a1f5e3` (`username`),
  KEY `IDX_e6386e92c288d85dbc43ac53f7` (`createTime`),
  KEY `IDX_5271afbb87138d688b6220b589` (`updateTime`),
  KEY `IDX_7c8ea8d68808b77734df54ce32` (`tenantId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_wx`
--

DROP TABLE IF EXISTS `user_wx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_wx` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建时间',
  `updateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '更新时间',
  `tenantId` int DEFAULT NULL COMMENT '租户ID',
  `unionid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信unionid',
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '微信openid',
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '昵称',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别 0-未知 1-男 2-女',
  `language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '语言',
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市',
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '省份',
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '国家',
  `type` int NOT NULL DEFAULT '0' COMMENT '类型 0-小程序 1-公众号 2-H5 3-APP',
  PRIMARY KEY (`id`),
  KEY `IDX_e23b473abf5a6b00e44f3fd842` (`createTime`),
  KEY `IDX_049adb91204e94c1ede5e6dd23` (`updateTime`),
  KEY `IDX_f39f7e2dd63c906fcee61c50ad` (`tenantId`),
  KEY `IDX_d22b5fa040a01ec1b09e1e181e` (`unionid`),
  KEY `IDX_7946849febadd93cf81fc2b53f` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11  8:57:10

