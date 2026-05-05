<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TahapSeleksi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TahapSeleksiController extends Controller
{
    public function index(Request $request): Response
    {
        $tahap = TahapSeleksi::orderBy('urutan')->get();

        return Inertia::render('admin/tahap-seleksi/index', [
            'tahap' => $tahap,
        ]);
    }

    public function create(): Response
    {
        $maxUrutan = TahapSeleksi::max('urutan') ?? 0;

        return Inertia::render('admin/tahap-seleksi/form', [
            'tahap' => null,
            'maxUrutan' => $maxUrutan + 1,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:64',
            'urutan' => 'required|integer|min:1',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        TahapSeleksi::create($validated);

        return redirect()->route('admin.tahap-seleksi.index')->with('success', 'Tahap seleksi berhasil ditambahkan.');
    }

    public function edit(TahapSeleksi $tahapSeleksi): Response
    {
        $maxUrutan = TahapSeleksi::max('urutan') ?? 0;

        return Inertia::render('admin/tahap-seleksi/form', [
            'tahap' => $tahapSeleksi,
            'maxUrutan' => $maxUrutan + 1,
        ]);
    }

    public function update(Request $request, TahapSeleksi $tahapSeleksi): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:64',
            'urutan' => 'required|integer|min:1',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $tahapSeleksi->update($validated);

        return redirect()->route('admin.tahap-seleksi.index')->with('success', 'Tahap seleksi berhasil diperbarui.');
    }

    public function destroy(TahapSeleksi $tahapSeleksi): RedirectResponse
    {
        $tahapSeleksi->delete();

        return redirect()->route('admin.tahap-seleksi.index')->with('success', 'Tahap seleksi berhasil dihapus.');
    }
}
