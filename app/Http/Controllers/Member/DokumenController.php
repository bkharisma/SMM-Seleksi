<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\FileKesehatan;
use App\Models\FileRaport;
use App\Models\Kesehatan;
use App\Models\Peserta;
use App\Models\Raport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DokumenController extends Controller
{
    public function raport(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $raport = Raport::where('noujian', $peserta->noujian)->first();
        $files = FileRaport::where('noujian', $peserta->noujian)->get();

        return Inertia::render('member/upload/raport', [
            'peserta' => $peserta,
            'raport' => $raport,
            'files' => $files,
        ]);
    }

    public function storeRaport(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $validated = $request->validate([
            'npsn' => 'required|string|max:20',
            'akreditasi' => 'nullable|string|max:2',
            'ahuruf' => 'nullable|string|max:2',
            'anilai' => 'nullable|numeric',
            'x_1peng' => 'nullable|numeric',
            'x_1ket' => 'nullable|numeric',
            'x_2peng' => 'nullable|numeric',
            'x_2ket' => 'nullable|numeric',
            'xi_1peng' => 'nullable|numeric',
            'xi_1ket' => 'nullable|numeric',
            'xi_2peng' => 'nullable|numeric',
            'xi_2ket' => 'nullable|numeric',
            'xii_1peng' => 'nullable|numeric',
            'xii_1ket' => 'nullable|numeric',
            'xii_2peng' => 'nullable|numeric',
            'xii_2ket' => 'nullable|numeric',
        ]);

        $raport = Raport::updateOrCreate(
            ['noujian' => $peserta->noujian],
            array_merge($validated, ['status' => 'Belum Diperiksa'])
        );

        return redirect()->back()->with('success', 'Data raport berhasil disimpan.');
    }

    public function uploadRaportFile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf|max:5120',
        ]);

        $path = $validated['file']->store('raport', 'public');

        FileRaport::create([
            'noujian' => $peserta->noujian,
            'file_loc' => $path,
        ]);

        return redirect()->back()->with('success', 'File raport berhasil diupload.');
    }

    public function deleteRaportFile(FileRaport $file): RedirectResponse
    {
        if (Storage::disk('public')->exists($file->file_loc)) {
            Storage::disk('public')->delete($file->file_loc);
        }
        $file->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus.');
    }

    public function kesehatan(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $kesehatan = Kesehatan::where('noujian', $peserta->noujian)->first();
        $files = FileKesehatan::where('noujian', $peserta->noujian)->get();

        return Inertia::render('member/upload/kesehatan', [
            'peserta' => $peserta,
            'kesehatan' => $kesehatan,
            'files' => $files,
        ]);
    }

    public function storeKesehatan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $validated = $request->validate([
            'namalbg' => 'nullable|string|max:100',
            'lokasi' => 'nullable|string|max:100',
            'tb' => 'nullable|numeric',
            'bb' => 'nullable|numeric',
            'ow' => 'nullable|numeric',
            'obesitas' => 'nullable|integer',
            'tensi' => 'nullable|string|max:20',
            'nadi' => 'nullable|string|max:20',
            'tato' => 'nullable|string|max:20',
            'tindik' => 'nullable|integer',
            'bw' => 'nullable|string|max:50',
            'strab' => 'nullable|integer',
            'pupil' => 'nullable|string|max:50',
            'paru' => 'nullable|string|max:50',
            'sco' => 'nullable|string|max:50',
            'mop' => 'nullable|integer',
            'amp' => 'nullable|integer',
            'thc' => 'nullable|integer',
            'kehamilan' => 'nullable|integer',
        ]);

        $kesehatan = Kesehatan::updateOrCreate(
            ['noujian' => $peserta->noujian],
            array_merge($validated, ['status' => 'Belum Diperiksa'])
        );

        return redirect()->back()->with('success', 'Data kesehatan berhasil disimpan.');
    }

    public function uploadKesehatanFile(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        $path = $validated['file']->store('kesehatan', 'public');

        FileKesehatan::create([
            'noujian' => $peserta->noujian,
            'file_lockes' => $path,
        ]);

        return redirect()->back()->with('success', 'File kesehatan berhasil diupload.');
    }

    public function deleteKesehatanFile(FileKesehatan $file): RedirectResponse
    {
        if (Storage::disk('public')->exists($file->file_lockes)) {
            Storage::disk('public')->delete($file->file_lockes);
        }
        $file->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus.');
    }
}
