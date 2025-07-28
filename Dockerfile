# Dockerfile

# --- Stage 1: Builder ---
# Menggunakan base image Node.js resmi yang terbukti stabil
FROM node:20 AS builder

WORKDIR /app

# Salin SELURUH KODE APLIKASI terlebih dahulu
# Ini memastikan semua file yang dibutuhkan (termasuk prisma/schema.prisma, package.json, package-lock.json, postcss.config.mjs)
# ada sebelum instalasi dependensi, termasuk script postinstall Prisma.
COPY . .

# Hapus node_modules SAJA
# Ini untuk memastikan instalasi benar-benar bersih sambil tetap mempertahankan package-lock.json
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
# Gunakan npm ci untuk instalasi yang konsisten berdasarkan package-lock.json
# Tambahkan npm rebuild untuk memastikan semua dependensi (terutama yang mungkin memiliki komponen biner) dibangun kembali untuk lingkungan kontainer.
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
    # KUNCI DIAGNOSTIK: Verifikasi versi autoprefixer dan postcss yang terinstal
    echo "--- Verifying installed versions of autoprefixer and postcss ---"; \
    npm ls autoprefixer postcss || true; \
    echo "--- Autoprefixer and PostCSS modules verification completed ---"; \
    \
    # Verifikasi Prisma client files
    echo "--- Verifying Prisma schema and client files ---"; \
    ls -l prisma/schema.prisma || true; \
    ls -l node_modules/@prisma/client/runtime/library.d.ts || true; \
    ls -l node_modules/.prisma/client/runtime/ || true; \
    echo "--- Prisma schema and client files verification completed ---"; \
    \
    # Mengubah kepemilikan direktori /app ke user 'node'
    chown -R node:node /app; \
    echo "--- Ownership of /app changed to node user ---"

# Kembali ke user non-root 'node' untuk langkah-langkah berikutnya
USER node

# Jalankan build produksi Next.js.
RUN set -eux; \
    echo "--- Starting Next.js build ---"; \
    npm run build; \
    echo "--- Next.js build completed ---"; \
    \
    # --- DIAGNOSTIK KRUSIAL SETELAH BUILD ---
    echo "--- Listing contents of /app/.next after build ---"; \
    ls -la /app/.next/ || true; \
    echo "--- Listing contents of /app/.next/standalone after build ---"; \
    ls -la /app/.next/standalone/ || true; \
    echo "--- Listing contents of /app/.next/static after build ---"; \
    ls -la /app/.next/static/ || true; \
    echo "--- Searching for 'standalone' directory in /app ---"; \
    find /app -name "standalone" || true; \
    echo "--- DIAGNOSTIK END ---"

# --- Stage 2: Runner ---
# Menggunakan base image Node.js resmi yang sama untuk konsistensi
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV production
# Set PRISMA_CLI_BINARY_TARGETS di runner juga.
ENV PRISMA_CLI_BINARY_TARGETS="debian-openssl-3.0.x"

# Salin hasil build dari builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Salin node_modules dari builder stage (penting untuk standalone)
COPY --from=builder /app/node_modules /app/node_modules
# Salin package.json dan package-lock.json (jika diperlukan oleh runtime)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN ls -l /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
