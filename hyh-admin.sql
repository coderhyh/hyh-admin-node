/*
 Navicat Premium Data Transfer

 Source Server         : coderhyh_mysql
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : hyh-admin

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 23/05/2023 17:01:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0: 未冻结\n1: 已冻结\n2: 管理员; 不可设置',
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `routeName` varchar(255) DEFAULT NULL,
  `permission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `component` varchar(255) DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'directory: 目录\nmenu: 菜单\npermission: 权限',
  `parentId` int DEFAULT NULL,
  `requiredId` int DEFAULT NULL,
  `order` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  KEY `requiredId` (`requiredId`),
  CONSTRAINT `parentId` FOREIGN KEY (`parentId`) REFERENCES `sys_menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `requiredId` FOREIGN KEY (`requiredId`) REFERENCES `sys_menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (5, '角色新增', NULL, 0, '', NULL, 'system/role-manage[table]:insert', NULL, 'permission', 14, NULL, 1);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (6, '角色删除', NULL, 0, '', NULL, 'system/role-manage[table]:delete', NULL, 'permission', 14, NULL, 2);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (7, '角色更新', NULL, 0, '', NULL, 'system/role-manage[table]:update', NULL, 'permission', 14, NULL, 3);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (8, '角色查看', NULL, 0, '', NULL, 'system/role-manage[table]:query', NULL, 'permission', 14, NULL, 4);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (9, '用户新增', NULL, 0, '', NULL, 'system/user-manage[table]:insert', NULL, 'permission', 15, NULL, 1);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (10, '用户删除', NULL, 0, '', NULL, 'system/user-manage[table]:delete', NULL, 'permission', 15, NULL, 2);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (11, '用户更新', NULL, 0, '', NULL, 'system/user-manage[table]:update', NULL, 'permission', 15, NULL, 3);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (12, '用户查看', NULL, 0, '', NULL, 'system/user-manage[table]:query', NULL, 'permission', 15, NULL, 4);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (14, '角色管理', 'material-symbols:manage-accounts', 0, 'role-manage', 'RoleManage', NULL, 'system/role-manage/index', 'menu', 16, 8, 2);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (15, '用户管理', 'material-symbols:settings-account-box', 0, 'user-manage', 'UserManage', NULL, 'system/user-manage/index', 'menu', 16, 12, 1);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (16, '系统管理', 'mdi:cog', 0, 'system', 'System', NULL, NULL, 'directory', NULL, NULL, 1);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (17, '菜单管理', 'mdi:list-box', 0, 'menu-manage', 'MenuManage', NULL, 'system/menu-manage/index', 'menu', 16, 21, 3);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (18, '菜单新增', NULL, 0, '', NULL, 'system/menu-manage[table]:insert', NULL, 'permission', 17, NULL, 1);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (19, '菜单删除', NULL, 0, '', NULL, 'system/menu-manage[table]:delete', NULL, 'permission', 17, NULL, 2);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (20, '菜单更新', NULL, 0, '', NULL, 'system/menu-manage[table]:update', NULL, 'permission', 17, NULL, 3);
INSERT INTO `sys_menu` (`id`, `page`, `icon`, `status`, `route`, `routeName`, `permission`, `component`, `type`, `parentId`, `requiredId`, `order`) VALUES (21, '菜单查看', NULL, 0, '', NULL, 'system/menu-manage[table]:query', NULL, 'permission', 17, NULL, 4);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `role_alias` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0: 未冻结\n1: 已冻结\n2: 管理员; 不可设置',
  `grade` int NOT NULL DEFAULT '2',
  `create_by` int DEFAULT NULL,
  `update_by` int DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `create_by` (`create_by`),
  KEY `update_by` (`update_by`),
  CONSTRAINT `create_by` FOREIGN KEY (`create_by`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `update_by` FOREIGN KEY (`update_by`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `role_name`, `role_alias`, `status`, `grade`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES (1, '管理员', '管理员', 2, 1, 1000, 1000, '2023-04-28 00:08:08', '2023-05-04 14:23:31');
INSERT INTO `sys_role` (`id`, `role_name`, `role_alias`, `status`, `grade`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES (2, '普通用户', '普通用户', 0, 2, 1000, 1000, '2023-04-28 00:08:23', '2023-05-23 17:00:53');
INSERT INTO `sys_role` (`id`, `role_name`, `role_alias`, `status`, `grade`, `create_by`, `update_by`, `create_time`, `update_time`) VALUES (3, 'hyh', 'hyh', 0, 3, 1000, 1000, '2023-04-28 00:20:29', '2023-05-11 01:05:39');
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`) USING BTREE,
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `menu_id` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 2);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 4);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 5);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 5);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 5);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 6);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 6);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 6);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 7);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 7);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 7);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 8);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 8);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 8);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 9);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 12);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 12);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 12);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 13);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 14);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 14);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 15);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 17);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 17);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 18);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 18);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 19);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 19);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 20);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 20);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 21);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 21);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (3, 21);
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0: 未冻结\n1: 已冻结\n2: 管理员; 不可设置',
  `role` int NOT NULL,
  `jwt` varchar(2555) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`username`) USING BTREE,
  KEY `role` (`role`),
  CONSTRAINT `role` FOREIGN KEY (`role`) REFERENCES `sys_role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1020 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `status`, `role`, `jwt`, `create_time`, `update_time`, `last_login_time`) VALUES (1000, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 2, 1, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIyMTIzMmYyOTdhNTdhNWE3NDM4OTRhMGU0YTgwMWZjMyIsImlkIjoxMDAwLCJpYXQiOjE2ODQ4MzIzMzgsImV4cCI6MTY4NDg3NTUzOH0.GdXCuq6zW-V47uFcqBXJexGiM4MsX9SROibWJNyGj8HiGRFCVmUHMIJMqM5NckOM8K98lUIBbPFbns35TWMMpnCY25u5z4wj9vUQNVeMJeBaMp-oJ2u08gmBbbB3DmaVZmrtJpeB2n2xAgMtQ_LqPIe4eEC88B6HpcWtXHTd0sSzI1mNm6DV2EIYuH3NbCK0jWI84T-FxakVQc_1STTSeqgm-6GhiO6aiFALKfePFtlp_U60Yk13AeD-2Bu3i8Fmcycd8RPJO-NVMqGI35nEO_2EtME96plEs7A_4VIdj41nqvEo59UlFsmb4Yz8c1YnLqZ6pLeg2pBf09gqQtD7hw', '2023-04-28 09:24:51', '2023-04-28 09:24:51', '2023-05-23 16:58:58');
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `status`, `role`, `jwt`, `create_time`, `update_time`, `last_login_time`) VALUES (1001, 'yuhao.huang', '96e79218965eb72c92a549dd5a330112', '黄玉豪', 0, 2, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl1aGFvLmh1YW5nIiwicGFzc3dvcmQiOiI5NmU3OTIxODk2NWViNzJjOTJhNTQ5ZGQ1YTMzMDExMiIsImlkIjoxMDAxLCJpYXQiOjE2ODI2Njc4ODAsImV4cCI6MTY4MjcxMTA4MH0.OIwtQ4vCVENpGBGuNlS0SJ_TyyvqnJFokuoIatRbcGHr8BfZoo7PgslR3MPDDXS5hgJX7zrBrSprc5cy96_t4hNDh5qfObX1r8eOzr0w9SF3K_Jdno9RgmCtkBJdKvvLXPbOv07On5Vzu214wR7sUVP2YpzWDOSFL5oVwCacgO_kIPqVJaVz46nCcTP2A9DKJr7LjNjb9uf4vFh-sS4BAXzDfyLycv7RYz_KTI7quDjdO1jtqS1T84qsA0i94TAafbvHsWoJLsb4LE-4FGYQ3ke6kiIdnqKKUUvgDrPW3LMb4RLAofGOosJYh1F6afrwWrwt-nTY76WQfTCAjGw50Q', '2023-04-28 09:25:06', '2023-04-28 09:25:06', '2023-04-28 15:44:40');
COMMIT;

-- ----------------------------
-- Triggers structure for table sys_role
-- ----------------------------
DROP TRIGGER IF EXISTS `non update role status`;
delimiter ;;
CREATE TRIGGER `non update role status` BEFORE UPDATE ON `sys_role` FOR EACH ROW IF NEW.id = 1 AND NEW.status <> OLD.status THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '无法修改管理员状态';
END IF
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table sys_role
-- ----------------------------
DROP TRIGGER IF EXISTS `non delete role`;
delimiter ;;
CREATE TRIGGER `non delete role` BEFORE DELETE ON `sys_role` FOR EACH ROW IF OLD.id = 1 THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '管理员角色禁止删除';
END IF
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table sys_user
-- ----------------------------
DROP TRIGGER IF EXISTS `non update user status`;
delimiter ;;
CREATE TRIGGER `non update user status` BEFORE UPDATE ON `sys_user` FOR EACH ROW IF NEW.id = 1000 AND NEW.status <> OLD.status THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '无法修改admin状态';
END IF
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table sys_user
-- ----------------------------
DROP TRIGGER IF EXISTS `non delete user`;
delimiter ;;
CREATE TRIGGER `non delete user` BEFORE DELETE ON `sys_user` FOR EACH ROW IF OLD.id = 1000 THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'admin账号禁止删除';
END IF
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
