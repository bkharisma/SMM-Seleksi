<?php

namespace App\Exports;

use App\Models\JalurPendaftaran;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class JalurReferenceSheet implements FromCollection, WithHeadings, WithTitle
{
    public function collection()
    {
        return JalurPendaftaran::where('active', true)
            ->orderBy('kode_jalur')
            ->get(['kode_jalur', 'nama_jalur', 'deskripsi']);
    }

    public function headings(): array
    {
        return [
            'Kode Jalur',
            'Nama Jalur',
            'Deskripsi',
        ];
    }

    public function title(): string
    {
        return 'Referensi Jalur Pendaftaran';
    }
}
