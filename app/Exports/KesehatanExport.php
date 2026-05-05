<?php

namespace App\Exports;

use App\Models\Kesehatan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class KesehatanExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Kesehatan::with(['peserta' => function ($q) {
            $q->with('pil1Prodi');
        }]);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->whereHas('peserta', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nup', 'like', "%{$search}%")
                    ->orWhere('noujian', 'like', "%{$search}%");
            });
        }

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'NUP',
            'No. Ujian',
            'Nama',
            'Pilihan 1',
            'Nama Lembaga',
            'Lokasi',
            'Tinggi Badan',
            'Berat Badan',
            'OW',
            'Obesitas',
            'Tensi',
            'Nadi',
            'Tato',
            'Tindik',
            'Buta Warna',
            'Strabismus',
            'Pupil',
            'Paru-paru',
            'Scoliosis',
            'Morphin',
            'Amphetamine',
            'THC',
            'Kehamilan',
            'Status',
            'Catatan',
        ];
    }

    public function map($kesehatan): array
    {
        return [
            $kesehatan->peserta?->nup,
            $kesehatan->peserta?->noujian,
            $kesehatan->peserta?->nama,
            $kesehatan->peserta?->pil1Prodi?->nama_prodi,
            $kesehatan->namalbg,
            $kesehatan->lokasi,
            $kesehatan->tb,
            $kesehatan->bb,
            $kesehatan->ow,
            $kesehatan->obesitas,
            $kesehatan->tensi,
            $kesehatan->nadi,
            $kesehatan->tato,
            $kesehatan->tindik,
            $kesehatan->bw,
            $kesehatan->strab,
            $kesehatan->pupil,
            $kesehatan->paru,
            $kesehatan->sco,
            $kesehatan->mop,
            $kesehatan->amp,
            $kesehatan->thc,
            $kesehatan->kehamilan,
            $kesehatan->status,
            $kesehatan->catatan,
        ];
    }
}
