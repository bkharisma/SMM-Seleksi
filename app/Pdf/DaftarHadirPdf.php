<?php

namespace App\Pdf;

use App\Models\Absensi;
use App\Models\DataAbsensi;
use App\Models\Ruang;
use Mpdf\Mpdf;

class DaftarHadirPdf
{
    public function generate(DataAbsensi $dataAbsensi, Ruang $ruang): string
    {
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $absensi = Absensi::with(['peserta' => function ($q) {
            $q->with('pil1Prodi');
        }])
            ->where('data_absensi_id', $dataAbsensi->id)
            ->where('ruang_id', $ruang->id)
            ->orderBy('peserta_id')
            ->get();

        $html = view('pdf.daftar-hadir', [
            'dataAbsensi' => $dataAbsensi,
            'ruang' => $ruang,
            'absensi' => $absensi,
            'appName' => config('app.name'),
        ])->render();

        $mpdf->WriteHTML($html);

        return $mpdf->Output("daftar-hadir-{$ruang->nomor_ruang}.pdf", 'S');
    }

    public function download(DataAbsensi $dataAbsensi, Ruang $ruang)
    {
        $pdf = $this->generate($dataAbsensi, $ruang);

        return response($pdf)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="daftar-hadir-'.$ruang->nomor_ruang.'.pdf"');
    }
}
