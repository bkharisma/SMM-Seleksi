<?php

namespace Database\Seeders;

use App\Models\Ujian;
use Illuminate\Database\Seeder;

class UjianTypeSeeder extends Seeder
{
    public function run(): void
    {
        $ujian = [
            [
                'nama' => 'Tes Bakat Skolastik',
                'kode' => 'TBS',
                'deskripsi' => 'Tes Bakat dan Skolastik',
                'fields_config' => ['fields' => ['psi_iq']],
            ],
            [
                'nama' => 'Literasi Bahasa Inggris',
                'kode' => 'LBI',
                'deskripsi' => 'Tes Literasi Bahasa Inggris',
                'fields_config' => ['fields' => ['bing_nil']],
            ],
            [
                'nama' => 'Psikotes',
                'kode' => 'PSI',
                'deskripsi' => 'Tes Psikotes',
                'fields_config' => ['fields' => ['psi_bobot']],
            ],
            [
                'nama' => 'Wawancara',
                'kode' => 'WW',
                'deskripsi' => 'Tes Wawancara',
                'fields_config' => ['fields' => ['waw_nil', 'waw_bersedia_pindah', 'waw_rekomendasi_prodi_id', 'waw_catatan']],
            ],
            [
                'nama' => 'Cek Kesehatan',
                'kode' => 'KSH',
                'deskripsi' => 'Tes Pemeriksaan Kesehatan',
                'fields_config' => ['fields' => ['kes_hasil', 'kes_tb', 'kes_bw', 'kes_scol', 'kes_hamil']],
            ],
        ];

        foreach ($ujian as $u) {
            Ujian::updateOrCreate(['kode' => $u['kode']], $u);
        }
    }
}
