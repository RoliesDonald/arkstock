# Dockerfile

# --- Stage 1: Builder ---
FROM node:20 AS builder 

WORKDIR /app

# Salin package.json dan lock files terlebih dahulu untuk memanfaatkan Docker layer caching
# Ini memastikan dependensi diinstal hanya jika package.json atau lock file berubah
COPY package.json yarn.lock* package-lock.json* ./

# Salin semua file sumber aplikasi lainnya
# Ini harus dilakukan SETELAH menyalin package.json tetapi SEBELUM npm install
# agar semua file yang dibutuhkan untuk build tersedia.
COPY . . 

# Instal dependensi sistem yang diperlukan (openssl, curl, gzip)
# Fedora menggunakan dnf, tetapi image Node.js berbasis Debian/Ubuntu, jadi apt masih benar.
RUN set -eux && apt-get update && apt-get install -y openssl curl gzip && rm -rf /var/lib/apt/lists/*

# Instal dependensi Node.js
# Perintah ini akan memicu "postinstall" script (npx prisma generate)
RUN set -eux && \
    echo "--- Running npm install ---" && \
    npm install --frozen-lockfile && \
    echo "--- npm install completed ---"

# Jalankan build produksi Next.js
# Ini akan menghasilkan folder .next yang dioptimalkan
RUN set -eux && \
    echo "--- Running npm run build ---" && \
    npm run build && \
    echo "--- npm run build completed ---"

# --- Stage 2: Runner ---
FROM node:20-slim AS runner 

WORKDIR /app

# Salin hanya artefak yang diperlukan dari builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 

# Konfigurasi variabel lingkungan
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

# Prisma Client yang digenerate akan tahu di mana menemukan engine-nya.
# ENV PRISMA_FORCE_NAPI="true" # Ini tidak selalu diperlukan di runner stage jika build berhasil

EXPOSE 3000

# Perintah untuk menjalankan aplikasi Next.js dalam mode produksi
CMD ["npm", "run", "start"]
