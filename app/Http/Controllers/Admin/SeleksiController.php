<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KelulusanRekapExport;
use App\Http\Controllers\Controller;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Services\SelectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class SeleksiController extends Controller
{
    protected SelectionService $selectionService;

    public function __construct(SelectionService $selectionService)
    {
        $this->selectionService = $selectionService;
    }

    public function index(Request $request): Response
    {
        $tahap = TahapSeleksi::active()->orderBy('urutan')->get();
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi', 'kuota_smm']);

        return Inertia::render('admin/seleksi/index', [
            'tahap' => $tahap,
            'prodi' => $prodi,
            'filters' => $request->only(['tahap_id', 'prodi_id', 'pilihan']),
        ]);
    }

    public function preview(Request $request): Response
    {
        $validated = $request->validate([
            'tahap_id' => 'required|exists:tahap_seleksi,id',
            'prodi_id' => 'required|exists:prodi,id',
            'pilihan' => 'nullable|integer|min:1|max:4',
        ]);

        $result = $this->selectionService->previewSelection(
            (int) $validated['tahap_id'],
            (int) $validated['prodi_id'],
            $validated['pilihan'] ?? null
        );

        $tahap = TahapSeleksi::active()->orderBy('urutan')->get();
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi', 'kuota_smm']);

        return Inertia::render('admin/seleksi/preview', [
            'tahap' => $tahap,
            'prodi' => $prodi,
            'preview' => $result,
            'filters' => $request->only(['tahap_id', 'prodi_id', 'pilihan']),
        ]);
    }

    public function save(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahap_id' => 'required|exists:tahap_seleksi,id',
            'prodi_id' => 'required|exists:prodi,id',
            'pilihan' => 'nullable|integer|min:1|max:4',
            'selected_nup' => 'required|array|min:1',
            'selected_nup.*' => 'required|string',
        ]);

        $result = $this->selectionService->saveSelection(
            (int) $validated['tahap_id'],
            (int) $validated['prodi_id'],
            $validated['selected_nup'],
            $validated['pilihan'] ?? null
        );

        if ($result['success']) {
            return redirect()->route('admin.seleksi.index')
                ->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function rekap(Request $request): Response
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $rekap = $this->selectionService->getRekapKelulusan($prodiId);
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi']);

        return Inertia::render('admin/seleksi/rekap', [
            'rekap' => $rekap,
            'prodi' => $prodi,
            'filters' => $request->only(['prodi_id']),
        ]);
    }

    public function export(Request $request)
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $filename = 'rekap_kelulusan_'.date('Y-m-d_His').'.xlsx';

        return Excel::download(new KelulusanRekapExport($prodiId), $filename);
    }
}
