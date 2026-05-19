<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KelulusanDetailExport;
use App\Exports\KelulusanRekapExport;
use App\Http\Controllers\Controller;
use App\Models\JalurPendaftaran;
use App\Models\Pendaftar;
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
        $jalur = JalurPendaftaran::active()->get(['id', 'kode_jalur', 'nama_jalur']);
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi', 'kuota_smm']);

        return Inertia::render('admin/seleksi/index', [
            'tahap' => $tahap,
            'jalur' => $jalur,
            'prodi' => $prodi,
            'filters' => $request->only(['tahap_id', 'jalur_id', 'prodi_id', 'pilihan']),
        ]);
    }

    public function preview(Request $request): Response
    {
        $validated = $request->validate([
            'tahap_id' => 'required|exists:tahap_seleksi,id',
            'jalur_id' => 'nullable|string',
            'prodi_id' => 'required|exists:prodi,id',
            'pilihan' => 'nullable|integer|min:1|max:3',
        ]);

        $jalurId = !$validated['jalur_id'] || $validated['jalur_id'] === 'all' ? null : (int) $validated['jalur_id'];

        $result = $this->selectionService->previewSelection(
            (int) $validated['tahap_id'],
            (int) $validated['prodi_id'],
            $validated['pilihan'] ?? null,
            $jalurId
        );

        $tahap = TahapSeleksi::active()->orderBy('urutan')->get();
        $jalur = JalurPendaftaran::active()->get(['id', 'kode_jalur', 'nama_jalur']);
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi', 'kuota_smm']);

        return Inertia::render('admin/seleksi/preview', [
            'tahap' => $tahap,
            'jalur' => $jalur,
            'prodi' => $prodi,
            'preview' => $result,
            'filters' => $request->only(['tahap_id', 'jalur_id', 'prodi_id', 'pilihan']),
        ]);
    }

    public function save(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahap_id' => 'required|exists:tahap_seleksi,id',
            'jalur_id' => 'nullable|string',
            'prodi_id' => 'required|exists:prodi,id',
            'pilihan' => 'nullable|integer|min:1|max:3',
            'selected_nup' => 'required|array|min:1',
            'selected_nup.*' => 'required|string',
        ]);

        $jalurId = !$validated['jalur_id'] || $validated['jalur_id'] === 'all' ? null : (int) $validated['jalur_id'];

        $result = $this->selectionService->saveSelection(
            (int) $validated['tahap_id'],
            (int) $validated['prodi_id'],
            $validated['selected_nup'],
            $validated['pilihan'] ?? null,
            $jalurId
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
        $isFinalized = $this->selectionService->isFinalized();

        return Inertia::render('admin/seleksi/rekap', [
            'rekap' => $rekap,
            'prodi' => $prodi,
            'is_finalized' => $isFinalized,
            'filters' => $request->only(['prodi_id']),
        ]);
    }

    public function export(Request $request)
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $filename = 'rekap_kelulusan_'.date('Y-m-d_His').'.xlsx';

        return Excel::download(new KelulusanRekapExport($prodiId), $filename);
    }

    public function rekapDetail(Prodi $prodi): Response
    {
        $result = $this->selectionService->getLulusByProdi($prodi->id);

        return Inertia::render('admin/seleksi/rekap-detail', [
            'detail' => $result,
        ]);
    }

    public function rekapDetailExport(Prodi $prodi)
    {
        $result = $this->selectionService->getLulusByProdi($prodi->id);
        $data = collect($result['peserta'] ?? []);
        $filename = 'detail_lulus_'.$prodi->kode_prodi.'_'.date('Y-m-d_His').'.xlsx';

        return Excel::download(new KelulusanDetailExport($data, $prodi), $filename);
    }

    public function revokeLulus(Pendaftar $pendaftar): RedirectResponse
    {
        $result = $this->selectionService->revokeLulus($pendaftar->id);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function bulkRevokeLulus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:pendaftar,id',
        ]);

        $result = $this->selectionService->bulkRevokeLulus($validated['ids']);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function finalisasi(Request $request): RedirectResponse
    {
        $result = $this->selectionService->finalisasiSeleksi();

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function revertFinalisasi(Request $request): RedirectResponse
    {
        $result = $this->selectionService->revertFinalisasi();

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }
}
