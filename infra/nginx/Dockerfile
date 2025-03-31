FROM nginx:1.25

RUN rm -rf /usr/share/nginx/html/*

COPY --from=mosaic/frontend:deploy /dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
