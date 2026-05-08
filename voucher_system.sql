-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 08, 2026 lúc 01:05 PM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `voucher_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `created_at`) VALUES
(1, 'Nguyen Van A', 'a@gmail.com', '0901234567', '2026-05-08 14:22:48'),
(2, 'Tran Thi B', 'b@gmail.com', '0912345678', '2026-05-08 14:22:48'),
(3, 'Lê Văn C', 'vanC@gmail.com', '0398765432', '2026-05-08 12:07:16'),
(4, 'Le Thi C', 'c@gmail.com', '0923456789', '2026-05-08 15:00:00'),
(5, 'Pham Van D', 'd@gmail.com', '0934567890', '2026-05-08 15:01:00'),
(6, 'Hoang Thi E', 'e@gmail.com', '0945678901', '2026-05-08 15:02:00'),
(7, 'Ngo Van F', 'f@gmail.com', '0956789012', '2026-05-08 15:03:00'),
(8, 'Vu Thi G', 'g@gmail.com', '0967890123', '2026-05-08 15:04:00'),
(9, 'Dinh Van H', 'h@gmail.com', '0978901234', '2026-05-08 15:05:00'),
(10, 'Ly Thi I', 'i@gmail.com', '0989012345', '2026-05-08 15:06:00'),
(11, 'Trinh Van K', 'k@gmail.com', '0990123456', '2026-05-08 15:07:00'),
(12, 'Bui Thi L', 'l@gmail.com', '0901123456', '2026-05-08 15:08:00'),
(13, 'Do Van M', 'm@gmail.com', '0912234567', '2026-05-08 15:09:00'),
(14, 'Ho Thi N', 'n@gmail.com', '0923345678', '2026-05-08 15:10:00'),
(15, 'Duong Van O', 'o@gmail.com', '0934456789', '2026-05-08 15:11:00'),
(16, 'Truong Thi P', 'p@gmail.com', '0945567890', '2026-05-08 15:12:00'),
(17, 'Phan Van Q', 'q@gmail.com', '0956678901', '2026-05-08 15:13:00'),
(18, 'Nguyen Thi R', 'r@gmail.com', '0967789012', '2026-05-08 15:14:00'),
(19, 'Tran Van S', 's@gmail.com', '0978890123', '2026-05-08 15:15:00'),
(20, 'Le Thi T', 't@gmail.com', '0989901234', '2026-05-08 15:16:00'),
(21, 'Pham Van U', 'u@gmail.com', '0990012345', '2026-05-08 15:17:00'),
(22, 'Hoang Thi V', 'v@gmail.com', '0901223456', '2026-05-08 15:18:00'),
(23, 'Ngo Van X', 'x@gmail.com', '0912334567', '2026-05-08 15:19:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `discount_percent` int NOT NULL,
  `quantity` int NOT NULL,
  `expired_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_voucher_status` (`status`),
  KEY `idx_voucher_expired_date` (`expired_date`)
) ;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount_percent`, `quantity`, `expired_date`, `status`, `created_at`) VALUES
(1, 'SALE10', 10, 99, '2026-12-31', 'ACTIVE', '2026-05-08 14:22:48'),
(2, 'SALE50', 50, 10, '2026-12-31', 'ACTIVE', '2026-05-08 14:22:48'),
(3, 'TEST', 100, 100, '2026-05-15', 'ACTIVE', '2026-05-08 12:17:24'),
(4, 'SUMMER15', 15, 200, '2026-08-31', 'ACTIVE', '2026-05-08 15:00:00'),
(5, 'SUMMER20', 20, 149, '2026-08-31', 'ACTIVE', '2026-05-08 15:00:00'),
(6, 'WELCOME5', 5, 500, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(7, 'VIP30', 30, 50, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(8, 'FLASH40', 40, 20, '2026-05-15', 'ACTIVE', '2026-05-08 15:00:00'),
(9, 'FREESHIP', 100, 300, '2026-06-30', 'ACTIVE', '2026-05-08 15:00:00'),
(10, 'BIRTHDAY25', 25, 100, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(11, 'WEEKEND10', 10, 200, '2026-05-10', 'ACTIVE', '2026-05-08 15:00:00'),
(12, 'PAYDAY20', 20, 150, '2026-05-25', 'ACTIVE', '2026-05-08 15:00:00'),
(13, 'NEWYEAR50', 50, 10, '2027-01-01', 'ACTIVE', '2026-05-08 15:00:00'),
(14, 'BLACKFRIDAY', 70, 50, '2026-11-27', 'ACTIVE', '2026-05-08 15:00:00'),
(15, 'CYBERMONDAY', 60, 50, '2026-11-30', 'ACTIVE', '2026-05-08 15:00:00'),
(16, 'MEMBER15', 15, 500, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(17, 'APPONLY20', 20, 300, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(18, 'FIRSTBUY', 10, 1000, '2026-12-31', 'ACTIVE', '2026-05-08 15:00:00'),
(19, 'TET2027', 30, 200, '2027-02-10', 'ACTIVE', '2026-05-08 15:00:00'),
(20, 'HALFWAY', 15, 100, '2026-07-01', 'ACTIVE', '2026-05-08 15:00:00'),
(21, 'NIGHTOWL', 25, 50, '2026-05-09', 'ACTIVE', '2026-05-08 15:00:00'),
(22, 'EARLYBIRD', 20, 50, '2026-05-09', 'ACTIVE', '2026-05-08 15:00:00'),
(23, 'STUDENT10', 10, 500, '2026-09-30', 'ACTIVE', '2026-05-08 15:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher_usages`
--

DROP TABLE IF EXISTS `voucher_usages`;
CREATE TABLE IF NOT EXISTS `voucher_usages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `voucher_id` bigint NOT NULL,
  `used_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_voucher_usages_voucher` (`voucher_id`),
  KEY `idx_usage_used_at` (`used_at`),
  KEY `idx_user_time` (`user_id`,`used_at`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher_usages`
--

INSERT INTO `voucher_usages` (`id`, `user_id`, `voucher_id`, `used_at`) VALUES
(1, 1, 1, '2026-05-01 10:00:00'),
(2, 2, 2, '2026-05-02 14:30:00'),
(3, 1, 2, '2026-05-05 09:15:00'),
(4, 2, 1, '2026-05-08 12:06:49'),
(5, 3, 4, '2026-05-08 16:00:00'),
(6, 4, 3, '2026-05-08 16:05:00'),
(7, 5, 5, '2026-05-08 16:10:00'),
(8, 6, 6, '2026-05-08 16:15:00'),
(9, 7, 7, '2026-05-08 16:20:00'),
(10, 8, 8, '2026-05-08 16:25:00'),
(11, 9, 9, '2026-05-08 16:30:00'),
(12, 10, 10, '2026-05-08 16:35:00'),
(13, 11, 11, '2026-05-08 16:40:00'),
(14, 12, 12, '2026-05-08 16:45:00'),
(15, 13, 13, '2026-05-08 16:50:00'),
(16, 14, 14, '2026-05-08 16:55:00'),
(17, 15, 15, '2026-05-08 17:00:00'),
(18, 16, 16, '2026-05-08 17:05:00'),
(19, 17, 17, '2026-05-08 17:10:00'),
(20, 18, 18, '2026-05-08 17:15:00'),
(21, 19, 19, '2026-05-08 17:20:00'),
(22, 20, 20, '2026-05-08 17:25:00'),
(23, 21, 21, '2026-05-08 17:30:00'),
(24, 22, 22, '2026-05-08 17:35:00'),
(25, 4, 5, '2026-05-08 13:03:23');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `voucher_usages`
--
ALTER TABLE `voucher_usages`
  ADD CONSTRAINT `fk_voucher_usages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_voucher_usages_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
