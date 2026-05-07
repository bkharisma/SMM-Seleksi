<?php

namespace App\Exports;

use App\Models\Pendaftar;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PesertaExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Pendaftar::with(['pil1Prodi', 'ruang', 'lulusProdi']);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode_pendaftar', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if (! empty($this->filters['prodi_id'])) {
            $query->where('pil1', $this->filters['prodi_id']);
        }

        if (! empty($this->filters['ruang_id'])) {
            $query->where('ruang_id', $this->filters['ruang_id']);
        }

        if (! empty($this->filters['lulus'])) {
            if ($this->filters['lulus'] === 'lulus') {
                $query->whereNotNull('lulus');
            } elseif ($this->filters['lulus'] === 'belum') {
                $query->whereNull('lulus');
            }
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Kode Pendaftar',
            'No. Ujian',
            'Nama',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'Email',
            'HP',
            'Pilihan 1',
            'Ruang',
            'Lulus',
        ];
    }

    public function map($peserta): array
    {
        return [
            $peserta->kode_pendaftar,
            $peserta->noujian,
            $peserta->nama,
            $peserta->tempat_lahir,
            $peserta->tanggal_lahir?->format('Y-m-d'),
            $peserta->jenis_kelamin === 'L' ? 'Laki-laki' : ($peserta->jenis_kelamin === 'P' ? 'Perempuan' : ''),
            $peserta->email,
            $peserta->no_hp,
            $peserta->pil1Prodi?->nama_prodi,
            $peserta->ruang?->nomor_ruang,
            $peserta->lulusProdi?->nama_prodi,
        ];
    }
}
