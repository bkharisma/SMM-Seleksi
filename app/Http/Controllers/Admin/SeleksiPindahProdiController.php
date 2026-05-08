<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prodi;
use App\Services\SeleksiPindahProdiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeleksiPindahProdiController extends Controller
{
    protected SeleksiPindahProdiService $service;

    public function __construct(SeleksiPindahProdiService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): Response
    {
        $search = $request->get('search');
        $peserta = $this->service->getPesertaBelumLulus($search);
        $prodiWithKuota = $this->service->getProdiWithSisaKuota();

        return Inertia::render('admin/seleksi-pindah-prodi/index', [
            'peserta' => $peserta,
            'prodiWithKuota' => $prodiWithKuota,
            'filters' => $request->only(['search']),
        ]);
    }

    public function saveKeputusan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'selections' => 'required|array|min:1',
            'selections.*.nup' => 'required|string',
            'selections.*.prodi_id' => 'required|integer|exists:prodi,id',
        ]);

        $result = $this->service->savePindahProdi($validated['selections']);

        if ($result['success']) {
            $message = $result['message'];
            if (!empty($result['errors'])) {
                $message .= '. Catatan: ' . implode(', ', $result['errors']);
            }
            return redirect()->route('admin.seleksi-pindah-prodi.index')
                ->with('success', $message);
        }

        return redirect()->back()
            ->with('error', $result['message'] . '. ' . implode(', ', $result['errors']));
    }
}
