FROM python:3.9-slim

# 기본 시스템 및 빌드 도구 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openjdk-17-jre \
    procps \
    build-essential \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# pip 업그레이드
RUN pip install --upgrade pip setuptools wheel

# 패키지를 그룹별로 설치 (의존성 충돌 방지)
# 기본 데이터 과학 패키지
RUN pip install --no-cache-dir numpy==1.24.3 pandas==2.2.3 scipy==1.9.3 gdown pymysql

# 머신러닝 패키지
RUN pip install --no-cache-dir scikit-learn==1.6.1 

# API 관련 패키지 라인을 다음과 같이 수정
RUN pip install --no-cache-dir pydantic==2.4.2 python-multipart==0.0.6 fastapi uvicorn boto3 python-dotenv

# NLP 및 딥러닝 패키지 (의존성이 많은 패키지)
RUN pip install --no-cache-dir gensim==4.0.1
RUN pip install --no-cache-dir konlpy==0.6.0
RUN pip install --no-cache-dir torch==2.6.0
RUN pip install --no-cache-dir transformers==4.50.1


# 애플리케이션 코드 복사
COPY . .

# 실행 스크립트 권한 부여
RUN chmod +x /app/scripts/entrypoint.sh

# 포트 노출
EXPOSE 8002

# 환경 변수 설정
ENV PYTHONPATH=/app

# 실행
ENTRYPOINT ["/app/scripts/entrypoint.sh"]