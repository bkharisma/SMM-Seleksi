<?php

namespace App\Http\Controllers\Admin;

use App\Exports\KelulusanTahap2Export;
use App\Http\Controllers\Controller;
use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\TahapSeleksi;
use App\Services\KelulusanRekapService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class KelulusanRekapController extends Controller
{
    protected KelulusanRekapService $service;

    public function __construct(KelulusanRekapService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): Response
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $rekap = $this->service->getRekapKelulusanSyarat($prodiId);
        $prodi = Prodi::active()->get(['id', 'nama_prodi', 'kode_prodi']);
        $isFinalized = $this->service->isFinalizedTahap2();

        return Inertia::render('admin/syarat/rekap/index', [
            'rekap' => $rekap,
            'prodi' => $prodi,
            'is_finalized' => $isFinalized,
            'filters' => $request->only(['prodi_id']),
        ]);
    }

    public function detail(Prodi $prodi): Response
    {
        $result = $this->service->getDetailByProdi($prodi->id);

        return Inertia::render('admin/syarat/rekap/detail', [
            'detail' => $result,
        ]);
    }

    public function exportTahap2Detail(Prodi $prodi)
    {
        $tahap2 = TahapSeleksi::where('urutan', 2)->where('active', true)->first();

        $peserta = Pendaftar::with(['kesehatan', 'lulusProdi', 'lulusTahap'])
            ->where('lulus', $prodi->id)
            ->orderBy('nama')
            ->get()
            ->map(function ($p) use ($tahap2) {
                $tahap2Id = $tahap2?->id;
                $statusBerkas = $p->kesehatan ? $p->kesehatan->status : 'Belum Upload';
                $isFinalTahap2 = $p->lulus_tahap == $tahap2Id;

                return [
                    'nup' => $p->kode_pendaftar,
                    'nama' => $p->nama,
                    'noujian' => $p->noujian,
                    'status_berkas' => $statusBerkas,
                    'is_lulus_final' => $isFinalTahap2,
                    'is_tidak_lulus_final' => $p->finalisasi === true,
                ];
            });

        $filename = 'kelulusan_tahap2_' . $prodi->kode_prodi . '_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(new KelulusanTahap2Export($peserta, $prodi), $filename);
    }

    public function finalisasi(Request $request): RedirectResponse
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $result = $this->service->finalisasiTahap2($prodiId);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }

    public function revertFinalisasi(Request $request): RedirectResponse
    {
        $prodiId = $request->filled('prodi_id') ? (int) $request->prodi_id : null;
        $result = $this->service->revertFinalisasiTahap2($prodiId);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message']);
    }
}
