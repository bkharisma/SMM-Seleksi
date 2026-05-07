<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JalurPendaftaran;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JalurPendaftaranController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JalurPendaftaran::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_jalur', 'like', "%{$search}%")
                    ->orWhere('kode_jalur', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $jalur = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/jalur-pendaftaran/index', [
            'jalur' => $jalur,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/jalur-pendaftaran/form', [
            'jalur' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_jalur' => 'required|string|max:16|unique:jalur_pendaftaran,kode_jalur',
            'nama_jalur' => 'required|string|max:128',
            'deskripsi' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        JalurPendaftaran::create($validated);

        return redirect()->route('admin.jalur-pendaftaran.index')->with('success', 'Jalur pendaftaran berhasil ditambahkan.');
    }

    public function edit(JalurPendaftaran $jalur): Response
    {
        return Inertia::render('admin/jalur-pendaftaran/form', [
            'jalur' => $jalur,
        ]);
    }

    public function update(Request $request, JalurPendaftaran $jalur): RedirectResponse
    {
        $validated = $request->validate([
            'kode_jalur' => 'required|string|max:16|unique:jalur_pendaftaran,kode_jalur,'.$jalur->id,
            'nama_jalur' => 'required|string|max:128',
            'deskripsi' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $jalur->update($validated);

        return redirect()->route('admin.jalur-pendaftaran.index')->with('success', 'Jalur pendaftaran berhasil diperbarui.');
    }

    public function destroy(JalurPendaftaran $jalur): RedirectResponse
    {
        $jalur->delete();

        return redirect()->route('admin.jalur-pendaftaran.index')->with('success', 'Jalur pendaftaran berhasil dihapus.');
    }

    public function toggleStatus(JalurPendaftaran $jalur): RedirectResponse
    {
        $jalur->update(['active' => ! $jalur->active]);

        return redirect()->back()->with('success', 'Status jalur pendaftaran berhasil diubah.');
    }
}
