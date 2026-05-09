<?php

namespace App\Exports;

use App\Models\Prodi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProdiReferensiSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function collection()
    {
        return Prodi::active()->orderBy('kode_prodi')->get();
    }

    public function headings(): array
    {
        return ['ID Prodi', 'Kode Prodi', 'Nama Prodi'];
    }

    public function map($prodi): array
    {
        return [
            $prodi->id,
            $prodi->kode_prodi,
            $prodi->nama_prodi,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'color' => ['rgb' => '000000']]],
        ];
    }

    public function title(): string
    {
        return 'Daftar Prodi';
    }
}
