#!/bin/bash
set -e

# Spark 관련 환경 변수 설정
export PYTHONPATH=$PYTHONPATH:/app
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# FastAPI 서버 실행
exec uvicorn app.main:app --host 0.0.0.0 --port 8001 --workers 4