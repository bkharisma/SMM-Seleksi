<?php

namespace App\Exports;

use App\Models\Prodi;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KelulusanTahap2Export implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected Collection $peserta;

    protected Prodi $prodi;

    public function __construct(Collection $peserta, Prodi $prodi)
    {
        $this->peserta = $peserta;
        $this->prodi = $prodi;
    }

    public function collection()
    {
        return $this->peserta;
    }

    public function headings(): array
    {
        return [
            'No',
            'NUP',
            'Nama',
            'No. Ujian',
            'Program Studi',
            'Status Berkas',
            'Status Kelulusan',
        ];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row['nup'] ?? '',
            $row['nama'] ?? '',
            $row['noujian'] ?? '-',
            $this->prodi->nama_prodi,
            $row['status_berkas'] ?? '-',
            $row['is_lulus_final'] ? 'LULUS Tahap 2' : ($row['is_tidak_lulus_final'] ? 'TIDAK LULUS' : 'Belum Finalisasi'),
        ];
    }

    public function title(): string
    {
        return 'Lulus Tahap 2 - ' . $this->prodi->kode_prodi;
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();

        return [
            1 => ['font' => ['bold' => true]],
            "A1:G{$highestRow}" => ['alignment' => ['vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER]],
            "A2:A{$highestRow}" => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            "D2:D{$highestRow}" => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            "F2:F{$highestRow}" => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
            "G2:G{$highestRow}" => ['alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER]],
        ];
    }
}
