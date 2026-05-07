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
            'kode_pendaftar',
            'nama',
            'tanggal_lahir',
            'email',
            'no_hp',
            'jenis_kelamin',
            'agama',
            'alamat',
            'pil1',
            'pil2',
            'pil3',
            'nama_sekolah',
            'npsn',
            'akreditasi',
            'tahun_lulus',
        ];
    }
}
