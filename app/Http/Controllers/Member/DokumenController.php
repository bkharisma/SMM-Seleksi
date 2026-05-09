<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\FileKesehatan;
use App\Models\KriteriaKelulusan;
use App\Models\Pendaftar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DokumenController extends Controller
{
    public function kesehatan(Request $request): Response
    {
        $user = $request->user();
        $pendaftar = Pendaftar::where('user_id', $user->id)
            ->with(['kesehatan', 'fileKesehatan'])
            ->firstOrFail();

        $parameters = [];

        if ($pendaftar->pil1) {
            $kriteria = KriteriaKelulusan::where('prodi_id', $pendaftar->pil1)
                ->whereHas('kriteriaUjian', function ($q) {
                    $q->where('jenis', 'kesehatan');
                })
                ->with('kriteriaUjian')
                ->first();

            if ($kriteria) {
                foreach ($kriteria->kriteriaUjian as $ku) {
                    if ($ku->jenis === 'kesehatan' && $ku->parameters) {
                        $parameters = array_merge($parameters, $ku->parameters);
                    }
                }
            }
        }

        return Inertia::render('member/upload/kesehatan', [
            'peserta' => $pendaftar,
            'kesehatan' => $pendaftar->kesehatan,
            'files' => $pendaftar->fileKesehatan,
            'parameters' => $parameters,
        ]);
    }

    public function storeKesehatan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = Pendaftar::where('user_id', $user->id)->firstOrFail();

        if (! $pendaftar->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $kesehatan = $pendaftar->kesehatan;
        if ($kesehatan && $kesehatan->finalized) {
            return redirect()->back()->with('error', 'Data kesehatan sudah difinalisasi dan tidak dapat diubah.');
        }

        $parameters = [];

        if ($pendaftar->pil1) {
            $kriteria = KriteriaKelulusan::where('prodi_id', $pendaftar->pil1)
                ->whereHas('kriteriaUjian', function ($q) {
                    $q->where('jenis', 'kesehatan');
                })
                ->with('kriteriaUjian')
                ->first();

            if ($kriteria) {
                foreach ($kriteria->kriteriaUjian as $ku) {
                    if ($ku->jenis === 'kesehatan' && $ku->parameters) {
                        $parameters = array_merge($parameters, $ku->parameters);
                    }
                }
            }
        }

        $rules = [
            'namalbg' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:100',
        ];

        foreach ($parameters as $param) {
            $key = 'param_' . $param['nama'];
            $tipe = $param['tipe_value'] ?? 'string';

            if ($tipe === 'number') {
                $rules[$key] = 'nullable|numeric';
            } elseif ($tipe === 'boolean') {
                $rules[$key] = 'nullable|boolean';
            } else {
                $rules[$key] = 'nullable|string|max:255';
            }
        }

        $validated = $request->validate($rules);

        $dataToSave = [
            'noujian' => $pendaftar->noujian,
            'namalbg' => $validated['namalbg'] ?? null,
            'lokasi' => $validated['lokasi'] ?? null,
        ];

        $dynamicParams = [];
        foreach ($parameters as $param) {
            $key = 'param_' . $param['nama'];
            if (isset($validated[$key])) {
                $dynamicParams[$param['nama']] = $validated[$key];
            }
        }

        if (! empty($dynamicParams)) {
            $dataToSave['param_kesehatan'] = $dynamicParams;
        }

        $previousStatus = $kesehatan ? $kesehatan->status : null;
        if (in_array($previousStatus, ['Tidak Lengkap', 'Perbaikan'])) {
            $dataToSave['status'] = 'Perbaikan';
        } else {
            $dataToSave['status'] = 'Belum Diperiksa';
        }

        $pendaftar->kesehatan()->updateOrCreate([], $dataToSave);

        return redirect()->back()->with('success', 'Data kesehatan berhasil disimpan.');
    }

    public function uploadKesehatanFile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = Pendaftar::where('user_id', $user->id)->firstOrFail();

        if (! $pendaftar->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $kesehatan = $pendaftar->kesehatan;
        if ($kesehatan && $kesehatan->finalized) {
            return redirect()->back()->with('error', 'Dokumen sudah difinalisasi dan tidak dapat diubah.');
        }

        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf|max:5120',
        ]);

        $existingCount = $pendaftar->fileKesehatan()->count();
        $counter = $existingCount + 1;
        $extension = $validated['file']->getClientOriginalExtension();
        $filename = "KESEHATAN-{$pendaftar->noujian}-{$counter}.{$extension}";

        $path = $validated['file']->storeAs('kesehatan', $filename, 'public');

        $pendaftar->fileKesehatan()->create([
            'file_lockes' => $path,
        ]);

        $previousStatus = $kesehatan ? $kesehatan->status : null;
        if (in_array($previousStatus, ['Tidak Lengkap', 'Perbaikan'])) {
            $kesehatan->update(['status' => 'Perbaikan']);
        }

        return redirect()->back()->with('success', 'File kesehatan berhasil diupload.');
    }

    public function deleteKesehatanFile(FileKesehatan $file): RedirectResponse
    {
        $user = request()->user();
        $pendaftar = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $kesehatan = $pendaftar->kesehatan;
        if ($kesehatan && $kesehatan->finalized) {
            return redirect()->back()->with('error', 'Dokumen sudah difinalisasi dan tidak dapat dihapus.');
        }

        if (Storage::disk('public')->exists($file->file_lockes)) {
            Storage::disk('public')->delete($file->file_lockes);
        }
        $file->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus.');
    }

    public function finalizeKesehatan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $pendaftar = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $kesehatan = $pendaftar->kesehatan;

        if (! $kesehatan) {
            return redirect()->back()->with('error', 'Data kesehatan belum tersedia.');
        }

        if ($kesehatan->finalized) {
            return redirect()->back()->with('error', 'Data kesehatan sudah difinalisasi.');
        }

        $previousStatus = $kesehatan->status;
        $newStatus = in_array($previousStatus, ['Tidak Lengkap', 'Perbaikan']) ? 'Perbaikan' : 'Belum Diperiksa';

        $kesehatan->update([
            'finalized' => true,
            'finalized_at' => now(),
            'status' => $newStatus,
        ]);

        return redirect()->back()->with('success', 'Data kesehatan berhasil difinalisasi.');
    }
}
