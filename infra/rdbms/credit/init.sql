-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS mosaic_credit;
-- 사용자에게 권한 부여
CREATE USER IF NOT EXISTS 'credit'@'%' IDENTIFIED BY '608';
GRANT ALL PRIVILEGES ON mosaic_credit.* TO 'credit'@'%';
-- 권한 적용
FLUSH PRIVILEGES;