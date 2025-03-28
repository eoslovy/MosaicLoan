FROM python:3.9-slim

# Java 설치 (PySpark에 필요)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    default-jre \
    procps \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# Poetry 설치
RUN pip install poetry

# Poetry 가상환경을 사용하지 않도록 설정
RUN poetry config virtualenvs.create false

# 종속성 파일 복사 및 설치
COPY pyproject.toml poetry.lock* ./
# 명령어에 --no-root 옵션 추가 (중요!)
RUN pip install fastapi uvicorn pyspark==3.5.5 pydantic python-dotenv numpy
# 애플리케이션 코드 복사
COPY . .

# 모델 디렉토리 생성
RUN mkdir -p models/gbt_model

# 실행 스크립트에 실행 권한 부여
RUN chmod +x /app/scripts/entrypoint.sh

# 포트 노출
EXPOSE 8000

# 환경 변수 설정
ENV MODEL_PATH=/app/models/gbt_model
ENV PYTHONPATH=/app

# 실행
ENTRYPOINT ["/app/scripts/entrypoint.sh"]