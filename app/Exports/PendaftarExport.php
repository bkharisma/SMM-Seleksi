<?php

namespace App\Exports;

use App\Models\Pendaftar;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PendaftarExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Pendaftar::with(['pil1Prodi', 'pil2Prodi', 'pil3Prodi', 'lulusProdi', 'jalur'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Kode Pendaftar',
            'No. Ujian',
            'Nama',
            'Jenis Kelamin',
            'Tanggal Lahir',
            'Email',
            'No. HP',
            'Jalur Pendaftaran',
            'Pilihan 1',
            'Pilihan 2',
            'Pilihan 3',
            'Lulus',
            'Lulus Tahap',
            'Ruang',
            'Kelas Kelompok',
            'Dibuat Pada',
        ];
    }

    public function map($pendaftar): array
    {
        return [
            $pendaftar->id,
            $pendaftar->kode_pendaftar,
            $pendaftar->noujian,
            $pendaftar->nama,
            $pendaftar->jenis_kelamin,
            $pendaftar->tanggal_lahir?->format('Y-m-d'),
            $pendaftar->email,
            $pendaftar->no_hp,
            $pendaftar->jalur?->nama_jalur,
            $pendaftar->pil1Prodi?->nama_prodi,
            $pendaftar->pil2Prodi?->nama_prodi,
            $pendaftar->pil3Prodi?->nama_prodi,
            $pendaftar->lulusProdi?->nama_prodi,
            $pendaftar->lulusTahap?->nama,
            $pendaftar->ruang?->nomor_ruang,
            $pendaftar->ruang_kelompok,
            $pendaftar->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
