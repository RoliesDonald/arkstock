#!/bin/sh
set -e

echo "--- Starting docker-entrypoint.sh ---"

# Diagnostik: Periksa direktori kerja saat ini
echo "Current working directory: $(pwd)"

# Diagnostik: Periksa apakah server.js ada di direktori kerja
echo "Checking for server.js in current directory:"
ls -la server.js || echo "server.js not found in current directory."

# Diagnostik: Periksa isi direktori /app
echo "Listing contents of /app:"
ls -la /app/ || true

# Diagnostik: Cari server.js di /app secara rekursif
echo "Searching for server.js in /app (recursive):"
find /app -name "server.js" || true

# Jika argumen pertama adalah "node", maka jalankan server Next.js
# Ini adalah cara standar untuk menjalankan Next.js standalone
if [ "$1" = "node" ]; then
  echo "Executing Next.js server with: node server.js"
  # Pastikan kita berada di direktori /app sebelum menjalankan node server.js
  cd /app
  exec node server.js
else
  # Jika tidak, jalankan perintah yang diberikan sebagai argumen
  echo "Executing command: $@"
  exec "$@"
fi

echo "--- Exiting docker-entrypoint.sh ---"
