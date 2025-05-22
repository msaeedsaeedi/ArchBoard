FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune backend --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm turbo build --filter=backend...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/dist /app/dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/backend/package.json /app/

# Install production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod

USER nestjs

EXPOSE 3000
CMD ["node", "dist/main.js"]