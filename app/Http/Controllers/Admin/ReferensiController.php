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
}
