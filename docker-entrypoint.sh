#!/bin/sh

# Ini adalah script entrypoint untuk kontainer pengembangan.
# Ini akan memastikan dependensi diinstal dan Prisma Client digenerate.

# KUNCI PERBAIKAN: Hapus seluruh folder node_modules untuk instalasi yang benar-benar bersih.
echo "--- Cleaning up node_modules directory ---"
rm -rf node_modules
echo "--- node_modules directory cleaned ---"

echo "--- Running npm install --force (in container) ---"
npm install --force # <--- TAMBAHKAN --force DI SINI
echo "--- npm install completed (in container) ---"

echo "--- Running npx prisma generate --force (in container) ---"
npx prisma generate --force # <--- PASTIKAN --force JUGA ADA DI SINI
echo "--- npx prisma generate completed (in container) ---"

# Jalankan perintah utama yang diteruskan ke entrypoint (yaitu "npm run dev -- -H 0.0.0.0 -p 3000")
exec "$@"
