<?php

namespace App\Exports;

use App\Models\Prodi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProdiReferenceSheet implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        return Prodi::where('active', true)
            ->orderBy('kode_prodi')
            ->get(['kode_prodi', 'nama_prodi', 'jenjang_prodi']);
    }

    public function headings(): array
    {
        return [
            'Kode Prodi',
            'Nama Prodi',
            'Jenjang',
        ];
    }

    public function title(): string
    {
        return 'Referensi Prodi';
    }
}
