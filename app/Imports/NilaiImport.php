<?php

namespace App\Imports;

use App\Models\Pendaftar;
use App\Models\PendaftarNilai;
use App\Models\Ujian;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class NilaiImport implements ToModel, WithHeadingRow, WithStartRow
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

    protected int $rowCount = 0;

    protected array $errors = [];

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
            $this->rowCount++;
            $this->errors[] = [
                'row' => $this->rowCount + 1,
                'data' => $row,
                'error' => 'NUP atau No. Ujian wajib diisi',
            ];

            return null;
        }

        $nup = $row['nup'] ?? null;
        $nus = $row['no_ujian'] ?? null;

        if (! $nup && $nus) {
            $pendaftar = Pendaftar::where('noujian', $nus)->first();
            $nup = $pendaftar?->kode_pendaftar;
        }

        if (! $nup) {
            $this->rowCount++;
            $this->errors[] = [
                'row' => $this->rowCount + 1,
                'data' => $row,
                'error' => 'Pendaftar dengan NUP/No. Ujian tersebut tidak ditemukan',
            ];

            return null;
        }

        $pendaftar = Pendaftar::where('kode_pendaftar', $nup)->first();

        $data = $this->mapRowToData($row);

        if (empty($data['skor_akhir'])) {
            foreach ($this->fields() as $field) {
                $meta = self::FIELD_META[$field] ?? null;
                if ($meta && in_array($meta['type'], ['int', 'float']) && ! empty($data[$field])) {
                    $data['skor_akhir'] = $data[$field];
                    break;
                }
            }
        }

        $nilai = PendaftarNilai::updateOrCreate(
            ['nup' => $nup, 'ujian_id' => $this->ujian->id],
            array_merge($data, ['pendaftar_id' => $pendaftar?->id])
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
            $key = Str::slug($label, '_');
            $value = $row[$key] ?? $row[$label] ?? $row[$field] ?? null;

            $data[$field] = match ($meta['type']) {
                'int' => $this->toInt($value),
                'float' => $this->toFloat($value),
                'bool' => $this->toBool($value),
                'string' => $this->toString($value),
                default => $value,
            };
        }

        return $data;
    }

    protected function toInt($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $value = str_replace(',', '.', $value);
        }

        return (int) $value;
    }

    protected function toFloat($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $value = str_replace(',', '.', $value);
        }

        return (float) $value;
    }

    protected function toBool($value): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        return in_array(strtolower((string) $value), ['1', 'true', 'yes', 'y']);
    }

    protected function toString($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (string) $value;
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
