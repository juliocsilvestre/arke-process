FROM node:21-slim AS builder

WORKDIR /builder

RUN npm i -g bun

COPY package.json .
COPY bun.lockb .

RUN npm pkg delete scripts.prepare
RUN bun install

COPY . .

ARG host_ip

ENV VITE_API_URL=http://$host_ip:8080/v1

RUN bun run build


FROM nginx AS app

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /builder/dist /usr/share/nginx/html

COPY /scripts/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
