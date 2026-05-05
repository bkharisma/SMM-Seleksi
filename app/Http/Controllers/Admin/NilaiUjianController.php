<?php

namespace App\Http\Controllers\Admin;

use App\Exports\NilaiExport;
use App\Http\Controllers\Controller;
use App\Imports\NilaiImport;
use App\Models\PesertaNilai;
use App\Models\Ujian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class NilaiUjianController extends Controller
{
    public function selectUjian(Request $request): Response
    {
        $query = Ujian::with('tahapSeleksi');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        $ujian = $query->orderBy('id')->paginate(20)->withQueryString();

        return Inertia::render('admin/nilai/select', [
            'ujian' => $ujian,
            'filters' => $request->only(['search']),
        ]);
    }

    public function index(Request $request, Ujian $ujian): Response
    {
        $query = PesertaNilai::with(['peserta' => function ($q) {
            $q->with('pil1Prodi');
        }])->where('ujian_id', $ujian->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('peserta', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nup', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $nilai = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/nilai/index', [
            'nilai' => $nilai,
            'ujian' => $ujian,
            'filters' => $request->only(['search']),
        ]);
    }

    public function upload(Request $request, Ujian $ujian): RedirectResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        $import = new NilaiImport($ujian);
        Excel::import($import, $validated['file']);

        return redirect()->back()->with('success', "Berhasil import {$import->getRowCount()} data nilai.");
    }

    public function downloadTemplate(Ujian $ujian)
    {
        return Excel::download(new NilaiExport($ujian, true), "template-nilai-{$ujian->kode}.xlsx");
    }

    public function export(Ujian $ujian)
    {
        return Excel::download(new NilaiExport($ujian), "nilai-{$ujian->kode}-".now()->format('Y-m-d').'.xlsx');
    }

    public function update(Request $request, PesertaNilai $nilai): RedirectResponse
    {
        $validated = $request->validate([
            'psi_iq' => 'nullable|integer',
            'psi_bobot' => 'nullable|integer',
            'bing_nil' => 'nullable|integer',
            'waw_nil' => 'nullable|integer',
            'kes_tb' => 'nullable|integer',
            'kes_bw' => 'nullable|boolean',
            'kes_obe' => 'nullable|numeric',
            'kes_nark' => 'nullable|boolean',
            'kes_hml' => 'nullable|boolean',
            'kes_tato' => 'nullable|boolean',
            'kes_tindik' => 'nullable|boolean',
            'kes_paru' => 'nullable|boolean',
            'kes_stra' => 'nullable|boolean',
            'kes_scol' => 'nullable|boolean',
            'skor_akhir' => 'nullable|numeric',
        ]);

        $nilai->update($validated);

        return redirect()->back()->with('success', 'Nilai berhasil diperbarui.');
    }

    public function destroy(PesertaNilai $nilai): RedirectResponse
    {
        $nilai->delete();

        return redirect()->back()->with('success', 'Data nilai berhasil dihapus.');
    }
}
