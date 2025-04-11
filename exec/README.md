#서비스 버전
- JVM = Amazone-Correto:jdk17
- kafka = bitnami/3.6
- zookeeper = 3.8
- nginx = 1.25
- db = mysql:8.0
- nosql = redis:7.2.0
- fastapi/modeling = python:3.9-slim
- docker-compose = 2.33.1

#IDE
- INTELLIJ
- VSCODE 
- CURSOR

#환경변수
환경변수.env = .ENV
- 일반 통합개발환경 백엔드/프론트엔드 = s.docker-compose.yml
- 일반 통합개발환경 모델링 = docker-compose.model.yml
- 프론트/백엔드 배포용 설정 = docker-compose.deploy.yml
- 모델링 배포용 설정 = docker-compose.deploy.yml

#배포 특이사항
- GITLAB-CI 를 통한 배포
- CI-CD파이프라인 Gitlab-runner사용 
- DOCKER-COMPOSE의 환경변수(GITLAB-CI 기반) 
- 배포용 DOCKER-COMPOSE파일 분리

