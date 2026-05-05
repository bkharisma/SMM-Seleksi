<?php

namespace App\Imports;

use App\Models\Peserta;
use App\Models\PesertaNilai;
use App\Models\Ujian;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class NilaiImport implements ToModel, WithHeadingRow, WithStartRow
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

    protected int $rowCount = 0;

    public function __construct(Ujian $ujian)
    {
        $this->ujian = $ujian;
    }

    private function fields(): array
    {
        return $this->ujian->fields_config['fields'] ?? [];
    }

    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        if (empty($row['nup']) && empty($row['no_ujian'])) {
            return null;
        }

        $nup = $row['nup'] ?? null;
        $nus = $row['no_ujian'] ?? null;

        if (! $nup && $nus) {
            $peserta = Peserta::where('noujian', $nus)->first();
            $nup = $peserta?->nup;
        }

        if (! $nup) {
            return null;
        }

        $nilai = PesertaNilai::updateOrCreate(
            ['nup' => $nup, 'ujian_id' => $this->ujian->id],
            $this->mapRowToData($row)
        );

        $this->rowCount++;

        return $nilai;
    }

    protected function mapRowToData(array $row): array
    {
        $data = ['nus' => $row['no_ujian'] ?? null, 'type' => $this->ujian->kode];

        foreach ($this->fields() as $field) {
            $meta = self::FIELD_META[$field] ?? null;
            if (! $meta) {
                continue;
            }

            $label = $meta['label'];
            $value = $row[$label] ?? $row[$field] ?? null;

            $data[$field] = match ($meta['type']) {
                'int' => $this->toInt($value),
                'float' => $this->toFloat($value),
                'bool' => $this->toBool($value),
                default => $value,
            };
        }

        return $data;
    }

    protected function toInt($value): ?int
    {
        return $value !== null && $value !== '' ? (int) $value : null;
    }

    protected function toFloat($value): ?float
    {
        return $value !== null && $value !== '' ? (float) $value : null;
    }

    protected function toBool($value): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        return in_array(strtolower((string) $value), ['1', 'true', 'yes', 'y']);
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
