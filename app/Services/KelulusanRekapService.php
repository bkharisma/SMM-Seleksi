<?php

namespace App\Services;

use App\Models\Kesehatan;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class KelulusanRekapService
{
    public function getRekapKelulusanSyarat(?int $prodiId = null): array
    {
        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();
        $tahap2Id = $tahap2?->id;

        $query = Pendaftar::with(['lulusProdi', 'pil1Prodi', 'kesehatan'])
            ->whereNotNull('lulus');

        if ($prodiId) {
            $query->where('lulus', $prodiId);
        }

        $pesertaLulus = $query->get();

        $rekapPerProdi = [];
        $prodiList = Prodi::active()->get();

        foreach ($prodiList as $prodi) {
            $lulusKeProdi = $pesertaLulus->where('lulus', $prodi->id);

            $berkasLengkap = $lulusKeProdi->filter(function ($p) {
                return $p->kesehatan && $p->kesehatan->status === 'Lengkap';
            })->count();

            $berkasTidakLengkap = $lulusKeProdi->filter(function ($p) {
                return $p->kesehatan && in_array($p->kesehatan->status, ['Tidak Lengkap', 'Perbaikan']);
            })->count();

            $belumUpload = $lulusKeProdi->filter(function ($p) {
                return !$p->kesehatan;
            })->count();

            $belumDiperiksa = $lulusKeProdi->filter(function ($p) {
                return $p->kesehatan && $p->kesehatan->status === 'Belum Diperiksa';
            })->count();

            $totalLulusProdi = $lulusKeProdi->count();

            $finalisasiTahap2 = $lulusKeProdi->filter(function ($p) use ($tahap2Id) {
                return $p->lulus_tahap == $tahap2Id;
            })->count();

            $rekapPerProdi[] = [
                'prodi_id' => $prodi->id,
                'nama_prodi' => $prodi->nama_prodi,
                'kode_prodi' => $prodi->kode_prodi,
                'total_lulus_tahap1' => $totalLulusProdi,
                'berkas_lengkap' => $berkasLengkap,
                'berkas_tidak_lengkap' => $berkasTidakLengkap,
                'belum_upload' => $belumUpload,
                'belum_diperiksa' => $belumDiperiksa,
                'finalisasi_tahap2' => $finalisasiTahap2,
                'belum_finalisasi' => $totalLulusProdi - $finalisasiTahap2,
            ];
        }

        $totalLulusTahap1 = $pesertaLulus->count();

        $kelulusanFinal = $tahap2Id
            ? Pendaftar::whereNotNull('lulus')->where('lulus_tahap', $tahap2Id)->count()
            : 0;

        $berkasLengkapTotal = $pesertaLulus->filter(function ($p) {
            return $p->kesehatan && $p->kesehatan->status === 'Lengkap';
        })->count();

        $berkasTidakLengkapTotal = $pesertaLulus->filter(function ($p) {
            return $p->kesehatan && in_array($p->kesehatan->status, ['Tidak Lengkap', 'Perbaikan']);
        })->count();

        $belumUploadTotal = $pesertaLulus->filter(function ($p) {
            return !$p->kesehatan;
        })->count();

        $isFinalizedTahap2 = $tahap2Id
            ? Pendaftar::whereNotNull('lulus')->where('lulus_tahap', $tahap2Id)->exists()
            : false;

        return [
            'rekap_per_prodi' => $rekapPerProdi,
            'total_lulus_tahap1' => $totalLulusTahap1,
            'kelulusan_final' => $kelulusanFinal,
            'berkas_lengkap' => $berkasLengkapTotal,
            'berkas_tidak_lengkap' => $berkasTidakLengkapTotal,
            'belum_upload' => $belumUploadTotal,
            'is_finalized_tahap2' => $isFinalizedTahap2,
        ];
    }

    public function getDetailByProdi(int $prodiId): array
    {
        $prodi = Prodi::find($prodiId);
        if (!$prodi) {
            return ['error' => 'Program studi tidak ditemukan'];
        }

        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();
        $tahap2Id = $tahap2?->id;

        $peserta = Pendaftar::with(['kesehatan', 'lulusProdi', 'lulusTahap'])
            ->where('lulus', $prodiId)
            ->orderBy('nama')
            ->get()
            ->map(function ($p) use ($tahap2Id) {
                $statusBerkas = $p->kesehatan ? $p->kesehatan->status : 'Belum Upload';
                $isFinalTahap2 = $p->lulus_tahap == $tahap2Id;

                return [
                    'id' => $p->id,
                    'nup' => $p->kode_pendaftar,
                    'nama' => $p->nama,
                    'noujian' => $p->noujian,
                    'status_berkas' => $statusBerkas,
                    'tahap_lulus' => $p->lulusTahap?->nama ?? 'Tahap 1',
                    'finalisasi_tahap2' => $isFinalTahap2,
                    'is_lulus_final' => $isFinalTahap2,
                    'is_tidak_lulus_final' => $p->finalisasi === true,
                ];
            });

        $totalPeserta = $peserta->count();
        $berkasLengkap = $peserta->filter(fn($p) => $p['status_berkas'] === 'Lengkap')->count();
        $berkasTidakLengkap = $peserta->filter(fn($p) => in_array($p['status_berkas'], ['Tidak Lengkap', 'Perbaikan']))->count();
        $belumUpload = $peserta->filter(fn($p) => $p['status_berkas'] === 'Belum Upload')->count();
        $finalisasiTahap2 = $peserta->filter(fn($p) => $p['finalisasi_tahap2'])->count();

        return [
            'prodi' => [
                'id' => $prodi->id,
                'kode_prodi' => $prodi->kode_prodi,
                'nama_prodi' => $prodi->nama_prodi,
            ],
            'total_lulus_tahap1' => $totalPeserta,
            'berkas_lengkap' => $berkasLengkap,
            'berkas_tidak_lengkap' => $berkasTidakLengkap,
            'belum_upload' => $belumUpload,
            'finalisasi_tahap2' => $finalisasiTahap2,
            'peserta' => $peserta,
        ];
    }

    public function finalisasiTahap2(?int $prodiId = null): array
    {
        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();
        if (!$tahap2) {
            return ['success' => false, 'message' => 'Tahap 2 tidak ditemukan atau tidak aktif.'];
        }

        $tahap1 = TahapSeleksi::where('urutan', 1)->where('active', true)->first();
        if (!$tahap1) {
            return ['success' => false, 'message' => 'Tahap 1 tidak ditemukan atau tidak aktif.'];
        }

        DB::beginTransaction();
        try {
            $query = Pendaftar::whereNotNull('lulus')
                ->where('lulus_tahap', $tahap1->id);

            if ($prodiId) {
                $query->where('lulus', $prodiId);
            }

            $pesertaWithLengkapBerkas = (clone $query)
                ->whereHas('kesehatan', function ($q) {
                    $q->where('status', 'Lengkap');
                })
                ->get();

            $finalizedLulus = 0;
            foreach ($pesertaWithLengkapBerkas as $p) {
                $p->update([
                    'lulus_tahap' => $tahap2->id,
                    'finalisasi' => false,
                ]);
                $finalizedLulus++;
            }

            $queryTidakLulus = Pendaftar::whereNotNull('lulus')
                ->where('lulus_tahap', $tahap1->id);

            if ($prodiId) {
                $queryTidakLulus->where('lulus', $prodiId);
            }

            $pesertaWithIncompleteBerkas = (clone $queryTidakLulus)
                ->where(function ($q) {
                    $q->whereDoesntHave('kesehatan')
                        ->orWhereHas('kesehatan', function ($q2) {
                            $q2->whereIn('status', ['Belum Diperiksa', 'Tidak Lengkap', 'Perbaikan']);
                        });
                })
                ->get();

            $finalizedTidakLulus = 0;
            foreach ($pesertaWithIncompleteBerkas as $p) {
                $p->update([
                    'finalisasi' => true,
                ]);
                $finalizedTidakLulus++;
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Finalisasi Tahap 2 berhasil. {$finalizedLulus} peserta LULUS, {$finalizedTidakLulus} peserta TIDAK LULUS.",
                'finalized_lulus' => $finalizedLulus,
                'finalized_tidak_lulus' => $finalizedTidakLulus,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => 'Gagal finalisasi Tahap 2: ' . $e->getMessage()];
        }
    }

    public function revertFinalisasiTahap2(?int $prodiId = null): array
    {
        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();
        if (!$tahap2) {
            return ['success' => false, 'message' => 'Tahap 2 tidak ditemukan atau tidak aktif.'];
        }

        $tahap1 = TahapSeleksi::where('urutan', 1)->where('active', true)->first();
        if (!$tahap1) {
            return ['success' => false, 'message' => 'Tahap 1 tidak ditemukan atau tidak aktif.'];
        }

        DB::beginTransaction();
        try {
            $query = Pendaftar::whereNotNull('lulus')
                ->where('lulus_tahap', $tahap2->id);

            if ($prodiId) {
                $query->where('lulus', $prodiId);
            }

            $countLulus = (clone $query)->count();

            $query->update([
                'lulus_tahap' => $tahap1->id,
            ]);

            $queryFinalisasi = Pendaftar::whereNotNull('lulus')
                ->where('finalisasi', true);

            if ($prodiId) {
                $queryFinalisasi->where('lulus', $prodiId);
            }

            $countTidakLulus = $queryFinalisasi->count();

            $queryFinalisasi->update([
                'finalisasi' => false,
            ]);

            DB::commit();

            $totalReverted = $countLulus + $countTidakLulus;

            return [
                'success' => true,
                'message' => "Revert finalisasi Tahap 2 berhasil. {$totalReverted} peserta dikembalikan ({$countLulus} lulus, {$countTidakLulus} tidak lulus).",
                'reverted' => $totalReverted,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['success' => false, 'message' => 'Gagal revert finalisasi Tahap 2: ' . $e->getMessage()];
        }
    }

    public function isFinalizedTahap2(): bool
    {
        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();
        if (!$tahap2) {
            return false;
        }

        return Pendaftar::whereNotNull('lulus')
            ->where('lulus_tahap', $tahap2->id)
            ->exists();
    }
}
