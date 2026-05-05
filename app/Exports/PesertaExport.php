<?php

namespace App\Exports;

use App\Models\Peserta;
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
        $query = Peserta::with(['pil1Prodi', 'ruang', 'lulusProdi']);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nup', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if (! empty($this->filters['prodi_id'])) {
            $query->where('pil1', $this->filters['prodi_id']);
        }

        if (! empty($this->filters['ruang_id'])) {
            $query->where('ruang_id', $this->filters['ruang_id']);
        }

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status'] === 'active');
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
            'NUP',
            'No. Ujian',
            'Nama',
            'NIK',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'Email',
            'HP',
            'Pilihan 1',
            'Ruang',
            'Nilai Psikotes',
            'Nilai B. Inggris',
            'Nilai Wawancara',
            'Nilai Kesehatan',
            'Lulus',
            'Status',
        ];
    }

    public function map($peserta): array
    {
        return [
            $peserta->nup,
            $peserta->noujian,
            $peserta->nama,
            $peserta->nik,
            $peserta->tempatlahir,
            $peserta->tgllahir?->format('Y-m-d'),
            $peserta->sex === 'L' ? 'Laki-laki' : ($peserta->sex === 'P' ? 'Perempuan' : ''),
            $peserta->email,
            $peserta->hp,
            $peserta->pil1Prodi?->nama_prodi,
            $peserta->ruang?->nomor_ruang,
            $peserta->nil_psikotes,
            $peserta->nil_bhsinggris,
            $peserta->nil_wawancara,
            $peserta->nil_kesehatan,
            $peserta->lulusProdi?->nama_prodi,
            $peserta->status ? 'Aktif' : 'Tidak Aktif',
        ];
    }
}
