<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\News;
use App\Models\Pendaftar;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function index(): Response
    {
        $news = News::published()->latest('published_at')->take(5)->get();
        $jadwal = Jadwal::active()->latest('tgl_awal')->take(5)->get();

        return Inertia::render('public/home', [
            'news' => $news,
            'jadwal' => $jadwal,
        ]);
    }

    public function verify(string $noujian): Response
    {
        $peserta = Pendaftar::with(['lulusProdi', 'ruang', 'pil1Prodi'])
            ->where('noujian', $noujian)
            ->first();

        return Inertia::render('public/verifikasi', [
            'peserta' => $peserta ? [
                'nup' => $peserta->kode_pendaftar,
                'noujian' => $peserta->noujian,
                'nama' => $peserta->nama,
                'foto' => $peserta->foto,
                'tempatlahir' => $peserta->tempat_lahir,
                'tgllahir' => $peserta->tanggal_lahir,
                'sex' => $peserta->jenis_kelamin,
                'pil1' => $peserta->pil1Prodi?->nama_prodi,
                'ruang' => $peserta->ruang ? [
                    'nomor_ruang' => $peserta->ruang->nomor_ruang,
                    'nama_gedung' => $peserta->ruang->nama_gedung,
                ] : null,
                'lulus' => $peserta->lulus,
                'lulus_prodi' => $peserta->lulusProdi?->nama_prodi,
                'lulus_tahap' => $peserta->lulus_tahap,
            ] : null,
        ]);
    }

    public function buktiDaftar(string $nup): Response
    {
        $peserta = Pendaftar::with(['pil1Prodi', 'pil2Prodi', 'pil3Prodi'])
            ->where('kode_pendaftar', $nup)
            ->first();

        if (! $peserta) {
            return redirect()->route('home')->with('error', 'Data tidak ditemukan.');
        }

        return Inertia::render('public/bukti-daftar', [
            'peserta' => $peserta,
        ]);
    }
}
