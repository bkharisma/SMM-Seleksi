<?php

namespace App\Services;

use App\Mail\RegistrationConfirmed;
use App\Models\Peminat;
use App\Models\Periode;
use App\Models\Prodi;
use App\Models\Setup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegistrationService
{
    public function __construct(
        protected BsiVaService $bsiVaService
    ) {}

    public function register(array $data): array
    {
        $periode = Periode::current()->first();
        if (! $periode) {
            return [
                'success' => false,
                'message' => 'Pendaftaran sedang tidak dibuka.',
            ];
        }

        $aktif = (int) Setup::get('aktif', 0);
        if (! $aktif) {
            return [
                'success' => false,
                'message' => 'Pendaftaran sedang ditutup.',
            ];
        }

        $maxPilihan = (int) Setup::get('max_pilihan', 4);
        $biaya = (int) Setup::get('biaya_pendaftaran', 0);

        $errors = $this->validateRegistration($data, $maxPilihan);
        if (! empty($errors)) {
            return [
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $errors,
            ];
        }

        try {
            return DB::transaction(function () use ($data, $periode, $biaya, $maxPilihan) {
                $nup = $this->generateNup();
                $password = Str::random(8);

                $peminat = Peminat::create([
                    'nup' => $nup,
                    'spmb' => $periode->spmb,
                    'nama' => $data['nama'],
                    'pwd' => $password,
                    'email' => $data['email'],
                    'hp' => $data['hp'],
                    'tgldaftar' => now(),
                    'tgllahir' => $data['tgllahir'],
                    'kwng' => $data['kwng'] ?? 'WNI',
                    'pil1' => ! empty($data['pil1']) ? $data['pil1'] : null,
                    'pil2' => ! empty($data['pil2']) ? $data['pil2'] : null,
                    'pil3' => $maxPilihan >= 3 && ! empty($data['pil3']) ? $data['pil3'] : null,
                    'pil4' => $maxPilihan >= 4 && ! empty($data['pil4']) ? $data['pil4'] : null,
                    'taustp' => ! empty($data['taustp']) ? $data['taustp'] : null,
                    'nama_sekolah' => ! empty($data['nama_sekolah']) ? $data['nama_sekolah'] : null,
                ]);

                $vaResult = $this->bsiVaService->createVirtualAccount($peminat, $biaya);

                if (! $vaResult['success']) {
                    return [
                        'success' => false,
                        'message' => $vaResult['message'] ?? 'Gagal membuat virtual account.',
                    ];
                }

                try {
                    Mail::to($peminat->email)->queue(new RegistrationConfirmed($peminat, $password, $vaResult));
                } catch (\Throwable $e) {
                    Log::error('Failed to send registration email', [
                        'peminat_id' => $peminat->id,
                        'error' => $e->getMessage(),
                    ]);
                }

                return [
                    'success' => true,
                    'peminat' => $peminat,
                    'password' => $password,
                    'va' => $vaResult,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'email' => $data['email'] ?? null,
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.',
            ];
        }
    }

    protected function validateRegistration(array $data, int $maxPilihan): array
    {
        $errors = [];

        if (empty($data['nama'])) {
            $errors['nama'] = 'Nama wajib diisi.';
        }

        if (empty($data['email'])) {
            $errors['email'] = 'Email wajib diisi.';
        } elseif (! filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Format email tidak valid.';
        } elseif (Peminat::where('email', $data['email'])->exists()) {
            $errors['email'] = 'Email sudah terdaftar.';
        }

        if (empty($data['hp'])) {
            $errors['hp'] = 'Nomor HP wajib diisi.';
        }

        if (empty($data['tgllahir'])) {
            $errors['tgllahir'] = 'Tanggal lahir wajib diisi.';
        }

        if (empty($data['pil1'])) {
            $errors['pil1'] = 'Pilihan prodi 1 wajib diisi.';
        } elseif (! Prodi::where('id', $data['pil1'])->where('active', true)->exists()) {
            $errors['pil1'] = 'Program studi tidak valid atau tidak aktif.';
        }

        if (! empty($data['pil2'])) {
            if ($data['pil2'] == $data['pil1']) {
                $errors['pil2'] = 'Pilihan prodi 2 tidak boleh sama dengan pilihan 1.';
            } elseif (! Prodi::where('id', $data['pil2'])->where('active', true)->exists()) {
                $errors['pil2'] = 'Program studi tidak valid atau tidak aktif.';
            }
        }

        if ($maxPilihan >= 3 && ! empty($data['pil3'])) {
            if (in_array($data['pil3'], [$data['pil1'], $data['pil2']])) {
                $errors['pil3'] = 'Pilihan prodi 3 tidak boleh sama dengan pilihan sebelumnya.';
            }
        }

        if ($maxPilihan >= 4 && ! empty($data['pil4'])) {
            if (in_array($data['pil4'], [$data['pil1'], $data['pil2'], $data['pil3'] ?? null])) {
                $errors['pil4'] = 'Pilihan prodi 4 tidak boleh sama dengan pilihan sebelumnya.';
            }
        }

        return $errors;
    }

    protected function generateNup(): string
    {
        $year = date('y');
        $lastNup = DB::table('peminat')
            ->where('nup', 'like', $year.'%')
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('nup');

        $seq = $lastNup ? (intval(substr($lastNup, -4)) + 1) : 1;

        return sprintf('%s%04d', $year, $seq);
    }
}
