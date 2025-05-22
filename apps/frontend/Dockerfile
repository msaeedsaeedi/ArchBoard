FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune frontend --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=frontend...

FROM nginx:alpine AS runner
COPY --from=installer /app/apps/frontend/dist/frontend/browser /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]