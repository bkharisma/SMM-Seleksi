<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\KriteriaKelulusan;
use App\Models\Peserta;
use App\Models\TahapSeleksi;
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
        $peserta = Peserta::where('user_id', $user->id)
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian', 'raport', 'kesehatan'])
            ->first();

        $profileCompleteness = 0;
        $profileFields = [];

        if ($peserta) {
            $fields = [
                ['key' => 'nik', 'label' => 'NIK', 'check' => ! empty($peserta->nik)],
                ['key' => 'tempatlahir', 'label' => 'Tempat Lahir', 'check' => ! empty($peserta->tempatlahir)],
                ['key' => 'tgllahir', 'label' => 'Tanggal Lahir', 'check' => ! empty($peserta->tgllahir)],
                ['key' => 'sex', 'label' => 'Jenis Kelamin', 'check' => ! empty($peserta->sex)],
                ['key' => 'agama', 'label' => 'Agama', 'check' => ! empty($peserta->agama)],
                ['key' => 'hp', 'label' => 'No. HP', 'check' => ! empty($peserta->hp)],
                ['key' => 'alamat', 'label' => 'Alamat', 'check' => ! empty($peserta->alamat)],
                ['key' => 'nm_ibu', 'label' => 'Nama Ibu', 'check' => ! empty($peserta->nm_ibu)],
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

        return Inertia::render('member/dashboard', [
            'peserta' => $peserta ? [
                'id' => $peserta->id,
                'nama' => $peserta->nama,
                'nup' => $peserta->nup,
                'noujian' => $peserta->noujian,
                'status' => $peserta->status,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
                'lulus_tahap' => $peserta->lulus_tahap,
                'pil1_prodi' => $peserta->pil1Prodi?->nama_prodi,
                'foto' => $peserta->foto,
                'nilai' => [
                    'psikotes' => $peserta->nil_psikotes,
                    'inggris' => $peserta->nil_bhsinggris,
                    'wawancara' => $peserta->nil_wawancara,
                    'kesehatan' => $peserta->nil_kesehatan,
                ],
                'raport_status' => $peserta->raport?->status,
                'kesehatan_status' => $peserta->kesehatan?->status,
            ] : null,
            'profile_completeness' => $profileCompleteness,
            'profile_fields' => $profileFields,
            'details_per_tahap' => $detailsPerTahap,
            'jadwal' => $jadwal,
        ]);
    }
}
