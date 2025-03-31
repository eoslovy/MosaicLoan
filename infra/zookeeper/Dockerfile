FROM bitnami/zookeeper:3.8

ENV ALLOW_ANONYMOUS_LOGIN=yes \
    ZOO_PORT_NUMBER=2181
EXPOSE 2181

ENTRYPOINT ["/opt/bitnami/scripts/zookeeper/entrypoint.sh"]
CMD ["/opt/bitnami/scripts/zookeeper/run.sh"]
