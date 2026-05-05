<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PesertaTemplateExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return collect([]);
    }

    public function headings(): array
    {
        return [
            'nama',
            'nik',
            'tempatlahir',
            'tgllahir',
            'goldarah',
            'sex',
            'agama',
            'email',
            'hp',
            'alamat',
            'kodepos',
            'provinsi',
            'kabupaten',
            'pil1',
            'pil2',
            'pil3',
            'pil4',
            'ruang',
        ];
    }
}
