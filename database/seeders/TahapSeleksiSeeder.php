<?php

namespace Database\Seeders;

use App\Models\TahapSeleksi;
use Illuminate\Database\Seeder;

class TahapSeleksiSeeder extends Seeder
{
    public function run(): void
    {
        $tahap = [
            ['nama' => 'Tahap 1', 'urutan' => 1],
            ['nama' => 'Tahap 2', 'urutan' => 2],
        ];

        foreach ($tahap as $t) {
            TahapSeleksi::firstOrCreate(['nama' => $t['nama']], ['urutan' => $t['urutan']]);
        }
    }
}
