# SMMPTP - Seleksi Mandiri Masuk Politeknik Pariwisata Palembang

Sistem informasi pendaftaran, seleksi, dan manajemen peserta Seleksi Mandiri Masuk Politeknik Pariwisata Palembang (SMMPTP).

## Teknologi

- **Backend**: Laravel 13, PHP 8.4
- **Frontend**: React 19 + TypeScript via Inertia.js (SPA)
- **Database**: MySQL/MariaDB (`smm_poltekpar`)
- **Authentication**: Laravel Sanctum (SPA cookie-based)
- **Authorization**: Spatie Laravel Permission
- **UI**: Tailwind CSS 4
- **Pembayaran**: BSI Virtual Account (sandbox/production configurable)
- **Testing**: Pest PHP

## Prasyarat

- PHP 8.3+
- Node.js 20+
- MySQL/MariaDB 5.7+
- Composer

## Setup Development

```bash
# Clone dan masuk ke direktori
cd laravel-smm

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=smm_poltekpar
# DB_USERNAME=root
# DB_PASSWORD=yourpassword

# Jalankan migrasi dan seeder
php artisan migrate --seed

# Build frontend
npm run build

# Jalankan development server
composer run dev
```

## Akun Default

| Role | Username | Password |
|------|----------|----------|
| Superadmin | superadmin | password |
| Admin | admin | password |
| Operator | operator | password |

## Struktur Direktori Utama

```
app/
├── Http/Controllers/   # Controller per modul
├── Models/             # Eloquent Models
├── Services/           # Business logic
├── Exports/            # Excel exports
├── Imports/            # Excel imports
├── Mail/               # Mailables
└── Pdf/                # PDF generators
database/
├── migrations/         # Database migrations
└── seeders/            # Database seeders
resources/js/           # React frontend (TypeScript)
routes/                 # Web, API, console routes
tests/                  # Pest PHP tests
```

## Roles & Permissions

| Role | Deskripsi |
|------|-----------|
| `superadmin` | Full access semua modul |
| `admin` | Manajemen data master & peserta |
| `operator` | Manajemen PTP, absensi, jadwal, input nilai |
| `mahasiswa` | Lihat status, upload dokumen, cek kelulusan |

## Menjalankan Tests

```bash
# Semua tests
php artisan test

# Unit tests saja
php artisan test --testsuite=Unit

# Feature tests saja
php artisan test --testsuite=Feature

# Menggunakan Pest
./vendor/bin/pest
./vendor/bin/pest tests/Unit/
./vendor/bin/pest tests/Feature/
```

## Konfigurasi BSI Virtual Account

Tambahkan di `.env`:

```env
BSI_CLIENT_ID=
BSI_SECRET_KEY=
BSI_API_URL=https://sandbox.api.bpi.co.id/ext/bnis/
BSI_ENVIRONMENT=sandbox
```

Di environment `local` dan `testing`, BSI VA menggunakan mock response tanpa koneksi ke API BSI.

## Konfigurasi Email

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=youremail@gmail.com
MAIL_FROM_NAME="SMMPTP Poltekpar Palembang"
```

Email dikirim melalui queue. Pastikan queue worker berjalan:

```bash
php artisan queue:work
```

## Deployment

```bash
# Production build
npm run build

# Optimize
php artisan optimize

# Jalankan migrasi
php artisan migrate --force

# Restart queue worker
php artisan queue:restart
```

## BSI Callback Webhook

**URL:** `POST /api/callback/bsi`

Endpoint ini menerima callback pembayaran dari BSI setelah pembayaran VA dilakukan. CSRF protection dinonaktifkan untuk endpoint ini.

Response sukses:
```json
{
  "statusCode": "2000000",
  "statusMessage": "Success"
}
```

## License

Proprietary - Politeknik Pariwisata Palembang
