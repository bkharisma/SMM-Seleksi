<?php

namespace App\Exports;

use App\Models\Peminat;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PeminatExport implements FromCollection, WithHeadings, WithMapping
{
    protected $filters;

    protected bool $isTemplate;

    public function __construct(array $filters = [], bool $isTemplate = false)
    {
        $this->filters = $filters;
        $this->isTemplate = $isTemplate;
    }

    public function collection()
    {
        if ($this->isTemplate) {
            return collect([]);
        }

        $query = Peminat::with(['pil1Prodi', 'pil2Prodi', 'bsiPembayaran']);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nup', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (! empty($this->filters['prodi_id'])) {
            $query->where(function ($q) {
                $q->where('pil1', $this->filters['prodi_id'])
                    ->orWhere('pil2', $this->filters['prodi_id'])
                    ->orWhere('pil3', $this->filters['prodi_id'])
                    ->orWhere('pil4', $this->filters['prodi_id']);
            });
        }

        if (! empty($this->filters['status'])) {
            if ($this->filters['status'] === 'paid') {
                $query->whereHas('bsiPembayaran', function ($q) {
                    $q->whereNotNull('datetime_payment');
                });
            } elseif ($this->filters['status'] === 'unpaid') {
                $query->whereDoesntHave('bsiPembayaran', function ($q) {
                    $q->whereNotNull('datetime_payment');
                });
            }
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'NUP',
            'Nama',
            'Email',
            'HP',
            'Tanggal Lahir',
            'Pilihan 1',
            'Pilihan 2',
            'Asal Sekolah',
            'Tanggal Daftar',
            'Status Pembayaran',
        ];
    }

    public function map($peminat): array
    {
        return [
            $peminat->nup,
            $peminat->nama,
            $peminat->email,
            $peminat->hp,
            $peminat->tgllahir?->format('Y-m-d'),
            $peminat->pil1Prodi?->nama_prodi,
            $peminat->pil2Prodi?->nama_prodi,
            $peminat->nama_sekolah,
            $peminat->tgldaftar?->format('Y-m-d'),
            $peminat->bsiPembayaran?->datetime_payment ? 'Lunas' : 'Belum Lunas',
        ];
    }
}
