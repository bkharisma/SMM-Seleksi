<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\News;
use App\Models\Pendaftar;
use App\Models\Setup;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function index(): Response
    {
        $news = News::published()->latest('published_at')->take(5)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'post_name' => $item->post_name,
                'news_type' => $item->news_type,
                'img' => $item->img,
                'pdf' => $item->pdf,
                'published_at' => $item->published_at,
            ];
        });
        $jadwal = Jadwal::active()->orderBy('urutan', 'asc')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_jadwal' => $item->nama_jadwal,
                'keterangan' => $item->keterangan,
                'tgl_awal' => $item->tgl_awal,
                'tgl_akhir' => $item->tgl_akhir,
                'jam_awal' => $item->jam_awal,
                'jam_akhir' => $item->jam_akhir,
                'jenis' => $item->jenis,
            ];
        });

        $settings = Setup::all()->keyBy('code');
        $heroImagePath = $settings->get('hero_image_path')?->char_val ?? '';
        $accreditationImagePath = $settings->get('accreditation_image_path')?->char_val ?? '';
        $tahunAkademik = $settings->get('tahun_akademik')?->char_val ?? '2024/2025';

        return Inertia::render('public/home', [
            'news' => $news,
            'jadwal' => $jadwal,
            'hero_image_url' => $heroImagePath ? "/storage/{$heroImagePath}" : null,
            'accreditation_image_url' => $accreditationImagePath ? "/storage/{$accreditationImagePath}" : null,
            'tahun_akademik' => $tahunAkademik,
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

    public function indexNews(): Response
    {
        $news = News::published()->latest('published_at')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'post_name' => $item->post_name,
                'news_type' => $item->news_type,
                'img' => $item->img,
                'pdf' => $item->pdf,
                'published_at' => $item->published_at,
            ];
        });

        return Inertia::render('public/news', [
            'news' => $news,
        ]);
    }

    public function showNews(int $id): Response
    {
        $news = News::published()->find($id);

        if (! $news) {
            abort(404);
        }

        return Inertia::render('public/news-detail', [
            'news' => [
                'id' => $news->id,
                'title' => $news->title,
                'description' => $news->description,
                'post_name' => $news->post_name,
                'news_type' => $news->news_type,
                'img' => $news->img,
                'pdf' => $news->pdf,
                'published_at' => $news->published_at,
            ],
        ]);
    }

    public function jadwal(): Response
    {
        $jadwal = Jadwal::active()->orderBy('urutan', 'asc')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_jadwal' => $item->nama_jadwal,
                'keterangan' => $item->keterangan,
                'tgl_awal' => $item->tgl_awal,
                'tgl_akhir' => $item->tgl_akhir,
                'jam_awal' => $item->jam_awal,
                'jam_akhir' => $item->jam_akhir,
                'jenis' => $item->jenis,
            ];
        });

        return Inertia::render('public/jadwal', [
            'jadwal' => $jadwal,
        ]);
    }

    public function kontak(): Response
    {
        $settings = Setup::all()->keyBy('code');

        $data = [
            'nama_ptp' => $settings->get('nama_ptp')?->char_val ?? '',
            'alamat_ptp' => $settings->get('alamat_ptp')?->char_val ?? '',
            'telepon_ptp' => $settings->get('telepon_ptp')?->char_val ?? '',
            'email_ptp' => $settings->get('email_ptp')?->char_val ?? '',
            'website_ptp' => $settings->get('website_ptp')?->char_val ?? '',
        ];

        return Inertia::render('public/kontak', [
            'settings' => $data,
        ]);
    }

    public function kebijakanPrivasi(): Response
    {
        return Inertia::render('public/kebijakan-privasi');
    }

    public function syaratKetentuan(): Response
    {
        return Inertia::render('public/syarat-ketentuan');
    }
}
