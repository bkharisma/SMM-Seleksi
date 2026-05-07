<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = [
            ['kode_prodi' => 'D4-PKA', 'nama_prodi' => 'D4 - Pengelolaan Konvensi dan Acara', 'singkatan_prodi' => 'PKA', 'jenjang_prodi' => 'D4', 'kapasitas' => 100, 'kuota_smm' => 40, 'deskripsi' => 'Program Studi Pengelolaan Konenvsi dan Acara'],
            ['kode_prodi' => 'D3-DIK', 'nama_prodi' => 'D3 - Divisi Kamar', 'singkatan_prodi' => 'DIK', 'jenjang_prodi' => 'D3', 'kapasitas' => 100, 'kuota_smm' => 40, 'deskripsi' => 'Program Studi Divis Kamar'],
            ['kode_prodi' => 'D3-TAH', 'nama_prodi' => 'D3 - Tata Hidang', 'singkatan_prodi' => 'TAH', 'jenjang_prodi' => 'D3', 'kapasitas' => 100, 'kuota_smm' => 40, 'deskripsi' => 'Program Studi Tata Hidang'],
            ['kode_prodi' => 'D3-SKU', 'nama_prodi' => 'D3 - Seni Kuliner', 'singkatan_prodi' => 'SKU', 'jenjang_prodi' => 'D3', 'kapasitas' => 100, 'kuota_smm' => 40, 'deskripsi' => 'Program Studi Seni Kuliner'],
        ];

        foreach ($prodi as $p) {
            Prodi::firstOrCreate(['kode_prodi' => $p['kode_prodi']], $p);
        }
    }
}
