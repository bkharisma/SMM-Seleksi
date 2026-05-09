<?php

namespace App\Http\Controllers\Admin;

use App\Exports\NilaiExport;
use App\Http\Controllers\Controller;
use App\Imports\NilaiImport;
use App\Models\PendaftarNilai;
use App\Models\Ujian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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
        $query = PendaftarNilai::with(['pendaftar' => function ($q) {
            $q->with('pil1Prodi');
        }])->where('ujian_id', $ujian->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('pendaftar', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
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

    public function upload(Request $request, Ujian $ujian): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            $import = new NilaiImport($ujian);
            Excel::import($import, $validated['file']);

            $rowCount = $import->getRowCount();
            $errors = $import->getErrors();
            $errorCount = count($errors);

            $message = $rowCount > 0
                ? "Berhasil import {$rowCount} data nilai".($errorCount > 0 ? " dengan {$errorCount} error" : '')
                : 'Gagal import data nilai';

            if ($request->wantsJson()) {
                $response = [
                    'success' => $errorCount === 0,
                    'message' => $message,
                    'row_count' => $rowCount,
                    'error_count' => $errorCount,
                ];

                if ($errorCount > 0) {
                    $cacheKey = 'import_nilai_errors_'.uniqid();
                    cache()->put($cacheKey, $errors, now()->addMinutes(30));
                    $response['download_error_url'] = '/admin/nilai/import-errors/'.$cacheKey;
                }

                return response()->json($response);
            }

            if ($rowCount > 0 && $errorCount > 0) {
                return redirect()->back()->with('warning', $message);
            }
            if ($rowCount > 0) {
                return redirect()->back()->with('success', $message);
            }

            return redirect()->back()->with('error', $message);
        } catch (\Throwable $e) {
            \Log::error('Nilai import error: '.$e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal import: '.$e->getMessage(),
                    'row_count' => 0,
                    'error_count' => 1,
                ]);
            }

            return redirect()->back()->with('error', 'Gagal import: '.$e->getMessage());
        }
    }

    public function downloadImportErrors(string $key): BinaryFileResponse
    {
        $errors = cache()->get($key);

        if (! $errors) {
            abort(404, 'File error tidak ditemukan atau sudah kadaluarsa.');
        }

        $headings = [];
        if (! empty($errors[0]['data']) && is_array($errors[0]['data'])) {
            $headings = array_keys($errors[0]['data']);
        }

        $export = new \App\Exports\ImportErrorsExport($errors, $headings);

        return Excel::download($export, 'import-nilai-errors-'.now()->format('Y-m-d').'.xlsx');
    }

    public function downloadTemplate(Ujian $ujian)
    {
        return Excel::download(new NilaiExport($ujian, true), "template-nilai-{$ujian->kode}.xlsx");
    }

    public function export(Ujian $ujian)
    {
        return Excel::download(new NilaiExport($ujian), "nilai-{$ujian->kode}-".now()->format('Y-m-d').'.xlsx');
    }

    public function update(Request $request, PendaftarNilai $nilai): RedirectResponse
    {
        $validated = $request->validate([
            'psi_iq' => 'nullable|numeric',
            'psi_bobot' => 'nullable|numeric',
            'bing_nil' => 'nullable|numeric',
            'waw_nil' => 'nullable|numeric',
            'waw_bersedia_pindah' => 'nullable|boolean',
            'waw_rekomendasi_prodi_id' => 'nullable|integer',
            'waw_catatan' => 'nullable|string',
            'kes_hasil' => 'nullable|boolean',
            'kes_tb' => 'nullable|numeric',
            'kes_bw' => 'nullable|boolean',
            'kes_scol' => 'nullable|boolean',
            'kes_hamil' => 'nullable|boolean',
            'minat_dominan' => 'nullable|numeric',
            'skor_akhir' => 'nullable|numeric',
        ]);

        $nilai->update($validated);

        return redirect()->back()->with('success', 'Nilai berhasil diperbarui.');
    }

    public function destroy(PendaftarNilai $nilai): RedirectResponse
    {
        $nilai->delete();

        return redirect()->back()->with('success', 'Data nilai berhasil dihapus.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        if ($request->boolean('all')) {
            $ujianId = $request->integer('ujian_id');
            $count = PendaftarNilai::where('ujian_id', $ujianId)->delete();

            return redirect()->back()->with('success', "Semua {$count} data nilai berhasil dihapus.");
        }

        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return redirect()->back()->with('error', 'Tidak ada data yang dipilih.');
        }

        $count = PendaftarNilai::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', "{$count} data nilai terpilih berhasil dihapus.");
    }
}
