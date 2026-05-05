<?php

namespace App\Services;

use App\Models\KriteriaKelulusan;
use App\Models\Peminat;
use App\Models\Peserta;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SelectionService
{
    public function getTahapSeleksiActive(): Collection
    {
        return TahapSeleksi::active()->get();
    }

    public function getKriteriaForProdiTahap(int $prodiId, int $tahapId): ?KriteriaKelulusan
    {
        return KriteriaKelulusan::with('kriteriaUjian.ujian')
            ->where('prodi_id', $prodiId)
            ->where('tahap_seleksi_id', $tahapId)
            ->where('active', true)
            ->first();
    }

    public function getPesertaForSelection(int $tahapId, ?int $prodiId = null, ?int $pilihan = null): Collection
    {
        $query = Peserta::with(['nilai', 'pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'pil4Prodi', 'lulusProdi'])
            ->where('status', true)
            ->whereNotNull('noujian');

        if ($prodiId) {
            $pilihanCol = $pilihan ? 'pil'.$pilihan : null;
            if ($pilihanCol) {
                $query->where($pilihanCol, $prodiId);
            } else {
                $query->where(function ($q) use ($prodiId) {
                    $q->where('pil1', $prodiId)
                        ->orWhere('pil2', $prodiId)
                        ->orWhere('pil3', $prodiId)
                        ->orWhere('pil4', $prodiId);
                });
            }
        }

        return $query->orderBy('nama')->get();
    }

    public function evaluatePeserta(Peserta $peserta, KriteriaKelulusan $kriteria, ?int $pilihan = null): array
    {
        $nilaiList = $peserta->nilai;
        $result = [
            'nup' => $peserta->nup,
            'nama' => $peserta->nama,
            'noujian' => $peserta->noujian,
            'lulus' => true,
            'reasons' => [],
            'scores' => [],
        ];

        foreach ($kriteria->kriteriaUjian as $ku) {
            $ujianId = $ku->ujian_id;
            $nilai = $nilaiList->firstWhere('ujian_id', $ujianId);

            if ($ku->jenis === 'tes' && $ku->nilai_standar !== null) {
                $skor = $nilai?->skor_akhir;
                $result['scores'][$ku->ujian->nama ?? $ujianId] = $skor;

                if ($skor === null || (float) $skor < (float) $ku->nilai_standar) {
                    $result['lulus'] = false;
                    $result['reasons'][] = "Nilai {$ku->ujian->nama} ({$skor}) di bawah standar ({$ku->nilai_standar})";
                }
            }
        }

        return $result;
    }

    public function previewSelection(int $tahapId, int $prodiId, ?int $pilihan = null): array
    {
        $tahap = TahapSeleksi::with('kriteriaKelulusan.prodi')->find($tahapId);
        if (! $tahap) {
            return ['error' => 'Tahap seleksi tidak ditemukan'];
        }

        $kriteria = $this->getKriteriaForProdiTahap($prodiId, $tahapId);
        if (! $kriteria) {
            return ['error' => 'Kriteria kelulusan belum dikonfigurasi untuk prodi ini'];
        }

        $pesertaList = $this->getPesertaForSelection($tahapId, $prodiId, $pilihan);

        $results = [];
        $lulusCount = 0;
        $tidakLulusCount = 0;

        foreach ($pesertaList as $peserta) {
            $eval = $this->evaluatePeserta($peserta, $kriteria, $pilihan);
            $results[] = $eval;
            if ($eval['lulus']) {
                $lulusCount++;
            } else {
                $tidakLulusCount++;
            }
        }

        $prodi = Prodi::find($prodiId);

        return [
            'tahap' => $tahap,
            'prodi' => $prodi,
            'kriteria' => $kriteria,
            'pilihan' => $pilihan,
            'total' => count($results),
            'lulus' => $lulusCount,
            'tidak_lulus' => $tidakLulusCount,
            'results' => $results,
        ];
    }

    public function saveSelection(int $tahapId, int $prodiId, array $selectedNup, ?int $pilihan = null): array
    {
        $kriteria = $this->getKriteriaForProdiTahap($prodiId, $tahapId);
        if (! $kriteria) {
            return ['success' => false, 'message' => 'Kriteria kelulusan belum dikonfigurasi'];
        }

        $tahap = TahapSeleksi::find($tahapId);
        if (! $tahap) {
            return ['success' => false, 'message' => 'Tahap seleksi tidak ditemukan'];
        }

        $updated = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($selectedNup as $nup) {
                $peserta = Peserta::where('nup', $nup)->first();
                if (! $peserta) {
                    $errors[] = "NUP {$nup} tidak ditemukan";

                    continue;
                }

                $eval = $this->evaluatePeserta($peserta, $kriteria, $pilihan);

                if ($eval['lulus']) {
                    $updateData = [
                        'lulus' => $prodiId,
                        'lulus_tahap' => $tahap->nama,
                        'param_lulus' => json_encode([
                            'tahap_id' => $tahapId,
                            'prodi_id' => $prodiId,
                            'pilihan' => $pilihan,
                            'scores' => $eval['scores'],
                        ]),
                    ];
                    $peserta->update($updateData);
                    $updated++;
                }
            }

            DB::commit();

            return [
                'success' => true,
                'message' => "Berhasil meluluskan {$updated} peserta ke {$tahap->nama}",
                'updated' => $updated,
                'errors' => $errors,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return ['success' => false, 'message' => 'Gagal menyimpan seleksi: '.$e->getMessage()];
        }
    }

    public function getRekapKelulusan(?int $prodiId = null): array
    {
        $query = Peserta::with(['lulusProdi', 'pil1Prodi'])
            ->whereNotNull('lulus');

        if ($prodiId) {
            $query->where('lulus', $prodiId);
        }

        $pesertaLulus = $query->get();

        $rekapPerProdi = [];
        $prodiList = Prodi::active()->get();

        foreach ($prodiList as $prodi) {
            $lulusKeProdi = $pesertaLulus->where('lulus', $prodi->id);

            $pilCounts = [
                'pil1' => $lulusKeProdi->where('pil1', $prodi->id)->count(),
                'pil2' => $lulusKeProdi->where('pil2', $prodi->id)->count(),
                'pil3' => $lulusKeProdi->where('pil3', $prodi->id)->count(),
                'pil4' => $lulusKeProdi->where('pil4', $prodi->id)->count(),
            ];

            $rekapPerProdi[] = [
                'prodi_id' => $prodi->id,
                'nama_prodi' => $prodi->nama_prodi,
                'kode_prodi' => $prodi->kode_prodi,
                'total_lulus' => $lulusKeProdi->count(),
                'kuota' => $prodi->kuota_smm,
                'pilihan_1' => $pilCounts['pil1'],
                'pilihan_2' => $pilCounts['pil2'],
                'pilihan_3' => $pilCounts['pil3'],
                'pilihan_4' => $pilCounts['pil4'],
                'tersisa' => $prodi->kuota_smm ? max(0, $prodi->kuota_smm - $lulusKeProdi->count()) : null,
            ];
        }

        $totalLulus = $pesertaLulus->count();
        $totalPeserta = Peserta::count();

        return [
            'rekap_per_prodi' => $rekapPerProdi,
            'total_lulus' => $totalLulus,
            'total_peserta' => $totalPeserta,
            'total_peminat' => Peminat::count(),
        ];
    }

    public function getGraduationDetails(string $nup): ?array
    {
        $peserta = Peserta::with(['lulusProdi', 'nilai.ujian'])
            ->where('nup', $nup)
            ->first();

        if (! $peserta) {
            return null;
        }

        $tahapList = TahapSeleksi::active()->get();
        $detailsPerTahap = [];

        foreach ($tahapList as $tahap) {
            $kriteria = $this->getKriteriaForProdiTahap($peserta->pil1 ?? 0, $tahap->id);

            if (! $kriteria) {
                $kriteria = KriteriaKelulusan::with('kriteriaUjian.ujian')
                    ->where('tahap_seleksi_id', $tahap->id)
                    ->where('active', true)
                    ->first();
            }

            $detail = [
                'tahap_id' => $tahap->id,
                'tahap_nama' => $tahap->nama,
                'urutan' => $tahap->urutan,
                'lulus' => false,
                'scores' => [],
                'kriteria' => null,
            ];

            if ($kriteria) {
                $eval = $this->evaluatePeserta($peserta, $kriteria);
                $detail['lulus'] = $eval['lulus'];
                $detail['scores'] = $eval['scores'];
                $detail['reasons'] = $eval['reasons'] ?? [];
                $detail['kriteria'] = [];
                foreach ($kriteria->kriteriaUjian as $ku) {
                    $detail['kriteria'][] = [
                        'ujian' => $ku->ujian->nama ?? null,
                        'jenis' => $ku->jenis,
                        'nilai_standar' => $ku->nilai_standar,
                        'parameters' => $ku->parameters,
                    ];
                }
            }

            $detailsPerTahap[] = $detail;
        }

        return [
            'nup' => $peserta->nup,
            'nama' => $peserta->nama,
            'foto' => $peserta->foto,
            'lulus' => $peserta->is_lulus,
            'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
            'lulus_tahap' => $peserta->lulus_tahap,
            'details_per_tahap' => $detailsPerTahap,
            'tgl_cek_lulus' => $peserta->tgl_cek_lulus,
        ];
    }
}
