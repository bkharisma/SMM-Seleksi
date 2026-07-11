<?php

namespace App\Services;

use App\Models\Pendaftar;
use App\Models\PendaftarNilai;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SeleksiPindahProdiService
{
    public function getPesertaBelumLulus(?string $search = null): array
    {
        $query = Pendaftar::with([
                'nilai',
                'pil1Prodi',
                'pil2Prodi',
                'pil3Prodi',
            ])
            ->whereNotNull('noujian')
            ->whereNull('lulus')
            ->whereHas('nilai', function ($q) {
                $q->whereNotNull('waw_nil');
            });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        $peserta = $query->get();

        $results = [];
        foreach ($peserta as $p) {
            $nilaiWawancara = $p->nilai->firstWhere('waw_nil', '!=', null);

            $results[] = [
                'id' => $p->id,
                'nup' => $p->kode_pendaftar,
                'noujian' => $p->noujian,
                'nama' => $p->nama,
                'pil1' => $p->pil1Prodi ? [
                    'id' => $p->pil1Prodi->id,
                    'kode' => $p->pil1Prodi->kode_prodi,
                    'nama' => $p->pil1Prodi->nama_prodi,
                ] : null,
                'pil2' => $p->pil2Prodi ? [
                    'id' => $p->pil2Prodi->id,
                    'kode' => $p->pil2Prodi->kode_prodi,
                    'nama' => $p->pil2Prodi->nama_prodi,
                ] : null,
                'pil3' => $p->pil3Prodi ? [
                    'id' => $p->pil3Prodi->id,
                    'kode' => $p->pil3Prodi->kode_prodi,
                    'nama' => $p->pil3Prodi->nama_prodi,
                ] : null,
                'nilai_akhir' => (float) ($p->nilai_akhir ?? 0),
                'waw_bersedia_pindah' => (bool) ($nilaiWawancara?->waw_bersedia_pindah ?? false),
                'waw_rekomendasi_prodi' => $nilaiWawancara?->wawRekomendasiProdi ? [
                    'id' => $nilaiWawancara->wawRekomendasiProdi->id,
                    'kode' => $nilaiWawancara->wawRekomendasiProdi->kode_prodi,
                    'nama' => $nilaiWawancara->wawRekomendasiProdi->nama_prodi,
                ] : null,
                'waw_catatan' => $nilaiWawancara?->waw_catatan,
                'waw_nilai' => $nilaiWawancara?->waw_nil,
            ];
        }

        usort($results, fn ($a, $b) => $b['nilai_akhir'] <=> $a['nilai_akhir']);

        $rank = 1;
        foreach ($results as &$item) {
            $item['peringkat'] = $rank++;
        }
        unset($item);

        return $results;
    }

    public function getProdiWithSisaKuota(): Collection
    {
        $prodiList = Prodi::active()->withCount(['pendaftarPil1', 'pendaftarPil2', 'pendaftarPil3'])->get();

        return $prodiList->map(function ($prodi) {
            $totalLulus = Pendaftar::where('lulus', $prodi->id)->count();
            $sisaKuota = $prodi->kuota_smm ? $prodi->kuota_smm - $totalLulus : null;

            return [
                'id' => $prodi->id,
                'kode_prodi' => $prodi->kode_prodi,
                'nama_prodi' => $prodi->nama_prodi,
                'kuota_smm' => $prodi->kuota_smm,
                'total_lulus' => $totalLulus,
                'sisa_kuota' => $sisaKuota,
                'tersedia' => $sisaKuota === null || $sisaKuota > 0,
            ];
        });
    }

    public function savePindahProdi(array $data): array
    {
        $validated = [];
        $errors = [];

        foreach ($data as $item) {
            if (empty($item['nup']) || empty($item['prodi_id'])) {
                $errors[] = "NUP atau prodi tujuan tidak valid";
                continue;
            }

            $peserta = Pendaftar::where('kode_pendaftar', $item['nup'])->first();
            if (!$peserta) {
                $errors[] = "Peserta dengan NUP {$item['nup']} tidak ditemukan";
                continue;
            }

            if ($peserta->lulus) {
                $errors[] = "{$peserta->nama} sudah lulus di {$peserta->lulusProdi?->nama_prodi}";
                continue;
            }

            $prodi = Prodi::find($item['prodi_id']);
            if (!$prodi) {
                $errors[] = "Prodi tujuan tidak ditemukan";
                continue;
            }

            $totalLulus = Pendaftar::where('lulus', $prodi->id)->count();
            if ($prodi->kuota_smm && $totalLulus >= $prodi->kuota_smm) {
                $errors[] = "Kuota {$prodi->nama_prodi} sudah penuh";
                continue;
            }

            $validated[] = [
                'peserta' => $peserta,
                'prodi' => $prodi,
            ];
        }

        if (empty($validated)) {
            return [
                'success' => false,
                'message' => 'Tidak ada data valid untuk diproses',
                'errors' => $errors,
            ];
        }

        $tahap1 = TahapSeleksi::where('urutan', 1)->where('active', true)->first();
        if (!$tahap1) {
            return [
                'success' => false,
                'message' => 'Tahap seleksi 1 tidak ditemukan atau tidak aktif.',
                'errors' => $errors,
            ];
        }

        DB::beginTransaction();
        try {
            $updated = 0;
            foreach ($validated as $item) {
                $peserta = $item['peserta'];
                $prodi = $item['prodi'];

                $paramLulus = json_encode([
                    'pindah_prodi' => true,
                    'prodi_asal_pil1' => $peserta->pil1,
                    'prodi_asal_pil2' => $peserta->pil2,
                    'prodi_asal_pil3' => $peserta->pil3,
                    'prodi_tujuan' => $prodi->id,
                    'total_skor' => (float) ($peserta->nilai_akhir ?? 0),
                    'tanggal_pindah' => now()->toDateTimeString(),
                ]);

                $peserta->update([
                    'lulus' => $prodi->id,
                    'lulus_tahap' => $tahap1->id,
                    'param_lulus' => $paramLulus,
                ]);

                $updated++;
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Berhasil memindahkan {$updated} peserta ke prodi lain",
                'updated' => $updated,
                'errors' => $errors,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage(),
                'errors' => $errors,
            ];
        }
    }
}
