FROM amazoncorretto:17 AS builder

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew

RUN ./gradlew clean build -x test


FROM amazoncorretto:17


WORKDIR /app

# builder에서 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "-Xms512m", "-Xmx512m", "app.jar"]