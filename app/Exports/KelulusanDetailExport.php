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

class KelulusanDetailExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
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
            'NUP',
            'Nama',
            'No. Ujian',
            'Pilihan',
            'Tahap Lulus',
            'Nilai Akhir',
            'Status',
            'Lulus di Prodi',
        ];
    }

    public function map($row): array
    {
        return [
            $row['nup'] ?? '',
            $row['nama'] ?? '',
            $row['noujian'] ?? '-',
            $row['pilihan'] ?? '-',
            $row['tahap_lulus'] ?? '-',
            $row['total_skor'] ?? 0,
            $row['status'] ?? 'Lulus',
            $row['lulus_prodi'] ?? '-',
        ];
    }

    public function title(): string
    {
        return 'Detail Lulus - '.$this->prodi->nama_prodi;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
