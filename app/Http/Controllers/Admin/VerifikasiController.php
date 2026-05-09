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
        $totalLulus = Pendaftar::whereNotNull('lulus')->count();

        $kesehatanCount = Kesehatan::selectRaw('status, COUNT(*) as count')
            ->whereHas('pendaftar', function ($q) {
                $q->whereNotNull('lulus');
            })
            ->groupBy('status')
            ->pluck('count', 'status');

        $belumUpload = Pendaftar::whereNotNull('lulus')
            ->whereDoesntHave('kesehatan')
            ->count();

        $query = Pendaftar::whereNotNull('lulus')
            ->with(['pil1Prodi', 'lulusProdi', 'kesehatan', 'kesehatan.diverifikasiOleh']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'Belum Upload') {
                $query->whereDoesntHave('kesehatan');
            } else {
                $query->whereHas('kesehatan', function ($q) use ($request) {
                    $q->where('status', $request->status);
                });
            }
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');

        if ($sort === 'status') {
            $query->leftJoin('kesehatan', 'pendaftar.id', '=', 'kesehatan.pendaftar_id')
                ->orderByRaw('COALESCE(kesehatan.status, "Belum Upload") ' . $order)
                ->select('pendaftar.*');
        } else {
            $query->orderBy($sort, $order);
        }

        $peserta = $query->paginate(15)->withQueryString();

        $peserta->getCollection()->transform(function ($item) {
            $data = $item->toArray();
            $data['kesehatan_status'] = $item->kesehatan ? $item->kesehatan->status : 'Belum Upload';
            $data['kesehatan_id'] = $item->kesehatan ? $item->kesehatan->id : null;
            $data['kesehatan_data'] = $item->kesehatan ? $item->kesehatan->toArray() : null;
            return $data;
        });

        return Inertia::render('admin/syarat/index', [
            'kesehatan_stats' => [
                'total_lulus' => $totalLulus,
                'belum_upload' => $belumUpload,
                'belum_diperiksa' => $kesehatanCount['Belum Diperiksa'] ?? 0,
                'lengkap' => $kesehatanCount['Lengkap'] ?? 0,
                'tidak_lengkap' => $kesehatanCount['Tidak Lengkap'] ?? 0,
                'perbaikan' => $kesehatanCount['Perbaikan'] ?? 0,
            ],
            'kesehatan' => $peserta,
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

        $updateData = [
            'status' => $validated['status'],
            'catatan' => $validated['status'] === 'Lengkap' ? null : ($validated['catatan'] ?? $kesehatan->catatan),
            'verifikasi_terakhir' => now(),
            'diverifikasi_oleh_id' => Auth::id(),
        ];

        if (in_array($validated['status'], ['Tidak Lengkap', 'Perbaikan'])) {
            $updateData['finalized'] = false;
            $updateData['finalized_at'] = null;
        }

        $kesehatan->update($updateData);

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
