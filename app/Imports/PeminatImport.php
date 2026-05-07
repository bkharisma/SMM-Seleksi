<?php

namespace App\Imports;

use App\Models\Peminat;
use App\Models\Prodi;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class PeminatImport implements ToModel, WithHeadingRow, WithStartRow
{
    protected int $rowCount = 0;

    protected array $prodiKodeMap;

    public function __construct()
    {
        $this->prodiKodeMap = Prodi::pluck('id', 'kode_prodi')->toArray();
    }

    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        $nup = $row['nup'] ?? null;

        if (empty($nup)) {
            return null;
        }

        $peminat = Peminat::updateOrCreate(
            ['nup' => $nup],
            $this->mapRowToData($row)
        );

        $this->rowCount++;

        return $peminat;
    }

    protected function mapRowToData(array $row): array
    {
        $pil1 = null;
        $pil2 = null;

        if (! empty($row['pilihan_1'])) {
            $pil1 = $this->prodiKodeMap[$row['pilihan_1']] ?? null;
        }
        if (! empty($row['pilihan_2'])) {
            $pil2 = $this->prodiKodeMap[$row['pilihan_2']] ?? null;
        }

        return [
            'nama' => $row['nama'] ?? null,
            'email' => $row['email'] ?? null,
            'hp' => $row['hp'] ?? null,
            'tgllahir' => $this->toDate($row['tanggal_lahir'] ?? $row['tgllahir'] ?? null),
            'tgldaftar' => $this->toDate($row['tanggal_daftar'] ?? $row['tgldaftar'] ?? null),
            'pil1' => $pil1,
            'pil2' => $pil2,
            'nama_sekolah' => $row['asal_sekolah'] ?? $row['nama_sekolah'] ?? null,
        ];
    }

    protected function toDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception) {
            return null;
        }
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
