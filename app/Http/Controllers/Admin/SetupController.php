<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SetupController extends Controller
{
    public function index(): Response
    {
        $settings = Setup::all()->keyBy('code');

        $data = [
            'nama_ptp' => $settings->get('nama_ptp')?->char_val ?? '',
            'alamat_ptp' => $settings->get('alamat_ptp')?->char_val ?? '',
            'telepon_ptp' => $settings->get('telepon_ptp')?->char_val ?? '',
            'email_ptp' => $settings->get('email_ptp')?->char_val ?? '',
            'website_ptp' => $settings->get('website_ptp')?->char_val ?? '',
            'biaya_pendaftaran' => $settings->get('biaya_pendaftaran')?->int_val ?? 0,
            'aktif' => $settings->get('aktif')?->int_val ?? 0,
            'tahun_akademik' => $settings->get('tahun_akademik')?->char_val ?? '',
            'pengumuman_url' => $settings->get('pengumuman_url')?->char_val ?? '',
            'max_pilihan' => $settings->get('max_pilihan')?->int_val ?? 4,
            'dashboard_lengkap' => $settings->get('dashboard_lengkap')?->int_val ?? 1,
            'dashboard_upload_syarat' => $settings->get('dashboard_upload_syarat')?->int_val ?? 0,
            'logo_path' => $settings->get('logo_path')?->char_val ?? '',
            'favicon_path' => $settings->get('favicon_path')?->char_val ?? '',
            'kelulusan_tahap_1_dibuka' => $settings->get('kelulusan_tahap_1_dibuka')?->int_val ?? 0,
            'kelulusan_tahap_2_dibuka' => $settings->get('kelulusan_tahap_2_dibuka')?->int_val ?? 0,
            'custom_registration_enabled' => $settings->get('custom_registration_enabled')?->int_val ?? 0,
            'custom_registration_url' => $settings->get('custom_registration_url')?->char_val ?? '',
        ];

        return Inertia::render('admin/settings/index', [
            'settings' => $data,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_ptp' => 'required|string|max:128',
            'alamat_ptp' => 'nullable|string|max:255',
            'telepon_ptp' => 'nullable|string|max:32',
            'email_ptp' => 'nullable|email|max:128',
            'website_ptp' => 'nullable|string|max:128',
            'biaya_pendaftaran' => 'required|integer|min:0',
            'aktif' => 'required|integer|in:0,1',
            'tahun_akademik' => 'required|string|max:16',
            'pengumuman_url' => 'nullable|string|max:255',
            'max_pilihan' => 'required|integer|min:1|max:4',
            'dashboard_lengkap' => 'required|integer|in:0,1',
            'dashboard_upload_syarat' => 'required|integer|in:0,1',
            'kelulusan_tahap_1_dibuka' => 'required|integer|in:0,1',
            'kelulusan_tahap_2_dibuka' => 'required|integer|in:0,1',
            'custom_registration_enabled' => 'required|integer|in:0,1',
            'custom_registration_url' => 'nullable|string|max:255',
        ]);

        if ($validated['dashboard_upload_syarat'] == 1) {
            $validated['dashboard_lengkap'] = 0;
        }

        if ($validated['dashboard_lengkap'] == 0 && $validated['dashboard_upload_syarat'] == 0) {
            $validated['dashboard_lengkap'] = 1;
        }

        foreach ($validated as $key => $value) {
            Setup::set($key, $value);
        }

        return redirect()->route('admin.settings')->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function uploadLogo(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg|max:2048',
        ]);

        $oldLogoPath = Setup::get('logo_path');

        if ($oldLogoPath && Storage::disk('public')->exists($oldLogoPath)) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        $file = $request->file('logo');
        $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('logos', $filename, 'public');

        Setup::set('logo_path', 'logos/' . $filename);

        return redirect()->route('admin.settings')->with('success', 'Logo berhasil diupload.');
    }

    public function deleteLogo(): RedirectResponse
    {
        $logoPath = Setup::get('logo_path');

        if ($logoPath && Storage::disk('public')->exists($logoPath)) {
            Storage::disk('public')->delete($logoPath);
        }

        Setup::where('code', 'logo_path')->delete();

        return redirect()->route('admin.settings')->with('success', 'Logo berhasil dihapus.');
    }

    public function dashboardMember(): Response
    {
        $settings = Setup::all()->keyBy('code');

        $data = [
            'dashboard_lengkap' => $settings->get('dashboard_lengkap')?->int_val ?? 1,
            'dashboard_upload_syarat' => $settings->get('dashboard_upload_syarat')?->int_val ?? 0,
        ];

        return Inertia::render('admin/settings/dashboard-member', [
            'settings' => $data,
        ]);
    }

    public function updateDashboardMember(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'dashboard_lengkap' => 'required|integer|in:0,1',
            'dashboard_upload_syarat' => 'required|integer|in:0,1',
        ]);

        if ($validated['dashboard_upload_syarat'] == 1) {
            $validated['dashboard_lengkap'] = 0;
        }

        if ($validated['dashboard_lengkap'] == 0 && $validated['dashboard_upload_syarat'] == 0) {
            $validated['dashboard_lengkap'] = 1;
        }

        Setup::set('dashboard_lengkap', $validated['dashboard_lengkap']);
        Setup::set('dashboard_upload_syarat', $validated['dashboard_upload_syarat']);

        return redirect()->route('admin.settings.dashboard-member')->with('success', 'Pengaturan dashboard member berhasil diperbarui.');
    }

    public function landing(): Response
    {
        $settings = Setup::all()->keyBy('code');

        $data = [
            'hero_image_path' => $settings->get('hero_image_path')?->char_val ?? '',
            'accreditation_image_path' => $settings->get('accreditation_image_path')?->char_val ?? '',
        ];

        return Inertia::render('admin/settings/landing', [
            'settings' => $data,
        ]);
    }

    public function uploadHeroImage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        $oldPath = Setup::get('hero_image_path');

        if ($oldPath && Storage::exists('public/' . $oldPath)) {
            Storage::delete('public/' . $oldPath);
        }

        $file = $request->file('image');
        $filename = 'hero_' . time() . '.' . $file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('landing', $file, $filename);

        if (!$path) {
            \Illuminate\Support\Facades\Log::error('Hero image upload failed', [
                'filename' => $filename,
            ]);
            return redirect()->route('admin.settings.landing')->withErrors(['image' => 'Gagal mengupload gambar. Periksa permission folder storage.']);
        }

        Setup::set('hero_image_path', 'landing/' . $filename);

        return redirect()->route('admin.settings.landing')->with('success', 'Hero image berhasil diupload.');
    }

    public function deleteHeroImage(): RedirectResponse
    {
        $imagePath = Setup::get('hero_image_path');

        if ($imagePath && Storage::exists('public/' . $imagePath)) {
            Storage::delete('public/' . $imagePath);
        }

        Setup::where('code', 'hero_image_path')->delete();

        return redirect()->route('admin.settings.landing')->with('success', 'Hero image berhasil dihapus.');
    }

    public function uploadAccreditationImage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        $oldPath = Setup::get('accreditation_image_path');

        if ($oldPath && Storage::exists('public/' . $oldPath)) {
            Storage::delete('public/' . $oldPath);
        }

        $file = $request->file('image');
        $filename = 'accreditation_' . time() . '.' . $file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('landing', $file, $filename);

        if (!$path) {
            \Illuminate\Support\Facades\Log::error('Accreditation image upload failed', [
                'filename' => $filename,
            ]);
            return redirect()->route('admin.settings.landing')->withErrors(['image' => 'Gagal mengupload gambar. Periksa permission folder storage.']);
        }

        Setup::set('accreditation_image_path', 'landing/' . $filename);

        return redirect()->route('admin.settings.landing')->with('success', 'Foto akreditasi berhasil diupload.');
    }

    public function deleteAccreditationImage(): RedirectResponse
    {
        $imagePath = Setup::get('accreditation_image_path');

        if ($imagePath && Storage::exists('public/' . $imagePath)) {
            Storage::delete('public/' . $imagePath);
        }

        Setup::where('code', 'accreditation_image_path')->delete();

        return redirect()->route('admin.settings.landing')->with('success', 'Foto akreditasi berhasil dihapus.');
    }

    public function uploadFavicon(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'favicon' => 'required|file|mimes:png,jpg,jpeg,svg,ico,webp|max:2048',
        ]);

        $oldPath = Setup::get('favicon_path');

        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $file = $request->file('favicon');
        $extension = $file->getClientOriginalExtension() ?: 'png';
        $filename = 'favicon_' . time() . '.' . $extension;
        $storedPath = $file->storeAs('favicons', $filename, 'public');

        if (!$storedPath) {
            \Illuminate\Support\Facades\Log::error('Favicon upload failed', [
                'filename' => $filename,
                'extension' => $extension,
                'original_name' => $file->getClientOriginalName(),
            ]);
            return redirect()->route('admin.settings')->withErrors(['favicon' => 'Gagal mengupload favicon. Periksa permission folder storage.']);
        }

        Setup::set('favicon_path', 'favicons/' . $filename);

        \Illuminate\Support\Facades\Log::info('Favicon uploaded successfully', [
            'path' => 'favicons/' . $filename,
        ]);

        return redirect()->route('admin.settings')->with('success', 'Favicon berhasil diupload.');
    }

    public function deleteFavicon(): RedirectResponse
    {
        $faviconPath = Setup::get('favicon_path');

        if ($faviconPath && Storage::disk('public')->exists($faviconPath)) {
            Storage::disk('public')->delete($faviconPath);
        }

        Setup::where('code', 'favicon_path')->delete();

        return redirect()->route('admin.settings')->with('success', 'Favicon berhasil dihapus.');
    }
}
