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