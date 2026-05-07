<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PendaftarErrorExport implements FromArray, WithHeadings, WithStyles, WithTitle
{
    protected array $errors;

    public function __construct(array $errors)
    {
        $this->errors = $errors;
    }

    public function array(): array
    {
        return array_map(function ($e) {
            return [
                $e['row'] ?? '',
                $e['kode_pendaftar'] ?? '',
                $e['nama'] ?? '',
                $e['tanggal_lahir'] ?? '',
                $e['jenis_kelamin'] ?? '',
                $e['pilihan_1'] ?? '',
                $e['pilihan_2'] ?? '',
                $e['pilihan_3'] ?? '',
                $e['email'] ?? '',
                $e['no_hp'] ?? '',
                $e['jalur_pendaftaran'] ?? '',
                $e['error'] ?? '',
            ];
        }, $this->errors);
    }

    public function headings(): array
    {
        return [
            'Baris',
            'Kode Pendaftar',
            'Nama',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'Pilihan 1',
            'Pilihan 2',
            'Pilihan 3',
            'Email',
            'No. HP',
            'Jalur Pendaftaran',
            'Error',
        ];
    }

    public function title(): string
    {
        return 'Error Import Pendaftar';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
