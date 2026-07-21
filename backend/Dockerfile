# syntax=docker/dockerfile:1

# ---- deps (full, incl. devDependencies — used for the TS build) -----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# ---- build ------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- prod-deps (production-only node_modules for the runtime image) -------
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

# ---- runtime ----------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

# Migrations: the entrypoint runs `prisma migrate deploy` against DATABASE_URL
# before starting the server (see docker-entrypoint.sh). This keeps the
# top-level docker-compose.yml simple — the backend service just builds this
# image and runs it, no separate one-off migrate service/command is required.
# `prisma` is kept as a regular (non-dev) dependency specifically so its CLI
# survives `npm ci --omit=dev` and is available in this runtime image.
ENTRYPOINT ["./docker-entrypoint.sh"]
