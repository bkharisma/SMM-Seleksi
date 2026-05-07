# SMMPTP — Seleksi Mandiri Masuk Politeknik Pariwisata Palembang

Sistem informasi pendaftaran, seleksi, dan manajemen peserta Seleksi Mandiri Masuk
Politeknik Pariwisata Palembang (SMMPTP).

## Teknologi

| Layer      | Tech                          |
|------------|-------------------------------|
| Backend    | Laravel 13, PHP 8.3+          |
| Frontend   | React 19 + TypeScript (Inertia SPA) |
| SSR        | Inertia SSR + Vite (Node)     |
| Database   | MySQL / MariaDB (`smm_poltekpar`) |
| Auth       | Laravel Sanctum (cookie SPA)  |
| RBAC       | Spatie Laravel Permission     |
| UI         | Tailwind CSS 4 + Material Symbols |
| Excel      | Maatwebsite/Laravel-Excel      |
| QR Code    | SimpleSoftwareIO               |
| Testing    | Pest PHP                       |
| Payments   | BSI Virtual Account (sandbox/production) |

## Prasyarat

- PHP 8.3+
- Node.js 20+
- MySQL / MariaDB
- Composer 2

## Setup Development

```bash
# Clone
git clone <repo-url> && cd seleksi

# Install
composer install
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database (pastikan DB_DATABASE, DB_USERNAME, DB_PASSWORD di .env sudah benar)
php artisan migrate --seed

# Build frontend + jalankan SSR development
npm run build
composer run dev
```

> `composer run dev` menjalankan 4 proses secara paralel: `php artisan serve`,
> `php artisan queue:listen`, `php artisan pail` (log viewer), dan `npm run dev` (Vite + SSR hot reload).

## Akun Default

| Role        | Username     | Password   |
|-------------|-------------|------------|
| Superadmin  | superadmin  | password   |
| Admin       | admin       | password   |
| Operator    | operator    | password   |
| Mahasiswa   | (terdaftar via registrasi publik) | `ddmmyyyy` (format tanggal lahir) |

## Halaman Publik

| URL               | Deskripsi                     |
|-------------------|-------------------------------|
| `/`               | Portal home / beranda         |
| `/registrasi`     | Form pendaftaran peserta baru |
| `/login`          | Login admin/operator          |
| `/login-member`   | Login peserta (NUP + password)|
| `/forgot-password`| Lupa password admin           |
| `/kelulusan`      | Cek pengumuman kelulusan      |
| `/verifikasi/{noujian}` | Verifikasi peserta via QR   |

## Struktur Direktori

```
app/
├── Http/Controllers/
│   ├── Admin/           # Admin panel (dashboard, CRUD, seleksi, nilai, referensi, …)
│   ├── Api/             # API referensi (kabupaten, prodi)
│   ├── Auth/            # Login, forgot/reset password
│   ├── Callback/        # BSI payment callback
│   ├── Member/          # Member dashboard, profile, dokumen
│   └── Public/          # Portal, registrasi, kelulusan
├── Models/              # Eloquent models
├── Services/            # Business logic (SelectionService, ExamNumberService)
├── Exports/             # Excel exports (PendaftarTemplate, NilaiExport, Prodi/Jalur ref)
├── Imports/             # Excel imports (PendaftarImport, NilaiImport)
├── Mail/                # Mailables
└── Pdf/                 # PDF generators (kartu peserta, profil)

database/
├── migrations/
└── seeders/             # RolePermission, Setup, Prodi, Ujian, AdminUser, Survey, …

resources/js/
├── components/          # layout/, ui/ (DataTable, Modal, Button, Card, Alert, …)
├── pages/               # auth/, admin/, member/, public/
└── types/               # Global Inertia shared types

routes/
├── web.php              # Public + admin + member + API routes
└── …

tests/
├── Unit/
└── Feature/
```

## Roles & Permissions

| Role        | Deskripsi                                         |
|-------------|---------------------------------------------------|
| superadmin  | Full access semua modul (settings, users, …)      |
| admin       | Manajemen data master, pendaftar, seleksi, dokumen |
| operator    | Absensi, jadwal, input & upload nilai             |
| mahasiswa   | Dashboard pribadi, upload dokumen, cek kelulusan  |

## Fitur Utama

### Admin Panel (`/admin`)

| Menu          | Sub-menu                                      |
|---------------|-----------------------------------------------|
| Dashboard     | Statistik pendaftar, chart, notifikasi        |
| Data Master   | Prodi, Periode, Ruang, Jadwal, Jenis Ujian, Tahap Seleksi, Sumber Informasi, Jenjang Pendidikan, Jalur Pendaftaran |
| Konten        | Berita, Dokumen                               |
| Pendaftar     | List, import/export Excel, kartu, generate No. Ujian, upload foto |
| Dokumen       | Verifikasi Raport, Verifikasi Kesehatan        |
| Seleksi       | Kriteria Kelulusan, Nilai Ujian, **Seleksi**, Rekap Kelulusan, **Referensi**, Absensi |
| Pengaturan    | Setup aplikasi                                |
| Users         | Manajemen user admin/operator (superadmin only)|

### Bulk Delete Nilai
Di halaman `Nilai Ujian > Kelola Nilai` tersedia 2 tombol merah di kanan toolbar:
- **Hapus Terpilih** — centang baris lalu klik tombol
- **Hapus Semua** — modal konfirmasi ketik "YA" untuk menghapus seluruh nilai ujian tersebut

### Template Upload Pendaftar
Download template menghasilkan Excel 3 sheet:
1. **Template Import Pendaftar** — format isian (NUP, nama, prodi, jalur, …)
2. **Referensi Prodi** — daftar kode & nama prodi yang tersedia
3. **Referensi Jalur Pendaftaran** — daftar kode & nama jalur pendaftaran

### Fitur Referensi (Override Lulus)
Halaman **Seleksi > Referensi** memungkinkan admin menandai peserta sebagai "Referensi"
(`is_referensi`). Peserta yang ditandai akan **otomatis lulus** pada proses seleksi
tanpa memperhitungkan nilai ujian. Terdapat catatan opsional untuk setiap penandaan.

### Excel Import
Pendaftar dan Nilai Ujian dapat di-import via Excel (`.xlsx`, `.xls`, `.csv`).
- Import pendaftar menggunakan `updateOrCreate` berdasarkan `kode_pendaftar`
- Import nilai mendukung kolom dinamis sesuai `fields_config` pada jenis ujian
- Error import ditampilkan dan tersedia download error report

### Kartu Peserta
Peserta yang telah memiliki No. Ujian dapat mencetak kartu peserta (PDF)
lengkap dengan QR code untuk verifikasi.

## Menjalankan Tests

```bash
php artisan test

# Spesifik suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Via Pest CLI
./vendor/bin/pest
./vendor/bin/pest tests/Unit/
./vendor/bin/pest tests/Feature/

# Filter test
./vendor/bin/pest --filter=nama_test
```

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

Email dikirim melalui queue database. Queue worker otomatis berjalan dengan `composer run dev`.

## Konfigurasi BSI Virtual Account

```env
BSI_CLIENT_ID=
BSI_SECRET_KEY=
BSI_API_URL=https://sandbox.api.bpi.co.id/ext/bnis/
BSI_ENVIRONMENT=sandbox
```

Di environment `local` dan `testing`, BSI VA menggunakan response mock tanpa koneksi API BSI live.

**Callback webhook:** `POST /api/callback/bsi` (tanpa CSRF protection).

## Deployment

```bash
npm run build
php artisan optimize
php artisan migrate --force
php artisan queue:restart
```

---

Proprietary — Politeknik Pariwisata Palembang
