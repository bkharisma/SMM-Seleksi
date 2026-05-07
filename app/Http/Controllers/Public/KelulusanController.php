<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\KriteriaKelulusan;
use App\Models\Pendaftar;
use App\Models\TahapSeleksi;
use App\Services\SelectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class KelulusanController extends Controller
{
    protected SelectionService $selectionService;

    public function __construct(SelectionService $selectionService)
    {
        $this->selectionService = $selectionService;
    }

    public function index(): Response
    {
        return Inertia::render('public/kelulusan');
    }

    public function check(Request $request)
    {
        $validated = $request->validate([
            'nup' => 'required|string',
            'password' => 'required|string',
        ]);

        $peserta = Pendaftar::where('kode_pendaftar', $validated['nup'])
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian'])
            ->first();

        if (! $peserta) {
            return back()->withErrors(['nup' => 'NUP tidak ditemukan.']);
        }

        $user = $peserta->user;
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['password' => 'Password salah.']);
        }

        $peserta->touch();

        $detailsPerTahap = $this->getDetailsPerTahap($peserta);

        return Inertia::render('public/kelulusan', [
            'peserta' => [
                'nup' => $peserta->kode_pendaftar,
                'nama' => $peserta->nama,
                'foto' => $peserta->foto,
                'pil1' => $peserta->pil1Prodi?->nama_prodi,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
                'lulus_tahap' => $peserta->lulus_tahap,
                'nilai' => $this->getNilaiSummary($peserta),
                'details_per_tahap' => $detailsPerTahap,
                'tgl_cek_lulus' => $peserta->updated_at,
            ],
        ]);
    }

    protected function getNilaiSummary(Pendaftar $peserta): array
    {
        $nilaiList = $peserta->nilai;

        return [
            'psikotes' => $nilaiList->firstWhere('type', 'psikotes')?->skor_akhir,
            'inggris' => $nilaiList->firstWhere('type', 'bhs_inggris')?->skor_akhir,
            'wawancara' => $nilaiList->firstWhere('type', 'wawancara')?->skor_akhir,
            'kesehatan' => $nilaiList->firstWhere('type', 'kesehatan')?->skor_akhir,
        ];
    }

    protected function getDetailsPerTahap(Pendaftar $peserta): array
    {
        $tahapList = TahapSeleksi::active()->orderBy('urutan')->get();
        $details = [];

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
                'reasons' => [],
            ];

            if ($kriteria && $peserta->nilai) {
                $eval = $this->selectionService->evaluatePeserta($peserta, $kriteria);
                $detail['lulus'] = $eval['lulus'];
                $detail['scores'] = $eval['scores'];
                $detail['reasons'] = $eval['reasons'] ?? [];
            }

            $details[] = $detail;
        }

        return $details;
    }
}
