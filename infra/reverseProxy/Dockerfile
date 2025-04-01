FROM nginx:alpine

# Let's Encrypt 인증서 경로를 올바르게 설정
COPY /certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY /certs/privkey.pem /etc/ssl/private/privkey.pem

# Nginx 설정 파일을 컨테이너에 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx 실행 ubuntu@ip-172-26-11-124:~$ docker run -d -p 80:80 -p 443:443 recreatekang/nginx-reverse-proxy:latest
CMD ["nginx", "-g", "daemon off;"]
