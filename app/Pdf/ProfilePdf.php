<?php

namespace App\Pdf;

use App\Models\Pendaftar;
use Mpdf\Mpdf;

class ProfilePdf
{
    public function generate(Pendaftar $peserta): string
    {
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 20,
            'margin_right' => 20,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $peserta->load([
            'pil1Prodi', 'pil2Prodi', 'pil3Prodi',
            'ruang', 'lulusProdi',
        ]);

        $html = view('pdf.profile', [
            'peserta' => $peserta,
            'appName' => config('app.name'),
        ])->render();

        $mpdf->WriteHTML($html);

        return $mpdf->Output('profile-'.$peserta->kode_pendaftar.'.pdf', 'S');
    }

    public function download(Pendaftar $peserta)
    {
        $pdf = $this->generate($peserta);

        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="profile-'.$peserta->kode_pendaftar.'.pdf"');
    }
}
