FROM mysql:8.0

# 환경 변수 설정 (Kubernetes Secret 또는 ConfigMap과 호환) 
EXPOSE 3306

VOLUME ["/var/lib/mysql"]
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost || exit 1
