FROM mysql:8.0

# 환경 변수 설정 (Kubernetes Secret 또는 ConfigMap과 호환) 
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=mosaic_contract
ENV MYSQL_USER=contract
ENV MYSQL_PASSWORD=608
EXPOSE 3306

VOLUME ["/var/lib/mysql"]
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost || exit 1
