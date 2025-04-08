-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS mosaic_mydata;
CREATE USER IF NOT EXISTS 'mydata'@'%' IDENTIFIED BY '608';
-- 사용자 생성 및 권한 부여
GRANT ALL PRIVILEGES ON mosaic_mydata.* TO 'mydata'@'%';

-- 권한 적용
FLUSH PRIVILEGES;