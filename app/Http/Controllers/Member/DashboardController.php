<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\KriteriaKelulusan;
use App\Models\Pendaftar;
use App\Models\TahapSeleksi;
use App\Models\Setup;
use App\Services\SelectionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected SelectionService $selectionService;

    public function __construct(SelectionService $selectionService)
    {
        $this->selectionService = $selectionService;
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian', 'kesehatan', 'fileKesehatan'])
            ->first();

        $profileCompleteness = 0;
        $profileFields = [];

        if ($peserta) {
            $fields = [
                ['key' => 'tempat_lahir', 'label' => 'Tempat Lahir', 'check' => ! empty($peserta->tempat_lahir)],
                ['key' => 'tanggal_lahir', 'label' => 'Tanggal Lahir', 'check' => ! empty($peserta->tanggal_lahir)],
                ['key' => 'jenis_kelamin', 'label' => 'Jenis Kelamin', 'check' => ! empty($peserta->jenis_kelamin)],
                ['key' => 'agama', 'label' => 'Agama', 'check' => ! empty($peserta->agama)],
                ['key' => 'no_hp', 'label' => 'No. HP', 'check' => ! empty($peserta->no_hp)],
                ['key' => 'alamat', 'label' => 'Alamat', 'check' => ! empty($peserta->alamat)],
                ['key' => 'nama_ibu', 'label' => 'Nama Ibu', 'check' => ! empty($peserta->nama_ibu)],
                ['key' => 'nama_sekolah', 'label' => 'Nama Sekolah', 'check' => ! empty($peserta->nama_sekolah)],
                ['key' => 'foto', 'label' => 'Foto', 'check' => ! empty($peserta->foto)],
            ];

            $filledCount = 0;
            foreach ($fields as $field) {
                if ($field['check']) {
                    $filledCount++;
                }
                $profileFields[] = $field;
            }

            $profileCompleteness = count($fields) > 0 ? round(($filledCount / count($fields)) * 100) : 0;
        }

        $detailsPerTahap = [];
        if ($peserta) {
            $tahapList = TahapSeleksi::active()->orderBy('urutan')->get();

            foreach ($tahapList as $tahap) {
                $kriteria = $this->selectionService->getKriteriaForProdiTahap($peserta->pil1 ?? 0, $tahap->id);

                if (! $kriteria) {
                    $kriteria = KriteriaKelulusan::where('tahap_seleksi_id', $tahap->id)
                        ->where('active', true)
                        ->first();
                }

                $detail = [
                    'tahap_nama' => $tahap->nama,
                    'urutan' => $tahap->urutan,
                    'lulus' => false,
                    'scores' => [],
                ];

                if ($kriteria && $peserta->nilai) {
                    $eval = $this->selectionService->evaluatePeserta($peserta, $kriteria);
                    $detail['lulus'] = $eval['lulus'];
                    $detail['scores'] = $eval['scores'];
                }

                $detailsPerTahap[] = $detail;
            }
        }

        $jadwal = Jadwal::active()
            ->orderBy('tgl_awal')
            ->get()
            ->map(function ($j) {
                return [
                    'nama_jadwal' => $j->nama_jadwal,
                    'tgl_awal' => $j->tgl_awal?->format('d M Y'),
                    'tgl_akhir' => $j->tgl_akhir?->format('d M Y'),
                    'jam_awal' => $j->jam_awal,
                    'jam_akhir' => $j->jam_akhir,
                    'keterangan' => $j->keterangan,
                    'jenis' => $j->jenis,
                ];
            });

        $dashboardLengkap = Setup::get('dashboard_lengkap', 1);
        $dashboardUploadSyarat = Setup::get('dashboard_upload_syarat', 0);

        $activeDashboardType = $dashboardUploadSyarat == 1 ? 'upload_syarat' : 'lengkap';

        $kesehatanData = null;
        $parameters = [];

        if ($peserta) {
            if ($peserta->kesehatan) {
                $kesehatanData = [
                    'status' => $peserta->kesehatan->status,
                    'catatan' => $peserta->kesehatan->catatan,
                    'finalized' => $peserta->kesehatan->finalized,
                    'finalized_at' => $peserta->kesehatan->finalized_at,
                    'files' => $peserta->fileKesehatan->map(function ($f) {
                        return [
                            'id' => $f->id,
                            'file_lockes' => $f->file_lockes,
                            'is_revisi' => $f->is_revisi,
                        ];
                    })->toArray(),
                ];
            }

            if ($peserta->pil1) {
                $kriteria = KriteriaKelulusan::where('prodi_id', $peserta->pil1)
                    ->whereHas('kriteriaUjian', function ($q) {
                        $q->where('jenis', 'kesehatan');
                    })
                    ->with('kriteriaUjian')
                    ->first();

                if ($kriteria) {
                    foreach ($kriteria->kriteriaUjian as $ku) {
                        if ($ku->jenis === 'kesehatan' && $ku->parameters) {
                            $parameters = array_merge($parameters, $ku->parameters);
                        }
                    }
                }
            }
        }

        $lulusTahap1 = false;
        $lulusTahap1Prodi = null;
        $isFinalized = $this->selectionService->isFinalized();

        if ($isFinalized) {
            if ($peserta->lulus !== null) {
                $lulusTahap1 = true;
                $lulusTahap1Prodi = $peserta->lulusProdi?->nama_prodi;
            }
        } else {
            foreach ($detailsPerTahap as $tahap) {
                if ($tahap['urutan'] === 1 && $tahap['lulus']) {
                    $lulusTahap1 = true;
                    $lulusTahap1Prodi = $peserta->lulusProdi?->nama_prodi;
                    break;
                }
            }
        }

        return Inertia::render('member/dashboard', [
            'peserta' => $peserta ? [
                'id' => $peserta->id,
                'nama' => $peserta->nama,
                'nup' => $peserta->kode_pendaftar,
                'noujian' => $peserta->noujian,
                'status' => (bool) $peserta->noujian,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
                'lulus_tahap' => $peserta->lulus_tahap,
                'pil1_prodi' => $peserta->pil1Prodi?->nama_prodi,
                'foto' => $peserta->foto,
                'email' => $peserta->email,
                'tanggal_lahir' => $peserta->tanggal_lahir,
                'jenis_kelamin' => $peserta->jenis_kelamin,
                'no_hp' => $peserta->no_hp,
                'nilai' => [
                    'psikotes' => $peserta->nilai?->firstWhere('type', 'psikotes')?->skor_akhir,
                    'inggris' => $peserta->nilai?->firstWhere('type', 'bhs_inggris')?->skor_akhir,
                    'wawancara' => $peserta->nilai?->firstWhere('type', 'wawancara')?->skor_akhir,
                    'kesehatan' => $peserta->nilai?->firstWhere('type', 'kesehatan')?->skor_akhir,
                ],
                'kesehatan_status' => $peserta->kesehatan?->status,
                'kesehatan_catatan' => $peserta->kesehatan?->catatan,
                'lulus_tahap_1' => $lulusTahap1,
                'lulus_tahap_1_prodi' => $lulusTahap1Prodi,
                'is_finalized' => $isFinalized,
            ] : null,
            'kesehatan' => $peserta ? array_merge($kesehatanData ?? [], [
                'full' => $peserta->kesehatan,
                'parameters' => $parameters,
            ]) : null,
            'profile_completeness' => $profileCompleteness,
            'profile_fields' => $profileFields,
            'details_per_tahap' => $detailsPerTahap,
            'jadwal' => $jadwal,
            'active_dashboard_type' => $activeDashboardType,
        ]);
    }
}
