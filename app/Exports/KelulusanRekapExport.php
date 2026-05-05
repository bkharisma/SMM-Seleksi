<?php

namespace App\Exports;

use App\Models\Peserta;
use App\Models\Prodi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KelulusanRekapExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $prodiId;

    public function __construct(?int $prodiId = null)
    {
        $this->prodiId = $prodiId;
    }

    public function collection()
    {
        $query = Prodi::active()->withCount(['pesertaLulus']);

        if ($this->prodiId) {
            $query->where('id', $this->prodiId);
        }

        return $query->get()->map(function ($prodi) {
            $lulusPil1 = Peserta::where('lulus', $prodi->id)->where('pil1', $prodi->id)->count();
            $lulusPil2 = Peserta::where('lulus', $prodi->id)->where('pil2', $prodi->id)->count();
            $lulusPil3 = Peserta::where('lulus', $prodi->id)->where('pil3', $prodi->id)->count();
            $lulusPil4 = Peserta::where('lulus', $prodi->id)->where('pil4', $prodi->id)->count();

            return (object) [
                'kode_prodi' => $prodi->kode_prodi,
                'nama_prodi' => $prodi->nama_prodi,
                'total_lulus' => $prodi->peserta_lulus_count,
                'kuota' => $prodi->kuota_smm,
                'pilihan_1' => $lulusPil1,
                'pilihan_2' => $lulusPil2,
                'pilihan_3' => $lulusPil3,
                'pilihan_4' => $lulusPil4,
                'tersisa' => $prodi->kuota_smm ? max(0, $prodi->kuota_smm - $prodi->peserta_lulus_count) : null,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Kode Prodi',
            'Nama Prodi',
            'Total Lulus',
            'Kuota',
            'Pilihan 1',
            'Pilihan 2',
            'Pilihan 3',
            'Pilihan 4',
            'Sisa Kuota',
        ];
    }

    public function map($row): array
    {
        return [
            $row->kode_prodi,
            $row->nama_prodi,
            $row->total_lulus,
            $row->kuota ?? '-',
            $row->pilihan_1,
            $row->pilihan_2,
            $row->pilihan_3,
            $row->pilihan_4,
            $row->tersisa ?? '-',
        ];
    }

    public function title(): string
    {
        return 'Rekap Kelulusan';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
