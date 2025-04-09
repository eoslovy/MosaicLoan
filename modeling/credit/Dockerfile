FROM python:3.9-slim

# Java 설치 (PySpark에 필요)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openjdk-17-jre \
    procps \
    && rm -rf /var/lib/apt/lists/* \
    && java -version

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 직접 설치
RUN pip install fastapi uvicorn pyspark==3.5.5 pydantic python-dotenv numpy tensorflow pandas

# 애플리케이션 코드 복사
COPY . .

# 실행 스크립트에 실행 권한 부여
RUN chmod +x /app/scripts/entrypoint.sh

# 포트 노출
EXPOSE 8001

# 환경 변수 설정
ENV PYTHONPATH=/app
ENV _JAVA_OPTIONS="-Xmx12g -Xms4g"

# 실행
ENTRYPOINT ["/app/scripts/entrypoint.sh"]