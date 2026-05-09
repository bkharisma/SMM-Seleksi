<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KesehatanExport;
use App\Exports\RaportExport;
use App\Http\Controllers\Controller;
use App\Models\Kesehatan;
use App\Models\Raport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PendaftarUploadController extends Controller
{
    public function raportIndex(Request $request): Response
    {
        $query = Raport::with(['pendaftar' => function ($q) {
            $q->with('pil1Prodi');
        }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pendaftar', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('raport.status', $request->status);
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $raport = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/upload/raport-index', [
            'raport' => $raport,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function raportShow(Raport $raport): Response
    {
        $raport->load(['pendaftar' => function ($q) {
            $q->with('pil1Prodi');
        }, 'fileRaport']);

        return Inertia::render('admin/upload/raport-form', [
            'raport' => $raport,
        ]);
    }

    public function updateRaportStatus(Request $request, Raport $raport): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Belum Diperiksa,Lengkap,Tidak Lengkap,Perbaikan',
            'catatan' => 'nullable|string|max:500',
        ]);

        $raport->update($validated);

        return redirect()->back()->with('success', 'Status raport berhasil diperbarui.');
    }

    public function exportRaport(Request $request)
    {
        return Excel::download(new RaportExport($request->only(['search', 'status'])), 'raport-'.now()->format('Y-m-d').'.xlsx');
    }

    public function kesehatanIndex(Request $request): Response
    {
        $query = Kesehatan::with(['pendaftar' => function ($q) {
            $q->with('pil1Prodi');
        }]);

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

        return Inertia::render('admin/upload/kesehatan-index', [
            'kesehatan' => $kesehatan,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function kesehatanShow(Kesehatan $kesehatan): Response
    {
        $kesehatan->load(['pendaftar' => function ($q) {
            $q->with('pil1Prodi');
        }, 'fileKesehatan']);

        return Inertia::render('admin/upload/kesehatan-form', [
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
        ];

        if (in_array($validated['status'], ['Tidak Lengkap', 'Perbaikan'])) {
            $updateData['finalized'] = false;
            $updateData['finalized_at'] = null;
        }

        $kesehatan->update($updateData);

        return redirect()->back()->with('success', 'Status kesehatan berhasil diperbarui.');
    }

    public function exportKesehatan(Request $request)
    {
        return Excel::download(new KesehatanExport($request->only(['search', 'status'])), 'kesehatan-'.now()->format('Y-m-d').'.xlsx');
    }
}
