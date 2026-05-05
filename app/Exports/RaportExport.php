<?php

namespace App\Exports;

use App\Models\Raport;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class RaportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Raport::with(['peserta' => function ($q) {
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
            'NPSN',
            'Akreditasi',
            'Nilai Rata-rata',
            'X Semester 1 Peng',
            'X Semester 1 Ket',
            'X Semester 2 Peng',
            'X Semester 2 Ket',
            'XI Semester 1 Peng',
            'XI Semester 1 Ket',
            'XI Semester 2 Peng',
            'XI Semester 2 Ket',
            'XII Semester 1 Peng',
            'XII Semester 1 Ket',
            'XII Semester 2 Peng',
            'XII Semester 2 Ket',
            'Status',
            'Catatan',
        ];
    }

    public function map($raport): array
    {
        return [
            $raport->peserta?->nup,
            $raport->peserta?->noujian,
            $raport->peserta?->nama,
            $raport->peserta?->pil1Prodi?->nama_prodi,
            $raport->npsn,
            $raport->akreditasi,
            $raport->anilai,
            $raport->x_1peng,
            $raport->x_1ket,
            $raport->x_2peng,
            $raport->x_2ket,
            $raport->xi_1peng,
            $raport->xi_1ket,
            $raport->xi_2peng,
            $raport->xi_2ket,
            $raport->xii_1peng,
            $raport->xii_1ket,
            $raport->xii_2peng,
            $raport->xii_2ket,
            $raport->status,
            $raport->catatan,
        ];
    }
}
