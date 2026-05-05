<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EducationLevel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EducationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EducationLevel::query();

        if ($request->filled('search')) {
            $query->where('description', 'like', "%{$request->search}%")
                ->orWhere('code', 'like', "%{$request->search}%");
        }

        $query->orderBy('orderby');

        $education = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/education/index', [
            'education' => $education,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/education/form', [
            'education' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:8|unique:education_level,code',
            'description' => 'required|string|max:128',
            'orderby' => 'nullable|integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);
        $validated['orderby'] = $validated['orderby'] ?? 0;

        EducationLevel::create($validated);

        return redirect()->route('admin.education.index')->with('success', 'Jenjang pendidikan berhasil ditambahkan.');
    }

    public function edit(EducationLevel $education): Response
    {
        return Inertia::render('admin/education/form', [
            'education' => $education,
        ]);
    }

    public function update(Request $request, EducationLevel $education): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:8|unique:education_level,code,'.$education->code.',code',
            'description' => 'required|string|max:128',
            'orderby' => 'nullable|integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['active'] = $request->boolean('active', true);

        $education->update($validated);

        return redirect()->route('admin.education.index')->with('success', 'Jenjang pendidikan berhasil diperbarui.');
    }

    public function destroy(EducationLevel $education): RedirectResponse
    {
        $education->delete();

        return redirect()->route('admin.education.index')->with('success', 'Jenjang pendidikan berhasil dihapus.');
    }
}
