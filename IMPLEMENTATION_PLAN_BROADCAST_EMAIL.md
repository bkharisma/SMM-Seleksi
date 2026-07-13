# Implementation Plan: Broadcast Email ke Calon Mahasiswa Lulus

## Overview

Membuat fitur broadcast email untuk mengirim email massal kepada pendaftar yang berstatus lulus (`lulus IS NOT NULL`), dengan dukungan:

- Subject, body (HTML + variabel personalisasi), dan multiple attachments
- Filter penerima berdasarkan Prodi Lulus
- Dynamic recipient count (update real-time saat filter berubah)
- Database logging untuk tracking status pengiriman
- Pengiriman via Gmail SMTP melalui queue
- Akses khusus role `superadmin`
- Riwayat pengiriman di halaman yang sama dengan form

---

## Keputusan Desain

| Aspek | Keputusan |
|-------|-----------|
| Personalisasi body | Ya, dukung variabel `{nama}`, `{kode_pendaftar}`, `{prodi_lulus}` |
| Filter penerima | Filter per Prodi Lulus (dengan opsi "Semua Prodi") |
| Log pengiriman | Database table `email_broadcast_logs` |
| Jumlah attachment | Multiple files (maks 5 file, max 10MB/file) |
| Akses role | `superadmin` saja |
| Dynamic count | Ya, update via API saat filter prodi berubah |
| Halaman log | Cukup di halaman yang sama dengan form |

---

## Tahap 1: Konfigurasi Gmail SMTP

**File**: `.env`

Ubah konfigurasi email dari `log` menjadi `smtp` dengan kredensial Gmail:

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

### Prasyarat Gmail

1. Aktifkan **2-Step Verification** di akun Gmail
2. Buat **App Password** di Google Account > Security > App Passwords
3. Gunakan App Password tersebut (bukan password Gmail biasa)

### Limit Gmail

- Free Gmail: ~500 email/hari
- Google Workspace: ~2000 email/hari
- Job menambahkan throttle 0.5 detik per email untuk menghindari rate limit

---

## Tahap 2: Database Migration & Model

### 2.1 Migration

**File baru**: `database/migrations/2026_07_13_000001_create_email_broadcast_logs_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_broadcast_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftar_id')->constrained('pendaftar')->cascadeOnDelete();
            $table->string('email');
            $table->string('subject');
            $table->text('body');
            $table->json('attachments')->nullable();
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('pendaftar_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_broadcast_logs');
    }
};
```

### 2.2 Model

**File baru**: `app/Models/EmailBroadcastLog.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmailBroadcastLog extends Model
{
    use HasFactory;

    protected $table = 'email_broadcast_logs';

    protected $fillable = [
        'pendaftar_id',
        'email',
        'subject',
        'body',
        'attachments',
        'status',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'attachments' => 'array',
        'sent_at' => 'datetime',
    ];

    public function pendaftar()
    {
        return $this->belongsTo(Pendaftar::class);
    }
}
```

---

## Tahap 3: Mailable Class

**File baru**: `app/Mail/BroadcastEmail.php`

Mengikuti pola `app/Mail/PaymentConfirmed.php` dan `app/Mail/RegistrationConfirmed.php`.

```php
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BroadcastEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subject,
        public string $body,
        public array $attachmentPaths = []
    ) {}

    public function build(): static
    {
        $mail = $this->subject($this->subject)->html($this->body);

        foreach ($this->attachmentPaths as $path) {
            if (file_exists($path)) {
                $mail->attach($path);
            }
        }

        return $mail;
    }
}
```

### Key Decisions

- Menggunakan `->html($body)` karena body diinput user sebagai HTML/teks
- Body sudah diproses (variabel personalisasi sudah diganti) sebelum dikirim ke Mailable
- Attachment paths adalah absolute path ke file di storage

---

## Tahap 4: Queued Job

Directory `app/Jobs/` belum ada dan perlu dibuat.

**File baru**: `app/Jobs/SendBroadcastEmail.php`

```php
<?php

namespace App\Jobs;

use App\Mail\BroadcastEmail;
use App\Models\EmailBroadcastLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendBroadcastEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public array $logIds,
        public string $originalBody,
        public array $attachmentPaths
    ) {}

    public function handle(): void
    {
        $logs = EmailBroadcastLog::with('pendaftar.lulusProdi')
            ->whereIn('id', $this->logIds)
            ->get();

        foreach ($logs as $log) {
            $pendaftar = $log->pendaftar;

            // Substitusi variabel personalisasi
            $body = str_replace(
                ['{nama}', '{kode_pendaftar}', '{prodi_lulus}'],
                [
                    $pendaftar->nama ?? '-',
                    $pendaftar->kode_pendaftar ?? '-',
                    $pendaftar->lulusProdi?->nama_prodi ?? '-',
                ],
                $this->originalBody
            );

            try {
                Mail::to($log->email)->send(new BroadcastEmail(
                    $log->subject,
                    $body,
                    $this->attachmentPaths
                ));

                $log->update([
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (\Exception $e) {
                $log->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);

                Log::error('Broadcast email failed', [
                    'log_id' => $log->id,
                    'email' => $log->email,
                    'error' => $e->getMessage(),
                ]);
            }

            // Throttle: jeda 0.5 detik antar email untuk menghindari Gmail rate limit
            usleep(500000);
        }

        // Cleanup attachment files setelah batch selesai
        $this->cleanupAttachments();
    }

    private function cleanupAttachments(): void
    {
        foreach ($this->attachmentPaths as $path) {
            if (file_exists($path)) {
                @unlink($path);
            }
        }

        // Hapus direktori batch jika kosong
        if (!empty($this->attachmentPaths)) {
            $dir = dirname($this->attachmentPaths[0]);
            if (is_dir($dir)) {
                $remaining = array_diff(scandir($dir), ['.', '..']);
                if (empty($remaining)) {
                    @rmdir($dir);
                }
            }
        }
    }
}
```

### Key Decisions

- Menggunakan `Mail::to()->send()` langsung (bukan `->queue()`) karena job ini sudah berjalan di queue
- Throttle 0.5 detik per email untuk menghormati Gmail sending limits
- Error per penerima tidak menghentikan batch - lanjut ke penerima berikutnya
- Attachment di-cleanup setelah seluruh batch selesai
- Load `pendaftar.lulusProdi` relationship untuk substitusi variabel `{prodi_lulus}`

---

## Tahap 5: Service Layer

**File baru**: `app/Services/BroadcastEmailService.php`

Mengikuti pola `app/Services/PaymentService.php` dan `app/Services/SelectionService.php`.

```php
<?php

namespace App\Services;

use App\Jobs\SendBroadcastEmail;
use App\Models\EmailBroadcastLog;
use App\Models\Pendaftar;
use App\Models\Prodi;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class BroadcastEmailService
{
    /**
     * Hitung jumlah penerima berdasarkan filter prodi.
     */
    public function getRecipientCount(?int $prodiId = null): int
    {
        return Pendaftar::whereNotNull('lulus')
            ->when($prodiId, fn($q) => $q->where('lulus', $prodiId))
            ->count();
    }

    /**
     * Daftar prodi yang memiliki pendaftar lulus (untuk dropdown filter).
     */
    public function getProdiWithLulus(): Collection
    {
        $prodiIds = Pendaftar::whereNotNull('lulus')
            ->distinct()
            ->pluck('lulus');

        return Prodi::whereIn('id', $prodiIds)
            ->orderBy('nama_prodi')
            ->get(['id', 'nama_prodi', 'kode_prodi']);
    }

    /**
     * Proses pengiriman broadcast email.
     */
    public function send(string $subject, string $body, array $attachments, ?int $prodiId = null): array
    {
        // 1. Query penerima
        $pendaftarList = Pendaftar::whereNotNull('lulus')
            ->when($prodiId, fn($q) => $q->where('lulus', $prodiId))
            ->with('lulusProdi')
            ->get();

        if ($pendaftarList->isEmpty()) {
            return [
                'success' => false,
                'message' => 'Tidak ada pendaftar lulus yang ditemukan.',
            ];
        }

        // 2. Simpan attachments ke storage
        $attachmentPaths = [];
        $attachmentNames = [];
        $batchDir = 'broadcast-attachments/' . now()->format('Ymd_His');

        foreach ($attachments as $file) {
            $filename = $file->getClientOriginalName();
            $path = $file->storeAs($batchDir, $filename, 'local');
            $attachmentPaths[] = storage_path('app/private/' . $path);
            $attachmentNames[] = $filename;
        }

        // 3. Buat log entries (status pending) untuk setiap penerima
        $logIds = [];
        foreach ($pendaftarList as $pendaftar) {
            $log = EmailBroadcastLog::create([
                'pendaftar_id' => $pendaftar->id,
                'email' => $pendaftar->email,
                'subject' => $subject,
                'body' => $body,
                'attachments' => $attachmentNames,
                'status' => 'pending',
            ]);
            $logIds[] = $log->id;
        }

        // 4. Dispatch job
        SendBroadcastEmail::dispatch($logIds, $body, $attachmentPaths);

        return [
            'success' => true,
            'message' => "Broadcast email dijadwalkan untuk {$pendaftarList->count()} penerima.",
            'recipient_count' => $pendaftarList->count(),
        ];
    }

    /**
     * Riwayat broadcast untuk ditampilkan di halaman.
     */
    public function getRecentLogs(int $limit = 50): Collection
    {
        return EmailBroadcastLog::with('pendaftar:id,nama,kode_pendaftar')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
```

### Key Decisions

- Attachment disimpan di `storage/app/private/broadcast-attachments/{timestamp}/` (disk `local`, tidak publik)
- Log entries dibuat sebelum dispatch job, sehingga status `pending` langsung terlihat di UI
- Variabel personalisasi disimpan di `body` log sebagai template original, substitusi dilakukan di job saat pengiriman
- `getProdiWithLulus()` hanya mengembalikan prodi yang benar-benar memiliki pendaftar lulus

---

## Tahap 6: Controller

**File baru**: `app/Http/Controllers/Admin/BroadcastEmailController.php`

Mengikuti pola `app/Http/Controllers/Admin/SeleksiController.php`.

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BroadcastEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BroadcastEmailController extends Controller
{
    public function __construct(
        protected BroadcastEmailService $broadcastEmailService
    ) {}

    /**
     * Tampilkan form broadcast email + riwayat.
     */
    public function index(Request $request): Response
    {
        $prodiList = $this->broadcastEmailService->getProdiWithLulus();
        $totalRecipients = $this->broadcastEmailService->getRecipientCount();
        $logs = $this->broadcastEmailService->getRecentLogs();

        return Inertia::render('admin/broadcast-email/index', [
            'prodiList' => $prodiList,
            'totalRecipients' => $totalRecipients,
            'logs' => $logs,
            'filters' => $request->only(['prodi_id']),
        ]);
    }

    /**
     * API: Hitung jumlah penerima berdasarkan filter prodi.
     */
    public function count(Request $request): JsonResponse
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $count = $this->broadcastEmailService->getRecipientCount($prodiId);

        return response()->json(['count' => $count]);
    }

    /**
     * Proses kirim broadcast email.
     */
    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|max:10240',
            'prodi_id' => 'nullable|exists:prodi,id',
        ]);

        $result = $this->broadcastEmailService->send(
            $validated['subject'],
            $validated['body'],
            $validated['attachments'] ?? [],
            $validated['prodi_id'] ?? null,
        );

        if ($result['success']) {
            return redirect()->route('admin.broadcast-email.index')
                ->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }
}
```

### Validasi Rules

| Field | Rule | Keterangan |
|-------|------|------------|
| `subject` | `required\|string\|max:255` | Subject email, wajib diisi |
| `body` | `required\|string` | Body email (HTML diperbolehkan), wajib diisi |
| `attachments` | `nullable\|array\|max:5` | Maksimal 5 file |
| `attachments.*` | `file\|max:10240` | Masing-masing file maksimal 10MB |
| `prodi_id` | `nullable\|exists:prodi,id` | Filter prodi, opsional |

---

## Tahap 7: Routes

**Edit**: `routes/web.php`

### 7.1 Tambahkan Import

Di bagian atas file (sekitar line 1-41), tambahkan:

```php
use App\Http\Controllers\Admin\BroadcastEmailController;
```

### 7.2 Tambahkan Routes Admin

Di dalam group `Route::middleware(['role:superadmin'])` (sekitar line 189-247), tambahkan:

```php
// Broadcast Email
Route::get('/broadcast-email', [BroadcastEmailController::class, 'index'])->name('broadcast-email.index');
Route::post('/broadcast-email/send', [BroadcastEmailController::class, 'send'])->name('broadcast-email.send');
```

### 7.3 Tambahkan Route API

Di dalam group `Route::middleware(['auth'])->prefix('api')` (sekitar line 285-289), tambahkan:

```php
Route::get('/admin/broadcast-email/count', [BroadcastEmailController::class, 'count'])
    ->middleware('role:superadmin')
    ->name('broadcast-email.count');
```

### Struktur Route Final

| Method | URI | Name | Middleware | Deskripsi |
|--------|-----|------|------------|-----------|
| GET | `/admin/broadcast-email` | `admin.broadcast-email.index` | auth + superadmin | Halaman form + riwayat |
| POST | `/admin/broadcast-email/send` | `admin.broadcast-email.send` | auth + superadmin | Proses kirim email |
| GET | `/api/admin/broadcast-email/count` | `broadcast-email.count` | auth + superadmin | API hitung penerima |

---

## Tahap 8: Frontend - React Page

**File baru**: `resources/js/pages/admin/broadcast-email/index.tsx`

Mengikuti pola yang ada di `resources/js/pages/admin/news/form.tsx` dan `resources/js/pages/admin/seleksi/index.tsx`.

### Struktur Page

```
AdminLayout
+-- Head: "Broadcast Email"
+-- Alert (flash success/error)
+-- Card: "Buat Broadcast Email"
|   +-- Select: Filter Prodi Lulus (opsional, default "Semua Prodi")
|   +-- Info Box: "Email akan dikirim ke {recipientCount} penerima" (dynamic)
|   +-- Input: Subject
|   +-- Textarea: Body Email
|   |   +-- Hint: "Variabel: {nama}, {kode_pendaftar}, {prodi_lulus}"
|   +-- File Upload: Multiple attachments
|   |   +-- List file terpilih + tombol hapus per file
|   +-- Button: "Kirim Email" (dengan confirm dialog)
+-- Card: "Riwayat Pengiriman"
    +-- DataTable: Penerima | Subject | Status (badge) | Dikirim Pada | Error
```

### Implementasi Lengkap

```tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Props {
    prodiList: Array<{ id: number; nama_prodi: string; kode_prodi: string }>;
    totalRecipients: number;
    logs: Array<{
        id: number;
        email: string;
        subject: string;
        status: 'pending' | 'sent' | 'failed';
        error_message: string | null;
        sent_at: string | null;
        created_at: string;
        pendaftar: { nama: string; kode_pendaftar: string } | null;
    }>;
    filters?: { prodi_id?: string };
}

export default function BroadcastEmailIndex({
    prodiList,
    totalRecipients,
    logs,
    filters,
}: Props) {
    const { flash } = usePage().props as any;
    const [showAlert, setShowAlert] = useState(false);
    const [recipientCount, setRecipientCount] = useState(totalRecipients);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [prodiId, setProdiId] = useState(filters?.prodi_id || '');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Flash alert
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Dynamic recipient count - fetch via API saat prodi filter berubah
    useEffect(() => {
        const params = prodiId ? `?prodi_id=${prodiId}` : '';
        fetch(`/api/admin/broadcast-email/count${params}`)
            .then((res) => res.json())
            .then((data) => setRecipientCount(data.count))
            .catch(() => {});
    }, [prodiId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !confirm(
                `Kirim email ke ${recipientCount} pendaftar lulus? Pastikan semua data sudah benar.`
            )
        ) {
            return;
        }

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('body', body);
        if (prodiId) formData.append('prodi_id', prodiId);
        selectedFiles.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        setProcessing(true);
        setErrors({});

        router.post('/admin/broadcast-email/send', formData, {
            forceFormData: true,
            onSuccess: () => {
                setSubject('');
                setBody('');
                setSelectedFiles([]);
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const statusVariant = (status: string) => {
        switch (status) {
            case 'sent':
                return 'success';
            case 'failed':
                return 'error';
            default:
                return 'warning';
        }
    };

    return (
        <AdminLayout title="Broadcast Email">
            <Head title="Broadcast Email" />

            {showAlert && flash?.success && (
                <Alert variant="success">{flash.success}</Alert>
            )}
            {showAlert && flash?.error && (
                <Alert variant="error">{flash.error}</Alert>
            )}

            {/* Form Card */}
            <Card title="Buat Broadcast Email">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Filter Prodi */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            Filter Prodi Lulus
                        </label>
                        <Select
                            value={prodiId}
                            onChange={(e) => setProdiId(e.target.value)}
                        >
                            <option value="">Semua Prodi</option>
                            {prodiList.map((prodi) => (
                                <option key={prodi.id} value={prodi.id}>
                                    {prodi.nama_prodi} ({prodi.kode_prodi})
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Info Box - Dynamic Recipient Count */}
                    <div className="rounded-lg bg-primary-container px-4 py-3 text-on-primary-container">
                        <span className="material-symbols-outlined text-lg align-middle mr-2">
                            info
                        </span>
                        Email akan dikirim ke{' '}
                        <strong>{recipientCount}</strong> pendaftar lulus
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            Subject Email *
                        </label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Masukkan subject email"
                        />
                        {errors.subject && (
                            <p className="text-error text-sm mt-1">{errors.subject}</p>
                        )}
                    </div>

                    {/* Body */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            Body Email *
                        </label>
                        <Textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={10}
                            placeholder="Masukkan isi email. Mendukung HTML dasar."
                        />
                        <p className="text-xs text-secondary mt-1">
                            Variabel yang tersedia:{' '}
                            <code>{'{nama}'}</code>,{' '}
                            <code>{'{kode_pendaftar}'}</code>,{' '}
                            <code>{'{prodi_lulus}'}</code> {' '}
                            - akan otomatis diganti per penerima
                        </p>
                        {errors.body && (
                            <p className="text-error text-sm mt-1">{errors.body}</p>
                        )}
                    </div>

                    {/* Multiple File Attachment */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">
                            Attachment (opsional, maks 5 file, max 10MB/file)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-on-surface-variant
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                                file:bg-primary-container file:text-on-primary-container
                                hover:file:bg-primary/80 cursor-pointer"
                        />
                        {selectedFiles.length > 0 && (
                            <ul className="mt-2 space-y-1">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between
                                            bg-surface-variant rounded-lg px-3 py-2"
                                    >
                                        <span className="text-sm text-on-surface-variant">
                                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-error hover:bg-error-container
                                                rounded p-1"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                close
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.attachments && (
                            <p className="text-error text-sm mt-1">{errors.attachments}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-2">
                        <Button type="submit" isLoading={processing} disabled={recipientCount === 0}>
                            Kirim Email
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Riwayat Pengiriman */}
            <Card title="Riwayat Pengiriman" className="mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-outline-variant text-left">
                                <th className="py-2 px-3 font-medium text-on-surface-variant">
                                    Penerima
                                </th>
                                <th className="py-2 px-3 font-medium text-on-surface-variant">
                                    Subject
                                </th>
                                <th className="py-2 px-3 font-medium text-on-surface-variant">
                                    Status
                                </th>
                                <th className="py-2 px-3 font-medium text-on-surface-variant">
                                    Dikirim Pada
                                </th>
                                <th className="py-2 px-3 font-medium text-on-surface-variant">
                                    Error
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-secondary">
                                        Belum ada riwayat pengiriman.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-outline-variant"
                                    >
                                        <td className="py-2 px-3">
                                            <div className="font-medium text-on-surface">
                                                {log.pendaftar?.nama || '-'}
                                            </div>
                                            <div className="text-xs text-secondary">
                                                {log.email}
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 text-on-surface-variant">
                                            {log.subject}
                                        </td>
                                        <td className="py-2 px-3">
                                            <Badge variant={statusVariant(log.status)}>
                                                {log.status}
                                            </Badge>
                                        </td>
                                        <td className="py-2 px-3 text-on-surface-variant">
                                            {log.sent_at || '-'}
                                        </td>
                                        <td className="py-2 px-3 text-xs text-error max-w-xs truncate">
                                            {log.error_message || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </AdminLayout>
    );
}
```

### Key Decisions Frontend

- Menggunakan `router.post()` dengan `FormData` manual (bukan `useForm`) karena `useForm` tidak menangani array `File[]` dengan baik untuk multiple files
- `forceFormData: true` memastikan request dikirim sebagai `multipart/form-data`
- Dynamic recipient count via `fetch()` ke API endpoint saat `prodiId` berubah
- Confirm dialog sebelum submit untuk mencegah pengiriman tidak sengaja
- Log table menampilkan 50 entry terbaru dengan badge status (success/warning/error)

---

## Tahap 9: Menu Item

**Edit**: `resources/js/components/layout/top-nav.tsx`

Tambahkan item ke group "Seleksi" (line 56-70), yang sudah memiliki `roles: ['superadmin']`:

```tsx
{
    title: 'Seleksi',
    icon: 'playlist_add_check',
    roles: ['superadmin'],
    items: [
        { href: '/admin/kriteria', label: 'Kriteria Kelulusan', icon: 'my_location' },
        { href: '/admin/pembobotan', label: 'Pembobotan', icon: 'percent' },
        { href: '/admin/nilai', label: 'Nilai Ujian', icon: 'emoji_events' },
        { href: '/admin/seleksi', label: 'Seleksi', icon: 'check_circle' },
        { href: '/admin/seleksi-pindah-prodi', label: 'Seleksi Pindah Prodi', icon: 'swap_horiz' },
        { href: '/admin/seleksi/rekap', label: 'Rekap Kelulusan', icon: 'bar_chart' },
        { href: '/admin/broadcast-email', label: 'Broadcast Email', icon: 'mail' },  // <-- TAMBAH INI
        { href: '/admin/referensi', label: 'Referensi', icon: 'info' },
        { href: '/admin/absensi', label: 'Absensi', icon: 'content_paste' },
    ],
},
```

---

## Tahap 10: Testing & Verifikasi

### 10.1 Setup

```bash
# Jalankan migration
php artisan migrate

# (Development) Pastikan queue worker berjalan
php artisan queue:work
# atau gunakan composer run dev yang sudah memulai queue worker
```

### 10.2 Testing dengan Log Mailer

Sebelum menggunakan Gmail asli, test dengan `MAIL_MAILER=log`:

1. Login sebagai superadmin
2. Buka `/admin/broadcast-email`
3. Pilih prodi atau "Semua Prodi"
4. Verifikasi dynamic count berubah saat filter prodi diubah
5. Isi subject, body (test dengan variabel `{nama}`, `{kode_pendaftar}`, `{prodi_lulus}`)
6. Upload 1-2 file attachment
7. Submit form
8. Verifikasi:
   - Flash message "Broadcast email dijadwalkan untuk X penerima"
   - Log entries di tabel `email_broadcast_logs` dengan status `pending`
   - Setelah queue worker memproses: status berubah ke `sent` atau `failed`
   - Email tercatat di `storage/logs/laravel.log`
   - Riwayat pengiriman muncul di tabel

### 10.3 Testing dengan Gmail SMTP

1. Ubah `.env` ke `MAIL_MAILER=smtp` dengan kredensial Gmail asli
2. Test kirim ke jumlah kecil (filter prodi dengan sedikit pendaftar)
3. Verifikasi email diterima dengan:
   - Subject benar
   - Body dengan variabel terganti (`{nama}` menjadi nama penerima, dll)
   - Attachment terlampir dan bisa dibuka

### 10.4 Edge Cases

| Skenario | Expected Behavior |
|----------|-------------------|
| Pendaftar tanpa email | Email tetap dicoba, error tercatat di log |
| File attachment > 10MB | Validation error di controller |
| > 5 file attachment | Validation error di controller |
| Gmail rate limit terlampaui | Error tercatat, status `failed`, batch lanjut |
| Queue worker tidak berjalan | Status tetap `pending` sampai worker dijalankan |
| Tidak ada pendaftar lulus | Flash error "Tidak ada pendaftar lulus yang ditemukan" |

---

## File Summary

### File Baru (7)

| # | File | Deskripsi |
|---|------|-----------|
| 1 | `database/migrations/2026_07_13_000001_create_email_broadcast_logs_table.php` | Tabel log pengiriman email |
| 2 | `app/Models/EmailBroadcastLog.php` | Model untuk email_broadcast_logs |
| 3 | `app/Mail/BroadcastEmail.php` | Mailable class dengan subject, body HTML, attachments |
| 4 | `app/Jobs/SendBroadcastEmail.php` | Queued job untuk kirim massal + substitusi variabel |
| 5 | `app/Services/BroadcastEmailService.php` | Business logic: query penerima, simpan attachment, dispatch job |
| 6 | `app/Http/Controllers/Admin/BroadcastEmailController.php` | Controller: index (form+log), send, count (API) |
| 7 | `resources/js/pages/admin/broadcast-email/index.tsx` | React page: form + dynamic count + riwayat |

### File Edit (3)

| # | File | Perubahan |
|---|------|-----------|
| 1 | `.env` | `MAIL_MAILER=smtp` + Gmail SMTP credentials |
| 2 | `routes/web.php` | +import controller, +3 routes (index, send, count) |
| 3 | `resources/js/components/layout/top-nav.tsx` | +menu item "Broadcast Email" di group Seleksi |

---

## Urutan Eksekusi

| Urutan | Tahap | File | Estimasi |
|--------|-------|------|----------|
| 1 | Konfigurasi SMTP | `.env` | 1 menit |
| 2 | Migration + Model | `database/migrations/...`, `app/Models/EmailBroadcastLog.php` | 5 menit |
| 3 | Mailable | `app/Mail/BroadcastEmail.php` | 3 menit |
| 4 | Queued Job | `app/Jobs/SendBroadcastEmail.php` | 10 menit |
| 5 | Service | `app/Services/BroadcastEmailService.php` | 10 menit |
| 6 | Controller | `app/Http/Controllers/Admin/BroadcastEmailController.php` | 5 menit |
| 7 | Routes | `routes/web.php` | 2 menit |
| 8 | Frontend Page | `resources/js/pages/admin/broadcast-email/index.tsx` | 20 menit |
| 9 | Menu Item | `resources/js/components/layout/top-nav.tsx` | 1 menit |
| 10 | Migrate + Test | `php artisan migrate` + testing | 10 menit |

**Total estimasi**: ~67 menit

---

## Arsitektur & Flow

```
User (superadmin)
    |
    | GET /admin/broadcast-email
    v
BroadcastEmailController@index
    |
    |-- BroadcastEmailService::getProdiWithLulus()    --> Prodi list untuk dropdown
    |-- BroadcastEmailService::getRecipientCount()    --> Total penerima
    |-- BroadcastEmailService::getRecentLogs()        --> Riwayat 50 terbaru
    |
    v
Inertia::render('admin/broadcast-email/index')
    |
    | (User ubah filter prodi)
    | GET /api/admin/broadcast-email/count?prodi_id=X
    v
BroadcastEmailController@count --> JSON {count: N}
    |
    | (User submit form)
    | POST /admin/broadcast-email/send
    v
BroadcastEmailController@send
    |-- Validate: subject, body, attachments, prodi_id
    v
BroadcastEmailService::send()
    |-- Query Pendaftar::whereNotNull('lulus') [+ filter prodi]
    |-- Simpan attachments ke storage/app/private/broadcast-attachments/{timestamp}/
    |-- Buat EmailBroadcastLog entries (status: pending) per penerima
    |-- Dispatch SendBroadcastEmail job
    v
Queue Worker (database)
    |
    v
SendBroadcastEmail::handle()
    |-- Load EmailBroadcastLog + Pendaftar + lulusProdi
    |-- Per penerima:
    |   |-- Substitusi {nama}, {kode_pendaftar}, {prodi_lulus} di body
    |   |-- Mail::to(email)->send(new BroadcastEmail(...))
    |   |-- Update log: status=sent, sent_at=now()
    |   |-- Atau: status=failed, error_message=exception
    |   |-- usleep(500000)  // throttle 0.5s
    |-- Cleanup attachment files
    v
Selesai
```

---

## Catatan Penting

1. **Gmail App Password**: Bukan password Gmail biasa. Harus buat di Google Account > Security > 2-Step Verification > App Passwords.

2. **Queue Worker**: Email dikirim via queue (database). Pastikan `php artisan queue:work` berjalan di server. `composer run dev` sudah memulainya otomatis di development.

3. **Gmail Sending Limits**: Free Gmail ~500 email/hari, Google Workspace ~2000 email/hari. Throttle 0.5 detik per email diimplementasikan di job. Jika penerima > limit harian, sebagian akan `failed`.

4. **Body HTML**: Body email dikirim sebagai HTML (`->html()`). User bisa gunakan tag HTML sederhana seperti `<br>`, `<b>`, `<p>` di textarea. Variabel `{nama}`, `{kode_pendaftar}`, `{prodi_lulus}` diganti per penerima.

5. **Attachment Storage**: File disimpan di `storage/app/private/broadcast-attachments/{timestamp}/` dan otomatis dihapus setelah job selesai.

6. **Error Handling**: Error per penerima tidak menghentikan batch. Setiap error tercatat di `email_broadcast_logs.error_message` dan dapat dilihat di tabel riwayat.
