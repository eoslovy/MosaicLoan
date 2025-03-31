
FROM node:22 AS builder
WORKDIR /app
RUN npm install -g pnpm
# COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm install
# 빌드 실패 시 로그를 강제 출력
RUN pnpm lint
RUN pnpm build || (echo "❌ React build failed" && exit 1)
FROM alpine AS react-static
WORKDIR /dist
COPY --from=builder /app/out ./  
# 이 라인에서 오류가 나면 build 폴더가 없는 것
