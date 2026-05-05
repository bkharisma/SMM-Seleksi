<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\KriteriaKelulusan;
use App\Models\Peserta;
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

        $peserta = Peserta::where('nup', $validated['nup'])
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian'])
            ->first();

        if (! $peserta) {
            return back()->withErrors(['nup' => 'NUP tidak ditemukan.']);
        }

        $user = $peserta->user;
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['password' => 'Password salah.']);
        }

        // Track check time
        $peserta->update([
            'tgl_cek_lulus' => now()->toISOString(),
        ]);

        // Get per-tahap details
        $detailsPerTahap = $this->getDetailsPerTahap($peserta);

        return Inertia::render('public/kelulusan', [
            'peserta' => [
                'nup' => $peserta->nup,
                'nama' => $peserta->nama,
                'foto' => $peserta->foto,
                'pil1' => $peserta->pil1Prodi?->nama_prodi,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
                'lulus_tahap' => $peserta->lulus_tahap,
                'nilai' => [
                    'psikotes' => $peserta->nil_psikotes,
                    'inggris' => $peserta->nil_bhsinggris,
                    'wawancara' => $peserta->nil_wawancara,
                    'kesehatan' => $peserta->nil_kesehatan,
                ],
                'details_per_tahap' => $detailsPerTahap,
                'tgl_cek_lulus' => $peserta->tgl_cek_lulus,
            ],
        ]);
    }

    protected function getDetailsPerTahap(Peserta $peserta): array
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
