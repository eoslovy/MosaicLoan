#!/bin/bash
set -e

# Spark 관련 환경 변수 설정
export PYTHONPATH=$PYTHONPATH:/app

# Java 경로 설정 (Windows 호스트에서도 동작하도록 수정)
if [ -f /usr/lib/jvm/java-17-openjdk-amd64/bin/java ]; then
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
else
    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
fi
echo "JAVA_HOME set to: $JAVA_HOME"

# FastAPI 서버 실행
exec uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 1