<?php

namespace Database\Seeders;

use App\Models\Ujian;
use Illuminate\Database\Seeder;

class UjianTypeSeeder extends Seeder
{
    public function run(): void
    {
        $ujian = [
            ['nama' => 'Psikotes', 'kode' => 'psikotes', 'deskripsi' => 'Tes Psikologi'],
            ['nama' => 'English Test', 'kode' => 'bhsinggris', 'deskripsi' => 'Tes Bahasa Inggris'],
            ['nama' => 'Wawancara', 'kode' => 'wawancara', 'deskripsi' => 'Tes Wawancara'],
            ['nama' => 'Cek Kesehatan', 'kode' => 'kesehatan', 'deskripsi' => 'Pemeriksaan Kesehatan'],
        ];

        foreach ($ujian as $u) {
            Ujian::firstOrCreate(['kode' => $u['kode']], $u);
        }
    }
}
