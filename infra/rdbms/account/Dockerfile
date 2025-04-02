FROM mysql:8.0
# MySQL 초기화 스크립트를 컨테이너에 복사
COPY init.sql /docker-entrypoint-initdb.d/
# 환경 변수 설정 (Kubernetes Secret 또는 ConfigMap과 호환) 
EXPOSE 3306

VOLUME ["/var/lib/mysql"]
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost || exit 1
