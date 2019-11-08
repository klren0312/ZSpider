/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : spider

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-11-08 16:49:09
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `apps`
-- ----------------------------
DROP TABLE IF EXISTS `apps`;
CREATE TABLE `apps` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `appName` varchar(255) NOT NULL,
  `ruleConfig` varchar(255) NOT NULL,
  `localId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of apps
-- ----------------------------
INSERT INTO `apps` VALUES ('1', 'test', '{\"config\":{\"chromePath\":\"C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe\",\"params\":[{\"name\":\"title\",\"param\":\".detailHead > .detailHead__title.fl.clearfix > p\",\"attr\":\"\",\"value\":\"\",\"dbParam\":\"\"},{\"name\":\"phone\",\"param\":\".infoDetail.fr > di', '52d13063-e14a-4402-bb71-8f37e8baab0c');
INSERT INTO `apps` VALUES ('2', 'house365南京1', '{\"config\":{\"chromePath\":\"C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe\",\"params\":[{\"name\":\"title\",\"param\":\"body > div:nth-child(5) > div.houseInformation.clearfix > div.left > div.titleT > h1\",\"attr\":\"\",\"value\":\"星火E方高新地铁口4.8米挑高办公火热招租\",\"', 'cd462d93-4904-4030-9025-af122c685f3b');
INSERT INTO `apps` VALUES ('3', 'house365应用', '{\"config\":{\"chromePath\":\"C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe\",\"params\":[{\"name\":\"title\",\"param\":\".detailHead > .detailHead__title.fl.clearfix > p\",\"attr\":\"\",\"value\":\"\",\"dbParam\":\"\"},{\"name\":\"phone\",\"param\":\".infoDetail.fr > di', '0d938118-08fd-43d5-aa55-8f51e6ee72fe');
