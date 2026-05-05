<?php

namespace App\Pdf;

use App\Models\Peminat;
use Mpdf\Mpdf;

class BuktiRegistrasiPdf
{
    public function generate(Peminat $peminat): string
    {
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 20,
            'margin_right' => 20,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $vaInfo = $peminat->bsiPembayaran;

        $html = view('pdf.bukti-registrasi', [
            'peminat' => $peminat,
            'va' => $vaInfo,
            'appName' => config('app.name'),
        ])->render();

        $mpdf->WriteHTML($html);

        return $mpdf->Output('bukti-registrasi-'.$peminat->nup.'.pdf', 'S');
    }

    public function download(Peminat $peminat)
    {
        $pdf = $this->generate($peminat);

        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="bukti-registrasi-'.$peminat->nup.'.pdf"');
    }
}
