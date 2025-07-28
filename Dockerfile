# Dockerfile

# --- Stage 1: Builder ---
# Menggunakan base image Node.js resmi yang terbukti stabil
FROM node:20 AS builder

WORKDIR /app

# Salin SELURUH KODE APLIKASI terlebih dahulu
COPY . .

# Hapus node_modules SAJA
RUN set -eux; \
    echo "--- Cleaning up potential cached node_modules ---"; \
    rm -rf node_modules; \
    echo "--- Clean up completed ---"

# Instal dependensi sistem (openssl, curl, gzip)
USER root
RUN set -eux; \
    apt-get update; \
    apt-get install -y openssl curl gzip; \
    rm -rf /var/lib/apt/lists/*

# Set PRISMA_CLI_BINARY_TARGETS ke target yang benar untuk Debian OpenSSL 3.0.
ENV PRISMA_CLI_BINARY_TARGETS="debian-openssl-3.0.x"

# Instal dependensi Node.js secara bersih
RUN set -eux; \
    echo "--- Updating npm to latest version ---"; \
    npm install -g npm@latest; \
    echo "--- npm updated ---"; \
    \
    echo "--- Running npm ci (clean install) ---"; \
    npm ci; \
    echo "--- npm ci completed ---"; \
    \
    echo "--- Running npm rebuild ---"; \
    npm rebuild; \
    echo "--- npm rebuild completed ---"; \
    \
    echo "--- Verifying installed versions of autoprefixer and postcss ---"; \
    npm ls autoprefixer postcss || true; \
    echo "--- Autoprefixer and PostCSS modules verification completed ---"; \
    \
    echo "--- Verifying Prisma schema and client files ---"; \
    ls -l prisma/schema.prisma || true; \
    ls -l node_modules/@prisma/client/runtime/library.d.ts || true; \
    ls -l node_modules/.prisma/client/runtime/ || true; \
    echo "--- Prisma schema and client files verification completed ---"; \
    \
    # Mengubah kepemilikan direktori /app ke user 'node' di builder stage
    chown -R node:node /app; \
    echo "--- Ownership of /app changed to node user ---"

USER node

# Jalankan build produksi Next.js.
RUN set -eux; \
    echo "--- Starting Next.js build ---"; \
    npm run build; \
    echo "--- Next.js build completed ---"; \
    \
    # --- DIAGNOSTIK SETELAH BUILD (DI BUILDER) ---
    echo "--- Listing contents of /app/.next (recursive) after build ---"; \
    ls -laR /app/.next/ || true; \
    echo "--- Searching for server.js in /app/.next/standalone ---"; \
    find /app/.next/standalone -name "server.js" || true; \
    echo "--- Searching for server.js in /app ---"; \
    find /app -name "server.js" || true; \
    echo "--- DIAGNOSTIK END (DI BUILDER) ---"

# --- Stage 2: Runner ---
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PRISMA_CLI_BINARY_TARGETS="debian-openssl-3.0.x"

# Salin hasil build dari builder stage (ini akan dijalankan sebagai root secara default)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# --- DIAGNOSTIK KRUSIAL DI RUNNER SETELAH SEMUA COPY ---
RUN set -eux; \
    echo "--- Listing contents of /app in runner after ALL copies ---"; \
    ls -la /app/ || true; \
    echo "--- Searching for server.js in /app in runner after ALL copies ---"; \
    find /app -name "server.js" || true; \
    echo "--- DIAGNOSTIK END (DI RUNNER) ---"

# Set up non-root user for security and runtime
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Salin docker-entrypoint.sh dan berikan izin eksekusi SEBAGAI ROOT
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN ls -l /usr/local/bin/docker-entrypoint.sh

# Change ownership of /app to the non-root user
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
