<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BersediaPindahReferensiSheet implements FromCollection, WithHeadings, WithStyles, WithTitle
{
    public function collection()
    {
        return collect([
            ['1', 'Ya'],
            ['0', 'Tidak'],
        ]);
    }

    public function headings(): array
    {
        return ['Nilai', 'Keterangan'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'color' => ['rgb' => '000000']]],
        ];
    }

    public function title(): string
    {
        return 'Format Bersedia Pindah';
    }
}
