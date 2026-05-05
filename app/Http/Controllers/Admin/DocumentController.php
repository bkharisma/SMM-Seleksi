<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(): Response
    {
        $files = collect();
        $path = storage_path('app/public/documents');

        if (is_dir($path)) {
            $files = collect(scandir($path))
                ->filter(fn ($file) => ! in_array($file, ['.', '..']))
                ->map(fn ($file) => [
                    'name' => $file,
                    'size' => round(filesize($path.'/'.$file) / 1024, 2),
                    'url' => Storage::url('documents/'.$file),
                    'created_at' => date('Y-m-d H:i:s', filemtime($path.'/'.$file)),
                ]);
        }

        return Inertia::render('admin/documents/index', [
            'documents' => $files,
        ]);
    }

    public function upload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        $file = $request->file('file');
        $filename = time().'_'.$file->getClientOriginalName();
        $file->storeAs('public/documents', $filename);

        return redirect()->route('admin.documents.index')->with('success', 'Dokumen berhasil diupload.');
    }

    public function destroy(string $filename): RedirectResponse
    {
        $path = 'public/documents/'.$filename;

        if (Storage::exists($path)) {
            Storage::delete($path);
        }

        return redirect()->route('admin.documents.index')->with('success', 'Dokumen berhasil dihapus.');
    }
}
