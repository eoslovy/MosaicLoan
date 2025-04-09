
FROM node:22 AS builder
WORKDIR /app
RUN npm install -g pnpm
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CREDIT_WEBSOCKET_URL
ENV NEXT_PUBLIC_CREDIT_WEBSOCKET_URL=$NEXT_PUBLIC_CREDIT_WEBSOCKET_URL

# 의존성 캐시를 위한 최소 COPY
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm format
RUN pnpm lint

RUN pnpm build:static || (echo "❌ React build failed" && exit 1)
FROM alpine AS react-static
WORKDIR /dist
COPY --from=builder /app/out ./  
# 이 라인에서 오류가 나면 build 폴더가 없는 것
