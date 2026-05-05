<?php

namespace App\Imports;

use App\Models\Kabupaten;
use App\Models\Peserta;
use App\Models\Prodi;
use App\Models\Provinsi;
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

    protected array $provinsiCache = [];

    protected array $kabupatenCache = [];

    protected array $ruangCache = [];

    public function startRow(): int
    {
        return 2;
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:128',
            'nik' => 'nullable|string|max:16',
            'tempatlahir' => 'nullable|string|max:64',
            'tgllahir' => 'nullable',
            'goldarah' => 'nullable|string|max:5',
            'sex' => 'nullable|in:L,P,l,p',
            'agama' => 'nullable|string|max:64',
            'email' => 'nullable|email|max:128',
            'hp' => 'nullable|string|max:16',
            'alamat' => 'nullable|string|max:128',
            'kodepos' => 'nullable|string|max:8',
        ];
    }

    public function model(array $row)
    {
        if (empty($row['nama'])) {
            return null;
        }

        $tgllahir = $this->parseDate($row['tgllahir'] ?? null);
        $pil1 = $this->resolveProdi($row['pil1'] ?? null);
        $pil2 = $this->resolveProdi($row['pil2'] ?? null);
        $pil3 = $this->resolveProdi($row['pil3'] ?? null);
        $pil4 = $this->resolveProdi($row['pil4'] ?? null);
        $kodeProp = $this->resolveProvinsi($row['provinsi'] ?? null);
        $kodeKab = $this->resolveKabupaten($row['kabupaten'] ?? null, $kodeProp);
        $ruangId = $this->resolveRuang($row['ruang'] ?? null);
        $sex = $row['sex'] ?? null;
        if ($sex) {
            $sex = strtoupper($sex);
        }

        $peserta = new Peserta([
            'nup' => $this->generateNup(),
            'nama' => $row['nama'],
            'nik' => $row['nik'] ?? null,
            'tempatlahir' => $row['tempatlahir'] ?? null,
            'tgllahir' => $tgllahir,
            'goldarah' => $row['goldarah'] ?? null,
            'sex' => $sex,
            'agama' => $row['agama'] ?? null,
            'email' => $row['email'] ?? null,
            'hp' => $row['hp'] ?? null,
            'alamat' => $row['alamat'] ?? null,
            'kodepos' => $row['kodepos'] ?? null,
            'kode_prop' => $kodeProp,
            'kode_kab' => $kodeKab,
            'propinsi' => $row['provinsi'] ?? null,
            'kabupaten' => $row['kabupaten'] ?? null,
            'pil1' => $pil1,
            'pil2' => $pil2,
            'pil3' => $pil3,
            'pil4' => $pil4,
            'ruang_id' => $ruangId,
            'status' => true,
            'tgldaftar' => now(),
        ]);

        $peserta->save();
        $this->rowCount++;

        return $peserta;
    }

    protected function generateNup(): string
    {
        $year = date('y');
        $last = Peserta::orderBy('id', 'desc')->first();
        $seq = $last ? ((int) substr($last->nup, -4)) + 1 : 1;

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

    protected function resolveProvinsi($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->provinsiCache[$key])) {
            return $this->provinsiCache[$key];
        }

        $provinsi = Provinsi::where('nama_prop', 'like', "%{$key}%")->first();
        $this->provinsiCache[$key] = $provinsi?->kode_prop;

        return $this->provinsiCache[$key];
    }

    protected function resolveKabupaten($value, $kodeProp): ?string
    {
        if (empty($value)) {
            return null;
        }

        $key = trim((string) $value);
        if (isset($this->kabupatenCache[$key])) {
            return $this->kabupatenCache[$key];
        }

        $query = Kabupaten::where('nama_kab', 'like', "%{$key}%");
        if ($kodeProp) {
            $query->where('kode_prop', $kodeProp);
        }
        $kabupaten = $query->first();
        $this->kabupatenCache[$key] = $kabupaten?->kode_kab;

        return $this->kabupatenCache[$key];
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
