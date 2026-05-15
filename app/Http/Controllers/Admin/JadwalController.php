<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Jadwal::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_jadwal', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $jadwal = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/jadwal/index', [
            'jadwal' => $jadwal,
            'filters' => $request->only(['search', 'jenis']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/jadwal/form', [
            'jadwal' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_jadwal' => 'required|string|max:128',
            'keterangan' => 'nullable|string|max:64',
            'tgl_awal' => 'nullable|date',
            'tgl_akhir' => 'nullable|date|after_or_equal:tgl_awal',
            'jam_awal' => 'nullable|string|max:16',
            'jam_akhir' => 'nullable|string|max:16',
            'jenis' => 'nullable|string|max:16',
            'active' => 'boolean',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $validated['urutan'] = $request->integer('urutan', 0);

        Jadwal::create($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Jadwal $jadwal): Response
    {
        return Inertia::render('admin/jadwal/form', [
            'jadwal' => $jadwal,
        ]);
    }

    public function update(Request $request, Jadwal $jadwal): RedirectResponse
    {
        $validated = $request->validate([
            'nama_jadwal' => 'required|string|max:128',
            'keterangan' => 'nullable|string|max:64',
            'tgl_awal' => 'nullable|date',
            'tgl_akhir' => 'nullable|date|after_or_equal:tgl_awal',
            'jam_awal' => 'nullable|string|max:16',
            'jam_akhir' => 'nullable|string|max:16',
            'jenis' => 'nullable|string|max:16',
            'active' => 'boolean',
            'urutan' => 'nullable|integer|min:0',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $validated['urutan'] = $request->integer('urutan', 0);

        $jadwal->update($validated);

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal): RedirectResponse
    {
        $jadwal->delete();

        return redirect()->route('admin.jadwal.index')->with('success', 'Jadwal berhasil dihapus.');
    }

    public function toggleStatus(Jadwal $jadwal): RedirectResponse
    {
        $jadwal->update(['active' => ! $jadwal->active]);

        return redirect()->back()->with('success', 'Status jadwal berhasil diubah.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer|exists:jadwal,id',
            'orders.*.urutan' => 'required|integer|min:0',
        ]);

        foreach ($validated['orders'] as $order) {
            Jadwal::where('id', $order['id'])->update(['urutan' => $order['urutan']]);
        }

        return redirect()->back()->with('success', 'Urutan jadwal berhasil diperbarui.');
    }
}
