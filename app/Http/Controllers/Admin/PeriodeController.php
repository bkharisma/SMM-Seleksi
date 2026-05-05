<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Periode::query();

        if ($request->filled('search')) {
            $query->where('spmb', 'like', "%{$request->search}%");
        }

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $periode = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/periode/index', [
            'periode' => $periode,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/periode/form', [
            'periode' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'spmb' => 'required|string|max:8',
            'tgl_awal' => 'required|date',
            'tgl_akhir' => 'required|date|after_or_equal:tgl_awal',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        Periode::create($validated);

        return redirect()->route('admin.periode.index')->with('success', 'Periode berhasil ditambahkan.');
    }

    public function edit(Periode $periode): Response
    {
        return Inertia::render('admin/periode/form', [
            'periode' => $periode,
        ]);
    }

    public function update(Request $request, Periode $periode): RedirectResponse
    {
        $validated = $request->validate([
            'spmb' => 'required|string|max:8',
            'tgl_awal' => 'required|date',
            'tgl_akhir' => 'required|date|after_or_equal:tgl_awal',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $periode->update($validated);

        return redirect()->route('admin.periode.index')->with('success', 'Periode berhasil diperbarui.');
    }

    public function destroy(Periode $periode): RedirectResponse
    {
        $periode->delete();

        return redirect()->route('admin.periode.index')->with('success', 'Periode berhasil dihapus.');
    }

    public function toggleStatus(Periode $periode): RedirectResponse
    {
        $periode->update(['active' => ! $periode->active]);

        return redirect()->back()->with('success', 'Status periode berhasil diubah.');
    }
}
