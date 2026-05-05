<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProdiController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Prodi::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_prodi', 'like', "%{$search}%")
                    ->orWhere('kode_prodi', 'like', "%{$search}%")
                    ->orWhere('singkatan_prodi', 'like', "%{$search}%");
            });
        }

        if ($request->filled('jenjang')) {
            $query->where('jenjang_prodi', $request->jenjang);
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'asc');
        $query->orderBy($sort, $order);

        $prodi = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/prodi/index', [
            'prodi' => $prodi,
            'filters' => $request->only(['search', 'jenjang']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/prodi/form', [
            'prodi' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_prodi' => 'required|string|max:16|unique:prodi,kode_prodi',
            'nama_prodi' => 'required|string|max:128',
            'singkatan_prodi' => 'nullable|string|max:16',
            'jenjang_prodi' => 'required|string|max:8',
            'kapasitas' => 'nullable|integer|min:0',
            'kuota_smm' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        Prodi::create($validated);

        Cache::forget('all_prodi_active');
        Cache::forget('registrasi_prodi_list');

        return redirect()->route('admin.prodi.index')->with('success', 'Program studi berhasil ditambahkan.');
    }

    public function edit(Prodi $prodi): Response
    {
        return Inertia::render('admin/prodi/form', [
            'prodi' => $prodi,
        ]);
    }

    public function update(Request $request, Prodi $prodi): RedirectResponse
    {
        $validated = $request->validate([
            'kode_prodi' => 'required|string|max:16|unique:prodi,kode_prodi,'.$prodi->id,
            'nama_prodi' => 'required|string|max:128',
            'singkatan_prodi' => 'nullable|string|max:16',
            'jenjang_prodi' => 'required|string|max:8',
            'kapasitas' => 'nullable|integer|min:0',
            'kuota_smm' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $prodi->update($validated);

        Cache::forget('all_prodi_active');
        Cache::forget('registrasi_prodi_list');

        return redirect()->route('admin.prodi.index')->with('success', 'Program studi berhasil diperbarui.');
    }

    public function destroy(Prodi $prodi): RedirectResponse
    {
        $prodi->delete();

        Cache::forget('all_prodi_active');
        Cache::forget('registrasi_prodi_list');

        return redirect()->route('admin.prodi.index')->with('success', 'Program studi berhasil dihapus.');
    }

    public function toggleStatus(Prodi $prodi): RedirectResponse
    {
        $prodi->update(['active' => ! $prodi->active]);

        Cache::forget('all_prodi_active');
        Cache::forget('registrasi_prodi_list');

        return redirect()->back()->with('success', 'Status program studi berhasil diubah.');
    }
}
