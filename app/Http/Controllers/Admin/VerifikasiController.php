<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kesehatan;
use App\Models\Pendaftar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class VerifikasiController extends Controller
{
    public function index(Request $request): Response
    {
        $kesehatanCount = Kesehatan::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalKesehatan = Kesehatan::count();

        $query = Kesehatan::with(['pendaftar' => function ($q) {
            $q->with(['pil1Prodi', 'lulusProdi']);
        }, 'diverifikasiOleh']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pendaftar', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('kesehatan.status', $request->status);
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $kesehatan = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/syarat/index', [
            'kesehatan_stats' => [
                'total' => $totalKesehatan,
                'belum_diperiksa' => $kesehatanCount['Belum Diperiksa'] ?? 0,
                'lengkap' => $kesehatanCount['Lengkap'] ?? 0,
                'tidak_lengkap' => $kesehatanCount['Tidak Lengkap'] ?? 0,
                'perbaikan' => $kesehatanCount['Perbaikan'] ?? 0,
            ],
            'kesehatan' => $kesehatan,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function showKesehatanDetail(Kesehatan $kesehatan): Response
    {
        $kesehatan->load(['pendaftar' => function ($q) {
            $q->with(['pil1Prodi', 'lulusProdi']);
        }, 'fileKesehatan', 'diverifikasiOleh']);

        return Inertia::render('admin/syarat/kesehatan-form', [
            'kesehatan' => $kesehatan,
        ]);
    }

    public function updateKesehatanStatus(Request $request, Kesehatan $kesehatan): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Belum Diperiksa,Lengkap,Tidak Lengkap,Perbaikan',
            'catatan' => 'nullable|string|max:500',
        ]);

        $kesehatan->update([
            'status' => $validated['status'],
            'catatan' => $validated['catatan'] ?? null,
            'verifikasi_terakhir' => now(),
            'diverifikasi_oleh_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Status kesehatan berhasil diperbarui.');
    }

    public function showPesertaDetail(Pendaftar $pendaftar): Response
    {
        $pendaftar->load(['pil1Prodi', 'lulusProdi', 'lulusTahap', 'kesehatan', 'fileKesehatan']);

        return Inertia::render('admin/syarat/peserta-detail', [
            'pendaftar' => $pendaftar,
        ]);
    }
}
