FROM mysql:8.0

EXPOSE 3306

VOLUME ["/var/lib/mysql"]
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD mysqladmin ping -h localhost || exit 1
