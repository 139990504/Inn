/*
 Navicat Premium Data Transfer

 Source Server         : 测试开发环境
 Source Server Type    : MySQL
 Source Server Version : 50557
 Source Host           : app.rysuo.com:3306
 Source Schema         : cms

 Target Server Type    : MySQL
 Target Server Version : 50557
 File Encoding         : 65001

 Date: 01/03/2019 09:39:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for think_class
-- ----------------------------
DROP TABLE IF EXISTS `think_class`;
CREATE TABLE `think_class` (
  `id` tinyint(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '班名',
  `depart_id` int(11) DEFAULT NULL COMMENT '院系id',
  `depart_name` varchar(50) DEFAULT NULL COMMENT '院系名',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `f_depart_id` (`depart_id`),
  CONSTRAINT `f_depart_id` FOREIGN KEY (`depart_id`) REFERENCES `think_depart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='班别';

-- ----------------------------
-- Records of think_class
-- ----------------------------
BEGIN;
INSERT INTO `think_class` VALUES (1, '软件081', 1, NULL, '');
INSERT INTO `think_class` VALUES (2, '微机082', 1, NULL, '');
INSERT INTO `think_class` VALUES (3, '电商083', 2, NULL, '');
COMMIT;

-- ----------------------------
-- Table structure for think_depart
-- ----------------------------
DROP TABLE IF EXISTS `think_depart`;
CREATE TABLE `think_depart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '院系名',
  `remark` text COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='院系';

-- ----------------------------
-- Records of think_depart
-- ----------------------------
BEGIN;
INSERT INTO `think_depart` VALUES (1, '计算机系', '软件硬件学院', NULL, NULL);
INSERT INTO `think_depart` VALUES (2, '财经系', '经济学、财务、会计', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for think_stu
-- ----------------------------
DROP TABLE IF EXISTS `think_stu`;
CREATE TABLE `think_stu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '姓名',
  `sex` varchar(10) NOT NULL COMMENT '性别',
  `birth` date NOT NULL COMMENT '出生年月',
  `class_id` int(11) NOT NULL COMMENT '班别id',
  `score` int(10) NOT NULL DEFAULT '0' COMMENT '修得学分',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10005 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='学生信息表';

-- ----------------------------
-- Records of think_stu
-- ----------------------------
BEGIN;
INSERT INTO `think_stu` VALUES (10001, '沈**', '男', '1989-01-03', 1, 9);
INSERT INTO `think_stu` VALUES (10002, '汤**', '男', '1989-01-01', 2, 9);
INSERT INTO `think_stu` VALUES (10003, '邹**', '男', '1988-02-01', 2, 9);
INSERT INTO `think_stu` VALUES (10004, '余*', '男', '1989-03-01', 3, 9);
COMMIT;

-- ----------------------------
-- Table structure for think_stu_score
-- ----------------------------
DROP TABLE IF EXISTS `think_stu_score`;
CREATE TABLE `think_stu_score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stu_id` int(11) NOT NULL COMMENT '学生id',
  `sub_id` int(11) DEFAULT NULL COMMENT '科目id',
  `score` tinyint(5) DEFAULT '0' COMMENT '考分',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `stu_name` varchar(30) DEFAULT NULL,
  `sub_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='科目考试成绩表';

-- ----------------------------
-- Records of think_stu_score
-- ----------------------------
BEGIN;
INSERT INTO `think_stu_score` VALUES (1, 10001, 1, 5, '2019-01-03 02:11:52', '2019-01-03 02:11:56', '沈华军', NULL);
COMMIT;

-- ----------------------------
-- Table structure for think_subject
-- ----------------------------
DROP TABLE IF EXISTS `think_subject`;
CREATE TABLE `think_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '课程名',
  `code` varchar(50) DEFAULT NULL COMMENT '课程代码',
  `score` tinyint(5) DEFAULT '1' COMMENT '学分',
  `remark` varchar(50) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='科目';

-- ----------------------------
-- Records of think_subject
-- ----------------------------
BEGIN;
INSERT INTO `think_subject` VALUES (1, '操作系统', '10290', 8, NULL, '2019-01-03 02:09:56', '2019-01-03 02:09:59');
INSERT INTO `think_subject` VALUES (2, 'Java程序设计', '89201', 9, NULL, '2019-01-03 02:10:29', '2019-01-03 02:10:32');
INSERT INTO `think_subject` VALUES (3, '微机接口原理', '27899', 5, NULL, '2019-01-03 02:10:53', '2019-01-03 02:10:55');
INSERT INTO `think_subject` VALUES (4, '计算机网络', '88799', 6, NULL, '2019-01-03 10:58:55', '2019-01-03 10:58:58');
COMMIT;

-- ----------------------------
-- Table structure for think_user
-- ----------------------------
DROP TABLE IF EXISTS `think_user`;
CREATE TABLE `think_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` int(10) DEFAULT NULL COMMENT '1表示班主任，0表示年级主任',
  `class` int(10) DEFAULT NULL,
  `grade` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of think_user
-- ----------------------------
BEGIN;
INSERT INTO `think_user` VALUES (1, '徐教授', 'e10adc3949ba59abbe56e057f20f883e', 1, 0, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
