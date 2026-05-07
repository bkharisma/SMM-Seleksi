<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class PendaftarTemplateSheet implements FromArray, WithHeadings, WithTitle
{
    public function array(): array
    {
        return [
            [
                'P2026001',
                'Ahmad Fauzi',
                '',
                'D3-DIK',
                '',
                '',
                '2000-01-15',
                'L',
                'ahmad@example.com',
                '081234567890',
                'REG',
            ],
            [
                'P2026002',
                'Siti Nurhaliza',
                '',
                'D4-PKA',
                '',
                '',
                '2001-03-22',
                'P',
                'siti@example.com',
                '089876543210',
                'PRESTASI',
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'kode_pendaftar',
            'nama',
            'no_ujian',
            'pilihan_1',
            'pilihan_2',
            'pilihan_3',
            'tanggal_lahir',
            'jenis_kelamin',
            'email',
            'no_hp',
            'jalur_pendaftaran',
        ];
    }

    public function title(): string
    {
        return 'Template Import Pendaftar';
    }
}
