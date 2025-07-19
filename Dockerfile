# Dockerfile

# --- Stage 1: Builder (Hanya untuk menyalin file yang sudah dibangun) ---
FROM node:20 AS builder 

WORKDIR /app

# Salin semua file dari host (termasuk node_modules, .next, prisma/, dll.)
# Ini mengasumsikan Anda sudah menjalankan npm install dan npm run build di host (WSL2)
COPY . . 

# --- Stage 2: Runner ---
FROM node:20-slim AS runner 

WORKDIR /app

# Salin semua yang sudah ada dari builder stage
COPY --from=builder /app ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

# Ini mungkin masih diperlukan untuk runtime Prisma Client
ENV PRISMA_FORCE_NAPI="true" 

EXPOSE 3000

# Mengubah CMD menjadi npm run start untuk menjalankan aplikasi Next.js yang sudah dibangun
CMD ["npm", "run", "start"]
