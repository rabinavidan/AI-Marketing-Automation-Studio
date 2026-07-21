# syntax=docker/dockerfile:1

# ---- deps ---------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# ---- build ----------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runtime ----------------------------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 4000

# NOTE on migrations: this image does NOT run migrations automatically.
# The chosen approach for this project is to run `npx prisma migrate deploy`
# as a one-off step from docker-compose (or CI/CD) BEFORE starting this
# container, e.g. in docker-compose.yml:
#
#   backend-migrate:
#     build: ./backend
#     command: npx prisma migrate deploy
#     depends_on: [postgres]
#   backend:
#     build: ./backend
#     command: node dist/main.js
#     depends_on: [backend-migrate]
#
# This keeps the container image simple (no entrypoint shell script) and
# avoids re-running migrations on every container restart/scale-out.
CMD ["node", "dist/main.js"]
