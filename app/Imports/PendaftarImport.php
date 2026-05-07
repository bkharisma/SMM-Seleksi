<?php

namespace App\Imports;

use App\Models\JalurPendaftaran;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PendaftarImport implements ToModel, WithHeadingRow, WithStartRow
{
    protected int $rowCount = 0;

    protected array $errors = [];

    protected array $prodiCache = [];

    protected array $jalurCache = [];

    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        $kodePendaftar = $row['kode_pendaftar'] ?? null;
        $nama = $row['nama_pendaftar'] ?? $row['nama'] ?? null;

        if (empty($kodePendaftar) || empty($nama)) {
            return null;
        }

        $tanggalLahir = $this->parseDate($row['tanggal_lahir'] ?? null);
        if (empty($tanggalLahir)) {
            $this->errors[] = [
                'row' => $this->rowCount + 2,
                'kode_pendaftar' => $row['kode_pendaftar'] ?? null,
                'nama' => $row['nama_pendaftar'] ?? $row['nama'] ?? null,
                'tanggal_lahir' => $row['tanggal_lahir'] ?? null,
                'jenis_kelamin' => $row['jenis_kelamin'] ?? null,
                'pilihan_1' => $row['pilihan_1'] ?? null,
                'pilihan_2' => $row['pilihan_2'] ?? null,
                'pilihan_3' => $row['pilihan_3'] ?? null,
                'email' => $row['email'] ?? null,
                'no_hp' => $row['no_hp'] ?? $row['hp'] ?? null,
                'jalur_pendaftaran' => $row['jalur_pendaftaran'] ?? $row['jalur'] ?? null,
                'error' => 'Tanggal lahir wajib diisi (format: YYYY-MM-DD)',
            ];

            return null;
        }

        DB::beginTransaction();
        try {
            $pil1 = $this->resolveProdi($row['pilihan_1'] ?? null);
            $pil2 = $this->resolveProdi($row['pilihan_2'] ?? null);
            $pil3 = $this->resolveProdi($row['pilihan_3'] ?? null);
            $jalur = $this->resolveJalur($row['jalur_pendaftaran'] ?? $row['jalur'] ?? null);

            $noujian = $row['no_ujian'] ?? $row['noujian'] ?? null;
            if (empty($noujian)) {
                $noujian = null;
            }

            $email = $row['email'] ?? null;
            $noHp = $row['no_hp'] ?? $row['hp'] ?? null;
            $jenisKelamin = $row['jenis_kelamin'] ?? null;
            if ($jenisKelamin) {
                $jenisKelamin = strtoupper(substr(trim($jenisKelamin), 0, 1));
                if (! in_array($jenisKelamin, ['L', 'P'])) {
                    $jenisKelamin = null;
                }
            }

            $pendaftar = Pendaftar::updateOrCreate(
                ['kode_pendaftar' => $kodePendaftar],
                [
                    'noujian' => $noujian,
                    'nama' => $nama,
                    'tanggal_lahir' => $tanggalLahir,
                    'email' => $email,
                    'no_hp' => $noHp,
                    'jenis_kelamin' => $jenisKelamin,
                    'pil1' => $pil1,
                    'pil2' => $pil2,
                    'pil3' => $pil3,
                    'jalur_id' => $jalur,
                ]
            );

            $this->createOrUpdateUser($pendaftar);

            $this->rowCount++;
            DB::commit();

            return $pendaftar;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errors[] = [
                'row' => $this->rowCount + 2,
                'kode_pendaftar' => $row['kode_pendaftar'] ?? null,
                'nama' => $row['nama_pendaftar'] ?? $row['nama'] ?? null,
                'tanggal_lahir' => $row['tanggal_lahir'] ?? null,
                'jenis_kelamin' => $row['jenis_kelamin'] ?? null,
                'pilihan_1' => $row['pilihan_1'] ?? null,
                'pilihan_2' => $row['pilihan_2'] ?? null,
                'pilihan_3' => $row['pilihan_3'] ?? null,
                'email' => $row['email'] ?? null,
                'no_hp' => $row['no_hp'] ?? $row['hp'] ?? null,
                'jalur_pendaftaran' => $row['jalur_pendaftaran'] ?? $row['jalur'] ?? null,
                'error' => $e->getMessage(),
            ];

            return null;
        }
    }

    protected function createOrUpdateUser(Pendaftar $pendaftar): void
    {
        if ($pendaftar->user_id) {
            $user = User::find($pendaftar->user_id);
            if ($user) {
                $user->update([
                    'name' => $pendaftar->nama,
                    'email' => $pendaftar->email ?? $user->email,
                ]);

                return;
            }
        }

        $username = $pendaftar->noujian ?? $pendaftar->kode_pendaftar;
        $password = $pendaftar->tanggal_lahir
            ? Hash::make($pendaftar->tanggal_lahir->format('dmY'))
            : Hash::make($pendaftar->kode_pendaftar);

        $email = $pendaftar->email;
        if (empty($email)) {
            $email = strtolower(str_replace([' ', '.', '@'], '', $pendaftar->kode_pendaftar)).'@pendaftar.seleksi';
        }

        $user = User::firstOrCreate(
            ['username' => $username],
            [
                'name' => $pendaftar->nama,
                'email' => $email,
                'password' => $password,
                'status' => 'active',
            ]
        );

        if (! $user->hasRole('mahasiswa')) {
            $user->assignRole('mahasiswa');
        }

        $pendaftar->update(['user_id' => $user->id]);
    }

    protected function resolveProdi($value): ?int
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->prodiCache[$key])) {
            return $this->prodiCache[$key];
        }

        $prodi = Prodi::where('kode_prodi', $key)
            ->orWhere('nama_prodi', 'like', "%{$key}%")
            ->first();

        $this->prodiCache[$key] = $prodi?->id;

        return $this->prodiCache[$key];
    }

    protected function resolveJalur($value): ?int
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->jalurCache[$key])) {
            return $this->jalurCache[$key];
        }

        $jalur = JalurPendaftaran::where('kode_jalur', $key)
            ->orWhere('nama_jalur', 'like', "%{$key}%")
            ->first();

        $this->jalurCache[$key] = $jalur?->id;

        return $this->jalurCache[$key];
    }

    protected function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
