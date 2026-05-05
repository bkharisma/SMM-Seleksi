<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = News::query()->with('creator');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sort = $request->get('sort', 'created_at');
        $order = $request->get('order', 'desc');
        $query->orderBy($sort, $order);

        $news = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/form', [
            'news' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'post_name' => 'required|string|max:128',
            'news_type' => 'nullable|string|max:16',
            'title' => 'required|string|max:128',
            'description' => 'required|string',
            'status' => 'required|in:draft,published',
            'img' => 'nullable|image|max:2048',
        ]);

        $validated['created_by'] = Auth::id();

        if ($request->hasFile('img')) {
            $validated['img'] = $request->file('img')->store('news');
        }

        if ($validated['status'] === 'published') {
            $validated['published_by'] = Auth::id();
            $validated['published_at'] = now();
        }

        News::create($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(News $news): Response
    {
        return Inertia::render('admin/news/form', [
            'news' => $news,
        ]);
    }

    public function update(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'post_name' => 'required|string|max:128',
            'news_type' => 'nullable|string|max:16',
            'title' => 'required|string|max:128',
            'description' => 'required|string',
            'status' => 'required|in:draft,published',
            'img' => 'nullable|image|max:2048',
        ]);

        $validated['updated_by'] = Auth::id();

        if ($request->hasFile('img')) {
            if ($news->img) {
                Storage::disk('public')->delete($news->img);
            }
            $validated['img'] = $request->file('img')->store('news');
        }

        if ($validated['status'] === 'published' && $news->status !== 'published') {
            $validated['published_by'] = Auth::id();
            $validated['published_at'] = now();
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(News $news): RedirectResponse
    {
        if ($news->img) {
            Storage::disk('public')->delete($news->img);
        }

        $news->delete();

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil dihapus.');
    }
}
