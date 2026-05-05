<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Survey::query();

        if ($request->filled('search')) {
            $query->where('keterangan', 'like', "%{$request->search}%");
        }

        $query->orderBy('id');

        $survey = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/survey/index', [
            'survey' => $survey,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/survey/form', [
            'survey' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'keterangan' => 'required|string|max:128',
        ]);

        Survey::create($validated);

        Cache::forget('registrasi_survey_list');

        return redirect()->route('admin.survey.index')->with('success', 'Sumber informasi berhasil ditambahkan.');
    }

    public function edit(Survey $survey): Response
    {
        return Inertia::render('admin/survey/form', [
            'survey' => $survey,
        ]);
    }

    public function update(Request $request, Survey $survey): RedirectResponse
    {
        $validated = $request->validate([
            'keterangan' => 'required|string|max:128',
        ]);

        $survey->update($validated);

        Cache::forget('registrasi_survey_list');

        return redirect()->route('admin.survey.index')->with('success', 'Sumber informasi berhasil diperbarui.');
    }

    public function destroy(Survey $survey): RedirectResponse
    {
        $survey->delete();

        Cache::forget('registrasi_survey_list');

        return redirect()->route('admin.survey.index')->with('success', 'Sumber informasi berhasil dihapus.');
    }
}
