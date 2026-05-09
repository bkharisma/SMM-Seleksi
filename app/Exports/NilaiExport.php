<?php

namespace App\Exports;

use App\Models\Pendaftar;
use App\Models\PendaftarNilai;
use App\Models\Ujian;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class NilaiExport implements WithMultipleSheets
{
    const FIELD_META = [
        'psi_iq' => ['label' => 'Bakat Skolastik', 'type' => 'float'],
        'psi_bobot' => ['label' => 'Psikotes', 'type' => 'float'],
        'bing_nil' => ['label' => 'Literasi Bahasa Inggris', 'type' => 'float'],
        'waw_nil' => ['label' => 'Wawancara', 'type' => 'float'],
        'waw_bersedia_pindah' => ['label' => 'Bersedia Pindah Prodi', 'type' => 'bool'],
        'waw_rekomendasi_prodi_id' => ['label' => 'Rekomendasi Prodi', 'type' => 'int'],
        'waw_catatan' => ['label' => 'Catatan Wawancara', 'type' => 'string'],
        'kes_hasil' => ['label' => 'Tes Kesehatan', 'type' => 'bool'],
        'kes_tb' => ['label' => 'Tinggi Badan', 'type' => 'float'],
        'kes_bw' => ['label' => 'Buta Warna', 'type' => 'bool'],
        'kes_scol' => ['label' => 'Skoliosis', 'type' => 'bool'],
        'kes_hamil' => ['label' => 'Kehamilan', 'type' => 'bool'],
        'minat_dominan' => ['label' => 'Minat Dominan', 'type' => 'float'],
        'skor_akhir' => ['label' => 'Skor Akhir', 'type' => 'float'],
    ];

    protected Ujian $ujian;

    protected bool $isTemplate;

    public function __construct(Ujian $ujian, bool $isTemplate = false)
    {
        $this->ujian = $ujian;
        $this->isTemplate = $isTemplate;
    }

    public function sheets(): array
    {
        return [
            'Data Nilai' => new class($this->ujian, $this->isTemplate) implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle {
                protected Ujian $ujian;
                protected bool $isTemplate;

                public function __construct(Ujian $ujian, bool $isTemplate)
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
                        $pendaftars = Pendaftar::with('pil1Prodi')->orderBy('nama')->get();

                        return $pendaftars->map(function ($pendaftar) {
                            $row = new \stdClass;
                            $row->nup = $pendaftar->kode_pendaftar;
                            $row->noujian = $pendaftar->noujian;
                            $row->nama = $pendaftar->nama;
                            $row->pil1_prodi = $pendaftar->pil1Prodi?->nama_prodi;
                            foreach ($this->fields() as $field) {
                                $row->$field = null;
                            }

                            return $row;
                        });
                    }

                    return PendaftarNilai::with(['pendaftar' => function ($q) {
                        $q->with('pil1Prodi');
                    }])
                        ->where('ujian_id', $this->ujian->id)
                        ->get();
                }

                public function headings(): array
                {
                    $base = ['NUP', 'No. Ujian', 'Nama', 'Pilihan 1'];

                    foreach ($this->fields() as $field) {
                        $base[] = NilaiExport::FIELD_META[$field]['label'] ?? $field;
                    }

                    return $base;
                }

                public function map($row): array
                {
                    $data = [
                        $row->nup,
                        $row->noujian ?? $row->nus ?? $row->pendaftar?->noujian ?? '',
                        $row->nama ?? $row->pendaftar?->nama ?? '',
                        $row->pil1_prodi ?? $row->pendaftar?->pil1Prodi?->nama_prodi ?? '',
                    ];

                    foreach ($this->fields() as $field) {
                        $value = $row->$field ?? null;
                        $meta = NilaiExport::FIELD_META[$field] ?? null;

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

                public function title(): string
                {
                    return 'Data Nilai';
                }
            },
            'Format Bersedia Pindah' => new BersediaPindahReferensiSheet(),
            'Daftar Prodi' => new ProdiReferensiSheet(),
        ];
    }
}
