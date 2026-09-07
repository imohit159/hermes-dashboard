FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y npm && npm install -g pnpm@9
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["pnpm", "start"]
