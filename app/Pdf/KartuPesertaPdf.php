<?php

namespace App\Pdf;

use App\Models\Peserta;
use Mpdf\Mpdf;
use SimpleSoftwareIO\QrCode\Generator;

class KartuPesertaPdf
{
    public function generate(Peserta $peserta): string
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

        $peserta->load(['pil1Prodi', 'ruang']);

        $qrCode = $this->generateQrCode($peserta);

        $html = view('pdf.kartu-peserta', [
            'peserta' => $peserta,
            'qrCode' => $qrCode,
            'appName' => config('app.name'),
        ])->render();

        $mpdf->WriteHTML($html);

        return $mpdf->Output('kartu-peserta-'.$peserta->noujian.'.pdf', 'S');
    }

    public function download(Peserta $peserta)
    {
        $pdf = $this->generate($peserta);

        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="kartu-peserta-'.$peserta->noujian.'.pdf"');
    }

    private function generateQrCode(Peserta $peserta): string
    {
        $qrCode = new Generator;
        $data = "NUP:{$peserta->nup}|NOUJIAN:{$peserta->noujian}|NAMA:{$peserta->nama}";
        $svg = $qrCode->size(80)->generate($data);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }
}
