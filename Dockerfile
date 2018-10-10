FROM alpine:3.7 AS SystemOS
RUN apk update \
	&& apk add --update nodejs nodejs-npm \
    && npm install pm2 -g \
    && apk add --update bash && rm -rf /var/cache/apk/* \
    && apk add --no-cache yarn

FROM SystemOS AS NgInx
RUN apk add openrc nginx --no-cache \
    && adduser -D -g 'www' www \
    && mkdir /www \
    && chown -R www:www /var/lib/nginx \
    && chown -R www:www /www \
    && mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig \
    && mkdir -p /run/nginx
COPY './nginx.conf' '/etc/nginx/nginx.conf'
RUN nginx -t
EXPOSE 8080

FROM SystemOS as build
COPY ./ /app-build
WORKDIR /app-build
RUN yarn
RUN yarn build:prod

FROM NgInx
COPY --from=build './app-build/build' /app
RUN rm -rf /app/public
COPY --from=build './app-build/build/public' ./www
COPY --from=build './app-build/package.json' /app
COPY --from=build './app-build/.env' /app/.env
COPY ./container.start.sh ./app/container.start.sh
WORKDIR /app
RUN yarn install --production
CMD ["sh", "container.start.sh"]
