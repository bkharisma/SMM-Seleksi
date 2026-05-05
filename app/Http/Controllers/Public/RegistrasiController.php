<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Peminat;
use App\Models\Periode;
use App\Models\Prodi;
use App\Models\Setup;
use App\Models\Survey;
use App\Pdf\BuktiRegistrasiPdf;
use App\Services\RegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class RegistrasiController extends Controller
{
    public function __construct(
        protected RegistrationService $registrationService
    ) {}

    public function create(): Response
    {
        $periode = Periode::current()->first();
        $aktif = (int) Setup::get('aktif', 0);
        $biaya = (int) Setup::get('biaya_pendaftaran', 0);
        $maxPilihan = (int) Setup::get('max_pilihan', 4);

        $prodi = Cache::remember('registrasi_prodi_list', 3600, fn () => Prodi::active()->orderBy('jenjang_prodi')->orderBy('nama_prodi')->get()->toArray()
        );
        $survey = Cache::remember('registrasi_survey_list', 3600, fn () => Survey::orderBy('keterangan')->get()->toArray()
        );

        return Inertia::render('public/registrasi', [
            'periode' => $periode,
            'aktif' => $aktif,
            'biaya' => $biaya,
            'maxPilihan' => $maxPilihan,
            'prodi' => $prodi,
            'survey' => $survey,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $result = $this->registrationService->register($request->all());

        if (! $result['success']) {
            if (isset($result['errors'])) {
                return redirect()->back()->withErrors($result['errors'])->withInput();
            }

            return redirect()->back()->with('error', $result['message'])->withInput();
        }

        return redirect()->route('registrasi.success', [
            'nup' => $result['peminat']->nup,
        ]);
    }

    public function success(string $nup): Response
    {
        $peminat = Peminat::with('bsiPembayaran')->where('nup', $nup)->firstOrFail();

        return Inertia::render('public/registrasi-success', [
            'peminat' => $peminat,
            'va' => $peminat->bsiPembayaran ? [
                'virtual_account' => $peminat->bsiPembayaran->virtual_account,
                'amount' => $peminat->bsiPembayaran->trx_amount,
                'expired_at' => $peminat->bsiPembayaran->datetime_expired?->format('Y-m-d H:i:s'),
                'is_sandbox' => env('BSI_MOCK_MODE', false) || config('app.env') === 'local' || config('app.env') === 'testing',
            ] : null,
        ]);
    }

    public function buktiDaftar(string $nup)
    {
        $peminat = Peminat::with('bsiPembayaran')->where('nup', $nup)->firstOrFail();

        $pdf = new BuktiRegistrasiPdf;

        return $pdf->download($peminat);
    }
}
