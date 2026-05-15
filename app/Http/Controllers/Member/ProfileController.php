<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use App\Models\Prodi;
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
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();
        $peserta->load(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'ruang']);

        return Inertia::render('member/profile/data-pribadi', [
            'peserta' => $peserta,
            'provinsi' => [],
            'kabupaten' => [],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama' => 'required|string|max:128',
            'tempat_lahir' => 'nullable|date',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'agama' => 'nullable|string|max:64',
            'email' => ['nullable', 'email', 'max:128', Rule::unique('pendaftar', 'email')->ignore($peserta->id)],
            'no_hp' => 'nullable|string|max:16',
            'alamat' => 'nullable|string|max:128',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data pribadi berhasil diperbarui.');
    }

    public function editOrtu(Request $request): Response
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        return Inertia::render('member/profile/data-ortu', [
            'peserta' => $peserta,
        ]);
    }

    public function updateOrtu(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama_ayah' => 'nullable|string|max:64',
            'nama_ibu' => 'nullable|string|max:64',
            'pekerjaan_ayah' => 'nullable|string|max:64',
            'pekerjaan_ibu' => 'nullable|string|max:64',
            'hp_ayah' => 'nullable|string|max:64',
            'hp_ibu' => 'nullable|string|max:64',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data orang tua berhasil diperbarui.');
    }

    public function editPendidikan(Request $request): Response
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        return Inertia::render('member/profile/data-pendidikan', [
            'peserta' => $peserta,
            'education' => [],
        ]);
    }

    public function updatePendidikan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'nama_sekolah' => 'nullable|string|max:64',
            'npsn' => 'nullable|string|max:20',
            'akreditasi' => 'nullable|string|max:10',
            'tahun_lulus' => 'nullable|string|max:4',
            'prestasi' => 'nullable|string|max:500',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Data pendidikan berhasil diperbarui.');
    }

    public function editPilihan(Request $request): Response
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();
        $peserta->load(['pil1Prodi', 'pil2Prodi', 'pil3Prodi']);

        return Inertia::render('member/profile/data-pilihan', [
            'peserta' => $peserta,
            'prodi' => Prodi::where('active', true)->get(['id', 'nama_prodi', 'kode_prodi', 'jenjang_prodi']),
            'survey' => [],
        ]);
    }

    public function updatePilihan(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'pil1' => 'required|exists:prodi,id',
            'pil2' => 'nullable|exists:prodi,id',
            'pil3' => 'nullable|exists:prodi,id',
        ]);

        $peserta->update($validated);

        return redirect()->back()->with('success', 'Pilihan prodi berhasil diperbarui.');
    }

    public function uploadFoto(Request $request): RedirectResponse
    {
        $user = $request->user();
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

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
        $peserta = Pendaftar::where('user_id', $user->id)->firstOrFail();

        if (! $peserta->noujian) {
            return redirect()->back()->with('error', 'Nomor ujian belum tersedia.');
        }

        return $pdf->download($peserta);
    }

    public function changePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return redirect()->back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return redirect()->back()->with('success', 'Password berhasil diubah.');
    }
}
