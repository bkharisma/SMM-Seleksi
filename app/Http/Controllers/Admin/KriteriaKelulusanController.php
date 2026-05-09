<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KriteriaKelulusan;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use App\Traits\HasNilaiFields;
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
        $ujian = Ujian::where('active', true)->get(['id', 'nama', 'kode', 'tahap_seleksi_id', 'fields_config']);

        return Inertia::render('admin/kriteria/form', [
            'kriteria' => null,
            'kriteriaUjian' => [],
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'tahap' => $tahap,
            'ujian' => $ujian,
            'health_fields' => $this->getHealthFields(),
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
            'kriteria_ujian.*.ujian_id' => 'required',
            'kriteria_ujian.*.jenis' => 'required|in:tes,berkas,kesehatan',
            'kriteria_ujian.*.nilai_standar' => 'nullable|numeric',
            'kriteria_ujian.*.parameters' => 'nullable|array',
            'kriteria_ujian.*.parameters.*.nama' => 'required|string|max:128',
            'kriteria_ujian.*.parameters.*.tipe_value' => 'required|in:number,string,boolean',
            'kriteria_ujian.*.parameters.*.nilai' => 'required',
        ]);
 
        $this->validateUjianIds($request);
 
        DB::transaction(function () use ($validated, $request) {
            $validated['active'] = $request->boolean('active', true);
 
            $kriteria = KriteriaKelulusan::create($validated);

            foreach ($validated['kriteria_ujian'] as $ku) {
                $kriteria->kriteriaUjian()->create([
                    'ujian_id' => $ku['ujian_id'],
                    'jenis' => $ku['jenis'],
                    'nilai_standar' => $ku['jenis'] === 'tes' ? ($ku['nilai_standar'] ?? null) : null,
                    'parameters' => ($ku['jenis'] === 'berkas' || $ku['jenis'] === 'kesehatan') ? ($ku['parameters'] ?? null) : null,
                ]);
            }
        });

        return redirect()->route('admin.kriteria.index')->with('success', 'Kriteria berhasil ditambahkan.');
    }

    public function edit(KriteriaKelulusan $kriteria): Response
    {
        $kriteria->load('kriteriaUjian.ujian');

        $tahap = TahapSeleksi::where('active', true)->orderBy('urutan')->get(['id', 'nama', 'urutan']);
        $ujian = Ujian::where('active', true)->get(['id', 'nama', 'kode', 'tahap_seleksi_id', 'fields_config']);

        $kriteriaUjianData = $kriteria->kriteriaUjian->map(function ($ku) {
            return [
                'id' => $ku->id,
                'ujian_id' => $ku->ujian_id,
                'jenis' => $ku->jenis,
                'nilai_standar' => $ku->nilai_standar,
                'parameters' => is_array($ku->parameters) ? $ku->parameters : [],
                'ujian' => $ku->ujian ? [
                    'id' => $ku->ujian->id,
                    'nama' => $ku->ujian->nama,
                    'kode' => $ku->ujian->kode,
                    'tahap_seleksi_id' => $ku->ujian->tahap_seleksi_id,
                    'fields_config' => $ku->ujian->fields_config,
                ] : null,
            ];
        });

        return Inertia::render('admin/kriteria/form', [
            'kriteria' => $kriteria,
            'kriteriaUjian' => $kriteriaUjianData,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi']),
            'tahap' => $tahap,
            'ujian' => $ujian,
            'health_fields' => $this->getHealthFields(),
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
            'kriteria_ujian.*.ujian_id' => 'required',
            'kriteria_ujian.*.jenis' => 'required|in:tes,berkas,kesehatan',
            'kriteria_ujian.*.nilai_standar' => 'nullable|numeric',
            'kriteria_ujian.*.parameters' => 'nullable|array',
            'kriteria_ujian.*.parameters.*.nama' => 'required|string|max:128',
            'kriteria_ujian.*.parameters.*.tipe_value' => 'required|in:number,string,boolean',
            'kriteria_ujian.*.parameters.*.nilai' => 'required',
        ]);
 
        $this->validateUjianIds($request);
 
        DB::transaction(function () use ($validated, $request, $kriteria) {
            $validated['active'] = $request->boolean('active', true);

            $kriteria->update($validated);

            $kriteria->kriteriaUjian()->delete();

            foreach ($validated['kriteria_ujian'] as $ku) {
                $kriteria->kriteriaUjian()->create([
                    'ujian_id' => $ku['ujian_id'],
                    'jenis' => $ku['jenis'],
                    'nilai_standar' => $ku['jenis'] === 'tes' ? ($ku['nilai_standar'] ?? null) : null,
                    'parameters' => ($ku['jenis'] === 'berkas' || $ku['jenis'] === 'kesehatan') ? ($ku['parameters'] ?? null) : null,
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

    private function getHealthFields(): array
    {
        $reflection = new \ReflectionClass(HasNilaiFields::class);
        $fieldMeta = $reflection->getConstant('FIELD_META');

        $healthFields = collect($fieldMeta)
            ->filter(fn ($meta, $key) => str_starts_with($key, 'kes_'))
            ->map(fn ($meta, $key) => [
                'key' => $key,
                'label' => $meta['label'],
                'type' => $meta['type'] === 'bool' ? 'boolean' : ($meta['type'] === 'float' ? 'number' : 'string'),
            ])
            ->values()
            ->toArray();

        return $healthFields;
    }

    private function validateUjianIds(Request $request): void
    {
        $ids = collect($request->input('kriteria_ujian', []))
            ->pluck('ujian_id')
            ->unique()
            ->values()
            ->all();

        if (empty($ids)) {
            return;
        }

        $existing = Ujian::whereIn('id', $ids)->pluck('id')->toArray();

        $diff = array_diff($ids, $existing);
        if (!empty($diff)) {
            abort(422, 'Ujian ID tidak valid: ' . implode(', ', $diff));
        }
    }
}
