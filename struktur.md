├── README.md
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.local
├── public/
│   ├── images/
│   │   └── logo.png
│   └── favicon.ico
│
├── src/
│   ├── app/                                    # Folder utama untuk Next.js App Router
│   │   ├── (admin)/                            # Grouping rute untuk Super Admin
│   │   │   ├── admin-dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── users/                          # Pengelolaan pengguna global
│   │   │   │   ├── page.tsx
│   │   │   │   └── [userId]/                   # Detail pengguna berdasarkan ID (dinamis)
│   │   │   │       └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (auth)/                             # Grouping rute untuk otentikasi
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (main)/                             # Grouping rute untuk halaman utama aplikasi (role lain)
│   │   │   ├── app-dashboard/                      # Dashboard umum (bisa disesuaikan per role)
│   │   │   │   └── page.tsx
│   │   │   ├── bengkel/                        # Modul untuk pengelolaan daftar BENGKEL (plural)
│   │   │   │   ├── page.tsx                    # Halaman daftar semua bengkel
│   │   │   │   └── [bengkelId]/                # Dynamic Route untuk detail satu BENGKEL
│   │   │   │       ├── page.tsx                # Dashboard/Overview untuk bengkel spesifik
│   │   │   │       ├── layout.tsx              # Layout khusus untuk halaman dalam satu bengkel
│   │   │   │       ├── bagian-gudang/
│   │   │   │       │   └── page.tsx            # Halaman Gudang untuk bengkel ini
│   │   │   │       ├── bagian-finance/
│   │   │   │       │   └── page.tsx            # Halaman Finance untuk bengkel ini
│   │   │   │       ├── bagian-operasional/
│   │   │   │       │   └── page.tsx            # Halaman Operasional untuk bengkel ini
│   │   │   │       ├── mekanik/
│   │   │   │       │   └── page.tsx            # Halaman manajemen mekanik untuk bengkel ini
│   │   │   │       └── laporan/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   ├── customer/                       # Modul untuk pengelolaan CUSTOMER (perusahaan rental & customernya)
│   │   │   │   ├── page.tsx                    # Halaman overview/dashboard Customer
│   │   │   │   ├── perusahaan-rental/          # Modul untuk daftar PERUSAHAAN RENTAL (plural)
│   │   │   │   │   ├── page.tsx                # Halaman daftar semua perusahaan rental
│   │   │   │   │   └── [rentalCompanyId]/      # Dynamic Route untuk detail satu PERUSAHAAN RENTAL
│   │   │   │   │       ├── page.tsx            # Dashboard/Overview untuk perusahaan rental ini
│   │   │   │   │       ├── layout.tsx          # Layout khusus untuk halaman dalam satu perusahaan rental
│   │   │   │   │       ├── bagian-operasional/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── bagian-finance/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── laporan/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       └── customer-list/      # Daftar customer dari perusahaan rental ini
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   └── customer-perusahaan-rental/ # Modul untuk detail CUSTOMER DARI PERUSAHAAN RENTAL (plural)
│   │   │   │       ├── page.tsx                # Halaman daftar semua customer (global, atau bisa diintegrasikan dengan [rentalCompanyId])
│   │   │   │       └── [customerId]/           # Dynamic Route untuk detail satu CUSTOMER
│   │   │   │           ├── page.tsx            # Dashboard/Overview untuk customer spesifik
│   │   │   │           ├── layout.tsx
│   │   │   │           ├── bagian-operasional/
│   │   │   │           │   └── page.tsx
│   │   │   │           └── driver/
│   │   │   │               └── page.tsx        # Halaman terkait driver untuk customer ini
│   │   │   │
│   │   │   │   └── layout.tsx                  # Layout umum untuk semua halaman Customer
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                                # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── route.ts
│   │   │   │   └── [nextauth]/route.ts         # Untuk NextAuth.js
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [userId]/route.ts
│   │   │   ├── bengkel/
│   │   │   │   ├── route.ts                    # API untuk daftar/buat bengkel
│   │   │   │   └── [bengkelId]/                # API untuk satu bengkel spesifik
│   │   │   │       ├── route.ts                # GET, PUT, DELETE bengkel
│   │   │   │       ├── gudang/route.ts
│   │   │   │       └── operasional/route.ts
│   │   │   ├── customer/
│   │   │   │   ├── perusahaan-rental/
│   │   │   │   │   ├── route.ts                # API untuk daftar/buat perusahaan rental
│   │   │   │   │   └── [rentalCompanyId]/
│   │   │   │   │       ├── route.ts
│   │   │   │   │       ├── operasional/route.ts
│   │   │   │   │       └── finance/route.ts
│   │   │   │   └── customer-perusahaan-rental/
│   │   │   │       ├── route.ts                # API untuk daftar/buat customer perusahaan rental
│   │   │   │       └── [customerId]/
│   │   │   │           ├── route.ts
│   │   │   │           └── driver/route.ts
│   │   │   └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── specific/
│   │       ├── BengkelCard.tsx                 # Komponen kartu untuk daftar bengkel
│   │       ├── RentalCompanyCard.tsx           # Komponen kartu untuk daftar perusahaan rental
│   │       └── CustomerDetailPanel.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── hooks.ts
│   │
│   ├── types/
│   │   ├── index.d.ts
│   │   ├── user.d.ts
│   │   ├── bengkel.d.ts                        # Definisi tipe untuk entitas Bengkel
│   │   ├── rentalCompany.d.ts                  # Definisi tipe untuk entitas Perusahaan Rental
│   │   └── customerRental.d.ts                 # Definisi tipe untuk entitas Customer Perusahaan Rental
│   │
│   ├── styles/
│   │   └── main.scss
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   └── services/
│       ├── authService.ts
│       ├── bengkelService.ts                   # Service untuk interaksi API Bengkel
│       ├── rentalCompanyService.ts             # Service untuk interaksi API Perusahaan Rental
│       └── customerRentalService.ts            # Service untuk interaksi API Customer Perusahaan Rental


superadmin@arkstok.com
passwordaman123

    # docker-compose.dev.yml
    # Hapus baris 'version: '3.8'' dari sini

    # Mengimpor konfigurasi dasar dari docker-compose.yml
    services:
      app:
        image: node:20 
        
        build:
          context: .
          dockerfile: Dockerfile
        
        entrypoint: /bin/sh -c "/app/docker-entrypoint.sh && exec npm run dev -- -H 0.0.0.0 -p 3000" 
        
        environment:
          NODE_ENV: development
          DATABASE_URL: "postgresql://arkstokuser:arkstokpassword@db:5432/arkstokdb?schema=public"
          JWT_SECRET: "eN3dY6qPzXk9Tj8H2f5mB4xL7sR0vC1aQ2uW7yF0bVpL6zJ5cK8oI7hG9pM0qY1rX2wZ3xV1yT4xY7hF0cK9oP6tQ2wZ3xV1yT4xY7hF0cK9"
          HOST: 0.0.0.0
          PORT: 3000
          # PRISMA_CLI_BINARY_TARGETS: "linux-musl" 
        
        volumes:
          - .:/app
          - /app/.next 

    

    #!/bin/sh

# Ini adalah script entrypoint untuk kontainer pengembangan.
# Ini akan memastikan dependensi diinstal, Prisma Client digenerate,
# dan cache Next.js dibersihkan sebelum memulai aplikasi.

echo "--- Cleaning up .next directory ---"
rm -rf .next # <--- PERUBAHAN DI SINI: Hapus folder .next
echo "--- .next directory cleaned ---"

echo "--- Running npm install (in container) ---"
npm install
echo "--- npm install completed (in container) ---"

echo "--- Running npx prisma generate (in container) ---"
npx prisma generate
echo "--- npx prisma generate completed (in container) ---"

# Jalankan perintah utama yang diteruskan ke entrypoint (yaitu "npm run dev -- -H 0.0.0.0 -p 3000")
exec "$@"


docker compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache



docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d



docker compose exec app sh -c "npx prisma migrate dev --name add_employee_position_enum"



docker compose exec app sh -c "npm run seed"