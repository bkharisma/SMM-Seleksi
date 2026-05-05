<?php

namespace App\Exports;

use App\Models\Peserta;
use App\Models\PesertaNilai;
use App\Models\Ujian;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class NilaiExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    const FIELD_META = [
        'psi_iq' => ['label' => 'IQ', 'type' => 'int'],
        'psi_bobot' => ['label' => 'Bobot', 'type' => 'int'],
        'bing_nil' => ['label' => 'Nilai Inggris', 'type' => 'int'],
        'waw_nil' => ['label' => 'Nilai Wawancara', 'type' => 'int'],
        'kes_tb' => ['label' => 'TB', 'type' => 'int'],
        'kes_bw' => ['label' => 'BW', 'type' => 'bool'],
        'kes_obe' => ['label' => 'Obesitas', 'type' => 'float'],
        'kes_nark' => ['label' => 'Narkoba', 'type' => 'bool'],
        'kes_hml' => ['label' => 'Hermes', 'type' => 'bool'],
        'kes_tato' => ['label' => 'Tato', 'type' => 'bool'],
        'kes_tindik' => ['label' => 'Tindik', 'type' => 'bool'],
        'kes_paru' => ['label' => 'Paru', 'type' => 'bool'],
        'kes_stra' => ['label' => 'Strabismus', 'type' => 'bool'],
        'kes_scol' => ['label' => 'Scoliosis', 'type' => 'bool'],
        'skor_akhir' => ['label' => 'Skor Akhir', 'type' => 'float'],
    ];

    protected Ujian $ujian;

    protected bool $isTemplate;

    public function __construct(Ujian $ujian, bool $isTemplate = false)
    {
        $this->ujian = $ujian;
        $this->isTemplate = $isTemplate;
    }

    private function fields(): array
    {
        return $this->ujian->fields_config['fields'] ?? [];
    }

    public function collection()
    {
        if ($this->isTemplate) {
            $pesertas = Peserta::with('pil1Prodi')->orderBy('nama')->get();

            return $pesertas->map(function ($peserta) {
                $row = new \stdClass;
                $row->nup = $peserta->nup;
                $row->noujian = $peserta->noujian;
                $row->nama = $peserta->nama;
                $row->pil1_prodi = $peserta->pil1Prodi?->nama_prodi;
                foreach ($this->fields() as $field) {
                    $row->$field = null;
                }

                return $row;
            });
        }

        return PesertaNilai::with(['peserta' => function ($q) {
            $q->with('pil1Prodi');
        }])
            ->where('ujian_id', $this->ujian->id)
            ->get();
    }

    public function headings(): array
    {
        $base = ['NUP', 'No. Ujian', 'Nama', 'Pilihan 1'];

        foreach ($this->fields() as $field) {
            $base[] = self::FIELD_META[$field]['label'] ?? $field;
        }

        return $base;
    }

    public function map($row): array
    {
        $data = [
            $row->nup,
            $row->noujian ?? $row->nus ?? $row->peserta?->noujian ?? '',
            $row->nama ?? $row->peserta?->nama ?? '',
            $row->pil1_prodi ?? $row->peserta?->pil1Prodi?->nama_prodi ?? '',
        ];

        foreach ($this->fields() as $field) {
            $value = $row->$field ?? null;
            $meta = self::FIELD_META[$field] ?? null;

            if ($meta && $meta['type'] === 'bool') {
                $value = $value ? 1 : 0;
            }

            $data[] = $value;
        }

        return $data;
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true, 'color' => ['rgb' => '000000']]],
        ];
    }
}
