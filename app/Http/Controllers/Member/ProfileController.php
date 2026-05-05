<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\EducationLevel;
use App\Models\Kabupaten;
use App\Models\Peserta;
use App\Models\Prodi;
use App\Models\Provinsi;
use App\Models\Survey;
use App\Pdf\KartuPesertaPdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();
        $peserta->load(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'pil4Prodi', 'ruang', 'survey']);

        return Inertia::render('member/profile/data-pribadi', [
            'peserta' => $peserta,
            'provinsi' => Provinsi::orderBy('nama_prop')->get(['kode_prop', 'nama_prop']),
            'kabupaten' => Kabupaten::orderBy('nama_kab')->get(['kode_kab', 'nama_kab', 'kode_prop']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama' => 'required|string|max:128',
            'nik' => 'nullable|string|max:16',
            'tempatlahir' => 'nullable|string|max:64',
            'tgllahir' => 'nullable|date',
            'goldarah' => 'nullable|string|max:5',
            'sex' => 'nullable|in:L,P',
            'agama' => 'nullable|string|max:64',
            'email' => ['nullable', 'email', 'max:128', Rule::unique('peserta', 'email')->ignore($peserta->id)],
            'hp' => 'nullable|string|max:16',
            'kode_prop' => 'nullable|string|max:2',
            'kode_kab' => 'nullable|string|max:4',
            'alamat' => 'nullable|string|max:128',
            'kodepos' => 'nullable|string|max:8',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data pribadi berhasil diperbarui.');
    }

    public function editOrtu(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        return Inertia::render('member/profile/data-ortu', [
            'peserta' => $peserta,
        ]);
    }

    public function updateOrtu(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nm_ayah' => 'nullable|string|max:64',
            'nm_ibu' => 'nullable|string|max:64',
            'pek_ayah' => 'nullable|string|max:64',
            'pek_ibu' => 'nullable|string|max:64',
            'telp_ortu' => 'nullable|string|max:64',
            'hp_ortu' => 'nullable|string|max:64',
            'email_ortu' => 'nullable|email|max:64',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data orang tua berhasil diperbarui.');
    }

    public function editPendidikan(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        return Inertia::render('member/profile/data-pendidikan', [
            'peserta' => $peserta,
            'education' => EducationLevel::where('active', true)->orderBy('orderby')->get(['code', 'description']),
        ]);
    }

    public function updatePendidikan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'jenis_sma' => 'nullable|string|max:8',
            'nama_sekolah' => 'nullable|string|max:64',
            'kota_sekolah' => 'nullable|string|max:64',
            'prop_sekolah' => 'nullable|string|max:64',
            'thn_sttb' => 'nullable|string|max:4',
            'presor_tkt' => 'nullable|string|max:32',
            'presor_juara' => 'nullable|integer|between:1,3',
            'presor' => 'nullable|string|max:64',
            'preskes_tkt' => 'nullable|string|max:32',
            'preskes_juara' => 'nullable|integer|between:1,3',
            'preskes' => 'nullable|string|max:64',
            'prespen_tkt' => 'nullable|string|max:32',
            'prespen_juara' => 'nullable|integer|between:1,3',
            'prespen' => 'nullable|string|max:64',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data pendidikan berhasil diperbarui.');
    }

    public function editPilihan(Request $request): Response
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();
        $peserta->load(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'pil4Prodi', 'survey']);

        return Inertia::render('member/profile/data-pilihan', [
            'peserta' => $peserta,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi', 'jenjang_prodi']),
            'survey' => Survey::orderBy('keterangan')->get(['id', 'keterangan']),
        ]);
    }

    public function updatePilihan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'pil1' => 'required|exists:prodi,id',
            'pil2' => 'nullable|exists:prodi,id',
            'pil3' => 'nullable|exists:prodi,id',
            'pil4' => 'nullable|exists:prodi,id',
            'taustp' => 'nullable|exists:survey,id',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Pilihan prodi berhasil diperbarui.');
    }

    public function uploadFoto(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($peserta->foto && Storage::disk('public')->exists($peserta->foto)) {
            Storage::disk('public')->delete($peserta->foto);
        }

        $path = $validated['foto']->store('foto', 'public');
        $peserta->update(['foto' => $path]);

        return redirect()->back()->with('success', 'Foto berhasil diupload.');
    }

    public function kartuPeserta(Request $request, KartuPesertaPdf $pdf)
    {
        $user = $request->user();
        $peserta = Peserta::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        return $pdf->download($peserta);
    }

    public function changePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return redirect()->back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return redirect()->back()->with('success', 'Password berhasil diubah.');
    }
}
