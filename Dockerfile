# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=cache,id=vowly-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build the standalone Next.js server.
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN mkdir -p ./public

ARG NEXT_PUBLIC_APP_URL=http://localhost:3303
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN --mount=type=cache,id=vowly-next-cache,target=/app/.next/cache \
    pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3303 \
    HOSTNAME="0.0.0.0"

RUN apk add --no-cache libc6-compat \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3303

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3303/api/health >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
