<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ruang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RuangController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Ruang::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_ruang', 'like', "%{$search}%")
                    ->orWhere('nama_gedung', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'urutan');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $ruang = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/ruang/index', [
            'ruang' => $ruang,
            'filters' => $request->only(['search']),
        ]);
    }

    public function summary(): Response
    {
        $ruangSummary = Ruang::withCount(['peserta' => function ($query) {
            $query->whereNotNull('ruang_id');
        }])->orderBy('urutan')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'nomor_ruang' => $r->nomor_ruang,
                'nama_gedung' => $r->nama_gedung,
                'kapasitas' => $r->kapasitas,
                'terisi' => $r->peserta_count,
                'tersisa' => max(0, ($r->kapasitas ?? 0) - $r->peserta_count),
                'active' => $r->active,
            ];
        });

        return Inertia::render('admin/ruang/index', [
            'ruangSummary' => $ruangSummary,
            'showSummary' => true,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/ruang/form', [
            'ruang' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_ruang' => 'required|string|max:8',
            'nama_gedung' => 'nullable|string|max:128',
            'kapasitas' => 'nullable|integer|min:1',
            'urutan' => 'nullable|integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $validated['urutan'] = $validated['urutan'] ?? 0;

        Ruang::create($validated);

        return redirect()->route('admin.ruang.index')->with('success', 'Ruang ujian berhasil ditambahkan.');
    }

    public function edit(Ruang $ruang): Response
    {
        return Inertia::render('admin/ruang/form', [
            'ruang' => $ruang,
        ]);
    }

    public function update(Request $request, Ruang $ruang): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_ruang' => 'required|string|max:8',
            'nama_gedung' => 'nullable|string|max:128',
            'kapasitas' => 'nullable|integer|min:1',
            'urutan' => 'nullable|integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $ruang->update($validated);

        return redirect()->route('admin.ruang.index')->with('success', 'Ruang ujian berhasil diperbarui.');
    }

    public function destroy(Ruang $ruang): RedirectResponse
    {
        $ruang->delete();

        return redirect()->route('admin.ruang.index')->with('success', 'Ruang ujian berhasil dihapus.');
    }

    public function toggleStatus(Ruang $ruang): RedirectResponse
    {
        $ruang->update(['active' => ! $ruang->active]);

        return redirect()->back()->with('success', 'Status ruang ujian berhasil diubah.');
    }
}
