<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setup;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
}
