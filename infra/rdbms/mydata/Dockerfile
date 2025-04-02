FROM mysql:8.0
COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 3306
# 데이터 지속성 유지
VOLUME ["/var/lib/mysql"]
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost || exit 1
