# syntax=docker/dockerfile:1

# ----------------------------------------------------------------- deps
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts pula o `prepare` (husky), que não faz sentido na imagem.
RUN npm ci --ignore-scripts

# ---------------------------------------------------------------- build
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variáveis NEXT_PUBLIC_* são embutidas no build.
ARG NEXT_PUBLIC_APP_URL=http://localhost:3001
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npm run build

# --------------------------------------------------------------- runner
# Só o servidor standalone e os assets estáticos: sem node_modules completo.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app

EXPOSE 3001
# API_URL é lida em runtime: aponte para a API NestJS.
CMD ["node", "server.js"]
