-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS mosaic_contract;
-- 사용자 생성 및 권한 부여
CREATE USER IF NOT EXISTS 'contract'@'%' IDENTIFIED BY '608';
GRANT ALL PRIVILEGES ON mosaic_contract.* TO 'contract'@'%';
-- 권한 적용
FLUSH PRIVILEGES;


CREATE TABLE `loan` (
                        `id` INTEGER NOT NULL COMMENT '대출 식별자',
                        `account_id` INTEGER NOT NULL COMMENT '대표 계좌 식별자',
                        `evaluation_id` INTEGER NOT NULL COMMENT '신용평가 식별자',
                        `request_amount` DECIMAL NULL COMMENT '대출 원금',
                        `amount` DECIMAL NULL COMMENT '대출 원금 + 이자',
                        `due_date` DATE NULL COMMENT '대출 계약 만기일',
                        `status` ENUM('IN_PROGRESS', 'COMPLETED', 'PARTIALLY_DELINQUENT', 'DELINQUENT') COMMENT '대출 상태(진행 중, 완료, 연체(일부상환, 연체))',
                        `created_at` TIMESTAMP NULL COMMENT '대출 생성 일시',
                        PRIMARY KEY (`id`)
);

CREATE TABLE `investment` (
                              `id` INTEGER NOT NULL COMMENT '투자계좌 식별자',
                              `account_id` INTEGER NOT NULL COMMENT '계좌 식별자',
                              `target_rate` INTEGER NULL COMMENT '목표수익률_천분율',
                              `current_rate` INTEGER NULL COMMENT '현재 대차중인 금액에서의 수익률',
                              `amount` DECIMAL NULL COMMENT '복리로 누적되어 현재 빌려줄 수 있는 금액',
                              `due_date` DATE NULL COMMENT '만기일',
                              `created_at` TIMESTAMP NULL COMMENT '투자계좌 생성일시',
                              `principal` DECIMAL NULL COMMENT '원금',
                              PRIMARY KEY (`id`)
);


CREATE TABLE `contract` (
                            `id` INTEGER NOT NULL COMMENT '계약 식별자',
                            `loan_id` INTEGER NOT NULL COMMENT '대출 식별자',
                            `investment_id` INTEGER NOT NULL COMMENT '투자 식별자',
                            `status` ENUM('IN_PROGRESS', 'COMPLETED', 'DELINQUENT', 'OWNERSHIP_TRANSFERRED') NULL COMMENT '계약 상태(진행, 종료, 연체, 소유권 이전)',
                            `amount` DECIMAL NULL COMMENT '계약 금액',
                            `outstanding_amount` DECIMAL NULL COMMENT '계약 금액에서 아직 상환되지 않은 금액',
                            `paid_amount` DECIMAL NULL COMMENT '실제 상환된 금액',
                            `delinquency_margin_rate` INTEGER NULL COMMENT '연체시 가산금리',
                            `interest_rate` INTEGER NULL COMMENT '이자율',
                            `due_date` DATE NULL COMMENT '채권 만기일',
                            `created_at` DATETIME(6) NULL COMMENT '계약(채권) 생성 일시',
                            PRIMARY KEY (`id`),
                            CONSTRAINT `FK_contract_loan` FOREIGN KEY (`loan_id`) REFERENCES `loan`(`id`),
                            CONSTRAINT `FK_contract_investment` FOREIGN KEY (`investment_id`) REFERENCES `investment`(`id`)
);

CREATE TABLE `contract_transaction` (
                                        `id` INTEGER NOT NULL COMMENT '계약 거래내역 식별자',
                                        `contract_id` INTEGER NOT NULL COMMENT '계약 식별자',
                                        `amount` INTEGER NULL COMMENT '계약 거래금액',
                                        `type` ENUM('LOAN', 'INTEREST', 'PRINCIPAL', 'OWNERSHIP_TRANSFER') COMMENT '거래 유형(대출, 이자, 원금, 소유권 이전 등)',
                                        `created_at` TIMESTAMP NULL COMMENT '거래 일시',
                                        PRIMARY KEY (`id`),
                                        CONSTRAINT `FK_transaction_contract` FOREIGN KEY (`contract_id`) REFERENCES `contract`(`id`)
);