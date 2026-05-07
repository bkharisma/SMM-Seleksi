<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KriteriaKelulusan;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KriteriaKelulusanController extends Controller
{
    public function index(Request $request): Response
    {
        $query = KriteriaKelulusan::with(['prodi', 'tahapSeleksi', 'kriteriaUjian.ujian']);

        if ($request->filled('prodi_id')) {
            $query->where('prodi_id', $request->prodi_id);
        }

        if ($request->filled('tahap_seleksi_id')) {
            $query->where('tahap_seleksi_id', $request->tahap_seleksi_id);
        }

        $kriteria = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/kriteria/index', [
            'kriteria' => $kriteria,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'tahap' => TahapSeleksi::where('active', true)->orderBy('urutan')->get(['id', 'nama', 'urutan']),
            'filters' => $request->only(['prodi_id', 'tahap_seleksi_id']),
        ]);
    }

    public function create(): Response
    {
        $tahap = TahapSeleksi::where('active', true)->orderBy('urutan')->get(['id', 'nama', 'urutan']);
        $ujian = Ujian::where('active', true)->get(['id', 'nama', 'kode', 'tahap_seleksi_id']);

        return Inertia::render('admin/kriteria/form', [
            'kriteria' => null,
            'kriteriaUjian' => [],
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'tahap' => $tahap,
            'ujian' => $ujian,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'prodi_id' => 'required|exists:prodi,id',
            'tahap_seleksi_id' => 'required|exists:tahap_seleksi,id',
            'ordering' => 'nullable|in:ASC,DESC',
            'filter_pilihan' => 'nullable|integer|min:1|max:4',
            'active' => 'boolean',
            'kriteria_ujian' => 'required|array|min:1',
            'kriteria_ujian.*.ujian_id' => 'required|exists:ujian,id',
            'kriteria_ujian.*.jenis' => 'required|in:tes,berkas',
            'kriteria_ujian.*.nilai_standar' => 'nullable|numeric',
            'kriteria_ujian.*.parameters' => 'nullable|array',
            'kriteria_ujian.*.parameters.*.nama' => 'required|string|max:128',
            'kriteria_ujian.*.parameters.*.tipe_value' => 'required|in:number,string,boolean',
            'kriteria_ujian.*.parameters.*.nilai' => 'required',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $validated['active'] = $request->boolean('active', true);

            $kriteria = KriteriaKelulusan::create($validated);

            foreach ($validated['kriteria_ujian'] as $ku) {
                $kriteria->kriteriaUjian()->create([
                    'ujian_id' => $ku['ujian_id'],
                    'jenis' => $ku['jenis'],
                    'nilai_standar' => $ku['jenis'] === 'tes' ? ($ku['nilai_standar'] ?? null) : null,
                    'parameters' => $ku['jenis'] === 'berkas' ? ($ku['parameters'] ?? null) : null,
                ]);
            }
        });

        return redirect()->route('admin.kriteria.index')->with('success', 'Kriteria berhasil ditambahkan.');
    }

    public function edit(KriteriaKelulusan $kriteria): Response
    {
        $kriteria->load('kriteriaUjian.ujian');

        $tahap = TahapSeleksi::where('active', true)->orderBy('urutan')->get(['id', 'nama', 'urutan']);
        $ujian = Ujian::where('active', true)->get(['id', 'nama', 'kode', 'tahap_seleksi_id']);

        return Inertia::render('admin/kriteria/form', [
            'kriteria' => $kriteria,
            'kriteriaUjian' => $kriteria->kriteriaUjian,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'tahap' => $tahap,
            'ujian' => $ujian,
        ]);
    }

    public function update(Request $request, KriteriaKelulusan $kriteria): RedirectResponse
    {
        $validated = $request->validate([
            'prodi_id' => 'required|exists:prodi,id',
            'tahap_seleksi_id' => 'required|exists:tahap_seleksi,id',
            'ordering' => 'nullable|in:ASC,DESC',
            'filter_pilihan' => 'nullable|integer|min:1|max:4',
            'active' => 'boolean',
            'kriteria_ujian' => 'required|array|min:1',
            'kriteria_ujian.*.ujian_id' => 'required|exists:ujian,id',
            'kriteria_ujian.*.jenis' => 'required|in:tes,berkas',
            'kriteria_ujian.*.nilai_standar' => 'nullable|numeric',
            'kriteria_ujian.*.parameters' => 'nullable|array',
            'kriteria_ujian.*.parameters.*.nama' => 'required|string|max:128',
            'kriteria_ujian.*.parameters.*.tipe_value' => 'required|in:number,string,boolean',
            'kriteria_ujian.*.parameters.*.nilai' => 'required',
        ]);

        DB::transaction(function () use ($validated, $request, $kriteria) {
            $validated['active'] = $request->boolean('active', true);

            $kriteria->update($validated);

            $kriteria->kriteriaUjian()->delete();

            foreach ($validated['kriteria_ujian'] as $ku) {
                $kriteria->kriteriaUjian()->create([
                    'ujian_id' => $ku['ujian_id'],
                    'jenis' => $ku['jenis'],
                    'nilai_standar' => $ku['jenis'] === 'tes' ? ($ku['nilai_standar'] ?? null) : null,
                    'parameters' => $ku['jenis'] === 'berkas' ? ($ku['parameters'] ?? null) : null,
                ]);
            }
        });

        return redirect()->route('admin.kriteria.index')->with('success', 'Kriteria berhasil diperbarui.');
    }

    public function destroy(KriteriaKelulusan $kriteria): RedirectResponse
    {
        $kriteria->delete();

        return redirect()->back()->with('success', 'Kriteria berhasil dihapus.');
    }
}
