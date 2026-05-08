<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use App\Models\Prodi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferensiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pendaftar::with(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'lulusProdi'])
            ->whereNotNull('noujian');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if ($request->filled('prodi_id')) {
            $prodiId = (int) $request->prodi_id;
            $query->where(function ($q) use ($prodiId) {
                $q->where('pil1', $prodiId)
                    ->orWhere('pil2', $prodiId)
                    ->orWhere('pil3', $prodiId);
            });
        }

        if ($request->filled('is_referensi')) {
            $query->where('is_referensi', $request->is_referensi === '1');
        }

        $pendaftar = $query->orderBy('nama')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/referensi/index', [
            'pendaftar' => $pendaftar,
            'prodi' => Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi']),
            'filters' => $request->only(['search', 'prodi_id', 'is_referensi']),
        ]);
    }

    public function toggle(Request $request, Pendaftar $pendaftar): RedirectResponse
    {
        $isReferensi = ! $pendaftar->is_referensi;

        if ($isReferensi) {
            $pendaftar->update([
                'is_referensi' => true,
                'catatan_referensi' => $request->catatan_referensi,
            ]);
            $status = 'ditandai sebagai referensi';
        } else {
            $pendaftar->update([
                'is_referensi' => false,
                'catatan_referensi' => null,
            ]);
            $status = 'dihapus dari referensi';
        }

        return redirect()->back()->with('success',
            "{$pendaftar->nama} ({$pendaftar->kode_pendaftar}) berhasil {$status}."
        );
    }

    public function nilai(Pendaftar $pendaftar)
    {
        $pendaftar->load(['nilai.ujian', 'pil1Prodi']);

        $agregasi = ['has_lulus' => false];

        if ($pendaftar->pil1) {
            $nilaiLulus = Pendaftar::where('lulus', $pendaftar->pil1)
                ->whereNotNull('nilai_akhir')
                ->pluck('nilai_akhir');

            if ($nilaiLulus->isNotEmpty()) {
                $sorted = $nilaiLulus->sort()->values();
                $count = $sorted->count();
                $median = $count % 2 === 0
                    ? ($sorted[$count / 2 - 1] + $sorted[$count / 2]) / 2
                    : $sorted[floor($count / 2)];

                $agregasi = [
                    'has_lulus' => true,
                    'prodi_nama' => $pendaftar->pil1Prodi?->nama_prodi,
                    'jumlah_lulus' => $count,
                    'nilai_akhir' => [
                        'min' => $sorted->first(),
                        'max' => $sorted->last(),
                        'median' => $median,
                    ],
                ];
            }
        }

        return response()->json([
            'nama' => $pendaftar->nama,
            'kode_pendaftar' => $pendaftar->kode_pendaftar,
            'noujian' => $pendaftar->noujian,
            'nilai' => $pendaftar->nilai->map(function ($n) {
                return [
                    'id' => $n->id,
                    'nup' => $n->nup,
                    'nus' => $n->nus,
                    'type' => $n->type,
                    'skor_akhir' => $n->skor_akhir,
                    'ujian_nama' => $n->ujian?->nama_ujian ?? $n->ujian?->nama ?? 'Nilai',
                    'fields_config' => $n->ujian?->fields_config,
                    'psi_iq' => $n->psi_iq,
                    'psi_bobot' => $n->psi_bobot,
                    'bing_nil' => $n->bing_nil,
                    'waw_nil' => $n->waw_nil,
                    'kes_tb' => $n->kes_tb,
                    'kes_bw' => $n->kes_bw,
                    'kes_paru' => $n->kes_paru,
                    'kes_scol' => $n->kes_scol,
                    'kes_hamil' => $n->kes_hamil,
                    'minat_dominan' => $n->minat_dominan,
                ];
            }),
            'agregasi' => $agregasi,
        ]);
    }
}
