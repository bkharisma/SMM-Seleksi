<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\KriteriaKelulusan;
use App\Models\Pendaftar;
use App\Models\Setup;
use App\Models\TahapSeleksi;
use App\Services\KelulusanRekapService;
use App\Services\SelectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class KelulusanController extends Controller
{
    protected SelectionService $selectionService;

    protected KelulusanRekapService $kelulusanRekapService;

    public function __construct(SelectionService $selectionService, KelulusanRekapService $kelulusanRekapService)
    {
        $this->selectionService = $selectionService;
        $this->kelulusanRekapService = $kelulusanRekapService;
    }

    protected function validatePeserta(Request $request): ?Pendaftar
    {
        $validated = $request->validate([
            'nup' => 'required|string',
            'password' => 'required|string',
        ]);

        $peserta = Pendaftar::where('kode_pendaftar', $validated['nup'])
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian'])
            ->first();

        if (! $peserta) {
            return null;
        }

        $user = $peserta->user;
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return null;
        }

        return $peserta;
    }

    public function index(): Response
    {
        $tahap1Dibuka = (bool) Setup::get('kelulusan_tahap_1_dibuka', 0);
        $tahap2Dibuka = (bool) Setup::get('kelulusan_tahap_2_dibuka', 0);

        return Inertia::render('public/kelulusan', [
            'tahap1_dibuka' => $tahap1Dibuka,
            'tahap2_dibuka' => $tahap2Dibuka,
        ]);
    }

    public function tahap1(): Response
    {
        return Inertia::render('public/kelulusan-tahap1');
    }

    public function checkTahap1(Request $request)
    {
        $validated = $request->validate([
            'nup' => 'required|string',
            'password' => 'required|string',
        ]);

        $peserta = Pendaftar::where('kode_pendaftar', $validated['nup'])
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian', 'lulusTahap'])
            ->first();

        if (! $peserta) {
            return back()->withErrors(['nup' => 'NUP tidak ditemukan.']);
        }

        $user = $peserta->user;
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['password' => 'Password salah.']);
        }

        if (! (bool) Setup::get('kelulusan_tahap_1_dibuka', 0)) {
            return back()->withErrors(['nup' => 'Pengumuman kelulusan Tahap 1 belum tersedia.']);
        }

        $peserta->touch();

        $tahap1 = TahapSeleksi::where('urutan', 1)->where('active', true)->first();

        $tahap1Result = $this->evaluateTahap($peserta, $tahap1);

        if ($peserta->finalisasi) {
            if ($peserta->lulus !== null && $tahap1 && $peserta->lulus_tahap == $tahap1->id) {
                $lulusTahap1 = true;
                $statusKelulusan = 'lulus';
            } else {
                $lulusTahap1 = false;
                $statusKelulusan = 'tidak_lulus';
            }
        } else {
            $lulusTahap1 = false;
            $statusKelulusan = 'belum_diproses';
        }

        $lulusProdi = $peserta->lulusProdi?->nama_prodi;
        $lulusTahapNama = $peserta->lulusTahap?->nama;

        return Inertia::render('public/kelulusan-tahap1', [
            'peserta' => [
                'nup' => $peserta->kode_pendaftar,
                'nama' => $peserta->nama,
                'pil1' => $peserta->pil1Prodi?->nama_prodi,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $lulusProdi,
                'lulus_tahap_nama' => $lulusTahapNama,
                'lulus_tahap_1' => $lulusTahap1,
                'status_kelulusan' => $statusKelulusan,
                'nilai' => $this->getNilaiSummary($peserta),
                'detail' => $tahap1Result,
                'tgl_cek' => $peserta->updated_at,
            ],
        ]);
    }

    public function tahap2(): Response
    {
        return Inertia::render('public/kelulusan-tahap2');
    }

    public function checkTahap2(Request $request)
    {
        $validated = $request->validate([
            'nup' => 'required|string',
            'password' => 'required|string',
        ]);

        $peserta = Pendaftar::where('kode_pendaftar', $validated['nup'])
            ->with(['lulusProdi', 'pil1Prodi', 'nilai.ujian', 'lulusTahap'])
            ->first();

        if (! $peserta) {
            return back()->withErrors(['nup' => 'NUP tidak ditemukan.']);
        }

        $user = $peserta->user;
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return back()->withErrors(['password' => 'Password salah.']);
        }

        if (! (bool) Setup::get('kelulusan_tahap_2_dibuka', 0)) {
            return back()->withErrors(['nup' => 'Pengumuman kelulusan Tahap 2 belum tersedia.']);
        }

        $peserta->touch();

        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();

        $tahap2Result = $this->evaluateTahap($peserta, $tahap2);

        if ($peserta->finalisasi) {
            if ($peserta->lulus_tahap && $tahap2 && $peserta->lulus_tahap == $tahap2->id) {
                $lulusTahap2 = true;
                $statusKelulusan = 'lulus';
            } else {
                $lulusTahap2 = false;
                $statusKelulusan = 'tidak_lulus';
            }
        } else {
            $lulusTahap2 = false;
            $statusKelulusan = 'belum_diproses';
        }

        $lulusProdi = $peserta->lulusProdi?->nama_prodi;
        $lulusTahapNama = $peserta->lulusTahap?->nama;

        return Inertia::render('public/kelulusan-tahap2', [
            'peserta' => [
                'nup' => $peserta->kode_pendaftar,
                'nama' => $peserta->nama,
                'pil1' => $peserta->pil1Prodi?->nama_prodi,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $lulusProdi,
                'lulus_tahap_nama' => $lulusTahapNama,
                'lulus_tahap_2' => $lulusTahap2,
                'status_kelulusan' => $statusKelulusan,
                'nilai' => $this->getNilaiSummary($peserta),
                'detail' => $tahap2Result,
                'tgl_cek' => $peserta->updated_at,
            ],
        ]);
    }

    protected function evaluateTahap(Pendaftar $peserta, TahapSeleksi $tahap): ?array
    {
        $kriteria = $this->selectionService->getKriteriaForProdiTahap($peserta->pil1 ?? 0, $tahap->id);

        if (! $kriteria) {
            $kriteria = KriteriaKelulusan::where('tahap_seleksi_id', $tahap->id)
                ->where('active', true)
                ->first();
        }

        if (! $kriteria || ! $peserta->nilai) {
            return null;
        }

        return $this->selectionService->evaluatePeserta($peserta, $kriteria);
    }

    protected function getNilaiSummary(Pendaftar $peserta): array
    {
        $nilaiList = $peserta->nilai;

        return [
            'psikotes' => $nilaiList->firstWhere('type', 'PSI')?->skor_akhir,
            'inggris' => $nilaiList->firstWhere('type', 'LBI')?->skor_akhir,
            'wawancara' => $nilaiList->firstWhere('type', 'WW')?->skor_akhir,
            'kesehatan' => $nilaiList->firstWhere('type', 'KSH')?->skor_akhir,
        ];
    }
}
