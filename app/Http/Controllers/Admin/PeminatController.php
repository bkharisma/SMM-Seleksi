<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PeminatExport;
use App\Http\Controllers\Controller;
use App\Imports\PeminatImport;
use App\Models\Peminat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PeminatController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Peminat::with(['pil1Prodi', 'pil2Prodi', 'bsiPembayaran']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nup', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('prodi_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('pil1', $request->prodi_id)
                    ->orWhere('pil2', $request->prodi_id)
                    ->orWhere('pil3', $request->prodi_id)
                    ->orWhere('pil4', $request->prodi_id);
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'paid') {
                $query->whereHas('bsiPembayaran', function ($q) {
                    $q->whereNotNull('datetime_payment');
                });
            } elseif ($request->status === 'unpaid') {
                $query->whereDoesntHave('bsiPembayaran', function ($q) {
                    $q->whereNotNull('datetime_payment');
                });
            }
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $peminat = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/peminat/index', [
            'peminat' => $peminat,
            'filters' => $request->only(['search', 'prodi_id', 'status']),
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(new PeminatExport($request->only(['search', 'prodi_id', 'status'])), 'peminat-'.now()->format('Y-m-d').'.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        $import = new PeminatImport;
        Excel::import($import, $validated['file']);

        return redirect()->back()->with('success', "Berhasil import {$import->getRowCount()} data peminat.");
    }

    public function template()
    {
        return Excel::download(new PeminatExport([], true), 'template-peminat.xlsx');
    }

    public function destroy(Peminat $peminat)
    {
        $peminat->delete();

        return redirect()->back()->with('success', 'Data peminat berhasil dihapus.');
    }
}
