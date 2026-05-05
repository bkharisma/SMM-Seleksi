<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Seeder;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = [
            ['kode_prodi' => 'D4-KP', 'nama_prodi' => 'D4 - Kepariwisataan', 'singkatan_prodi' => 'KP', 'jenjang_prodi' => 'D4', 'kapasitas' => 100, 'kuota_smm' => 50, 'deskripsi' => 'Program Studi Kepariwisataan'],
            ['kode_prodi' => 'D4-PPT', 'nama_prodi' => 'D4 - Perencanaan Perjalanan dan Bisnis Perjalanan Wisata', 'singkatan_prodi' => 'PPT', 'jenjang_prodi' => 'D4', 'kapasitas' => 100, 'kuota_smm' => 50, 'deskripsi' => 'Program Studi Perencanaan Perjalanan dan Bisnis Perjalanan Wisata'],
            ['kode_prodi' => 'D4-PHB', 'nama_prodi' => 'D4 - Perhotelan', 'singkatan_prodi' => 'PHB', 'jenjang_prodi' => 'D4', 'kapasitas' => 100, 'kuota_smm' => 50, 'deskripsi' => 'Program Studi Perhotelan'],
            ['kode_prodi' => 'D4-TPT', 'nama_prodi' => 'D4 - Tata Boga', 'singkatan_prodi' => 'TPT', 'jenjang_prodi' => 'D4', 'kapasitas' => 100, 'kuota_smm' => 50, 'deskripsi' => 'Program Studi Tata Boga'],
        ];

        foreach ($prodi as $p) {
            Prodi::firstOrCreate(['kode_prodi' => $p['kode_prodi']], $p);
        }
    }
}
