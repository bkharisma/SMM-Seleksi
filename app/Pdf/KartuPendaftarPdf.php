<?php

namespace App\Pdf;

use App\Models\Pendaftar;
use Mpdf\Mpdf;
use SimpleSoftwareIO\QrCode\Generator;

class KartuPendaftarPdf
{
    public function generate(Pendaftar $pendaftar): string
    {
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => [85, 55],
            'margin_left' => 5,
            'margin_right' => 5,
            'margin_top' => 5,
            'margin_bottom' => 5,
            'orientation' => 'L',
        ]);

        $pendaftar->load(['pil1Prodi', 'ruang']);

        $qrCode = $this->generateQrCode($pendaftar);

        $html = view('pdf.kartu-pendaftar', [
            'pendaftar' => $pendaftar,
            'qrCode' => $qrCode,
            'appName' => config('app.name'),
        ])->render();

        $mpdf->WriteHTML($html);

        return $mpdf->Output('kartu-pendaftar-'.$pendaftar->noujian.'.pdf', 'S');
    }

    public function download(Pendaftar $pendaftar)
    {
        $pdf = $this->generate($pendaftar);

        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="kartu-pendaftar-'.$pendaftar->noujian.'.pdf"');
    }

    private function generateQrCode(Pendaftar $pendaftar): string
    {
        $qrCode = new Generator;
        $data = "KODEPENDAFTAR:{$pendaftar->kode_pendaftar}|NOUJIAN:{$pendaftar->noujian}|NAMA:{$pendaftar->nama}";
        $svg = $qrCode->size(80)->generate($data);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
