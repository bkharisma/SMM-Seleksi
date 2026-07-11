<?php

namespace App\Services;

use App\Models\JalurPendaftaran;
use App\Models\KriteriaKelulusan;
use App\Models\Pendaftar;
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

    public function getPesertaForSelection(int $tahapId, ?int $prodiId = null, ?int $pilihan = null, ?int $jalurId = null): Collection
    {
        $query = Pendaftar::with(['nilai', 'pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'lulusProdi', 'jalur'])
            ->whereNotNull('noujian')
            ->whereNull('lulus');

        if ($jalurId) {
            $query->where('jalur_id', $jalurId);
        }

        if ($prodiId) {
            $pilihanCol = $pilihan ? 'pil'.$pilihan : null;
            if ($pilihanCol) {
                $query->where($pilihanCol, $prodiId);
            } else {
                $query->where(function ($q) use ($prodiId) {
                    $q->where('pil1', $prodiId)
                        ->orWhere('pil2', $prodiId)
                        ->orWhere('pil3', $prodiId);
                });
            }
        }

        return $query->orderBy('nama')->get();
    }

    public function evaluatePeserta(Pendaftar $peserta, KriteriaKelulusan $kriteria, ?int $pilihan = null): array
    {
        $nilaiList = $peserta->nilai;
        $result = [
            'nup' => $peserta->kode_pendaftar,
            'nama' => $peserta->nama,
            'noujian' => $peserta->noujian,
            'lulus' => true,
            'reasons' => [],
            'scores' => [],
            'total_skor' => 0,
            'is_referensi' => (bool) $peserta->is_referensi,
        ];

        $useWeighted = $peserta->nilai_akhir !== null;

        if ($peserta->is_referensi) {
            $result['lulus'] = true;
            $result['reasons'][] = 'Peserta Referensi (auto-lulus)';

            foreach ($kriteria->kriteriaUjian as $ku) {
                $ujianId = $ku->ujian_id;
                $nilai = $nilaiList->firstWhere('ujian_id', $ujianId);

                if ($ku->jenis === 'tes' && $ku->nilai_standar !== null) {
                    $skor = $nilai?->skor_akhir;
                    $result['scores'][$ku->ujian->nama ?? $ujianId] = $skor;
                    if (! $useWeighted) {
                        $result['total_skor'] += (float) ($skor ?? 0);
                    }
                }
            }

            $result['total_skor'] = ($useWeighted ? (float) $peserta->nilai_akhir : $result['total_skor']) + 32;

            return $result;
        }

        $hasTesCriteria = false;

        foreach ($kriteria->kriteriaUjian as $ku) {
            $ujianId = $ku->ujian_id;
            $nilai = $nilaiList->firstWhere('ujian_id', $ujianId);

            if ($ku->jenis === 'tes' && $ku->nilai_standar !== null) {
                $hasTesCriteria = true;
                $skor = $nilai?->skor_akhir;
                $result['scores'][$ku->ujian->nama ?? $ujianId] = $skor;
                if (! $useWeighted) {
                    $result['total_skor'] += (float) ($skor ?? 0);
                }

                if ($skor === null || (float) $skor < (float) $ku->nilai_standar) {
                    $result['lulus'] = false;
                    $result['reasons'][] = "Nilai {$ku->ujian->nama} ({$skor}) di bawah standar ({$ku->nilai_standar})";
                }
            }
        }

        if (! $hasTesCriteria) {
            $result['lulus'] = false;
            $result['reasons'][] = 'Belum ada kriteria penilaian yang dikonfigurasi';
        }

        if ($useWeighted) {
            $result['total_skor'] = (float) $peserta->nilai_akhir;
        }

        return $result;
    }

    public function previewSelection(int $tahapId, int $prodiId, ?int $pilihan = null, ?int $jalurId = null): array
    {
        $tahap = TahapSeleksi::with('kriteriaKelulusan.prodi')->find($tahapId);
        if (! $tahap) {
            return ['error' => 'Tahap seleksi tidak ditemukan'];
        }

        $kriteria = $this->getKriteriaForProdiTahap($prodiId, $tahapId);
        if (! $kriteria) {
            return ['error' => 'Kriteria kelulusan belum dikonfigurasi untuk prodi ini'];
        }

        $prodi = Prodi::find($prodiId);
        $kuotaTotal = $prodi?->kuota_smm;

        $sudahLulus = Pendaftar::where('lulus', $prodiId)->count();
        $sisaKuota = $kuotaTotal ? max(0, $kuotaTotal - $sudahLulus) : null;

        $kuota = $sisaKuota;

        $pesertaList = $this->getPesertaForSelection($tahapId, $prodiId, $pilihan, $jalurId);

        $eligible = [];
        $ineligible = [];

        foreach ($pesertaList as $peserta) {
            $eval = $this->evaluatePeserta($peserta, $kriteria, $pilihan);

            if ($eval['is_referensi'] || $eval['lulus']) {
                $eligible[] = $eval;
            } else {
                $eval['lulus'] = false;
                $ineligible[] = $eval;
            }
        }

        usort($eligible, fn ($a, $b) => $b['total_skor'] <=> $a['total_skor']);

        $rank = 1;
        foreach ($eligible as &$item) {
            $item['peringkat'] = $rank;

            if ($kuota && $kuota > 0) {
                if ($rank <= $kuota) {
                    $item['lulus'] = true;
                } else {
                    $item['lulus'] = false;
                    $item['reasons'][] = "Melebihi kuota (kuota: {$kuota}, peringkat: {$rank})";
                }
            } elseif ($kuota !== null && $kuota <= 0) {
                $item['lulus'] = false;
                $item['reasons'][] = 'Kuota belum ditentukan';
            } else {
                $item['lulus'] = true;
            }

            $rank++;
        }
        unset($item);

        foreach ($ineligible as &$item) {
            $item['peringkat'] = null;
        }
        unset($item);

        $results = array_merge($eligible, $ineligible);

        usort($results, function ($a, $b) {
            if ($a['lulus'] !== $b['lulus']) {
                return $a['lulus'] ? -1 : 1;
            }
            return $b['total_skor'] <=> $a['total_skor'];
        });

        $lulusCount = count(array_filter($results, fn ($r) => $r['lulus']));
        $sisaKuota = $kuota ? max(0, $kuota - $lulusCount) : null;

        return [
            'tahap' => $tahap,
            'prodi' => $prodi,
            'kriteria' => $kriteria,
            'pilihan' => $pilihan,
            'jalur_id' => $jalurId,
            'total' => count($results),
            'lulus' => $lulusCount,
            'tidak_lulus' => count($results) - $lulusCount,
            'kuota' => $kuotaTotal,
            'sisa_kuota' => $sisaKuota,
            'results' => $results,
        ];
    }

    public function saveSelection(int $tahapId, int $prodiId, array $selectedNup, ?int $pilihan = null, ?int $jalurId = null): array
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
                $peserta = Pendaftar::where('kode_pendaftar', $nup)->first();
                if (! $peserta) {
                    $errors[] = "NUP {$nup} tidak ditemukan";

                    continue;
                }

                $eval = $this->evaluatePeserta($peserta, $kriteria, $pilihan);

                if ($eval['lulus']) {
                    $updateData = [
                        'lulus' => $prodiId,
                        'lulus_tahap' => $tahapId,
                        'param_lulus' => json_encode([
                            'tahap_id' => $tahapId,
                            'prodi_id' => $prodiId,
                            'pilihan' => $pilihan,
                            'jalur_id' => $jalurId,
                            'scores' => $eval['scores'],
                            'total_skor' => $eval['total_skor'],
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
        $query = Pendaftar::with(['lulusProdi', 'pil1Prodi'])
            ->whereNotNull('lulus');

        if ($prodiId) {
            $query->where('lulus', $prodiId);
        }

        $pesertaLulus = $query->get();

        $rekapPerProdi = [];
        $prodiList = Prodi::active()->get();

        foreach ($prodiList as $prodi) {
            $lulusKeProdi = $pesertaLulus->where('lulus', $prodi->id);

            $lulusNormal = $lulusKeProdi->filter(function ($p) {
                $paramLulus = is_string($p->param_lulus) ? json_decode($p->param_lulus, true) : $p->param_lulus;
                return !isset($paramLulus['pindah_prodi']) || $paramLulus['pindah_prodi'] !== true;
            });

            $pilCounts = [
                'pil1' => $lulusNormal->where('pil1', $prodi->id)->count(),
                'pil2' => $lulusNormal->where('pil2', $prodi->id)->count(),
                'pil3' => $lulusNormal->where('pil3', $prodi->id)->count(),
            ];

            $totalPesertaProdi = Pendaftar::where('pil1', $prodi->id)->count();

            $diluarPilihan = $lulusKeProdi->filter(function ($p) {
                $paramLulus = is_string($p->param_lulus) ? json_decode($p->param_lulus, true) : $p->param_lulus;
                return isset($paramLulus['pindah_prodi']) && $paramLulus['pindah_prodi'] === true;
            })->count();

            $totalLulusProdi = $lulusKeProdi->count();

            $rekapPerProdi[] = [
                'prodi_id' => $prodi->id,
                'nama_prodi' => $prodi->nama_prodi,
                'kode_prodi' => $prodi->kode_prodi,
                'total_peserta' => $totalPesertaProdi,
                'total_lulus' => $totalLulusProdi,
                'tidak_lulus' => max(0, $totalPesertaProdi - $totalLulusProdi),
                'kuota' => $prodi->kuota_smm,
                'pilihan_1' => $pilCounts['pil1'],
                'pilihan_2' => $pilCounts['pil2'],
                'pilihan_3' => $pilCounts['pil3'],
                'diluar_pilihan' => $diluarPilihan,
                'tersisa' => $prodi->kuota_smm ? $prodi->kuota_smm - $totalLulusProdi : null,
            ];
        }

        $totalLulus = $pesertaLulus->count();
        $totalPeserta = Pendaftar::whereNotNull('pil1')->count();

        $nilaiLulus = (clone $query)->whereNotNull('nilai_akhir')->pluck('nilai_akhir');
        $statistik = null;

        if ($nilaiLulus->isNotEmpty()) {
            $sorted = $nilaiLulus->sort()->values();
            $count = $sorted->count();
            $median = $count % 2 === 0
                ? ($sorted[$count / 2 - 1] + $sorted[$count / 2]) / 2
                : $sorted[floor($count / 2)];

            $statistik = [
                'min' => $sorted->first(),
                'max' => $sorted->last(),
                'median' => $median,
            ];
        }

        return [
            'rekap_per_prodi' => $rekapPerProdi,
            'total_lulus' => $totalLulus,
            'total_peserta' => $totalPeserta,
            'total_peminat' => 0,
            'statistik' => $statistik,
        ];
    }

    public function getGraduationDetails(string $nup): ?array
    {
        $peserta = Pendaftar::with(['lulusProdi', 'nilai.ujian'])
            ->where('kode_pendaftar', $nup)
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
            'nup' => $peserta->kode_pendaftar,
            'nama' => $peserta->nama,
            'foto' => $peserta->foto,
            'lulus' => $peserta->is_lulus,
            'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
            'lulus_tahap' => $peserta->lulus_tahap,
            'details_per_tahap' => $detailsPerTahap,
        ];
    }

    public function getLulusByProdi(int $prodiId): array
    {
        $prodi = Prodi::withCount(['pendaftarPil1', 'pendaftarPil2', 'pendaftarPil3'])->find($prodiId);
        if (! $prodi) {
            return ['error' => 'Program studi tidak ditemukan'];
        }

        $peserta = Pendaftar::with(['jalur', 'lulusTahap', 'lulusProdi', 'nilai'])
            ->where('lulus', $prodiId)
            ->orderBy('nama')
            ->get()
            ->map(function ($p) {
                $paramLulus = is_string($p->param_lulus) ? json_decode($p->param_lulus, true) : $p->param_lulus;
                $totalSkor = $paramLulus['total_skor'] ?? 0;
                $isPindahProdi = isset($paramLulus['pindah_prodi']) && $paramLulus['pindah_prodi'] === true;
                if ($isPindahProdi) {
                    $pilLabel = 'Diluar Prodi Pilihan';
                } else {
                    $pilLabel = isset($paramLulus['pilihan']) ? "Pilihan {$paramLulus['pilihan']}" : '-';
                }

                return [
                    'id' => $p->id,
                    'nup' => $p->kode_pendaftar,
                    'nama' => $p->nama,
                    'noujian' => $p->noujian,
                    'pilihan' => $pilLabel,
                    'tahap_lulus' => $p->jalur?->kode_jalur ?? '-',
                    'total_skor' => $totalSkor,
                    'status' => 'Lulus',
                    'lulus_prodi' => $p->lulusProdi?->kode_prodi,
                    'is_referensi' => (bool) $p->is_referensi,
                    'is_pindah_prodi' => $isPindahProdi,
                ];
            });

        $nilaiLulus = Pendaftar::where('lulus', $prodiId)
            ->whereNotNull('nilai_akhir')
            ->pluck('nilai_akhir');

        $statistik = null;

        if ($nilaiLulus->isNotEmpty()) {
            $sorted = $nilaiLulus->sort()->values();
            $count = $sorted->count();
            $median = $count % 2 === 0
                ? ($sorted[$count / 2 - 1] + $sorted[$count / 2]) / 2
                : $sorted[floor($count / 2)];

            $statistik = [
                'min' => $sorted->first(),
                'max' => $sorted->last(),
                'median' => $median,
            ];
        }

        return [
            'prodi' => [
                'id' => $prodi->id,
                'kode_prodi' => $prodi->kode_prodi,
                'nama_prodi' => $prodi->nama_prodi,
                'kuota_smm' => $prodi->kuota_smm,
            ],
            'total_peserta' => $prodi->pendaftar_pil1_count + $prodi->pendaftar_pil2_count + $prodi->pendaftar_pil3_count,
            'total_lulus' => $peserta->count(),
            'statistik' => $statistik,
            'peserta' => $peserta,
        ];
    }

    public function revokeLulus(int $pendaftarId): array
    {
        $peserta = Pendaftar::find($pendaftarId);
        if (! $peserta) {
            return ['success' => false, 'message' => 'Pendaftar tidak ditemukan'];
        }

        if (! $peserta->lulus) {
            return ['success' => false, 'message' => 'Pendaftar ini belum diluluskan'];
        }

        $peserta->update([
            'lulus' => null,
            'lulus_tahap' => null,
            'param_lulus' => null,
        ]);

        return ['success' => true, 'message' => "Kelulusan {$peserta->nama} berhasil dibatalkan."];
    }

    public function bulkRevokeLulus(array $pendaftarIds): array
    {
        $revoked = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            $pesertaList = Pendaftar::whereIn('id', $pendaftarIds)->get();

            foreach ($pesertaList as $peserta) {
                if (! $peserta->lulus) {
                    $errors[] = "{$peserta->nama} belum diluluskan";
                    continue;
                }

                $peserta->update([
                    'lulus' => null,
                    'lulus_tahap' => null,
                    'param_lulus' => null,
                ]);
                $revoked++;
            }

            DB::commit();

            $message = "Berhasil membatalkan kelulusan {$revoked} peserta";
            if (count($errors) > 0) {
                $message .= " dengan " . count($errors) . " error";
            }

            return [
                'success' => true,
                'message' => $message,
                'revoked' => $revoked,
                'errors' => $errors,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return ['success' => false, 'message' => 'Gagal membatalkan kelulusan: ' . $e->getMessage()];
        }
    }

    public function finalisasiSeleksi(): array
    {
        $updated = 0;

        DB::beginTransaction();
        try {
            $alreadyFinalized = Pendaftar::where('finalisasi', true)->count();
            if ($alreadyFinalized > 0) {
                return ['success' => false, 'message' => 'Seleksi sudah difinalisasi sebelumnya. Gunakan revert terlebih dahulu.'];
            }

            $count = Pendaftar::whereNull('lulus')->whereNull('noujian')->count();

            Pendaftar::query()->update(['finalisasi' => true]);
            $updated = Pendaftar::where('finalisasi', true)->count();

            DB::commit();

            return [
                'success' => true,
                'message' => "Finalisasi berhasil. {$updated} peserta telah ditandai.",
                'updated' => $updated,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return ['success' => false, 'message' => 'Gagal memfinalisasi: '.$e->getMessage()];
        }
    }

    public function revertFinalisasi(): array
    {
        DB::beginTransaction();
        try {
            $count = Pendaftar::where('finalisasi', true)->count();
            if ($count === 0) {
                return ['success' => false, 'message' => 'Tidak ada data yang perlu direvert.'];
            }

            Pendaftar::where('finalisasi', true)->update(['finalisasi' => false]);

            DB::commit();

            return [
                'success' => true,
                'message' => "Revert finalisasi berhasil. {$count} peserta dikembalikan ke status awal.",
                'reverted' => $count,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return ['success' => false, 'message' => 'Gagal revert finalisasi: '.$e->getMessage()];
        }
    }

    public function isFinalized(): bool
    {
        return Pendaftar::where('finalisasi', true)->exists();
    }

    public function isFinalizedTahap1(): bool
    {
        return Pendaftar::whereNull('lulus')->where('finalisasi', true)->exists();
    }
}
