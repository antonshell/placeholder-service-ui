#!/usr/bin/env bash
# Smoke test of the production image: starts it as in deploy/compose.yml (read-only file system)
# and checks what Karma can't see: the prerendered pages, static files and their cache headers.
#
# Usage: .github/scripts/smoke-test.sh <image>
set -euo pipefail

IMAGE="${1:?usage: $0 <image>}"
NAME="placeholder-service-ui-smoke-$$"
PORT="${SMOKE_PORT:-18099}"
BASE="http://127.0.0.1:$PORT"
failures=0

cleanup() {
    if (( failures > 0 )); then
        echo "--- container logs ---"
        docker logs "$NAME" 2>&1 | tail -50 || true
    fi
    docker rm -f "$NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

check() { # check <description> <command...>
    local description="$1"; shift
    if "$@"; then
        echo "✅ $description"
    else
        echo "❌ $description"
        failures=$((failures + 1))
    fi
}

status_is() { # status_is <expected> <path>
    local actual
    actual="$(curl -s -o /dev/null -w '%{http_code}' "$BASE$2")"
    [[ "$actual" == "$1" ]] || { echo "   status: got $actual, expected $1"; return 1; }
}

header_is() { # header_is <path> <header> <expected value>
    local actual
    actual="$(curl -s -D - -o /dev/null "$BASE$1" | tr -d '\r' | grep -i "^$2:" | cut -d' ' -f2-)"
    [[ "$actual" == "$3" ]] || { echo "   $2: got '$actual', expected '$3'"; return 1; }
}

contains() { # contains <path> <text>
    curl -s "$BASE$1" | grep -qF "$2" || { echo "   '$2' not found in $1"; return 1; }
}

docker run -d --name "$NAME" --read-only --tmpfs /tmp -p "127.0.0.1:$PORT:8080" "$IMAGE" >/dev/null

# wait for the image's own HEALTHCHECK
health=starting
for _ in $(seq 1 30); do
    health="$(docker inspect -f '{{.State.Health.Status}}' "$NAME")"
    [[ "$health" == healthy ]] && break
    sleep 1
done
check "container is healthy" [ "$health" == healthy ]

# prerendered pages: the content is in the HTML, not only rendered by JavaScript
check "GET / → 200" status_is 200 /
check "GET / is prerendered" contains / '>Placeholder Service UI'
check "GET / uses the placeholder service" contains / 'https://placeholder.antonshell.me/img?'
check "GET /about → 200" status_is 200 /about
check "GET /about is prerendered" contains /about '>About'
check "pages are revalidated" header_is / Cache-Control no-cache
check "/about is revalidated" header_is /about Cache-Control no-cache
check "unknown route → 404" status_is 404 /this/route/does/not/exist

# hashed bundles referenced by the page
main_js="$(curl -s "$BASE/" | grep -o 'main-[A-Z0-9]*\.js' | head -1)"
styles_css="$(curl -s "$BASE/" | grep -o 'styles-[A-Z0-9]*\.css' | head -1)"
check "page references the main bundle" [ -n "$main_js" ]
check "main bundle → 200" status_is 200 "/$main_js"
check "main bundle is served as JavaScript" header_is "/$main_js" Content-Type "text/javascript; charset=utf-8"
check "hashed files are cached for a year" header_is "/$main_js" Cache-Control "public, max-age=31536000, immutable"
check "styles → 200" status_is 200 "/$styles_css"
check "styles are cached for a year" header_is "/$styles_css" Cache-Control "public, max-age=31536000, immutable"

check "/favicon.ico → 200" status_is 200 /favicon.ico
check "/favicon.ico is cached" header_is /favicon.ico Cache-Control "public, max-age=604800"

# only public/browser is in the image
check "SSR server bundle is not served" status_is 404 /server/server.mjs
check "build metadata is not served" status_is 404 /prerendered-routes.json

if (( failures > 0 )); then
    echo "Smoke test failed: $failures check(s)"
    exit 1
fi
echo "Smoke test passed"
