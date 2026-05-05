<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TahapSeleksi;
use App\Models\Ujian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UjianController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Ujian::with('tahapSeleksi');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $ujian = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/ujian/index', [
            'ujian' => $ujian,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/ujian/form', [
            'ujian' => null,
            'tahap' => TahapSeleksi::active()->get(['id', 'nama', 'urutan']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:64',
            'kode' => 'required|string|max:32|unique:ujian,kode',
            'tahap_seleksi_id' => 'nullable|exists:tahap_seleksi,id',
            'deskripsi' => 'nullable|string',
            'fields_config' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        Ujian::create($validated);

        return redirect()->route('admin.ujian.index')->with('success', 'Jenis ujian berhasil ditambahkan.');
    }

    public function edit(Ujian $ujian): Response
    {
        return Inertia::render('admin/ujian/form', [
            'ujian' => $ujian->load('tahapSeleksi'),
            'tahap' => TahapSeleksi::active()->get(['id', 'nama', 'urutan']),
        ]);
    }

    public function update(Request $request, Ujian $ujian): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:64',
            'kode' => 'required|string|max:32|unique:ujian,kode,'.$ujian->id,
            'tahap_seleksi_id' => 'nullable|exists:tahap_seleksi,id',
            'deskripsi' => 'nullable|string',
            'fields_config' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $ujian->update($validated);

        return redirect()->route('admin.ujian.index')->with('success', 'Jenis ujian berhasil diperbarui.');
    }

    public function destroy(Ujian $ujian): RedirectResponse
    {
        $ujian->delete();

        return redirect()->route('admin.ujian.index')->with('success', 'Jenis ujian berhasil dihapus.');
    }
}
