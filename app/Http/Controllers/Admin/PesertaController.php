<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PesertaExport;
use App\Exports\PesertaTemplateExport;
use App\Http\Controllers\Controller;
use App\Imports\PesertaImport;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\Ruang;
use App\Pdf\KartuPesertaPdf;
use App\Pdf\ProfilePdf;
use App\Services\ExamNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PesertaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Pendaftar::with(['pil1Prodi', 'ruang', 'lulusProdi']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if ($request->filled('prodi_id')) {
            $query->where('pil1', $request->prodi_id);
        }

        if ($request->filled('ruang_id')) {
            $query->where('ruang_id', $request->ruang_id);
        }

        if ($request->filled('lulus')) {
            if ($request->lulus === 'lulus') {
                $query->whereNotNull('lulus');
            } elseif ($request->lulus === 'belum') {
                $query->whereNull('lulus');
            }
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $peserta = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/peserta/index', [
            'peserta' => $peserta,
            'filters' => $request->only(['search', 'prodi_id', 'ruang_id', 'lulus']),
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang']),
        ]);
    }

    public function show(Pendaftar $peserta): Response
    {
        $peserta->load([
            'pil1Prodi', 'pil2Prodi', 'pil3Prodi',
            'ruang', 'lulusProdi',
            'nilai', 'raport', 'kesehatan', 'fileRaport', 'fileKesehatan',
        ]);

        return Inertia::render('admin/peserta/show', [
            'peserta' => $peserta,
        ]);
    }

    public function edit(Pendaftar $peserta): Response
    {
        $peserta->load(['pil1Prodi', 'ruang']);

        return Inertia::render('admin/peserta/form', [
            'peserta' => $peserta,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi', 'jenjang_prodi']),
            'ruang' => Ruang::where('active', true)->get(['id', 'nomor_ruang', 'nama_gedung']),
            'provinsi' => [],
            'kabupaten' => [],
            'survey' => [],
            'education' => [],
        ]);
    }

    public function update(Request $request, Pendaftar $peserta): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:128',
            'tempat_lahir' => 'nullable|date',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'agama' => 'nullable|string|max:64',
            'email' => 'nullable|email|max:128',
            'no_hp' => 'nullable|string|max:16',
            'alamat' => 'nullable|string|max:128',
            'pil1' => 'nullable|exists:prodi,id',
            'pil2' => 'nullable|exists:prodi,id',
            'pil3' => 'nullable|exists:prodi,id',
            'ruang_id' => 'nullable|exists:ruang,id',
            'ruang_kelompok' => 'nullable|integer',
            'nama_sekolah' => 'nullable|string|max:64',
            'npsn' => 'nullable|string|max:20',
            'akreditasi' => 'nullable|string|max:10',
            'tahun_lulus' => 'nullable|string|max:4',
            'nama_ayah' => 'nullable|string|max:64',
            'nama_ibu' => 'nullable|string|max:64',
            'pekerjaan_ayah' => 'nullable|string|max:64',
            'pekerjaan_ibu' => 'nullable|string|max:64',
            'hp_ayah' => 'nullable|string|max:64',
            'hp_ibu' => 'nullable|string|max:64',
            'prestasi' => 'nullable|string|max:500',
        ]);

        $peserta->update($validated);

        return redirect()->route('admin.peserta.index')->with('success', 'Data peserta berhasil diperbarui.');
    }

    public function generateNoUjian(Request $request, ExamNumberService $examNumberService): RedirectResponse
    {
        $validated = $request->validate([
            'peserta_ids' => 'required|array',
            'peserta_ids.*' => 'exists:pendaftar,id',
        ]);

        $count = $examNumberService->generateBulk($validated['peserta_ids']);

        return redirect()->back()->with('success', "Berhasil generate nomor ujian untuk {$count} peserta.");
    }

    public function kartuPeserta(Pendaftar $peserta, KartuPesertaPdf $pdf)
    {
        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum di-generate.');
        }

        return $pdf->download($peserta);
    }

    public function profilePdf(Pendaftar $peserta, ProfilePdf $pdf)
    {
        return $pdf->download($peserta);
    }

    public function uploadFoto(Request $request, Pendaftar $peserta): RedirectResponse
    {
        $validated = $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($peserta->foto && Storage::disk('public')->exists($peserta->foto)) {
            Storage::disk('public')->delete($peserta->foto);
        }

        $path = $validated['foto']->store('foto', 'public');
        $peserta->update(['foto' => $path]);

        return redirect()->back()->with('success', 'Foto berhasil diupload.');
    }

    public function export(Request $request)
    {
        return Excel::download(new PesertaExport($request->only(['search', 'prodi_id', 'ruang_id', 'lulus'])), 'peserta-'.now()->format('Y-m-d').'.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        $import = new PesertaImport;
        Excel::import($import, $validated['file']);

        return redirect()->back()->with('success', "Berhasil import {$import->getRowCount()} data peserta.");
    }

    public function downloadTemplate()
    {
        return Excel::download(new PesertaTemplateExport, 'template-peserta.xlsx');
    }

    public function destroy(Pendaftar $peserta): RedirectResponse
    {
        if ($peserta->foto && Storage::disk('public')->exists($peserta->foto)) {
            Storage::disk('public')->delete($peserta->foto);
        }

        $peserta->delete();

        return redirect()->route('admin.peserta.index')->with('success', 'Data peserta berhasil dihapus.');
    }
}
