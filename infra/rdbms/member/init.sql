-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS mosaic_member;
-- 사용자 생성 및 권한 부여
GRANT ALL PRIVILEGES ON mosaic_member.* TO 'member'@'%';

-- 권한 적용
FLUSH PRIVILEGES;