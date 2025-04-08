FROM bitnami/kafka:3.6

ENV KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
    ALLOW_PLAINTEXT_LISTENER=yes
EXPOSE 9092

ENTRYPOINT ["/opt/bitnami/scripts/kafka/entrypoint.sh"]
CMD ["/opt/bitnami/scripts/kafka/run.sh"]