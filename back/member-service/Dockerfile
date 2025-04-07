FROM gradle:7.4-jdk17 AS build

WORKDIR /app

COPY . .
RUN chmod +x ./gradlew

RUN ./gradlew clean build -x test

FROM gradle:7.4-jdk17 AS test

WORKDIR /app

COPY --from=build /app .

RUN ./gradlew test

FROM amazoncorretto:17-alpine AS run

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
#
ENV SPRING_SECURITY_ENABLED=false
ENV MANAGEMENT_SECURITY_ENABLED=false
ENV SPRING_SECURITY_FILTER_DISPATCHER_TYPES=none
ENV SPRING_SECURITY_FILTER_ORDER=-2147483648

ENTRYPOINT ["java", "-jar", "-Xms512m", "-Xmx512m", \
            "-Dspring.security.enabled=false", \
            "-Dmanagement.security.enabled=false", \
            "-Dspring.security.filter.dispatcher-types=none", \
            "-Dspring.security.filter.order=-2147483648", \
            "app.jar"]