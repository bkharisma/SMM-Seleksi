<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PendaftarErrorExport;
use App\Exports\PendaftarExport;
use App\Exports\PendaftarTemplateExport;
use App\Http\Controllers\Controller;
use App\Imports\PendaftarImport;
use App\Models\JalurPendaftaran;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\Ruang;
use App\Pdf\KartuPendaftarPdf;
use App\Pdf\ProfilePdf;
use App\Services\ExamNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PendaftarController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pendaftar::with(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'ruang', 'lulusProdi', 'jalur']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%");
            });
        }

        if ($request->filled('prodi_id')) {
            $query->where(function ($q) use ($request) {
                $q->where('pil1', $request->prodi_id)
                    ->orWhere('pil2', $request->prodi_id)
                    ->orWhere('pil3', $request->prodi_id);
            });
        }

        if ($request->filled('ruang_id')) {
            $query->where('ruang_id', $request->ruang_id);
        }

        if ($request->filled('jalur_id')) {
            $query->where('jalur_id', $request->jalur_id);
        }

        if ($request->filled('lulus')) {
            if ($request->lulus === 'lulus') {
                $query->whereNotNull('lulus');
            } elseif ($request->lulus === 'tidak_lulus') {
                $query->whereNull('lulus')->where('finalisasi', true);
            } elseif ($request->lulus === 'belum') {
                $query->whereNull('lulus')->where('finalisasi', false);
            }
        }

        if ($request->filled('noujian')) {
            if ($request->noujian === 'ya') {
                $query->whereNotNull('noujian');
            } elseif ($request->noujian === 'tidak') {
                $query->whereNull('noujian');
            }
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $pendaftar = $query->paginate(15)->withQueryString();

        $isFinalized = Pendaftar::where('finalisasi', true)->exists();

        return Inertia::render('admin/pendaftar/index', [
            'pendaftar' => $pendaftar,
            'filters' => $request->only(['search', 'prodi_id', 'ruang_id', 'jalur_id', 'lulus', 'noujian']),
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang']),
            'jalur' => JalurPendaftaran::where('active', true)->get(['id', 'nama_jalur', 'kode_jalur']),
            'is_finalized' => $isFinalized,
        ]);
    }

    public function show(Pendaftar $pendaftar): Response
    {
        $pendaftar->load([
            'pil1Prodi', 'pil2Prodi', 'pil3Prodi',
            'ruang', 'lulusProdi', 'lulusTahap', 'jalur',
            'nilai.ujian', 'raport', 'kesehatan', 'fileRaport', 'fileKesehatan',
            'user',
        ]);

        return Inertia::render('admin/pendaftar/show', [
            'pendaftar' => $pendaftar,
        ]);
    }

    public function edit(Pendaftar $pendaftar): Response
    {
        $pendaftar->load(['pil1Prodi', 'ruang', 'jalur']);

        return Inertia::render('admin/pendaftar/form', [
            'pendaftar' => $pendaftar,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi', 'jenjang_prodi']),
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang', 'nama_gedung']),
            'jalur' => JalurPendaftaran::where('active', true)->get(['id', 'nama_jalur', 'kode_jalur']),
        ]);
    }

    public function update(Request $request, Pendaftar $pendaftar): RedirectResponse
    {
        $validated = $request->validate([
            'kode_pendaftar' => 'required|string|max:20|unique:pendaftar,kode_pendaftar,'.$pendaftar->id,
            'noujian' => 'nullable|string|max:20|unique:pendaftar,noujian,'.$pendaftar->id,
            'nama' => 'required|string|max:200',
            'tanggal_lahir' => 'required|date',
            'email' => 'nullable|email|max:150',
            'no_hp' => 'nullable|string|max:20',
            'pil1' => 'nullable|exists:prodi,id',
            'pil2' => 'nullable|exists:prodi,id',
            'pil3' => 'nullable|exists:prodi,id',
            'ruang_id' => 'nullable|exists:ruang,id',
            'ruang_kelompok' => 'nullable|string|max:50',
            'jalur_id' => 'nullable|exists:jalur_pendaftaran,id',
            'tempat_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'alamat' => 'nullable|string',
            'agama' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:200',
            'nama_ibu' => 'nullable|string|max:200',
            'hp_ayah' => 'nullable|string|max:20',
            'hp_ibu' => 'nullable|string|max:20',
            'pekerjaan_ayah' => 'nullable|string|max:100',
            'pekerjaan_ibu' => 'nullable|string|max:100',
            'nama_sekolah' => 'nullable|string|max:200',
            'npsn' => 'nullable|string|max:20',
            'akreditasi' => 'nullable|string|max:10',
            'tahun_lulus' => 'nullable|string|max:10',
            'prestasi' => 'nullable|string|max:500',
        ]);

        $pendaftar->update($validated);

        return redirect()->route('admin.pendaftar.index')->with('success', 'Data pendaftar berhasil diperbarui.');
    }

    public function generateNoUjian(Request $request, ExamNumberService $examNumberService): RedirectResponse
    {
        $validated = $request->validate([
            'pendaftar_ids' => 'required|array',
            'pendaftar_ids.*' => 'exists:pendaftar,id',
        ]);

        $count = $examNumberService->generateBulkForPendaftar($validated['pendaftar_ids']);

        return redirect()->back()->with('success', "Berhasil generate nomor ujian untuk {$count} pendaftar.");
    }

    public function kartuPendaftar(Pendaftar $pendaftar, KartuPendaftarPdf $pdf)
    {
        if (! $pendaftar->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum di-generate.');
        }

        return $pdf->download($pendaftar);
    }

    public function profilePdf(Pendaftar $pendaftar, ProfilePdf $pdf)
    {
        return $pdf->download($pendaftar);
    }

    public function uploadFoto(Request $request, Pendaftar $pendaftar): RedirectResponse
    {
        $validated = $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($pendaftar->foto && Storage::disk('public')->exists($pendaftar->foto)) {
            Storage::disk('public')->delete($pendaftar->foto);
        }

        $path = $validated['foto']->store('foto', 'public');
        $pendaftar->update(['foto' => $path]);

        return redirect()->back()->with('success', 'Foto berhasil diupload.');
    }

    public function export(Request $request)
    {
        return Excel::download(new PendaftarExport($request->only(['search', 'prodi_id', 'ruang_id', 'jalur_id', 'lulus', 'noujian'])), 'pendaftar-'.now()->format('Y-m-d').'.xlsx');
    }

    public function import(Request $request)
    {
        if (! $request->hasFile('file')) {
            return $this->importResponse($request, 0, [['error' => 'File tidak ditemukan.']]);
        }

        $file = $request->file('file');
        if ($file->getSize() > 10240 * 1024) {
            return $this->importResponse($request, 0, [['error' => 'File terlalu besar. Maksimal 10MB.']]);
        }

        $ext = strtolower($file->getClientOriginalExtension());
        if (! in_array($ext, ['xlsx', 'xls', 'csv'])) {
            return $this->importResponse($request, 0, [['error' => 'Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv.']]);
        }

        try {
            $import = new PendaftarImport;
            Excel::import($import, $file);

            $errors = $import->getErrors();
            $rowCount = $import->getRowCount();

            return $this->importResponse($request, $rowCount, $errors);
        } catch (\Throwable $e) {
            \Log::error('Pendaftar import error: '.$e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);

            return $this->importResponse($request, 0, [['error' => $e->getMessage()]]);
        }
    }

    protected function importResponse(Request $request, int $rowCount, array $errors)
    {
        $errorCount = count($errors);
        $errorMessages = array_map(fn ($e) => $e['error'] ?? $e, $errors);

        $message = $rowCount > 0
            ? "Berhasil import {$rowCount} data pendaftar".($errorCount > 0 ? " dengan {$errorCount} error" : '')
            : 'Gagal import: '.implode('; ', $errorMessages);

        if ($request->wantsJson()) {
            $response = [
                'success' => $errorCount === 0,
                'message' => $message,
                'row_count' => $rowCount,
                'error_count' => $errorCount,
                'errors' => $errorMessages,
            ];

            if ($errorCount > 0) {
                $cacheKey = 'import_errors_'.uniqid();
                cache()->put($cacheKey, $errors, now()->addMinutes(30));
                $response['download_error_url'] = '/admin/pendaftar/import-errors/'.$cacheKey;
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
    }

    public function template()
    {
        return Excel::download(new PendaftarTemplateExport, 'template-pendaftar.xlsx');
    }

    public function downloadImportErrors(string $key)
    {
        $errors = cache()->get($key);

        if (empty($errors)) {
            return redirect()->back()->with('error', 'Data error tidak ditemukan atau sudah kadaluarsa.');
        }

        return Excel::download(new PendaftarErrorExport($errors), 'error-import-pendaftar-'.now()->format('Y-m-d-His').'.xlsx');
    }

    public function destroy(Pendaftar $pendaftar): RedirectResponse
    {
        if ($pendaftar->foto && Storage::disk('public')->exists($pendaftar->foto)) {
            Storage::disk('public')->delete($pendaftar->foto);
        }

        $pendaftar->delete();

        return redirect()->route('admin.pendaftar.index')->with('success', 'Data pendaftar berhasil dihapus.');
    }
}
