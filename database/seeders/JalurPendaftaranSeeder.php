<?php

namespace Database\Seeders;

use App\Models\JalurPendaftaran;
use Illuminate\Database\Seeder;

class JalurPendaftaranSeeder extends Seeder
{
    public function run(): void
    {
        $jalur = [
            ['kode_jalur' => 'SMM-REG', 'nama_jalur' => 'SMM Jalur Reguler'],
            ['kode_jalur' => 'SMM-PNA', 'nama_jalur' => 'SMM Jalur Prestasi Non Akademik'],
            ['kode_jalur' => 'SMM-PA', 'nama_jalur' => 'SMM Jalur Prestasi Akademik'],
            ['kode_jalur' => 'SMM-KD', 'nama_jalur' => 'SMM Jalur Khusus Diasbilitas'],
            ['kode_jalur' => 'SMM-KW', 'nama_jalur' => 'SMM Jalur Khusus Wiraswasta'],
            ['kode_jalur' => 'SMM-KK', 'nama_jalur' => 'SMM Jalur Khusus Kerjasama'],
        ];

        foreach ($jalur as $j) {
            JalurPendaftaran::firstOrCreate(
                ['kode_jalur' => $j['kode_jalur']],
                ['nama_jalur' => $j['nama_jalur'], 'active' => true]
            );
        }
    }
}
