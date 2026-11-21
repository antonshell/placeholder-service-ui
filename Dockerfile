# syntax=docker/dockerfile:1
#
# Targets:
#   dev   — local development (docker compose up): ng serve + Chromium for Karma tests, code is bind-mounted
#   prod  — production image (default target): the prerendered app served as static files by Caddy
#
# Every route (/ and /about) is prerendered at build time, so production needs no Node.js server:
# only public/browser/ goes into the image.

# Node 20: the newest version Angular 17 supports
ARG NODE_IMAGE=node:20-bookworm-slim

# ---------- Dev ----------
FROM ${NODE_IMAGE} AS dev

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium \
    && rm -rf /var/lib/apt/lists/*

# Writable home for the npm cache when running as an arbitrary UID (see `user:` in docker-compose.yml)
ENV CHROME_BIN=/usr/bin/chromium \
    HOME=/tmp \
    NG_CLI_ANALYTICS=false

WORKDIR /app

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# ---------- Build (Angular: src/ -> public/browser/) ----------
FROM ${NODE_IMAGE} AS build

ENV NG_CLI_ANALYTICS=false

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY angular.json tsconfig.json tsconfig.app.json server.ts ./
COPY src ./src
RUN npx ng build

# ---------- Prod (default target — keep it last) ----------
FROM caddy:2-alpine AS prod

COPY <<EOF /etc/caddy/Caddyfile
{
	# static files only: no admin API, TLS is terminated by the external Caddy
	admin off
	auto_https off
	persist_config off
}

:8080 {
	root * /srv

	# Angular output with a content hash in the file name: a changed file always gets a new URL.
	@hashed path_regexp -[A-Z0-9]{8}\.(js|css)$
	header @hashed Cache-Control "public, max-age=31536000, immutable"

	# Prerendered pages: always revalidate, so a deploy is visible immediately.
	@pages path / /about /about/ *.html
	header @pages Cache-Control "no-cache"

	@icons path /favicon.ico
	header @icons Cache-Control "public, max-age=604800"

	header -Server

	# /about -> /about/index.html
	try_files {path} {path}/index.html
	file_server
}
EOF

COPY --from=build /app/public/browser /srv

RUN addgroup -S app \
    && adduser -S -G app -H app \
    && chown -R app:app /data /config

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
