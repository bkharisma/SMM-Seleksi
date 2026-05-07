<?php

namespace App\Imports;

use App\Models\Pendaftar;
use App\Models\Prodi;
use App\Models\Ruang;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class PesertaImport implements ToModel, WithHeadingRow, WithStartRow, WithValidation
{
    protected int $rowCount = 0;

    protected array $prodiCache = [];

    protected array $ruangCache = [];

    public function startRow(): int
    {
        return 2;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:128',
            'tanggal_lahir' => 'nullable',
            'sex' => 'nullable|in:L,P,l,p',
            'agama' => 'nullable|string|max:64',
            'email' => 'nullable|email|max:128',
            'no_hp' => 'nullable|string|max:16',
            'alamat' => 'nullable|string|max:128',
        ];
    }

    public function model(array $row)
    {
        if (empty($row['nama'])) {
            return null;
        }

        $tgllahir = $this->parseDate($row['tanggal_lahir'] ?? $row['tgllahir'] ?? null);
        $pil1 = $this->resolveProdi($row['pil1'] ?? null);
        $pil2 = $this->resolveProdi($row['pil2'] ?? null);
        $pil3 = $this->resolveProdi($row['pil3'] ?? null);
        $ruangId = $this->resolveRuang($row['ruang'] ?? null);
        $sex = $row['sex'] ?? $row['jenis_kelamin'] ?? null;
        if ($sex) {
            $sex = strtoupper($sex);
        }

        $peserta = new Pendaftar([
            'kode_pendaftar' => $this->generateKodePendaftar(),
            'nama' => $row['nama'],
            'tanggal_lahir' => $tgllahir,
            'jenis_kelamin' => $sex,
            'agama' => $row['agama'] ?? null,
            'email' => $row['email'] ?? null,
            'no_hp' => $row['no_hp'] ?? $row['hp'] ?? null,
            'alamat' => $row['alamat'] ?? null,
            'pil1' => $pil1,
            'pil2' => $pil2,
            'pil3' => $pil3,
            'ruang_id' => $ruangId,
            'nama_sekolah' => $row['nama_sekolah'] ?? null,
            'npsn' => $row['npsn'] ?? null,
            'akreditasi' => $row['akreditasi'] ?? null,
            'tahun_lulus' => $row['tahun_lulus'] ?? null,
            'prestasi' => $row['prestasi'] ?? null,
        ]);

        $peserta->save();
        $this->rowCount++;

        return $peserta;
    }

    protected function generateKodePendaftar(): string
    {
        $year = date('y');
        $last = Pendaftar::orderBy('id', 'desc')->first();
        $seq = $last ? ((int) substr($last->kode_pendaftar, -4)) + 1 : 1;

        return sprintf('%s%04d', $year, $seq);
    }

    protected function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    protected function resolveProdi($value): ?int
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->prodiCache[$key])) {
            return $this->prodiCache[$key];
        }

        $prodi = Prodi::where('kode_prodi', $key)
            ->orWhere('nama_prodi', $key)
            ->first();

        $this->prodiCache[$key] = $prodi?->id;

        return $this->prodiCache[$key];
    }

    protected function resolveRuang($value): ?int
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->ruangCache[$key])) {
            return $this->ruangCache[$key];
        }

        $ruang = Ruang::where('nomor_ruang', $key)->first();
        $this->ruangCache[$key] = $ruang?->id;

        return $this->ruangCache[$key];
    }

    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
